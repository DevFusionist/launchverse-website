"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UserRole } from "@/lib/types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (userId: string, otp: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up refresh token interval
  useEffect(() => {
    if (user) {
      // Refresh access token every 14 minutes (before 15-minute expiry)
      const refreshInterval = setInterval(refreshSession, 14 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/me");

      if (response.ok) {
        const data = await response.json();

        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSession() {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh session");
      }

      const data = await response.json();

      setUser(data.user);
    } catch (err) {
      console.error("Session refresh failed:", err);
      // If refresh fails, log out the user
      await logout();
    }
  }

  async function login(email: string, password: string) {
    try {
      setError(null);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.requiresOTP) {
        router.push(`/verify-otp?userId=${data.userId}`);

        return;
      }

      setUser(data.user);
      console.log("data", data);
      router.push(
        data.user.role === UserRole.STUDENT ? "/dashboard" : "/admin",
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function verifyOTP(userId: string, otp: string) {
    try {
      setError(null);
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      setUser(data.user);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      });
      setUser(null);
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    verifyOTP,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

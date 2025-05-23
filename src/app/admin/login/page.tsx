"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-background-light dark:bg-neon-background-dark">
      <form
        onSubmit={handleSubmit}
        className="bg-neon-card-light dark:bg-neon-card-dark p-8 rounded-lg shadow-neon-sm w-full max-w-md border border-neon-primary/10 dark:border-neon-primary-dark/10"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-neon-text-light dark:text-neon-text-dark">
          Admin Login
        </h1>
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-neon-text-light dark:text-neon-text-dark">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neon-primary/10 dark:border-neon-primary-dark/10 rounded px-3 py-2 bg-neon-background-light dark:bg-neon-background-dark text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-neon-text-light dark:text-neon-text-dark">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neon-primary/10 dark:border-neon-primary-dark/10 rounded px-3 py-2 bg-neon-background-light dark:bg-neon-background-dark text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-neon-primary dark:bg-neon-primary-dark text-white py-2 rounded font-semibold hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

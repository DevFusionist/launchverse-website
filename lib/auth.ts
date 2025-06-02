import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

import { AuthUser } from "./auth-context";

import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { UserRole } from "@/lib/types";

export type { AuthUser };

// JWT secret as Uint8Array for jose
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Generate access token
export async function generateAccessToken(user: AuthUser) {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    type: "access" as const,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(ACCESS_TOKEN_SECRET);
}

// Verify access token
export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    // First cast to unknown, then to our expected type
    const decoded = payload as unknown as AuthUser & { type: "access" };

    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// Check if user has required role
export function hasRequiredRole(
  userRole: UserRole,
  allowedRoles: UserRole[],
): boolean {
  // SUPER_ADMIN has access to everything
  if (userRole === UserRole.SUPER_ADMIN) return true;

  // ADMIN has access to everything except SUPER_ADMIN routes
  if (userRole === UserRole.ADMIN) {
    return allowedRoles.some((role) => role !== UserRole.SUPER_ADMIN);
  }

  // For other roles, check if their role is in the allowed roles
  return allowedRoles.includes(userRole);
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser;
}

// Generate tokens (for API routes)
export async function generateTokens(user: AuthUser) {
  const accessToken = await generateAccessToken(user);

  return { accessToken };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  allowedRoles: UserRole[] = [],
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    let user: AuthUser | null = null;
    let response: NextResponse | null = null;

    // Try to verify access token first
    if (accessToken) {
      try {
        const decoded = await verifyAccessToken(accessToken);

        user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        };
      } catch (error) {
        // Access token invalid, try refresh token
      }
    }

    // If no valid access token, try refresh token
    if (!user && refreshToken) {
      try {
        await connectDB();
        const dbUser = await User.findOne({
          refreshToken,
          refreshTokenExpires: { $gt: new Date() },
          status: "ACTIVE",
        });

        if (!dbUser) {
          return NextResponse.json(
            { error: "Invalid refresh token" },
            { status: 401 },
          );
        }

        const { accessToken: newAccessToken } = await generateTokens({
          id: dbUser._id.toString(),
          email: dbUser.email,
          role: dbUser.role,
          name: dbUser.name,
        });

        const newRefreshToken = await dbUser.generateRefreshToken();

        // Create a new response using the outer response variable
        response = new NextResponse(
          JSON.stringify({
            user: {
              id: dbUser._id.toString(),
              email: dbUser.email,
              role: dbUser.role,
              name: dbUser.name,
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("refresh token based authentication is happening");
        console.log("new access token", newAccessToken);
        console.log("new refresh token", newRefreshToken);
        console.log("dbUser", dbUser);

        // Set cookies in response
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict" as const,
          path: "/",
        };

        // Set the cookies
        response.cookies.set("accessToken", newAccessToken, {
          ...cookieOptions,
          maxAge: 15 * 60, // 15 minutes
        });
        response.cookies.set("refreshToken", newRefreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        user = {
          id: dbUser._id.toString(),
          email: dbUser.email,
          role: dbUser.role,
          name: dbUser.name,
        };

        // Return the response with new cookies
        return response;
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid or expired tokens" },
          { status: 401 },
        );
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 401 },
      );
    }

    if (allowedRoles.length > 0 && !hasRequiredRole(user.role, allowedRoles)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // For page routes, attach user to request and return null to continue
    req.user = user;

    return null;
  } catch (error: any) {
    console.error("Auth middleware error:", error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }
}

// Helper function to create protected route handlers
export function withAuth(handler: Function, allowedRoles?: UserRole[]) {
  return async (req: AuthenticatedRequest) => {
    const authResult = await authMiddleware(req, allowedRoles);

    if (authResult) return authResult;

    return handler(req);
  };
}

// Rate limiting middleware
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(
  req: NextRequest,
  limit: number = 5,
  windowMs: number = 60000,
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "anonymous";
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  Array.from(rateLimit.entries()).forEach(([key, value]) => {
    if (value.resetTime < windowStart) {
      rateLimit.delete(key);
    }
  });

  // Get or create rate limit entry
  const entry = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };

  // Check if rate limit exceeded
  if (entry.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 },
    );
  }

  // Increment counter
  entry.count++;
  rateLimit.set(ip, entry);

  return null; // Continue to the route handler
}

// Helper to combine rate limiting with auth
export function withRateLimitAndAuth(
  handler: Function,
  allowedRoles?: UserRole[],
  rateLimitOptions?: { limit: number; windowMs: number },
) {
  return async (req: AuthenticatedRequest) => {
    // Apply rate limiting first
    const rateLimitResult = rateLimiter(
      req,
      rateLimitOptions?.limit,
      rateLimitOptions?.windowMs,
    );

    if (rateLimitResult) return rateLimitResult;

    // Then apply auth
    const authResult = await authMiddleware(req, allowedRoles);

    if (authResult) return authResult;

    return handler(req);
  };
}

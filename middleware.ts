import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { UserRole } from "@/lib/types";

// List of public routes that don't require authentication
const publicRoutes = [
  "/api/auth/login",
  "/api/auth/verify-email",
  "/api/auth/verify-otp",
  "/api/auth/resend-otp",
  "/api/auth/refresh",
  "/api/auth/me", // Add me endpoint to public routes
  "/api/seed", // Only for initial setup
];

// List of admin routes that require admin role
const adminRoutes = ["/api/admin", "/admin"];

export async function middleware(request: NextRequest) {
  // Handle CORS
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();

  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_APP_URL || "*",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isPublicRoute) {
    return response;
  }

  // For API routes and admin pages, check for authentication
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/admin")
  ) {
    try {
      // Call the me endpoint to check authentication
      const meResponse = await fetch(new URL("/api/auth/me", request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (!meResponse.ok) {
        // For admin routes, redirect to login
        if (request.nextUrl.pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/login", request.url));
        }

        // For API routes, return 401
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 },
        );
      }

      // Check if it's an admin route
      const isAdminRoute = adminRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route),
      );

      if (isAdminRoute) {
        const userData = await meResponse.json();
        const userRole = userData.user.role;

        // Check if user has admin role
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
          // For admin pages, redirect to admin dashboard
          if (request.nextUrl.pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/admin", request.url));
          }

          // For API routes, return 403
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 },
          );
        }
      }
    } catch (error) {
      // For admin routes, redirect to login
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // For API routes, return 401
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

// Define public routes that don't require authentication (only navbar/footer routes)
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/courses",
  // "/verify",
  // "/auth/login",
  // "/auth/register",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is exactly one of our public routes
  if (publicRoutes.includes(pathname)) {
    console.log("Public route accessed:", pathname);

    return NextResponse.next();
  }

  // Allow access to course detail pages
  if (pathname.startsWith("/courses/") && pathname !== "/courses/") {
    console.log("Course detail page accessed:", pathname);

    return NextResponse.next();
  }

  // For any other route, redirect to home
  console.log("Blocked route:", pathname, "redirecting to home");

  return NextResponse.redirect(new URL("/", request.url));
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next/* (Next.js internals)
     * 2. /fonts/* (inside /public)
     * 3. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!_next|fonts|favicon.ico|sitemap.xml).*)",
  ],
};

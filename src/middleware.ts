import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle login pages - redirect authenticated users to admin dashboard
  if (pathname === "/admin/login" || pathname === "/login") {
    if (token && ["admin", "super_admin"].includes(token.role as string)) {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token || !["admin", "super_admin"].includes(token.role as string)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add session headers to all requests if token exists
  const response = NextResponse.next();
  if (token) {
    response.headers.set("x-session-user-id", token.sub || "");
    response.headers.set("x-session-user-role", (token.role as string) || "");
    response.headers.set("x-session-user-name", (token.name as string) || "");
    response.headers.set("x-session-user-email", (token.email as string) || "");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { NextAuthMiddlewareOptions } from 'next-auth/middleware';
import type { JWT } from 'next-auth/jwt';

// List of all valid routes in the application
const VALID_ROUTES = [
  // Public routes
  '/', // Home page
  '/about', // About page
  '/courses', // Courses page
  '/courses/:path*', // Individual course pages
  '/blog', // Blog page
  '/blog/[id]', // Individual blog post pages
  '/blog/[id]/:path*', // Any additional blog post related pages
  '/certificates', // Certificates page
  '/certificates/:path*', // Individual certificate pages
  '/verify', // Certificate verification page
  '/verify/:path*', // Individual certificate verification pages
  '/contact', // Contact page
  '/privacy', // Privacy policy
  '/terms', // Terms of service
  '/login', // Unified login page

  // Student routes
  '/student/dashboard', // Student dashboard
  '/student/courses', // Student courses
  '/student/courses/:path*', // Individual student course pages
  '/student/certificates', // Student certificates
  '/student/certificates/:path*', // Individual student certificate pages
  '/student/profile', // Student profile
  '/student/profile/:path*', // Student profile edit pages

  // Admin routes
  '/admin', // Admin dashboard
  '/admin/dashboard', // Admin dashboard
  '/admin/students', // Admin students list
  '/admin/students/new', // New student form
  '/admin/students/:path*', // Student edit and other student-related pages
  '/admin/courses', // Admin courses
  '/admin/courses/:path*', // Course edit and other course-related pages
  '/admin/certificates', // Admin certificates
  '/admin/certificates/:path*', // Certificate edit and other certificate-related pages
  '/admin/placements', // Admin placements
  '/admin/placements/:path*', // Placement edit and other placement-related pages
  '/admin/companies', // Admin companies list
  '/admin/companies/new', // New company form
  '/admin/companies/:path*', // Company edit and other company-related pages
  '/admin/setup', // Admin account setup page
  '/admin/admins/invite', // Admin invitation page
  '/admin/admins/:path*', // Other admin management pages
];

// Helper function to check if a route is valid
function isValidRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Handle dynamic routes with [id]
    if (route.includes('[id]')) {
      const pattern = route.replace('[id]', '\\d+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    // Handle catch-all routes
    if (route.includes(':path*')) {
      const baseRoute = route.replace(':path*', '');
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });
}

// Middleware to handle all routing
export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for auth API routes
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // Get the session token
    const token = request.cookies.get('next-auth.session-token')?.value;
    const isAuthenticated = !!token;

    // Handle admin routes
    if (pathname.startsWith('/admin')) {
      // If trying to access any admin route while not authenticated
      if (!isAuthenticated) {
        // Redirect to login with admin mode
        const response = NextResponse.redirect(
          new URL('/login?mode=admin', request.url)
        );
        response.headers.set('Cache-Control', 'no-store');
        return response;
      }

      // For authenticated users, check if the admin route is valid
      if (isAuthenticated) {
        const isValidAdminRoute = isValidRoute(
          pathname,
          VALID_ROUTES.filter((route) => route.startsWith('/admin'))
        );
        if (!isValidAdminRoute) {
          // Redirect to admin dashboard for invalid admin routes
          const response = NextResponse.redirect(
            new URL('/admin', request.url)
          );
          response.headers.set('Cache-Control', 'no-store');
          return response;
        }
      }
    }
    // Handle student routes
    else if (pathname.startsWith('/student')) {
      // If trying to access any student route while not authenticated
      if (!isAuthenticated) {
        // Redirect to login with student mode
        const response = NextResponse.redirect(
          new URL('/login?mode=student', request.url)
        );
        response.headers.set('Cache-Control', 'no-store');
        return response;
      }

      // For authenticated users, check if the student route is valid
      if (isAuthenticated) {
        const isValidStudentRoute = isValidRoute(
          pathname,
          VALID_ROUTES.filter((route) => route.startsWith('/student'))
        );
        if (!isValidStudentRoute) {
          // Redirect to student dashboard for invalid student routes
          const response = NextResponse.redirect(
            new URL('/student/dashboard', request.url)
          );
          response.headers.set('Cache-Control', 'no-store');
          return response;
        }
      }
    } else {
      // For public routes, check if they're valid
      const isValidPublicRoute = isValidRoute(
        pathname,
        VALID_ROUTES.filter(
          (route) =>
            !route.startsWith('/admin') && !route.startsWith('/student')
        )
      );
      if (!isValidPublicRoute && !pathname.startsWith('/api')) {
        // Redirect to home for invalid public routes
        const response = NextResponse.redirect(new URL('/', request.url));
        response.headers.set('Cache-Control', 'no-store');
        return response;
      }
    }

    // Allow the request to proceed
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store');
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Skip auth check for API routes and login page
        if (pathname.startsWith('/api/auth') || pathname === '/login') {
          return true;
        }

        const jwt = token as JWT & { role?: string };

        // For admin routes
        if (pathname.startsWith('/admin')) {
          // For all admin routes, require authentication and admin role
          return (
            !!jwt?.role && (jwt.role === 'ADMIN' || jwt.role === 'SUPER_ADMIN')
          );
        }

        // For student routes
        if (pathname.startsWith('/student')) {
          // For all student routes, require authentication and student role
          return !!jwt?.role && jwt.role === 'STUDENT';
        }

        // For all other routes, allow access
        return true;
      },
    },
    pages: {
      signIn: '/login', // Default to login page for any auth errors
    },
  } as NextAuthMiddlewareOptions
);

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes except:
    // - _next (Next.js internals)
    // - static files (images, etc)
    // - favicon.ico
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

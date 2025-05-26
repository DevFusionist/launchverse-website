'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X, LogOut, LogIn } from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NavItem = {
  name: string;
  href: string;
};

// Public navigation items (for client pages)
const publicNavigation: NavItem[] = [
  { name: 'Home', href: ROUTES.home },
  { name: 'About', href: ROUTES.about },
  { name: 'Courses', href: ROUTES.courses },
  { name: 'Blog', href: ROUTES.blog },
  { name: 'Contact', href: ROUTES.contact },
  { name: 'Verify Certificate', href: ROUTES.verify },
];

// Admin navigation items (for admin pages)
const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: ROUTES.admin.dashboard },
  { name: 'Students', href: ROUTES.admin.students },
  { name: 'Courses', href: ROUTES.admin.courses },
  { name: 'Companies', href: ROUTES.admin.companies },
  { name: 'Certificates', href: ROUTES.admin.certificates },
  { name: 'Placements', href: ROUTES.admin.placements },
];

// Admin management navigation items (only for super admins)
const adminManagementNavigation: NavItem[] = [
  { name: 'Invite Admin', href: '/admin/admins/invite' },
];

// Student navigation items
const studentNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/student/dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session } = useSession();

  // Determine if we're in the admin section based on path only
  const isAdminRoute = pathname?.startsWith('/admin');
  const isStudentRoute = pathname?.startsWith('/student');

  // Use appropriate navigation based on route and session
  let navigation: NavItem[] = publicNavigation;
  if (isAdminRoute) {
    // For super admins, combine regular admin nav with management nav
    navigation =
      session?.user?.role === 'SUPER_ADMIN'
        ? [...adminNavigation, ...adminManagementNavigation]
        : adminNavigation;
  } else if (session?.user?.role === 'STUDENT') {
    navigation = studentNavigation;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // Don't show navbar on login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link
            href={
              isAdminRoute
                ? ROUTES.admin.dashboard
                : isStudentRoute
                  ? '/student/dashboard'
                  : ROUTES.home
            }
            className="mr-6 flex items-center space-x-2"
          >
            <span className="font-bold">Launch Verse</span>
            {isAdminRoute && (
              <span className="text-sm text-muted-foreground">(Admin)</span>
            )}
            {isStudentRoute && (
              <span className="text-sm text-muted-foreground">(Student)</span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1">
          <div className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login?mode=admin">Login as Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login?mode=student">Login as Student</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="container space-y-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {session ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            ) : (
              <>
                <Link
                  href="/login?mode=admin"
                  className="block w-full px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Login as Admin
                </Link>
                <Link
                  href="/login?mode=student"
                  className="block w-full px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Login as Student
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

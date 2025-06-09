"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "./ui/ResizableNavbar";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";

export const MainNavbar = () => {
  const { user, logout } = useAuth();
  
  const getNavItems = () => {
    if (!user) {
      return [
        { name: "Courses", link: "/courses" },
        { name: "About", link: "/about" },
        { name: "Contact", link: "/contact" },
      ];
    }

    if (user.role === UserRole.STUDENT) {
      return [
        { name: "Courses", link: "/courses" },
        { name: "My Courses", link: "/dashboard" },
        { name: "About", link: "/about" },
        { name: "Contact", link: "/contact" },
      ];
    }

    // For ADMIN and SUPER_ADMIN
    return [
      { name: "Dashboard", link: "/admin" },
      { name: "Students", link: "/admin/students" },
      { name: "Courses", link: "/admin/courses" },
      { name: "Companies", link: "/admin/companies" },
      { name: "Certificates", link: "/admin/certificates" },
    ];
  };

  const navItems = getNavItems();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody className="backdrop-blur-md bg-background/70 border-b border-divider/50 shadow-lg">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 relative z-10 pointer-events-auto">
            {user ? (
              <button
                onClick={() => logout()}
                className="relative px-4 py-2 rounded-md text-sm font-medium text-white bg-background/30 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 group"
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-md border border-primary/80" />
                  <div className="absolute inset-0 rounded-md border border-primary/60 blur-[2px]" />
                  <div className="absolute inset-0 rounded-md border border-primary/40 blur-[4px]" />
                  <div className="absolute inset-0 rounded-md bg-primary/5 blur-[12px]" />
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                className="relative px-4 py-2 rounded-md text-sm font-medium text-white bg-background/30 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 group"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-md border border-primary/80" />
                  <div className="absolute inset-0 rounded-md border border-primary/60 blur-[2px]" />
                  <div className="absolute inset-0 rounded-md border border-primary/40 blur-[4px]" />
                  <div className="absolute inset-0 rounded-md bg-primary/5 blur-[12px]" />
                </div>
              </Link>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav className="backdrop-blur-md bg-background/70">
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={() => logout()}
                  className="relative px-3 py-1.5 rounded-md text-sm font-medium text-white bg-background/30 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 group"
                >
                  <span className="relative z-10">Logout</span>
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-md border border-primary/80" />
                    <div className="absolute inset-0 rounded-md border border-primary/60 blur-[2px]" />
                    <div className="absolute inset-0 rounded-md border border-primary/40 blur-[4px]" />
                    <div className="absolute inset-0 rounded-md bg-primary/5 blur-[12px]" />
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="relative px-3 py-1.5 rounded-md text-sm font-medium text-white bg-background/30 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 group"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-md border border-primary/80" />
                    <div className="absolute inset-0 rounded-md border border-primary/60 blur-[2px]" />
                    <div className="absolute inset-0 rounded-md border border-primary/40 blur-[4px]" />
                    <div className="absolute inset-0 rounded-md bg-primary/5 blur-[12px]" />
                  </div>
                </Link>
              )}
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            _onClose={() => setIsMobileMenuOpen(false)}
            isOpen={isMobileMenuOpen}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                className="relative text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors block py-2"
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  );
};

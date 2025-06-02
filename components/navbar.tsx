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
} from "./ui/ResizableNavbar";

export const MainNavbar = () => {
  const navItems = [
    { name: "Courses", link: "/courses" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
    // { name: "Blog", link: "/blog" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody className="backdrop-blur-md bg-background/70 border-b border-divider/50 shadow-lg">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4" />
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav className="backdrop-blur-md bg-background/70">
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-2">
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

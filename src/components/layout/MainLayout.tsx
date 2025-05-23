"use client";

import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "@/components/theme/ThemeToggle";
import AnimatedNavLink from "@/components/ui/AnimatedNavLink";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Verify Certificate", href: "/verify" },
  { name: "Contact", href: "/contact" },
];

interface MainLayoutProps {
  children: ReactNode;
}

function GoToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-neon-primary dark:bg-neon-primary-dark text-white shadow-lg hover:bg-neon-primary-dark dark:hover:bg-neon-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark focus:ring-offset-2 dark:focus:ring-offset-neon-background-dark"
          aria-label="Go to top"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Navigation() {
  const [currentPathname, setCurrentPathname] = useState<string>("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setCurrentPathname(pathname ?? "/");
  }, [pathname]);

  const activePathname = currentPathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full glass-effect backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 shadow-lg">
      <div className="glass-effect-overlay" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold text-neon-primary dark:text-neon-primary-dark hover:text-neon-primary-dark dark:hover:text-neon-primary transition-colors duration-200"
              >
                Launch Verse Academy
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              {navigation.map((item) => (
                <AnimatedNavLink key={item.name} href={item.href}>
                  {item.name}
                </AnimatedNavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-neon-text-light dark:text-neon-text-dark hover:bg-neon-primary/10 dark:hover:bg-neon-primary-dark/10 focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark focus:ring-offset-2 dark:focus:ring-offset-neon-background-dark"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="space-y-1 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200 ${
                activePathname === item.href
                  ? "border-neon-primary dark:border-neon-primary-dark bg-neon-primary/10 dark:bg-neon-primary-dark/10 text-neon-primary dark:text-neon-primary-dark"
                  : "border-transparent text-neon-text-light dark:text-neon-text-dark hover:border-neon-primary/50 dark:hover:border-neon-primary-dark/50 hover:bg-neon-primary/5 dark:hover:bg-neon-primary-dark/5"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen section-gradient pt-16">
        <div className="section-gradient-overlay" />
        <div className="section-gradient-background" />
        <div>
          <AnimatePresence mode="wait">
            <motion.main
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              className="min-h-[calc(100vh-4rem)]"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
        <footer className="glass-effect">
          <div className="glass-effect-overlay" />
          <div
            className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
            suppressHydrationWarning
          >
            <div
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
              suppressHydrationWarning
            >
              <div suppressHydrationWarning>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-primary dark:text-neon-primary-dark">
                  Contact Us
                </h3>
                <div className="mt-4 space-y-4" suppressHydrationWarning>
                  <p className="text-base text-neon-text-light dark:text-neon-text-dark">
                    Business WhatsApp:{" "}
                    <a
                      href="https://wa.me/7001478078?text=Hi%20Launch%20Verse%20Academy!%20I%20am%20interested%20to%20know%20more."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-primary dark:text-neon-primary-dark underline hover:text-neon-primary-dark dark:hover:text-neon-primary transition-colors"
                    >
                      7001478078
                    </a>
                  </p>
                  <p className="text-base text-neon-text-light dark:text-neon-text-dark">
                    WhatsApp/Calls: 7508162363
                  </p>
                  <p className="text-base text-neon-text-light dark:text-neon-text-dark">
                    Hours: 9 AM to 10 PM daily
                  </p>
                </div>
              </div>
              <div suppressHydrationWarning>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-primary dark:text-neon-primary-dark">
                  Quick Links
                </h3>
                <div className="mt-4 space-y-4" suppressHydrationWarning>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-base text-neon-text-light dark:text-neon-text-dark hover:text-neon-primary dark:hover:text-neon-primary-dark transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div suppressHydrationWarning>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-primary dark:text-neon-primary-dark">
                  About
                </h3>
                <p className="mt-4 text-base text-neon-text-light dark:text-neon-text-dark">
                  Launch Verse Academy is a premier computer training academy
                  dedicated to helping students learn valuable skills and launch
                  successful careers in the digital world.
                </p>
              </div>
            </div>
            <div
              className="mt-8 border-t border-neon-primary/20 dark:border-neon-primary-dark/20 pt-8"
              suppressHydrationWarning
            >
              <p className="text-center text-base text-neon-text-light dark:text-neon-text-dark">
                &copy; {new Date().getFullYear()} Launch Verse Academy. All
                rights reserved.
              </p>
            </div>
          </div>
        </footer>
        <GoToTopButton />
      </div>
    </>
  );
}

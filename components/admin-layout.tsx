"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  BookOpen,
  FileCheck,
  Settings,
  Menu,
  X,
  Building2,
} from "lucide-react";

import { UserRole } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Certificates", href: "/admin/certificates", icon: FileCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if user has admin access
    if (!user || ![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(user.role)) {
      router.push("/login");
    }
  }, [user, router]);

  // Filter sidebar items based on role
  const filteredSidebarItems = sidebarItems.filter((item) => {
    // Super admin can see everything
    if (user?.role === UserRole.SUPER_ADMIN) return true;

    // Admin can't access settings
    if (user?.role === UserRole.ADMIN && item.name === "Settings") return false;

    return true;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-background/30 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="fixed lg:relative z-40 h-full"
        initial={{ x: -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <CardContainer className="inter-var h-full">
          <CardBody
            className="relative group/input h-full w-[280px] bg-background/30 backdrop-blur-md border-r border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]
            hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <CardItem className="p-6" translateZ="50">
                <Link className="flex items-center gap-2" href="/admin">
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    LaunchVerse
                  </span>
                  <span className="text-sm text-default-500">Admin</span>
                </Link>
              </CardItem>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {filteredSidebarItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <CardItem
                      key={item.name}
                      className="w-full"
                      translateZ={isActive ? "100" : "50"}
                    >
                      <Link
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                          ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-cyan-500/20 text-emerald-500 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                              : "text-default-500 hover:text-foreground hover:bg-white/5"
                          }`}
                        href={item.href}
                      >
                        <item.icon
                          className={`w-5 h-5 ${isActive ? "text-emerald-500" : ""}`}
                        />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </CardItem>
                  );
                })}
              </nav>

              {/* Footer */}
              <CardItem
                className="p-4 border-t border-white/10"
                translateZ="50"
              >
                <div className="flex items-center justify-end">
                  <button
                    className="text-sm text-default-500 hover:text-foreground transition-colors"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

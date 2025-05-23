"use client";

import { usePathname } from "next/navigation";
import MainLayout from "./MainLayout";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdminPage, setIsAdminPage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAdminPage(pathname?.startsWith("/admin") ?? false);
  }, [pathname]);

  // During SSR, render MainLayout by default
  if (typeof window === "undefined") {
    return <MainLayout>{children}</MainLayout>;
  }

  if (isAdminPage) {
    return children;
  }

  return <MainLayout>{children}</MainLayout>;
}

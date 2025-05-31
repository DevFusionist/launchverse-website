"use client";

import { MainNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col min-h-screen">
      <MainNavbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedLayout({
  children,
  className = "",
}: AnimatedLayoutProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
}

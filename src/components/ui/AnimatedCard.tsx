"use client";

import { motion } from "framer-motion";
import { enhancedCardAnimation } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  whileHover?: boolean;
  whileTap?: boolean;
}

export default function AnimatedCard({
  children,
  className = "",
  onClick,
  whileHover = true,
  whileTap = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      variants={enhancedCardAnimation}
      initial="initial"
      animate="animate"
      whileHover={whileHover ? "hover" : undefined}
      whileTap={whileTap ? "tap" : undefined}
      style={{ transformOrigin: "center" }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
  hover?: boolean;
  onClick?: () => void;
}

export default function NeonCard({
  children,
  className = "",
  variant = "primary",
  hover = true,
  onClick,
}: NeonCardProps) {
  const baseClasses = "relative rounded-lg p-6 transition-all duration-200";
  const variantClasses = {
    primary:
      "bg-neon-card-light dark:bg-neon-card-dark shadow-neon-sm hover:shadow-neon-md",
    secondary:
      "bg-neon-card-light dark:bg-neon-card-dark shadow-neon-secondary-sm hover:shadow-neon-secondary-md",
    accent:
      "bg-neon-card-light dark:bg-neon-card-dark shadow-[0_0_5px_theme('colors.neon.accent.DEFAULT'),0_0_10px_theme('colors.neon.accent.DEFAULT')] hover:shadow-[0_0_10px_theme('colors.neon.accent.DEFAULT'),0_0_20px_theme('colors.neon.accent.DEFAULT')]",
  };
  const hoverClasses = hover ? "hover:-translate-y-1" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const Component = onClick ? motion.div : "div";
  const componentProps = onClick
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick,
      }
    : {};

  return (
    <Component
      {...componentProps}
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`}
    >
      {children}
      <div
        className={`absolute inset-0 rounded-lg border border-${variant}-500/20 dark:border-${variant}-500/20 pointer-events-none`}
      />
    </Component>
  );
}

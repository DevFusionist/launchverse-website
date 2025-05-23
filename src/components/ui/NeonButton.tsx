"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import {
  enhancedButtonAnimation,
  enhancedSpinnerAnimation,
  transitions,
} from "@/lib/animations";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  href?: string;
}

export default function NeonButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  fullWidth = false,
  disabled,
  href,
  ...props
}: NeonButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  };

  const buttonContent = (
    <>
      {isLoading ? (
        <motion.div
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          variants={enhancedSpinnerAnimation}
          animate="animate"
        />
      ) : null}
      {children}
    </>
  );

  const buttonClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <motion.button
      className={buttonClasses}
      variants={enhancedButtonAnimation}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      whileFocus="focus"
      disabled={disabled || isLoading}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
}

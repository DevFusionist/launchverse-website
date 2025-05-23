"use client";

import { motion } from "framer-motion";
import {
  enhancedFormAnimation,
  enhancedFormFieldAnimation,
} from "@/lib/animations";
import { ReactNode, FormEvent } from "react";

interface AnimatedFormProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export default function AnimatedForm({
  children,
  className = "",
  onSubmit,
}: AnimatedFormProps) {
  return (
    <motion.form
      className={className}
      variants={enhancedFormAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      onSubmit={onSubmit}
    >
      <motion.div variants={enhancedFormFieldAnimation} layout>
        {children}
      </motion.div>
    </motion.form>
  );
}

export function AnimatedFormField({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={enhancedFormFieldAnimation}>
      {children}
    </motion.div>
  );
}

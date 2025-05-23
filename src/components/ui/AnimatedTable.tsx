"use client";

import { motion } from "framer-motion";
import {
  enhancedTableAnimation,
  enhancedTableRowAnimation,
} from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedTableProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedTable({
  children,
  className = "",
}: AnimatedTableProps) {
  return (
    <motion.div
      className={className}
      variants={enhancedTableAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <motion.div variants={enhancedTableRowAnimation} layout>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function AnimatedTableRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.tr className={className} variants={enhancedTableRowAnimation}>
      {children}
    </motion.tr>
  );
}

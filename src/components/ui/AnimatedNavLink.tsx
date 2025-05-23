"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedNavLink({
  href,
  children,
  className = "",
}: AnimatedNavLinkProps) {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsActive(pathname === href);
  }, [pathname, href]);

  // During SSR, assume not active
  const active = typeof window === "undefined" ? false : isActive;

  return (
    <Link href={href} className={`relative px-1 pb-1 ${className}`}>
      <motion.div
        className="group inline-flex flex-col items-start"
        initial="rest"
        whileHover="hover"
        animate={active ? "hover" : "rest"}
      >
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            active
              ? "text-neon-primary dark:text-neon-primary-dark"
              : "text-neon-text-light dark:text-neon-text-dark group-hover:text-neon-primary dark:group-hover:text-neon-primary-dark"
          }`}
        >
          {children}
        </span>

        <motion.div
          className="h-[2px] w-full bg-neon-primary dark:bg-neon-primary-dark origin-left"
          variants={{
            rest: { scaleX: 0 },
            hover: { scaleX: 1 },
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </Link>
  );
}

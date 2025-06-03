"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

export function CTAButtons() {
  return (
    <section aria-label="Call to action" className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto px-4 sm:px-0">
      <Link
        className={buttonStyles({
          color: "primary",
          radius: "full",
          variant: "bordered",
          size: "lg",
          class:
            "relative group overflow-visible bg-transparent hover:bg-transparent border-primary/20 transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto",
        })}
        href="/courses"
      >
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute inset-0 rounded-full border-2 border-primary/80" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/60 blur-[2px]" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 blur-[4px]" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 blur-[6px]" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/10 blur-[8px]" />
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-[12px]" />
        </div>
        <span className="relative z-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">
          Explore Courses
        </span>
      </Link>
      <Link
        className={buttonStyles({
          variant: "bordered",
          radius: "full",
          size: "lg",
          class:
            "relative group overflow-visible bg-transparent hover:bg-transparent border-secondary/20 transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto",
        })}
        href="/contact"
      >
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute inset-0 rounded-full border-2 border-secondary/80" />
          <div className="absolute inset-0 rounded-full border-2 border-secondary/60 blur-[2px]" />
          <div className="absolute inset-0 rounded-full border-2 border-secondary/40 blur-[4px]" />
          <div className="absolute inset-0 rounded-full border-2 border-secondary/20 blur-[6px]" />
          <div className="absolute inset-0 rounded-full border-2 border-secondary/10 blur-[8px]" />
          <div className="absolute inset-0 rounded-full bg-secondary/5 blur-[12px]" />
        </div>
        <span className="relative z-10 text-foreground/80 dark:text-foreground/90 group-hover:text-foreground transition-colors">
          Talk to an Advisor
        </span>
      </Link>
    </section>
  );
}

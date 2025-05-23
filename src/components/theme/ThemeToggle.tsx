"use client";

import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-neon-card-light dark:bg-neon-card-dark shadow-neon-sm transition-colors duration-200 hover:bg-neon-primary/10 dark:hover:bg-neon-primary-dark/10 focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark focus:ring-offset-2 dark:focus:ring-offset-neon-background-dark"
      aria-label="Toggle theme"
    >
      <SunIcon
        className={`h-5 w-5 text-neon-primary dark:text-neon-primary-dark transition-all duration-200 ${
          theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"
        }`}
      />
      <MoonIcon
        className={`absolute h-5 w-5 text-neon-primary dark:text-neon-primary-dark transition-all duration-200 ${
          theme === "light" ? "scale-0 -rotate-90" : "scale-100 rotate-0"
        }`}
      />
    </button>
  );
}

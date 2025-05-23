import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          // Light mode colors
          primary: {
            DEFAULT: "#2563eb",
            dark: "#1d4ed8",
            light: "#60a5fa",
          },
          secondary: {
            DEFAULT: "#7c3aed",
            dark: "#6d28d9",
            light: "#a78bfa",
          },
          accent: {
            DEFAULT: "#10b981",
            dark: "#059669",
            light: "#34d399",
          },
          background: {
            light: "#f8fafc",
            dark: "#0f172a",
          },
          card: {
            light: "#ffffff",
            dark: "#1e293b",
          },
          text: {
            light: "#0f172a",
            dark: "#f8fafc",
          },
          border: {
            light: "#e2e8f0",
            dark: "#334155",
          },
          muted: {
            light: "#64748b",
            dark: "#94a3b8",
          },
          "muted-foreground": {
            light: "#94a3b8",
            dark: "#cbd5e1",
          },
        },
        glass: {
          background: "var(--glass-background)",
          "background-dark": "var(--glass-background-dark)",
          border: "var(--glass-border)",
          "border-dark": "var(--glass-border-dark)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neon-sm": "0 0 2px var(--neon-primary), 0 0 4px var(--neon-primary)",
        "neon-md": "0 0 4px var(--neon-primary), 0 0 8px var(--neon-primary)",
        "neon-lg": "0 0 8px var(--neon-primary), 0 0 16px var(--neon-primary)",
        "neon-xl": "0 0 12px var(--neon-primary), 0 0 24px var(--neon-primary)",
        glass: "var(--glass-shadow)",
        "glass-dark": "var(--glass-shadow-dark)",
        "glass-neon":
          "0 0 5px var(--neon-primary), 0 0 20px var(--neon-primary)",
        "glass-neon-hover":
          "0 0 10px var(--neon-primary), 0 0 30px var(--neon-primary)",
      },
      animation: {
        "neon-pulse": "neon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "neon-shine": "neon-shine 2s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-in",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "scale-up": "scale-up 0.2s ease-out",
        "scale-down": "scale-down 0.2s ease-in",
        "glass-shine": "glass-shine 2s linear infinite",
        "glass-pulse": "glass-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "neon-pulse": {
          "0%, 100%": {
            opacity: "1",
            filter: "brightness(1.2)",
          },
          "50%": {
            opacity: "0.9",
            filter: "brightness(1.4)",
          },
        },
        "neon-shine": {
          "0%": {
            backgroundPosition: "-100% 0",
            opacity: "0.3",
          },
          "50%": {
            opacity: "0.5",
          },
          "100%": {
            backgroundPosition: "200% 0",
            opacity: "0.3",
          },
        },
        "glass-shine": {
          "0%": {
            backgroundPosition: "-100% 0",
            opacity: "0.3",
          },
          "50%": {
            opacity: "0.5",
          },
          "100%": {
            backgroundPosition: "200% 0",
            opacity: "0.3",
          },
        },
        "glass-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(0.98)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-down": {
          "0%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-neon":
          "linear-gradient(to bottom, var(--neon-primary), var(--neon-primary-dark))",
        "gradient-neon-secondary":
          "linear-gradient(to bottom, var(--neon-secondary), var(--neon-secondary-dark))",
        "gradient-neon-accent":
          "linear-gradient(to bottom, var(--neon-accent), var(--neon-accent-dark))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        "glass-gradient-dark":
          "linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
        "glass-neon-gradient":
          "linear-gradient(135deg, var(--neon-primary), var(--neon-secondary))",
      },
    },
  },
  plugins: [],
};

export default config;

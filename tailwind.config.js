import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        'neon': '0 0 30px rgba(var(--shadow-color), 0.3)',
      },
      perspective: {
        1000: "1000px",
        2000: "2000px",
        3000: "3000px",
        4000: "4000px",
        5000: "5000px",
        6000: "6000px",
        7000: "7000px",
        8000: "8000px",
        9000: "9000px",
        10000: "100000px",
      },
      translate: {
        'z-5': '5px',
        'z-10': '10px',
        'z-20': '20px',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        fancy: {
          blue: "#1455D9",
          navy: "#0B2A63",
          darkNavy: "#061A40",
          orange: "#F7941D",
          amber: "#FFB039",
          lightBlue: "#EBF3FF",
          lightOrange: "#FFF7ED",
          accent: "#2563EB",
          cardBg: "#FFFFFF",
          mutedBg: "#F8FAFC",
        },
        primary: {
          DEFAULT: "#1455D9",
          foreground: "#FFFFFF",
          dark: "#0B2A63",
          light: "#EBF3FF",
        },
        secondary: {
          DEFAULT: "#F7941D",
          foreground: "#FFFFFF",
          light: "#FFF7ED",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F8FAFC",
          foreground: "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 25px -5px rgba(20, 85, 217, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        dropdown: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

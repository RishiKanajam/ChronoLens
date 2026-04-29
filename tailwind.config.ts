import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ChronoLens design tokens (named palette kept for backward compat)
        obsidian: "hsl(var(--background))",
        ink: "hsl(var(--card))",
        surfaceElevated: "hsl(var(--secondary))",
        bronze: "hsl(var(--accent))",
        vellum: "hsl(var(--foreground))",
        textSecondary: "hsl(var(--muted-foreground))",
        verdigris: "hsl(var(--primary))",
        lapis: "#526dff",
        signal: "#ffcf5b",
        danger: "hsl(var(--destructive))",
        success: "#22c55e",
        muted: "#6b7280",
        // shadcn semantic tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        muted2: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
      },
      boxShadow: {
        glow: "0 14px 36px rgba(15, 118, 110, 0.1)",
        bronze: "0 14px 32px rgba(183, 121, 31, 0.1)",
        soft: "0 14px 42px rgba(35, 29, 20, 0.1)",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;

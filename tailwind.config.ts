import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        script: ['"Great Vibes"', "cursive"],
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        wedding: {
          cream: "hsl(var(--wedding-cream) / <alpha-value>)",
          paper: "hsl(var(--wedding-paper) / <alpha-value>)",
          blush: "hsl(var(--wedding-blush) / <alpha-value>)",
          sage: "hsl(var(--wedding-sage) / <alpha-value>)",
          accent: "hsl(var(--wedding-accent) / <alpha-value>)",
          text: "hsl(var(--wedding-text) / <alpha-value>)",
          olive: "hsl(var(--wedding-olive) / <alpha-value>)",
          gold: "hsl(var(--wedding-gold) / <alpha-value>)",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;

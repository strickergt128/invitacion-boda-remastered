import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // En pantallas táctiles el :hover se queda "pegado" después de tocar
  future: { hoverOnlyWhenSupported: true },
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
        // Paleta terracota de la boda
        boda: {
          terracota: "hsl(var(--boda-terracota) / <alpha-value>)",
          oxido: "hsl(var(--boda-oxido) / <alpha-value>)",
          arcilla: "hsl(var(--boda-arcilla) / <alpha-value>)",
          cafe: "hsl(var(--boda-cafe) / <alpha-value>)",
          crema: "hsl(var(--boda-crema) / <alpha-value>)",
          arena: "hsl(var(--boda-arena) / <alpha-value>)",
          marfil: "hsl(var(--boda-marfil) / <alpha-value>)",
          texto: "hsl(var(--boda-texto) / <alpha-value>)",
        },
      },
      transitionTimingFunction: {
        // Curvas de la skill "animate": las de CSS por defecto son demasiado débiles
        "out-fuerte": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-fuerte": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-solo": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Dígito de la cuenta regresiva: el nuevo baja a su lugar
        digito: {
          "0%": { opacity: "0", transform: "translateY(-45%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Acercamiento lento de fondo (efecto Ken Burns)
        acercar: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) both",
        "fade-solo": "fade-solo 0.6s ease both",
        digito: "digito 350ms cubic-bezier(0.23, 1, 0.32, 1) both",
        acercar: "acercar 24s linear infinite alternate",
      },
    },
  },
  plugins: [],
} satisfies Config;

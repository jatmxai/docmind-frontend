/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#06060a",
          900: "#0a0a12",
          800: "#0f0f1a",
          700: "#15152a",
          600: "#1c1c36",
          500: "#252544",
          400: "#3a3a5c",
        },
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(139, 92, 246, 0.4)",
        "glow-lg": "0 0 80px -20px rgba(139, 92, 246, 0.5)",
        "inner-border": "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "gradient-mesh":
          "radial-gradient(at 20% 30%, rgba(124, 58, 237, 0.15) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(56, 189, 248, 0.10) 0px, transparent 50%), radial-gradient(at 60% 80%, rgba(217, 70, 239, 0.10) 0px, transparent 50%)",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

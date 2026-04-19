/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        navy: {
          50:  "#f0f2f8",
          100: "#d9dff0",
          200: "#b3bfe1",
          300: "#8d9fd2",
          400: "#677fc3",
          500: "#4a62ae",
          600: "#3a4f8c",
          700: "#2c3c6a",
          800: "#1e2947",
          900: "#141c30",
          950: "#0d1220",
        },
        gold: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "float-delay": "float 3s ease-in-out 1.5s infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-8px)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

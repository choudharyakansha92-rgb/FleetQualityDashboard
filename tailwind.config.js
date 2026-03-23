/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
        mono:    ["DM Mono", "Courier New", "monospace"],
      },
      colors: {
        fleet: {
          page:    "var(--bg-page)",
          surface: "var(--bg-surface)",
          card:    "var(--bg-card)",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease both",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.5", transform: "scale(1.4)" },
        },
      },
    },
  },
  plugins: [],
};

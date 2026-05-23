import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0eaff",
          200: "#c4d3ff",
          300: "#9db4ff",
          400: "#7090ff",
          500: "#4c6ef5",
          600: "#3451d1",
          700: "#2a3fa8",
          800: "#1e2d7a",
          900: "#141f57",
        },
        surface: {
          0:   "#ffffff",
          50:  "#f8faff",
          100: "#f1f5fd",
          200: "#e4ecfb",
          800: "#0f1629",
          900: "#080e1c",
          950: "#040810",
        },
        accent: {
          green:  "#10b981",
          amber:  "#f59e0b",
          red:    "#ef4444",
          purple: "#8b5cf6",
        },
      },
      animation: {
        "fade-in":     "fadeIn 0.4s ease-out",
        "slide-up":    "slideUp 0.5s ease-out",
        "slide-in":    "slideIn 0.4s ease-out",
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow":   "spin 3s linear infinite",
        "gradient":    "gradient 6s ease infinite",
        "score-ring":  "scoreRing 1.2s ease-out forwards",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" },                          to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideIn:   { from: { opacity: "0", transform: "translateX(-20px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        gradient:  { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        scoreRing: { from: { strokeDashoffset: "339.3" }, to: { strokeDashoffset: "var(--dash-offset)" } },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        "glow":       "0 0 40px rgba(76, 110, 245, 0.15)",
        "glow-lg":    "0 0 80px rgba(76, 110, 245, 0.25)",
        "card":       "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

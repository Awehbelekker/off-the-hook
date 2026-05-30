import type { Config } from "tailwindcss"

// Vula Master Plan design system — applied to Off the Hook storefront
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Vula master plan primaries
        vula: {
          green: "#2C5545",
          "green-light": "#3A6B57",
          "green-dark": "#1E3D31",
          amber: "#C4861A",
          "amber-light": "#D99B2A",
          cream: "#F7F4EE",
          dark: "#080808",
          "dark-2": "#111111",
          "dark-3": "#1A1A1A",
          muted: "#6B7280",
          border: "#2A2A2A",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        input: "6px",
        badge: "20px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "slide-in": "slideIn 0.3s ease-out forwards",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.4)" },
        },
      },
    },
  },
  plugins: [],
}

export default config

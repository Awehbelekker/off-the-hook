import type { Config } from "tailwindcss"

// Off the Hook brand — from the official price-list design system.
// Navy + teal on cream, with white surfaces and peach highlights.
//
// Kept under the `vula-` namespace so existing components inherit
// the new brand automatically without rewriting every className.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vula: {
          // PRIMARY = deep navy (header bars, "Deboned Chicken" band, body text)
          dark:        "#0E2D4D",
          "dark-soft": "#15375F",

          // SURFACES = white cards on cream page (was dark surfaces)
          "dark-2":    "#FFFFFF",   // card / sticky surfaces
          "dark-3":    "#F0EBE0",   // input fields, subtle wells

          // CREAM = page background + light text on dark sections
          cream:       "#F5F0E6",

          // ACCENT = brand teal ("Fresh Portions" header, R95 price chip, tagline)
          green:        "#2DAAB5",
          "green-light":"#38C0CB",
          "green-dark": "#1F8B95",

          // HIGHLIGHT = warm peach (the *AMENDMENT*/*NEW* rows on the sheet)
          amber:        "#E8B86E",
          "amber-light":"#F4D196",
          peach:        "#F8E8D2",

          // SUPPORTING
          muted:   "#6B7280",
          border:  "#E5DFCF",
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

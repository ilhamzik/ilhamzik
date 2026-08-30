/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#f7efd9",
          100: "#efe4c2",
          200: "#e5d3a3",
          300: "#d8bd80",
          400: "#c8a563",
          500: "#b38b4a",
          600: "#8f6c39",
          700: "#6b502a",
          800: "#4a381e",
          900: "#2e2313",
        },
        ink: {
          100: "#3b332a",
          300: "#2a241d",
          500: "#1c1712",
          700: "#100d0a",
          900: "#080605",
        },
        blood: {
          500: "#8a2b1e",
          600: "#6f2117",
        },
        stamp: {
          500: "#7a1f1f",
        },
      },
      fontFamily: {
        headline: ["'Playfair Display'", "'Old Standard TT'", "serif"],
        typewriter: ["'Special Elite'", "'Courier Prime'", "monospace"],
        body: ["'Courier Prime'", "'Special Elite'", "monospace"],
        hand: ["'Caveat'", "cursive"],
      },
      boxShadow: {
        pinned: "0 6px 14px -4px rgba(20, 14, 8, 0.55), 0 2px 4px rgba(20,14,8,0.35)",
        case: "0 20px 60px -10px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "paper-gradient":
          "radial-gradient(120% 140% at 20% 0%, #f7efd9 0%, #ecdfb8 45%, #d8bf8f 100%)",
      },
      keyframes: {
        stampIn: {
          "0%": { transform: "scale(2.4) rotate(-14deg)", opacity: "0" },
          "60%": { transform: "scale(0.9) rotate(-8deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(-8deg)", opacity: "1" },
        },
        popIn: {
          "0%": { transform: "scale(0.85) translateY(12px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(var(--tilt, -3deg))" },
          "50%": { transform: "rotate(calc(var(--tilt, -3deg) * -1))" },
        },
      },
      animation: {
        stampIn: "stampIn 0.45s cubic-bezier(.2,.8,.2,1) forwards",
        popIn: "popIn 0.35s ease-out forwards",
        sway: "sway 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

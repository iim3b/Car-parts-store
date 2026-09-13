import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // هوية "معرض راقٍ": أسود دافئ فاخر (onyx) + ذهبي أنتيك (gold) كلون تمييز
        onyx: {
          50: "#F7F6F3",
          100: "#EDEAE3",
          200: "#D9D4C7",
          300: "#B8B0A0",
          400: "#8C8371",
          500: "#6B6354",
          600: "#4A4438",
          700: "#332F27",
          800: "#221F1A",
          900: "#151310",
          950: "#0B0A08",
        },
        gold: {
          50: "#FBF7EC",
          100: "#F5EAD0",
          200: "#E9D29C",
          300: "#DCB86A",
          400: "#C9A046",
          500: "#AD8630",
          600: "#8C6A25",
          700: "#6B501C",
        },
        success: { 50: "#EAF5EE", 400: "#3E9A6B", 500: "#1F6B45", 600: "#17532F" },
        danger: { 50: "#F8EAEA", 400: "#E0645F", 500: "#9E2B2B", 600: "#7A2020" },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Tahoma", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(18, 24, 31, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;

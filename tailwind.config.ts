import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // نظام ألوان "ورشة هادئة": رمادي فولاذي غامق + كهرمان دافئ كلون تنبيه/CTA
        graphite: {
          50: "#F5F6F7",
          100: "#E9EBED",
          200: "#D3D7DB",
          300: "#AEB6BD",
          400: "#7C8791",
          500: "#5B6672",
          600: "#434E5A",
          700: "#323C47",
          800: "#263445",
          900: "#1B2530",
          950: "#12181F",
        },
        amber: {
          50: "#FCF3E7",
          100: "#F8E3C4",
          200: "#F0C888",
          300: "#E8AD52",
          400: "#E0972E",
          500: "#C97F1E",
          600: "#A8681A",
          700: "#7F4F16",
        },
        success: { 50: "#EAF6EF", 500: "#2F855A", 600: "#276749" },
        danger: { 50: "#FBEAEA", 500: "#C53030", 600: "#9B2C2C" },
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

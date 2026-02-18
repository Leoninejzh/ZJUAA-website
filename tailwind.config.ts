import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      colors: {
        "zju-blue": {
          DEFAULT: "#003f87",
          50: "#e6eef6",
          100: "#b3c9e3",
          200: "#80a4d0",
          300: "#4d7fbd",
          400: "#1a5aaa",
          500: "#003f87",
          600: "#00336c",
          700: "#002651",
          800: "#001a36",
          900: "#000d1b",
        },
      },
    },
  },
  plugins: [],
};

export default config;

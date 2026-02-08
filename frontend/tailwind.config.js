/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        float: "float 3s ease-in-out infinite",
        "progress-pulse": "progress-pulse 2s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "progress-pulse": {
          "0%, 100%": { backgroundPosition: "0 0" },
          "50%": { backgroundPosition: "100% 0" },
        },
      },
      colors: {
        cyan: {
          400: "#00c6ff",
          500: "#00b8e6",
        },
        blue: {
          600: "#0072ff",
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 198, 255, 0.3)",
        "glow-cyan-lg": "0 0 30px rgba(0, 198, 255, 0.2)",
      },
    },
  },
  plugins: [],
};

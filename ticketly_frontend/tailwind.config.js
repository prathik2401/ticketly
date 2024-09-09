/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          background: "#F4F6F8",
          text: "#333333",
          primary: "#0052CC",
          secondary: "#4F5D75",
          buttonBackground: "#0061F2",
          buttonText: "#FFFFFF",
        },
        dark: {
          background: "#1F2937",
          text: "#E5E7EB",
          primary: "#1D4ED8",
          secondary: "#3B82F6",
          buttonBackground: "#2563EB",
          buttonText: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};

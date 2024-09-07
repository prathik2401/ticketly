/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
          text: "#000000",
          primary: "#1a202c",
          secondary: "#2d3748",
          buttonBackground: "#4a5568",
          buttonText: "#ffffff",
        },
        dark: {
          background: "#1a202c",
          text: "#ffffff",
          primary: "#2d3748",
          secondary: "#4a5568",
          buttonBackground: "#03346E",
          buttonText: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};

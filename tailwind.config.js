/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B5E3C",
        "primary-dark": "#5C3A24",
        "app-bg": "#FAFAF8",
        "outer-bg": "#F3F0EA",
        surface: "#FFFFFF",
        "text-main": "#171717",
        "text-secondary": "#737373",
        border: "#E5E5E5",
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};

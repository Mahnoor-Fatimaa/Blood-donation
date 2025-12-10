/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#D61F26",
          dark: "#99151A",
          light: "#FBE9EA"
        },
        slate: {
          950: "#0F172A"
        }
      },
      boxShadow: {
        soft: "0 15px 35px rgba(15,23,42,0.08)"
      }
    }
  },
  plugins: []
};


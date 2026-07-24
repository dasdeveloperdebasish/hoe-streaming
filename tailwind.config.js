/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        surface: "#16161A",
        line: "#26262C",
        ink: "#F5F5F4",
        muted: "#8B8B93",
        accent: "#FF5A36",
      },
    },
  },
  plugins: [],
};

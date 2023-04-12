/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      bgColor: "#fff",
    },
  },
  plugins: [require("daisyui")],
};

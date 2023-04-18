/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      bgColor: "#fff",
    },
    extend : {
      visibility : ["group-hover"]
    }
  },
  plugins: [require("daisyui")],
};

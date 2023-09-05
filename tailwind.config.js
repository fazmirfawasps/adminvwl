/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "rgba(0, 137, 85, 1)",
        sub: "#B3E5AA",
        rey: "#B0A4A4",
        mud: "#737272",
        "mud-plus": "#D9D9D9",
        "red-350": "#F44336",
      },
      backgroundColor: {
        main: "#008955",
        sub: "#B3E5AA",
        mud: "rgba(243, 246, 244, 1)",
        "mud-plus": "#D9D9D9",
        "sub-plus": "#E7FFF2",
      },
      height: {
        d: "77.2vh",
      },
      fontFamily: {
        Manrope: ["Manrope"],
        Poppins: ["Poppins"],
      },
    },
  },
  plugins: [],
  prefix: "tw-",
};

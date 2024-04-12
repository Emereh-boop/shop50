/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      height: {
        96: "32rem",
        700: "700px",
        400: "400px",
      },
      fontSize: {
        90: ["40rem"],
        "45xl": [
          "2.9rem",
          {
            lineHeight: "3rem",
            letterSpacing: "-0.01em",
            fontWeight: "500",
          },
        ],
      },
    },
  },
  plugins: [],
};

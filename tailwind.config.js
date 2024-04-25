/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": "80px 100px 35px rgba(0, 0, 0, 0.5)",
      },
      height: {
        96: "32rem",
        700: "700px",
        400: "400px",
      },
      backgroundImage: {
        "hero-pattern": "url('../src/images/slide-ecommerce.jpg')",
        "footer-texture": "url('/img/footer-texture.png')",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 2s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      scale: {
        80: "0.8",
        60: "0.6",
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
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

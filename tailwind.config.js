/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Ensuring compatibility across React & TypeScript
  theme: {
    extend: {
      colors: {
        primary: "#f472b6", // Elegant, mature pink (YNT Brand)
        secondary: "#f8f8fb", // Deep charcoal (Professional & Trustworthy)
        accent: "#0099FF", // Subtle blue accent (Modern & Fresh)
        background: "#F8F9FA", // Soft white-gray background
        black: "#121212", // True black for contrast
        gray: {
          100: "#E5E5E5",
          300: "#B0B0B0",
          500: "#787878",
          700: "#4A4A4A",
          900: "#222222",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "Helvetica", "Arial", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
        mono: ["Fira Code", "Menlo", "monospace"],
        display: ["Oswald"],
        body: ['"Open Sans"'],
      },
      dropShadow: {
        "3xl": "0 25px 50px rgba(0, 0, 0, 0.15)", // Softer shadow for elegance
        "4xl": "0 50px 80px rgba(0, 0, 0, 0.3)", // More defined professional look
      },
      height: {
        96: "32rem",
        700: "700px",
        400: "400px",
        screen90: "90vh", // Ensuring hero sections are well-proportioned
      },
      backgroundImage: {
        "hero-pattern": "url('../src/images/hero-bg.jpg')",
        "footer-texture": "url('../src/images/footer-texture.png')",
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-in-out",
        "wiggle": "wiggle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      scale: {
        95: "0.95",
        102: "1.02",
      },
      fontSize: {
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "6xl": ["3.75rem", { lineHeight: "4rem" }],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"), // Hides scrollbars for a cleaner look
    require("@tailwindcss/typography"), // Improved text readability
    require("@tailwindcss/aspect-ratio"), // Helps with image scaling
  ],
};

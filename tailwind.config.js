/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "gradient-animate": {
          "0%, 100%": {
            "background-size": "200% 100%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 100%",
            "background-position": "right center",
          },
        },
        "game-spin": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "gradient-animate": "gradient-animate 1s ease infinite",
        "game-spin": "game-spin 0.75s linear infinite",
      },
    },
  },
  plugins: [],
};

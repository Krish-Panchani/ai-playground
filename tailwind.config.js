/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    keyframes: {
      'gradient-animate': {
          '0%, 100%': {
            'background-size': '200% 100%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 100%',
            'background-position': 'right center'
          },
        },
        'pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.5,
          },
        }
    },
    animation: {
      'gradient-animate': 'gradient-animate 1s ease infinite',
      'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        acme: {
          navy: '#0b3c5d', // Deep Navy Blue for brand components
          navyDark: '#082a42', // Darker navy for hover/active states
          navyLight: '#328cc1', // Lighter branding accent blue
          gold: '#d9b310', // Complementary gold accent
          cream: '#fefefe',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Outfit"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

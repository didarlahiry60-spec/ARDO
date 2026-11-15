/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ardo: {
          ivory: '#F2EBDD',
          'soft-ivory': '#FAF7F0',
          charcoal: '#25231F',
          gold: '#AD946A',
          maroon: '#6B2D2D',
          'charcoal-light': '#36332D',
          'gold-light': '#C5AE86',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
        'bengali-serif': ['"Noto Serif Bengali"', '"Tiro Bangla"', 'serif'],
      },
      letterSpacing: {
        'widest-plus': '0.25em',
        'luxury': '0.35em',
      }
    },
  },
  plugins: [],
}

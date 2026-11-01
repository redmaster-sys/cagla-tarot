/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tarot: {
          black: '#17141F',
          plum: '#302139',
          burgundy: '#622F48',
          gold: '#C6A66A',
          cream: '#F3E7D1',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        velvet: 'inset 0 0 80px rgba(10, 7, 15, 0.85), 0 12px 32px rgba(0, 0, 0, 0.5)',
        gold: '0 0 20px rgba(198, 166, 106, 0.22)',
        card: '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(198, 166, 106, 0.35)',
      },
    },
  },
  plugins: [],
};

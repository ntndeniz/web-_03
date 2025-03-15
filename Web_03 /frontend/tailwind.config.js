/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fbf7e4',
          100: '#f7efca',
          200: '#ecd995',
          300: '#e2c460',
          400: '#d4af37',
          500: '#c19b29',
          600: '#a47f20',
          700: '#86641c',
          800: '#6e4f1c',
          900: '#5c411b',
        },
        gold: {
          50: '#fbf7e4',
          100: '#f7efca',
          200: '#ecd995',
          300: '#e2c460',
          400: '#d4af37',
          500: '#c19b29',
          600: '#a47f20',
          700: '#86641c',
          800: '#6e4f1c',
          900: '#5c411b',
        }
      }
    }
  },
  plugins: []
} 
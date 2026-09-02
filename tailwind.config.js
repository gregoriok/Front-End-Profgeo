/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        profgeo: {
          950: '#0f1a2e',
          900: '#1a2744',
          800: '#1e3a5f',
          700: '#22507a',
          600: '#2b6cb0',
          500: '#3b82c4',
          400: '#4db8e8',
          300: '#7acbef',
          200: '#a8ddf5',
          100: '#d4eefa',
          50:  '#eef7fd',
        },
      },
    },
  },
  plugins: [],
}

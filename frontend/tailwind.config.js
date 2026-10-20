/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f7f3fc',
          100: '#ece4f5',
          200: '#d9c9e8',
          300: '#c0a9d8',
          400: '#b89ad6',
          500: '#9d7cc4',
          600: '#7c6ca5',
          700: '#6a5a93',
          800: '#5a4d75',
          900: '#3d3454',
        },
        blush: {
          50: '#fdf5f7',
          100: '#fce8ee',
          200: '#f9d1dc',
          300: '#f4afc3',
          400: '#ec88a8',
        },
        cream: {
          50: '#fdfbf6',
          100: '#faf6ec',
          200: '#f3ecd8',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

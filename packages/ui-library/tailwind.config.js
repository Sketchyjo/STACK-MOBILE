/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Design system colors from design.json
        primary: {
          DEFAULT: '#5852FF', // royalBlue
        },
        accent: {
          DEFAULT: '#B9FF4B', // limeGreen
        },
        background: {
          main: '#FFFFFF',
          dark: '#121212',
        },
        surface: {
          card: '#F7F7F7',
          light: '#EAE2FF',
        },
        text: {
          primary: '#000000',
          secondary: '#545454',
          tertiary: '#A0A0A0',
          'on-primary': '#FFFFFF',
          'on-accent': '#000000',
        },
        semantic: {
          success: '#28A745',
          danger: '#DC3545',
          warning: '#FFC107',
        },
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontSize: {
        // Design System Typography Sizes from design.json
        h1: ['36px', { lineHeight: '1.2' }], // design.json: 36px
        h2: ['24px', { lineHeight: '1.3' }], // design.json: 24px
        h3: ['20px', { lineHeight: '1.4' }], // Common h3 size
        body: ['16px', { lineHeight: '1.5' }], // design.json: 16px
        label: ['14px', { lineHeight: '1.4' }], // design.json: 14px
        caption: ['12px', { lineHeight: '1.3' }], // design.json: 12px
      },
      colors: {
        // Design system colors from design.json
        primary: {
          DEFAULT: '#0000FF', // royalBlue
          dark: '#0A0427',
          lavender: '#949FFF',
          lavendertint: '#D7D6FF',
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

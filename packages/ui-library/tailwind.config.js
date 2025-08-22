/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        display: ['MDNichrome-Bold'], // For large, impactful text
        heading: ['MDNichrome-Regular'], // For section headers
        subheading: ['MDNichrome-Light'], // For subsection headers

        // Secondary Font: Gilroy (for body text)
        body: ['Gilroy-Regular', 'sans-serif'], // Main body text
        'body-bold': ['Gilroy-Bold', 'sans-serif'],
        'body-medium': ['Gilroy-Medium', 'sans-serif'],
        'body-light': ['Gilroy-Light', 'sans-serif'],
      },
      fontSize: {
        // Type Scale with Modern Ratios
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['40px', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'display-sm': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],

        'heading-xl': ['34px', { lineHeight: '1.3' }],
        'heading-lg': ['28px', { lineHeight: '1.3' }],
        'heading-md': ['24px', { lineHeight: '1.3' }],
        'heading-sm': ['20px', { lineHeight: '1.4' }],

        'body-lg': ['18px', { lineHeight: '1.5' }],
        'body-base': ['16px', { lineHeight: '1.5' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'body-xs': ['12px', { lineHeight: '1.5' }],

        // Legacy sizes for backward compatibility
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

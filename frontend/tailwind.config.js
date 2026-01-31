/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adoor Brand Colors (from company logo)
        primary: {
          50: '#f4f9e8',
          100: '#e5f2c7',
          200: '#d3e89f',
          300: '#c0de77',
          400: '#aed457',
          500: '#92bc1b',  // Main brand lime green
          600: '#7fa318',
          700: '#6a8714',
          800: '#556b11',
          900: '#40500d',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#d3d9df',
          300: '#b0bac4',
          400: '#8a99a8',
          500: '#6c7a89',
          600: '#556270',
          700: '#404d5a',
          800: '#2d3845',
          900: '#1a2530',
        },
        accent: {
          50: '#f0f2f5',
          100: '#dde2e8',
          200: '#c3ccd6',
          300: '#a3b0bf',
          400: '#7d8c9f',
          500: '#5d6d80',
          600: '#475566',
          700: '#35404d',
          800: '#121f2f',  // Main brand dark navy
          900: '#0a1219',
        },
        brand: {
          green: '#92bc1b',   // Main brand lime green
          navy: '#121f2f',    // Main brand dark navy
          dark: '#0a1219',    // Darker navy
          light: '#f3f4f6',
          lighter: '#f9fafb',
          white: '#ffffff',
        }
      },
    },
  },
  plugins: [],
}



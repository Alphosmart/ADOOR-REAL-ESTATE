/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adoor Brand Colors (from actual logo)
        primary: {
          50: '#fef6e7',
          100: '#fdecc4',
          200: '#fbd98d',
          300: '#f9c556',
          400: '#e8a943',
          500: '#d89439',  // Main brand orange/gold (ADOO text)
          600: '#c17b2a',
          700: '#9f6322',
          800: '#7d4d1f',
          900: '#5d3a19',
        },
        secondary: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#5a5a5a',
          900: '#4a4a4a',
        },
        accent: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#2d2d2d',  // Dark gray/black (logo text and roofs)
          900: '#1a1a1a',
        },
        brand: {
          orange: '#d89439',  // Main brand color
          dark: '#2d2d2d',    // Dark elements
          darker: '#1a1a1a',  // Darkest elements
          light: '#f3f4f6',
          lighter: '#f9fafb',
          white: '#ffffff',
        }
      },
    },
  },
  plugins: [],
}



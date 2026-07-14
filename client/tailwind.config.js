/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        brand: {
          DEFAULT: '#00236F',
          light: '#1E3A8A',
          dark: '#001340',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        surface: {
          DEFAULT: '#F8F9FF',
          card: '#FFFFFF',
          sidebar: '#F8F9FF',
        },
        figma: {
          border: '#C5C5D3',
          active: '#1E3A8A',
          inactive: '#444651',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
        sidebar: '2px 0 8px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}

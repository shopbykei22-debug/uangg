/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pinkfanta: {
          DEFAULT: '#F7559D',
          50: '#FFF5F9',
          100: '#FFE8F1',
          200: '#FFD6E8',
          300: '#FFB3D4',
          400: '#FF8ABF',
          500: '#F7559D',
          600: '#E03A85',
          700: '#B82E6A',
          800: '#922253',
          900: '#6B1840',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'offset': '3px 3px 0px 0px #171717',
        'offset-sm': '2px 2px 0px 0px #171717',
        'offset-lg': '5px 5px 0px 0px #171717',
        'pink': '3px 3px 0px 0px #F7559D',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pop': 'pop 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Plus Jakarta Sans', 'Georgia', 'serif'],
        cinzel: ['Playfair Display', 'Plus Jakarta Sans', 'Georgia', 'serif'],
      },
      colors: {
        cosmic: {
          950: '#070514',
          900: '#0d0926',
          800: '#17123d',
          700: '#231c54',
          accent: '#9333ea',
          gold: '#f59e0b',
          cyan: '#06b6d4',
          rose: '#f43f5e'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 15s linear infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

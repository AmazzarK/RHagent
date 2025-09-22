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
          50: '#f8fafc',
          100: '#f1f5f9',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
      animation: {
        blob1: 'blob1 32s ease-in-out infinite',
        blob2: 'blob2 40s ease-in-out infinite',
        blob3: 'blob3 36s ease-in-out infinite',
      },
      keyframes: {
        blob1: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(20vw, 10vw) scale(1.1)' },
          '66%': { transform: 'translate(10vw, 20vw) scale(0.95)' },
        },
        blob2: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '25%': { transform: 'translate(-10vw, 10vw) scale(1.05)' },
          '50%': { transform: 'translate(-5vw, -10vw) scale(1.1)' },
          '75%': { transform: 'translate(10vw, -5vw) scale(0.9)' },
        },
        blob3: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '20%': { transform: 'translate(-10vw, 10vw) scale(1.08)' },
          '60%': { transform: 'translate(10vw, -10vw) scale(0.92)' },
        },
      },
    },
  },
  plugins: [],
}

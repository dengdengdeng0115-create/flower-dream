/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'deep-purple': '#2d1b4e',
        'pink-purple': '#b76eb8',
        'warm-pink': '#e8a0bf',
        'pale-gold': '#f0d878',
        'night-blue': '#1a1a3e',
        'firefly': '#a8e6cf',
        'petal': '#fff5f5',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', boxShadow: '0 0 20px rgba(167, 230, 207, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(167, 230, 207, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

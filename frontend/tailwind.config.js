// tailwind.config.js
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
      backgroundImage: {
        shimmer:
          'linear-gradient(90deg, #e0e0e0 0%, #f8f8f8 50%, #e0e0e0 100%)',
      },
      backgroundSize: {
        shimmer: '200% 100%',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

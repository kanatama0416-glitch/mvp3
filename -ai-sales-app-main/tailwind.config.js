/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'vivid-red': '#FF4D4D',
        'sky-blue': '#4DBFFF',
        'success-green': '#10B981',
        'sunshine-yellow': '#FFD93D',
        'light-gray': '#F5F5F5',
        'charcoal-gray': '#333333',
        'emerald-green': '#059669',
        'forest-green': '#047857',
        'orange-500': '#F97316',
      }
    },
  },
  plugins: [],
};

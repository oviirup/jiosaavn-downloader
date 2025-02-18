const pluggables = require('tailwindcss-pluggables').default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    container: { center: true, padding: '24px' },
    extend: {},
  },
  future: { disableColorOpacityUtilitiesByDefault: true },
  plugins: pluggables(),
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        // Tamaños grandes para lectura fácil en móvil (uso en la calle)
        'xl2': '1.6rem',
      },
    },
  },
  plugins: [],
};

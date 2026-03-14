/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        oro: '#ffd21f',
        dark: '#0a0a0a',
        turquoise: '#2F6F7C',
      },
    },
  },
  plugins: [],
}

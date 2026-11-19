/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          navy: '#0f2942',
          maroon: '#6b1110',
          gold: '#d99b26',
          cream: '#fdfbf7',
          lightBlue: '#eef4fb',
          accent: '#1e40af'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif']
      }
    },
  },
  plugins: [],
}

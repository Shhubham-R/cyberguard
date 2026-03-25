/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0f1e',
          card: '#111827',
          accent: '#00d4ff',
          danger: '#ff3b3b',
          safe: '#22c55e',
          warning: '#f59e0b',
          orange: '#f97316'
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

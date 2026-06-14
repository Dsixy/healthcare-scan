/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          500: '#0891B2',
          600: '#0e7490',
          700: '#155e75',
          800: '#134E4A',
        },
        medical: {
          50: '#F0FDFA',
          100: '#ccfbf1',
          200: '#99f6e4',
          500: '#0891B2',
          700: '#134E4A',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'PingFang SC', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
        heading: ['Figtree', '"Noto Sans"', 'PingFang SC', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

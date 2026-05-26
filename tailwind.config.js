/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F1EA',
        ink: '#1A1612',
        gold: '#B57C36',
        'gold-dark': '#9C7138',
        'gray-text': '#3A332B',
        'gray-dark': '#5A5249',
        'gray-mid': '#75614A',
        'gray-light': '#7E6B53',
        'beige-dark': '#C9BFAE',
        'beige-mid': '#D9D2C5',
        'beige-light': '#E5DFD2',
        shadow: '#5C5246',
        dark: '#2E2A24',
      },
      fontFamily: {
        'serif-kr': ['"Noto Serif KR"', '"Gowun Batang"', 'serif'],
        'display-kr': ['"Gowun Batang"', '"Noto Serif KR"', 'serif'],
        body: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        code: ['"Cormorant Garamond"', 'serif'],
      },
      letterSpacing: {
        wider2: '0.3em',
      },
    },
  },
  plugins: [],
};

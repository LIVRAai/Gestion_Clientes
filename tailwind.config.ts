import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slatebg: '#F6FAFF',
        navy: '#0A1E3F',
        accent: '#2F80ED'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(10,30,63,0.08)'
      }
    }
  },
  plugins: []
};

export default config;

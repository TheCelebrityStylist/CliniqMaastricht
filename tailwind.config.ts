import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        ink:     '#080808',
        magenta: '#E8197B',
        gold:    '#C9A96E',
        ivory:   '#F0EBE3',
        smoke:   '#1A1A1A',
      },
      letterSpacing: {
        'ultra': '0.45em',
        'wide':  '0.22em',
        'tight-neg': '-0.03em',
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':      { transform: 'translate(-2%, -3%)' },
          '20%':      { transform: 'translate(3%, 2%)' },
          '30%':      { transform: 'translate(-1%, 4%)' },
          '40%':      { transform: 'translate(2%, -2%)' },
          '50%':      { transform: 'translate(-3%, 1%)' },
          '60%':      { transform: 'translate(1%, -4%)' },
          '70%':      { transform: 'translate(-2%, 3%)' },
          '80%':      { transform: 'translate(3%, -1%)' },
          '90%':      { transform: 'translate(-1%, 2%)' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.9)' },
          '50%':      { opacity: '1',    transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        ticker:      'ticker 40s linear infinite',
        'fade-up':   'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        grain:       'grain 0.4s steps(1) infinite',
        'dot-pulse': 'dot-pulse 2.4s ease-in-out infinite',
        float:       'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

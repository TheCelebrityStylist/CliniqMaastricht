import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: {
      sans: ['var(--font-inter-tight)', 'ui-sans-serif', 'system-ui'],
      display: ['var(--font-display)', 'ui-sans-serif', 'system-ui'],
      serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
    },
    // Exact brand tokens (Cliniq brand book V1). Ink/plum carry the weight; coral is the primary
    // action colour; magenta is accent + glow only, never a large flat fill - see globals.css.
    colors: { ink: '#31071B', plum: '#500B38', coral: '#DB334C', magenta: '#DC48FE' },
    boxShadow: { glow: '0 0 60px rgba(220,72,254,.22)' },
    keyframes: { float: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-8px)' } } },
    animation: { float: 'float 5s ease-in-out infinite' }
  } },
  plugins: [],
}
export default config

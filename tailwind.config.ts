import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { sans: ['var(--font-inter-tight)', 'ui-sans-serif', 'system-ui'] },
    colors: { ink: '#080607', burgundy: '#36101F', magenta: '#F02688', gold: '#D5B56D', ivory: '#FFF7EA', smoke: '#171114' },
    boxShadow: { glow: '0 0 60px rgba(240,38,136,.22)' },
    keyframes: { float: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-8px)' } } },
    animation: { float: 'float 5s ease-in-out infinite' }
  } },
  plugins: [],
}
export default config

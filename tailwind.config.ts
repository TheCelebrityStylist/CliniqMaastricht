import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: {
      sans: ['var(--font-inter-tight)', 'ui-sans-serif', 'system-ui'],
      display: ['var(--font-display)', 'ui-sans-serif', 'system-ui'],
      serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
    },
    // Exact brand tokens (component-kit spec, cliniq-component-kit.html #01). Ink/plum carry the
    // weight; coral is THE action colour (every primary CTA, nothing else); magenta is accent/
    // glow only, <=5% of any surface, never a large flat fill - see globals.css.
    // coral-text is NOT a separate brand colour - it's coral lightened ~15% toward white, used
    // only for small coral TEXT on the dark ink/plum background (eyebrows, inline links). Brand
    // coral itself measures 3.90-4.40:1 there depending on which dark surface, below the 4.5:1 AA
    // minimum for normal text (audit.mjs caught this on the previous, lighter ink value); this
    // tint measures 4.74-5.34:1 against both. Never use it for fills/buttons/borders - `coral` is
    // exact-brand there and already passes contrast against white.
    colors: { ink: '#12030A', plum: '#31071B', plum2: '#440A28', coral: '#DB334C', 'coral-text': '#E05267', magenta: '#DC48FE' },
    boxShadow: { glow: '0 0 60px rgba(220,72,254,.22)' },
    keyframes: { float: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-8px)' } } },
    animation: { float: 'float 5s ease-in-out infinite' }
  } },
  plugins: [],
}
export default config

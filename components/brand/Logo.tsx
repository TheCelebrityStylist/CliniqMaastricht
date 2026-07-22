// Placeholder brand mark. The brief's decision #2 supplies three production SVGs
// (cliniq-logo-solid.svg / -outline.svg / -white.svg, extracted from the brand PDF, reversed N
// preserved) to drop in /public/brand/ - they did not arrive in this environment (checked the
// filesystem and session scratchpad, nothing landed). Flagged in the report as a blocker, not
// silently faked. Once the real files exist, replace the <span> below with the matching
// <img src={`/brand/cliniq-logo-${variant}.svg`} alt="Cliniq Maastricht" /> for each variant -
// every call site already goes through this one component, so that's a one-line swap.
//
// Until then: a pill-contained wordmark, MuseoModerno, normal tracking - NOT the rejected
// letterspaced "C L I N I Q" treatment (decision #2: "retire the letterspaced wordmark entirely -
// it is not the brand"). This is deliberately plain so it doesn't read as a fake logo.
const VARIANT_CLASSES = {
  solid: 'border-ink/15 bg-ink text-white',
  outline: 'border-plum/50 bg-transparent text-plum',
  white: 'border-white/40 bg-transparent text-white',
} as const

export default function Logo({ variant = 'white', className = '' }: { variant?: keyof typeof VARIANT_CLASSES; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-1.5 font-display text-base font-bold leading-none ${VARIANT_CLASSES[variant]} ${className}`}
    >
      Cliniq
    </span>
  )
}

import type { ReactNode } from 'react'

// Component-kit spec #05 `.quote`: the single sharpest EXISTING sentence of a content block, as a
// deep-gradient accent panel beside the headline column. Verbatim text only - never hand-authored
// marketing copy. White-on-deep-gradient at a moderate size keeps it a readable accent, not the
// loudest element in its section - a bright coral/magenta panel with near-black text was shouting.
export default function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p
      className="rounded-[18px] p-[clamp(14px,2vw,22px)] font-display text-[clamp(17px,2vw,24px)] font-extrabold leading-[1.14] tracking-[-0.02em] text-white"
      style={{ background: 'linear-gradient(120deg, rgba(80,11,56,.94), rgba(219,51,76,.88))' }}
    >
      {children}
    </p>
  )
}

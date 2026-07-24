import type { ReactNode } from 'react'

// Component-kit spec #05 `.quote`: the single sharpest EXISTING sentence of a content block,
// blown up on a coral-to-magenta panel. Verbatim text only - never hand-authored marketing copy.
export default function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[18px] bg-[linear-gradient(120deg,#DB334C,#DC48FE)] p-[clamp(18px,3vw,30px)] font-display text-[clamp(20px,3.2vw,36px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
      {children}
    </p>
  )
}

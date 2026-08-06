import type { ReactNode } from 'react'

// Component-kit spec #05 `.stats`/`.stat`: numbers already present in the copy (400 gasten,
// openingsdagen, faciliteiten) pulled into a row of designed tiles. Values are meant to be short
// (~9 chars or less, e.g. "400", "€15", "Do·Vr·Za") - anything longer is a fact and belongs in the
// label or prose, never the value. `min-w-0` on both the grid cell and the value div (grid items
// default to min-width:auto, which ignores `break-words` and lets long content overflow into the
// next cell) plus `break-words` and a tighter clamp/leading are defense in depth so a too-long
// value degrades to wrapped text instead of ever overlapping a neighbouring tile. Weight-800 text
// at this size (>=18.66px bold) still qualifies as WCAG "large text" (3:1 threshold), matching the
// kit's use of plain --coral here, unlike the smaller .eyebrow text which needs the coral-text tint.
export default function StatStrip({ stats }: { stats: { value: ReactNode; label: string }[] }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="min-w-0 rounded-[18px] border border-white/10 bg-white/[0.03] p-[18px]">
          <div className="min-w-0 break-words font-display text-[clamp(20px,2.2vw,30px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-coral">{stat.value}</div>
          <div className="mt-2 text-[13px] leading-[1.4] text-white/72">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

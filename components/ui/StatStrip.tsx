import type { ReactNode } from 'react'

// Component-kit spec #05 `.stats`/`.stat`: numbers already present in the copy (400 gasten,
// openingsdagen, faciliteiten) pulled into a row of designed tiles. Number text sits at >=24px/800
// weight, which is WCAG "large text" (3:1 threshold) - matches the kit's use of plain --coral here,
// unlike the smaller .eyebrow text which needs the lightened coral-text tint for 4.5:1.
export default function StatStrip({ stats }: { stats: { value: ReactNode; label: string }[] }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-[18px]">
          <div className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-none tracking-[-0.03em] text-coral">{stat.value}</div>
          <div className="mt-2 text-[13px] leading-[1.4] text-white/72">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

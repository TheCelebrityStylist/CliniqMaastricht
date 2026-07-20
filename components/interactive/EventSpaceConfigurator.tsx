'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'

const LAYOUTS = ['borrel', 'diner', 'presentatie', 'feest'] as const
type Layout = (typeof LAYOUTS)[number]

const LABELS: Record<Layout, { nl: string; en: string }> = {
  borrel: { nl: 'Borrel', en: 'Drinks reception' },
  diner: { nl: 'Diner', en: 'Dinner' },
  presentatie: { nl: 'Presentatie', en: 'Presentation' },
  feest: { nl: 'Feest', en: 'Party' },
}

const DOT_COUNT = 28

function positionsFor(layout: Layout): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []

  if (layout === 'borrel') {
    const clusters: [number, number][] = [
      [18, 32],
      [45, 62],
      [72, 28],
      [30, 78],
      [82, 68],
    ]
    clusters.forEach(([cx, cy], clusterIndex) => {
      const remaining = DOT_COUNT - points.length
      const clusterSize = clusterIndex === clusters.length - 1 ? remaining : Math.round(DOT_COUNT / clusters.length)
      for (let i = 0; i < clusterSize; i++) {
        const angle = (i / clusterSize) * Math.PI * 2
        points.push({ x: cx + Math.cos(angle) * 7, y: cy + Math.sin(angle) * 9 })
      }
    })
  } else if (layout === 'diner') {
    const cols = 7
    for (let i = 0; i < DOT_COUNT; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      points.push({ x: 12 + col * 12.5, y: 24 + row * 18 })
    }
  } else if (layout === 'presentatie') {
    const cols = 7
    for (let i = 0; i < DOT_COUNT; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      points.push({ x: 14 + col * 11.5, y: 78 - row * 13 })
    }
  } else {
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = (i / DOT_COUNT) * Math.PI * 2
      const radius = 22 + (i % 3) * 9
      points.push({ x: 50 + Math.cos(angle) * radius, y: 58 + Math.sin(angle) * radius * 0.7 })
    }
  }

  return points.slice(0, DOT_COUNT)
}

export default function EventSpaceConfigurator({ ctaHref }: { ctaHref: string }) {
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang].configurator
  const reduceMotion = useReducedMotion()
  const [layout, setLayout] = useState<Layout>('borrel')
  const points = positionsFor(layout)

  return (
    <section className="container-premium pb-24">
      <p className="eyebrow">{t.eyebrow}</p>
      <h2 className="h2 mt-4">{t.title}</h2>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={t.title}>
        {LAYOUTS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={layout === key}
            onClick={() => setLayout(key)}
            className={`focus-ring rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
              layout === key ? 'border-white bg-white text-ink' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
            }`}
          >
            {LABELS[key][lang]}
          </button>
        ))}
      </div>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]" role="tabpanel" aria-label={LABELS[layout][lang]}>
        <div className="absolute inset-x-6 top-4 rounded-full bg-white/10 px-3 py-1 text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
          Bar
        </div>
        {points.map((point, index) => (
          <motion.span
            key={index}
            layout={!reduceMotion}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-magenta/80"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-black uppercase tracking-[0.1em] text-white/50">{t.upTo}</p>
        <a href={ctaHref} className="btn-primary">
          {lang === 'nl' ? 'Vrijblijvende aanvraag' : 'Request proposal'}
        </a>
      </div>
    </section>
  )
}

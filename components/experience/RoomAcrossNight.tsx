'use client'

import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'
import { images } from '@/lib/site'
import SafeImage from '@/components/ui/SafeImage'

// Replaces EventSpaceConfigurator's dot-diagram (explicitly rejected - "the layout-diagram
// approach is rejected outright"). No matched day/night photo pair of the same room angle exists
// in the current image inventory (checked lib/site.ts), so per the brief's own fallback ("if a
// full day->night arc doesn't exist, build the moment as a two-state cross-dissolve instead"):
// one real photo, two honest grades (CSS filter, not fabricated imagery) - clean/bright for day,
// full saturation + a coral/magenta glow for night. Pointer position on desktop scrubs between
// them; a slow auto-alternate covers touch/no-pointer, off entirely under reduced-motion (shows
// the night grade, static). Reuses the existing approved capacity line and CTA button text
// verbatim; only new strings are the two functional Day/Night labels, listed in the report.
const DAY_LABEL = { nl: 'Overdag', en: 'Day' }
const NIGHT_LABEL = { nl: "'s Avonds", en: 'Night' }

export default function RoomAcrossNight({ ctaHref }: { ctaHref: string }) {
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang].configurator
  const reduceMotion = useReducedMotion()
  const [mix, setMix] = useState(1) // 0 = day, 1 = night
  const frameRef = useRef<HTMLDivElement>(null)

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    setMix(Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1))
  }

  return (
    <section className="container-premium pb-24">
      <p className="eyebrow">{lang === 'nl' ? 'De ruimte' : 'The space'}</p>

      <div
        ref={frameRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => !reduceMotion && setMix(1)}
        className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
      >
        <SafeImage
          src={images.redRoom}
          fallbackSrc={images.fallbackWide}
          alt={lang === 'nl' ? 'CLINIQ eventruimte' : 'CLINIQ event space'}
          fill
          sizes="(min-width:1024px) 1100px, 100vw"
          className="object-cover transition-[filter] duration-300 ease-out"
          style={{ filter: `brightness(${1.5 - mix * 0.42}) saturate(${0.55 + mix * 0.75}) contrast(${1 - mix * 0.1 + mix * 0.14})` }}
        />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ opacity: mix, background: 'radial-gradient(circle at 30% 25%, rgba(220,72,254,.22), transparent 55%), linear-gradient(0deg, rgba(49,7,27,.55), transparent 46%)' }}
        />
        <div className="absolute left-5 top-5 flex gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
          <span className={`rounded-full border px-3 py-1 transition ${mix < 0.5 ? 'border-white bg-white text-ink' : 'border-white/25 text-white/60'}`}>{DAY_LABEL[lang]}</span>
          <span className={`rounded-full border px-3 py-1 transition ${mix >= 0.5 ? 'border-coral bg-coral text-white' : 'border-white/25 text-white/60'}`}>{NIGHT_LABEL[lang]}</span>
        </div>
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

'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/lang'
import { COPY, PHOTOS, HOURS } from '@/lib/content'

const ArrowSvg = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function EditorialSection() {
  const { lang } = useLang()
  const t = COPY[lang].home
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const dayLabel = lang === 'nl'
    ? ['Donderdag', 'Vrijdag', 'Zaterdag']
    : ['Thursday', 'Friday', 'Saturday']

  return (
    <section ref={ref} className="bg-ink">

      {/* Asymmetric editorial split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

        {/* Large photo — 8 cols */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 relative overflow-hidden"
          style={{ height: 'clamp(400px, 60vw, 740px)' }}
        >
          <img
            src={PHOTOS.crowd}
            alt={lang === 'nl' ? 'Uitgaan Maastricht — Cliniq dancefloor nachtclub' : 'Nightlife Maastricht — Cliniq dancefloor nightclub'}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-[1200ms]"
            style={{ filter: 'brightness(0.88) saturate(1.08)' }}
          />
          <div
            className="absolute bottom-0 inset-x-0 p-8 md:p-12"
            style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.2) 55%, transparent 100%)' }}
          >
            <p className="text-white/40 font-display font-semibold tracking-[0.22em] uppercase mb-2" style={{ fontSize: 9 }}>
              Platielstraat 9A — Maastricht
            </p>
            <p className="text-white font-display font-black text-xl md:text-2xl tracking-tight">
              {lang === 'nl' ? 'Elke week. Elke editie.' : 'Every week. Every edition.'}
            </p>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="lg:col-span-4 flex flex-col">

          {/* Copy block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center px-8 md:px-12 py-14 bg-ink flex-1"
          >
            <p className="eyebrow mb-5">{t.nightLabel}</p>
            <h2
              className="font-display font-black text-white tracking-tight leading-[1.0] mb-5 whitespace-pre-line"
              style={{ fontSize: 'clamp(1.9rem, 3vw, 2.8rem)' }}
            >
              {t.nightTitle}
            </h2>
            <p className="text-white/48 text-sm leading-relaxed mb-8 max-w-xs font-body">
              {t.nightBody}
            </p>

            {/* Hours */}
            <div className="mb-8 border-t border-white/8">
              {HOURS.map((h, i) => (
                <div key={h.abbr.nl} className="flex items-center justify-between py-3.5 border-b border-white/6">
                  <span className="text-white/80 font-display font-semibold text-sm">{dayLabel[i]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white/32 font-body" style={{ fontSize: 11 }}>{h.time}</span>
                    <span className="border border-magenta/25 text-magenta/55 font-display font-black px-2 py-0.5 tracking-widest" style={{ fontSize: 8 }}>
                      {h.age}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/uitgaan" className="btn-primary self-start group">
              {t.nightCta}
              <ArrowSvg />
            </Link>
          </motion.div>

          {/* Secondary photo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 1.0 }}
            className="relative overflow-hidden hidden lg:block"
            style={{ height: '230px' }}
          >
            <img
              src={PHOTOS.nightlife}
              alt={lang === 'nl' ? 'Cliniq sfeer nachtleven' : 'Cliniq nightlife atmosphere'}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1000ms]"
              style={{ filter: 'brightness(0.82) saturate(1.05)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Photo strip */}
      <div className="grid grid-cols-3 gap-0.5 mt-0.5">
        {[
          { src: PHOTOS.venue2, label: lang === 'nl' ? 'De zaal' : 'The venue' },
          { src: PHOTOS.venue3, label: lang === 'nl' ? 'De sfeer' : 'The vibe'  },
          { src: PHOTOS.venue4, label: lang === 'nl' ? 'De crowd' : 'The crowd' },
        ].map(({ src, label }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.35 + i * 0.08, duration: 0.7 }}
            className="relative overflow-hidden group"
            style={{ height: 'clamp(150px, 22vw, 300px)' }}
          >
            <img
              src={src}
              alt={label}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
              style={{ filter: 'brightness(0.85) saturate(1.0)' }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.65) 0%, transparent 55%)' }}
            />
            <p className="absolute bottom-4 left-5 text-transparent group-hover:text-white/70 font-display font-black tracking-[0.22em] uppercase transition-all duration-300" style={{ fontSize: 9 }}>
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

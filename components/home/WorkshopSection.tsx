'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/lang'
import { COPY, PHOTOS } from '@/lib/content'

const ArrowSvg = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const WORKSHOP_PHOTOS = [PHOTOS.workshop1, PHOTOS.workshop2, PHOTOS.workshop3]

export default function WorkshopSection() {
  const { lang } = useLang()
  const t = COPY[lang].home
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="bg-[#f8f6f3] py-28 md:py-36 px-8 md:px-16">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="font-display font-black text-magenta tracking-[0.5em] uppercase mb-3"
              style={{ fontSize: 9 }}
            >
              {t.workshopLabel}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-ink tracking-tight leading-tight whitespace-pre-line"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              {t.workshopTitle}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-ink/50 text-sm max-w-xs leading-relaxed font-body"
          >
            {t.workshopBody}
          </motion.p>
        </div>

        {/* Photo grid + info card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Main large photo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative overflow-hidden group"
            style={{ height: 'clamp(320px, 44vw, 580px)' }}
          >
            <img
              src={WORKSHOP_PHOTOS[0]}
              alt={lang === 'nl' ? 'Cocktail workshop Maastricht — Cliniq bar' : 'Cocktail workshop Maastricht — Cliniq bar'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-[1000ms]"
              style={{ filter: 'brightness(0.94) saturate(1.05)' }}
            />
          </motion.div>

          {/* Right: two photos + info card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {WORKSHOP_PHOTOS.slice(1).map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.7 }}
                  className="overflow-hidden group"
                  style={{ height: 'clamp(140px, 17vw, 220px)' }}
                >
                  <img
                    src={src}
                    alt={`Cocktail workshop foto ${i + 2}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    style={{ filter: 'brightness(0.90)' }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border border-ink/10 bg-white p-8 flex flex-col gap-5 flex-1 shadow-sm"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display font-black text-ink tracking-tight" style={{ fontSize: '2.4rem' }}>€15</span>
                <span className="font-display font-black text-ink/35 tracking-[0.18em] uppercase" style={{ fontSize: 9 }}>
                  {lang === 'nl' ? 'per cocktail' : 'per cocktail'}
                </span>
              </div>
              <div className="space-y-2">
                {t.workshopFacts.map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-ink/55 text-sm font-body">
                    <span className="w-1 h-1 rounded-full bg-magenta flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href="/cocktail-workshop"
                className="self-start inline-flex items-center gap-2.5 bg-magenta text-white font-display font-black tracking-[0.18em] uppercase px-7 py-3.5 hover:bg-ink hover:text-white transition-all duration-300 text-[10px] mt-auto group"
              >
                {t.workshopCta}
                <ArrowSvg />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

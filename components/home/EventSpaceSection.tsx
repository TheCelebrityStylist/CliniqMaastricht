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

export default function EventSpaceSection() {
  const { lang } = useLang()
  const t = COPY[lang].home
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="bg-ivory overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'clamp(560px, 68vw, 880px)' }}>

        {/* LEFT: Content */}
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-24 bg-ivory order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="font-display font-black text-magenta tracking-ultra uppercase mb-5"
            style={{ fontSize: 9, letterSpacing: '0.5em' }}
          >
            {t.spaceLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-ink tracking-tight leading-[0.9] mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 5rem)' }}
          >
            {t.spaceTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-ink/55 text-base leading-relaxed mb-8 max-w-sm font-body"
          >
            {t.spaceBody}
          </motion.p>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-10"
          >
            {t.spaceFeatures.map(f => (
              <div key={f} className="flex items-center gap-2.5 text-ink/55 text-sm font-body">
                <span className="w-1 h-1 rounded-full bg-magenta flex-shrink-0" />
                {f}
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-10 mb-10 pb-10 border-b border-ink/8"
          >
            {[
              { n: '400',  l: lang === 'nl' ? 'max. gasten' : 'max. guests' },
              { n: '100%', l: lang === 'nl' ? 'exclusief'  : 'exclusive' },
              { n: '<24h', l: lang === 'nl' ? 'reactietijd' : 'response' },
            ].map(({ n, l }) => (
              <div key={n}>
                <p className="font-display font-black text-ink tracking-tight" style={{ fontSize: '2rem' }}>{n}</p>
                <p className="font-display font-black text-ink/35 tracking-[0.18em] uppercase mt-0.5" style={{ fontSize: 9 }}>{l}</p>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/event-space"
              className="inline-flex items-center justify-center gap-2.5 bg-magenta text-white font-display font-black tracking-[0.18em] uppercase px-8 py-4 hover:bg-ink hover:text-white transition-all duration-300 text-[10px] group"
            >
              {t.spaceCta1}
              <ArrowSvg />
            </Link>
            <Link
              href="/event-space"
              className="inline-flex items-center justify-center gap-2.5 border border-ink/15 text-ink/50 font-display font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:border-magenta hover:text-magenta transition-all duration-300 text-[10px]"
            >
              {t.spaceCta2}
            </Link>
          </motion.div>
        </div>

        {/* RIGHT: Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden order-1 lg:order-2 group"
          style={{ minHeight: 'clamp(340px, 48vw, 880px)' }}
        >
          <img
            src={PHOTOS.venue1}
            alt={lang === 'nl' ? 'Feestzaal huren Maastricht — Cliniq evenementenlocatie tot 400 personen' : 'Event venue hire Maastricht — Cliniq up to 400 guests'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[1200ms]"
            style={{ filter: 'brightness(0.93)' }}
          />
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-8 left-8 bg-white px-6 py-4 shadow-xl"
          >
            <p className="font-display font-black text-ink tracking-tight leading-none" style={{ fontSize: '2.6rem' }}>400</p>
            <p className="font-display font-black text-ink/40 tracking-[0.2em] uppercase mt-1" style={{ fontSize: 9 }}>
              {lang === 'nl' ? 'max. gasten' : 'max. guests'}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

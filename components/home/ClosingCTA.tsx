'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/lang'
import { COPY, PHOTOS, HOURS } from '@/lib/content'

export default function ClosingCTA() {
  const { lang } = useLang()
  const t = COPY[lang].home
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const dayLabels = lang === 'nl'
    ? ['Donderdag', 'Vrijdag', 'Zaterdag']
    : ['Thursday', 'Friday', 'Saturday']

  return (
    <section ref={ref} className="relative overflow-hidden grain">
      <img
        src={PHOTOS.nightlife}
        alt={lang === 'nl' ? 'Cliniq Maastricht nachtclub' : 'Cliniq Maastricht nightclub'}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.38) saturate(0.85)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.68) 50%, rgba(8,8,8,0.4) 100%)' }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-16 py-28 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: address + hours */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="eyebrow mb-5"
            >
              {t.closingLabel}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-white tracking-tight leading-tight mb-10"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)' }}
            >
              Platielstraat 9A,{'\n'}Maastricht.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-8"
            >
              {HOURS.map((h, i) => (
                <div key={h.abbr.nl}>
                  <p className="text-white/75 font-display font-semibold text-sm">{dayLabels[i]}</p>
                  <p className="text-white/32 font-body mt-0.5 tracking-wide" style={{ fontSize: 11 }}>
                    {h.time} · {h.age}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 lg:items-end"
          >
            <Link href="/contact" className="btn-primary w-full lg:w-auto group">
              {t.closingCta1}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <Link href="/event-space" className="btn-secondary w-full lg:w-auto">
              {t.closingCta2}
            </Link>
            <Link
              href="/cocktail-workshop"
              className="inline-flex items-center justify-center border border-white/10 text-white/38 font-display font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:border-white/25 hover:text-white/60 transition-all duration-300 text-[11px] w-full lg:w-auto"
            >
              {t.closingCta3}
            </Link>
            <div className="flex items-center gap-6 mt-2 w-full lg:justify-end">
              <a href="mailto:contact@cafecliniq.com"
                className="text-white/20 hover:text-white/55 font-body tracking-wide transition-colors duration-200"
                style={{ fontSize: 11 }}>
                contact@cafecliniq.com
              </a>
              <a href="https://wa.me/31612530987" target="_blank" rel="noopener noreferrer"
                className="text-white/20 hover:text-white/55 font-body tracking-wide transition-colors duration-200"
                style={{ fontSize: 11 }}>
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/lib/lang'
import { COPY, PHOTOS } from '@/lib/content'

const ArrowSvg = ({ className = '' }: { className?: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TRUST_NL = ['Club Maastricht', 'Cocktail Workshops', 'Feestzaal tot 400p', 'Do · Vr · Za open']
const TRUST_EN = ['Club Maastricht', 'Cocktail Workshops', 'Venue up to 400', 'Thu · Fri · Sat']

export default function HeroSection() {
  const { lang } = useLang()
  const t = COPY[lang].home
  const [loaded, setLoaded] = useState(false)
  const trust = lang === 'nl' ? TRUST_NL : TRUST_EN

  useEffect(() => {
    const img = new Image()
    img.src = PHOTOS.hero
    img.onload = () => setLoaded(true)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden grain"
      style={{ height: '100svh', minHeight: 680 }}
      aria-label="Hero"
    >
      {/* Full-bleed photo */}
      <div className="absolute inset-0">
        <img
          src={PHOTOS.hero}
          alt="Cliniq Maastricht — premium nachtclub uitgaan Maastricht"
          fetchPriority="high"
          className="w-full h-full object-cover object-center transition-opacity duration-[1600ms]"
          style={{
            filter: 'brightness(0.72) saturate(1.08)',
            opacity: loaded ? 1 : 0,
          }}
        />
        {/* Gradient stack */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.55) 32%, rgba(8,8,8,0.06) 65%, transparent 85%)',
        }} />
        <div className="absolute top-0 inset-x-0 h-32" style={{
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.6) 0%, transparent 100%)',
        }} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 lg:px-20 pb-16 md:pb-24">

        {/* Location pill */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 mb-7 md:mb-9"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-magenta animate-dot-pulse flex-shrink-0" />
          <span className="text-white/55 font-display font-semibold tracking-[0.22em] uppercase" style={{ fontSize: 10 }}>
            {t.heroEyebrow}
          </span>
        </motion.div>

        {/* Headline — two-line reveal */}
        <div className="overflow-hidden mb-1.5">
          <motion.h1
            initial={{ y: '108%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.12, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(3.4rem, 9vw, 9.5rem)' }}
          >
            {t.heroLine1}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-11 md:mb-14">
          <motion.span
            initial={{ y: '108%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.26, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="block font-display font-black leading-[0.88] tracking-tight text-magenta"
            style={{ fontSize: 'clamp(3.4rem, 9vw, 9.5rem)' }}
          >
            {t.heroLine2}
          </motion.span>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        >
          <Link href="/uitgaan" className="btn-primary group">
            {t.heroCta1}
            <ArrowSvg className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link href="/event-space" className="btn-secondary">
            {t.heroCta2}
          </Link>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="hidden md:flex items-center gap-8 mt-12 pt-8 border-t border-white/10"
        >
          {trust.map(item => (
            <span key={item} className="text-white/30 font-display font-black tracking-[0.2em] uppercase" style={{ fontSize: 9 }}>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 right-10 md:right-16 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/20 tracking-[0.3em] uppercase font-display font-black" style={{ fontSize: 7, writingMode: 'vertical-rl' }}>scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent animate-float" />
      </motion.div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/lang'
import { PHOTOS } from '@/lib/content'


const ArrowRightIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const CARDS_NL = [
  {
    label: 'Vrijgezellenavond',
    title: 'Avond van je leven.',
    body: 'Workshop + club. Exclusief voor jouw groep.',
    href: '/vrijgezellenavond',
    accent: '#E8197B',
  },
  {
    label: 'Bedrijfsfeest',
    title: 'Team. Bar. Dansvloer.',
    body: 'Personeelsfeest of borrel tot 400 personen.',
    href: '/bedrijfsfeest',
    accent: '#C9A96E',
  },
  {
    label: 'Privéfeest',
    title: 'Jouw avond. Onze club.',
    body: 'Verjaardag of jubileum — volledig exclusief.',
    href: '/privefeest',
    accent: '#ffffff',
  },
]

const CARDS_EN = [
  {
    label: 'Hen Night',
    title: 'Night of your life.',
    body: 'Workshop + club. Exclusively yours.',
    href: '/vrijgezellenavond',
    accent: '#E8197B',
  },
  {
    label: 'Corporate Event',
    title: 'Team. Bar. Dancefloor.',
    body: 'Staff party or drinks for up to 400.',
    href: '/bedrijfsfeest',
    accent: '#C9A96E',
  },
  {
    label: 'Private Party',
    title: 'Your night. Our club.',
    body: 'Birthday or anniversary — fully exclusive.',
    href: '/privefeest',
    accent: '#ffffff',
  },
]

export default function ClosingCTA() {
  const { lang } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const cards = lang === 'nl' ? CARDS_NL : CARDS_EN

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink">
      <img
        src={PHOTOS.crowd}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'brightness(0.18) saturate(0.6)', mixBlendMode: 'luminosity' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(8,8,8,1) 0%, rgba(8,8,8,0.85) 50%, rgba(8,8,8,0.7) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-8 py-28 md:px-16 md:py-40">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="eyebrow mb-6"
            >
              {lang === 'nl' ? 'Plan je avond' : 'Plan your night'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 font-black leading-[0.9] tracking-tight text-white"
              style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)' }}
            >
              {lang === 'nl'
                ? <>Cliniq is ook<br /><span className="text-magenta">voor jou.</span></>
                : <>Cliniq is yours<br /><span className="text-magenta">to take.</span></>
              }
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              className="mb-10 max-w-sm text-base leading-relaxed text-white/40"
            >
              {lang === 'nl'
                ? 'Reserveer de ruimte, kies je programma. Wij regelen de rest.'
                : 'Reserve the space, choose your programme. We handle the rest.'
              }
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-2"
            >
              <Link
                href="/event-space"
                className="group inline-flex items-center gap-2.5 self-start bg-magenta px-8 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-ink"
              >
                {lang === 'nl' ? 'Alle opties bekijken' : 'See all options'}
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <div className="mt-4 flex items-center gap-5">
                <a
                  href="mailto:contact@cafecliniq.com"
                  className="text-xs tracking-wide text-white/[0.22] transition-colors duration-200 hover:text-white/[0.55]"
                >
                  contact@cafecliniq.com
                </a>
                <span className="text-white/10">·</span>
                <a
                  href="https://wa.me/31612530987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-wide text-white/[0.22] transition-colors duration-200 hover:text-white/[0.55]"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-3">
            {cards.map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={card.href}
                  className="group flex items-center justify-between gap-6 border border-white/[0.08] px-7 py-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p
                      className="mb-2 font-black uppercase tracking-[0.22em]"
                      style={{ fontSize: 9, color: card.accent }}
                    >
                      {card.label}
                    </p>
                    <p className="mb-1.5 text-lg font-black leading-none tracking-tight text-white">
                      {card.title}
                    </p>
                    <p className="text-sm text-white/35">{card.body}</p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 flex-shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-magenta" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

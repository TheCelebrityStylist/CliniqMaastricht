'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/lang'
import { COPY, HOURS } from '@/lib/content'
import { getNextOpenDays } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/sanity/client'

interface Props {
  events: AgendaEvent[]
  loading?: boolean
}

function parseEventDate(str: string): Date | null {
  if (!str) return null
  const parts = str.split(/[-\/.]/)
  if (parts.length === 3) {
    const d = new Date(+parts[2], +parts[1] - 1, +parts[0])
    if (!isNaN(d.getTime())) return d
  }
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

const ArrowSvg = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function AgendaSection({ events, loading = false }: Props) {
  const { lang } = useLang()
  const t = COPY[lang].home
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const days = getNextOpenDays(4)
  const locale = lang === 'nl' ? 'nl-NL' : 'en-GB'

  return (
    <section className="bg-ink section">
      <div className="container-xl" ref={ref}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="eyebrow mb-4"
            >
              {t.agendaLabel}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-white tracking-tight leading-none"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}
            >
              {t.agendaTitle}
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 }}
          >
            <Link
              href="/uitgaan"
              className="inline-flex items-center gap-2 text-white/30 hover:text-magenta font-display font-black tracking-[0.22em] uppercase transition-colors duration-200 group"
              style={{ fontSize: 10 }}
            >
              {t.agendaLink}
              <ArrowSvg />
            </Link>
          </motion.div>
        </div>

        {/* Agenda rows */}
        <div className="divide-y divide-white/[0.06]">
          {days.map((date, i) => {
            const dow     = date.getDay()
            const isThurs = dow === 4
            const hourRow = HOURS[isThurs ? 0 : dow === 5 ? 1 : 2]
            const dayName = date.toLocaleDateString(locale, { weekday: 'long' })
            const dateStr = date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
            const event   = events.find(e => {
              const d = parseEventDate(e.date)
              return d && d.toDateString() === date.toDateString()
            })

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href="/uitgaan"
                  className="group flex items-center gap-5 md:gap-8 py-6 md:py-7 hover:bg-white/[0.025] -mx-4 px-4 transition-all duration-300 rounded-sm"
                >
                  {/* Day */}
                  <div className="w-28 md:w-36 flex-shrink-0">
                    <p className="text-white font-display font-semibold text-sm capitalize">{dayName}</p>
                    <p className="text-white/28 mt-0.5" style={{ fontSize: 11 }}>{dateStr}</p>
                  </div>

                  <div className="hidden sm:block w-px h-7 bg-white/8 flex-shrink-0" />

                  {/* Artist / TBA */}
                  <div className="flex-1 min-w-0">
                    {loading ? (
                      <div className="h-4 bg-white/[0.06] animate-pulse w-36 rounded-sm" />
                    ) : event ? (
                      <div className="flex items-center gap-3 flex-wrap">
                        {event.special && (
                          <span className="border border-magenta/50 text-magenta font-display font-black px-2 py-0.5 flex-shrink-0 tracking-widest uppercase" style={{ fontSize: 8 }}>
                            ✦ {event.special}
                          </span>
                        )}
                        <span className="text-white font-display font-bold text-base md:text-lg group-hover:text-magenta transition-colors duration-200 truncate">
                          {event.dj}
                        </span>
                        {event.description && (
                          <span className="text-white/22 text-sm hidden md:block truncate">{event.description}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-white/16 font-display font-medium text-base">TBA</span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                    <span className="text-white/22 tracking-wide" style={{ fontSize: 11 }}>{hourRow.time}</span>
                    <span className="border border-magenta/20 text-magenta/45 font-display font-black px-2 py-0.5 tracking-widest" style={{ fontSize: 8 }}>
                      {hourRow.age}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowSvg />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-14 pt-10 border-t border-white/6 flex justify-center"
        >
          <Link href="/uitgaan" className="btn-ghost group">
            {t.agendaLink}
            <ArrowSvg />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

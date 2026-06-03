'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/lang'
import { COPY, PHOTOS } from '@/lib/content'
import { ArrowRight } from 'lucide-react'

const PHOTO_GRID = [
  { src: PHOTOS.crowd,   alt: 'Cliniq dancefloor' },
  { src: PHOTOS.venue2,  alt: 'Cliniq interior'   },
  { src: PHOTOS.nightlife, alt: 'Cliniq crowd'    },
  { src: PHOTOS.venue4,  alt: 'Cliniq event'      },
]

export default function CultureSection() {
  const { lang } = useLang()
  const t = COPY[lang].home
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-ink section">
      <div className="container-xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="eyebrow mb-4"
            >
              {t.cultureLabel}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-white tracking-tight leading-[0.88] whitespace-pre-line"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              {t.cultureTitle}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm max-w-xs leading-relaxed font-body"
          >
            {t.cultureBody}
          </motion.p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1 md:row-span-2 overflow-hidden"
            style={{ height: 'clamp(320px, 42vw, 560px)' }}
          >
            <img src={PHOTO_GRID[0].src} alt={PHOTO_GRID[0].alt} loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              style={{ filter: 'brightness(0.88)' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="col-span-1 md:col-span-2 overflow-hidden"
            style={{ height: 'clamp(160px, 20vw, 270px)' }}
          >
            <img src={PHOTO_GRID[1].src} alt={PHOTO_GRID[1].alt} loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              style={{ filter: 'brightness(0.88)' }} />
          </motion.div>
          {[PHOTO_GRID[2], PHOTO_GRID[3]].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
              className="overflow-hidden"
              style={{ height: 'clamp(150px, 20vw, 270px)' }}
            >
              <img src={p.src} alt={p.alt} loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ filter: 'brightness(0.88)' }} />
            </motion.div>
          ))}
        </div>

        {/* Stats + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex gap-10">
            {[
              { n: '400', l: lang === 'nl' ? 'Max. gasten' : 'Max. guests' },
              { n: '3×',  l: lang === 'nl' ? 'Per week' : 'Per week' },
              { n: '10+', l: lang === 'nl' ? 'Jaar ervaring' : 'Years' },
            ].map(({ n, l }) => (
              <div key={n}>
                <p className="text-white font-display font-black text-2xl tracking-tight">{n}</p>
                <p className="text-white/28 font-display font-black tracking-[0.2em] uppercase mt-1" style={{ fontSize: 8 }}>
                  {l.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
          <Link href="/uitgaan" className="btn-ghost group">
            {t.cultureLink}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

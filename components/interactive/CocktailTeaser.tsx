'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'
import { images } from '@/lib/site'
import SafeImage from '@/components/ui/SafeImage'

const COCKTAILS = [
  { key: 'mojito', nameNl: 'Mojito', nameEn: 'Mojito', image: images.mojito },
  { key: 'whiskey', nameNl: 'Whiskey Sour', nameEn: 'Whiskey Sour', image: images.whiskey },
  { key: 'espresso', nameNl: 'Espresso Martini', nameEn: 'Espresso Martini', image: images.espresso },
  { key: 'passion', nameNl: 'Passion Fruit Martini', nameEn: 'Passion Fruit Martini', image: images.passion },
  { key: 'bartender', nameNl: "Bartender's Choice", nameEn: "Bartender's Choice", image: images.workshopBar },
]

export default function CocktailTeaser() {
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang].cocktailTeaser
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)

  return (
    <section className="container-premium pb-24">
      <p className="eyebrow">{t.eyebrow}</p>
      <h2 className="h2 mt-4">{t.title}</h2>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {COCKTAILS.map((cocktail) => {
          const name = lang === 'nl' ? cocktail.nameNl : cocktail.nameEn
          const isActive = active === cocktail.key
          return (
            <a
              key={cocktail.key}
              href="#aanvraag"
              onMouseEnter={() => setActive(cocktail.key)}
              onMouseLeave={() => setActive((current) => (current === cocktail.key ? null : current))}
              onFocus={() => setActive(cocktail.key)}
              onBlur={() => setActive((current) => (current === cocktail.key ? null : current))}
              onClick={() => setActive(cocktail.key)}
              className="group focus-ring relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              aria-label={`${name} — ${t.cta}`}
            >
              <motion.div
                className="relative aspect-[3/4]"
                animate={
                  reduceMotion
                    ? undefined
                    : isActive
                      ? { rotate: [0, -3, 3, -2, 2, 0], y: [0, -2, 0] }
                      : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <SafeImage
                  src={cocktail.image}
                  fallbackSrc={images.fallbackWide}
                  alt={`${name} — cocktail workshop Maastricht bij Cliniq`}
                  fill
                  sizes="(min-width:1024px) 20vw, 33vw"
                  className="object-cover brightness-[1.05] transition duration-500 group-hover:scale-105"
                />
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent"
                  style={{ transformOrigin: 'top center' }}
                  animate={reduceMotion ? undefined : isActive ? { scaleY: [0, 1, 0.6], opacity: [0, 0.8, 0] } : { scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                <p className="text-xs font-black uppercase tracking-[0.06em] text-white">{name}</p>
              </div>
            </a>
          )
        })}
      </div>

      <div className="mt-6">
        <a href="#aanvraag" className="btn-secondary">{t.cta}</a>
      </div>
    </section>
  )
}

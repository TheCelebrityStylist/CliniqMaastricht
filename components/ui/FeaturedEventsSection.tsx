import type { AgendaEvent } from '@/lib/admin/types'
import { FeaturedEventCard } from './FeaturedEventCard'

// Portrait flyer cards need their own row, entirely separate from the landscape weekly-agenda
// grid (see FeaturedEventCard.tsx for why). Desktop/tablet gets a real CSS grid (2-4 columns,
// capped so cards never shrink into unreadable strips); mobile gets a horizontal snap-scroll row
// instead of a tall stack, so several flyers stay scannable in one screen's worth of scrolling -
// same "no endless full-height stack" lesson already applied to the regular agenda's mobile rows.
export function FeaturedEventsSection({ events, lang = 'nl' }: { events: AgendaEvent[]; lang?: 'nl' | 'en' }) {
  const featured = events.filter((event) => event.featured)
  if (!featured.length) return null

  const columns = Math.min(featured.length, 4)
  const eyebrow = lang === 'nl' ? 'Uitgelicht' : 'Featured'
  const title = lang === 'nl' ? 'Deze avonden mis je niet' : 'Nights you don\'t want to miss'
  const text =
    lang === 'nl'
      ? 'Speciale avonden bij CLINIQ, met hun eigen promoflyer en aanbieding.'
      : 'Special nights at CLINIQ, each with its own promo flyer and deal.'

  return (
    <section id="uitgelicht" className="container-premium section-y">
      <div className="reveal-up">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2 mt-3">{title}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">{text}</p>
      </div>
      <div className={`featured-grid featured-grid-${columns} mt-10`}>
        {featured.map((event, index) => (
          <FeaturedEventCard key={event._id} event={event} lang={lang} priority={index === 0} />
        ))}
      </div>
    </section>
  )
}

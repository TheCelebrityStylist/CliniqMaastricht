import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'

export function EventCard({ event, lang = 'nl' }: { event: AgendaEvent; lang?: 'nl' | 'en' }) {
  const title = lang === 'en' ? event.titleEn || event.title : event.titleNl || event.title
  const description = lang === 'en' ? event.shortDescriptionEn || event.shortDescription : event.shortDescriptionNl || event.shortDescription
  return <article className="card group overflow-hidden rounded-[2rem]">
    <div className="relative aspect-[4/3] overflow-hidden bg-burgundy">
      <Image src={event.imageUrl || images.club} alt={event.imageAlt || `${title} bij Cliniq Maastricht`} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
      {event.featured ? <span className="absolute left-4 top-4 rounded-full bg-magenta px-3 py-1 text-xs font-black uppercase tracking-widest">Featured</span> : null}
    </div>
    <div className="p-6">
      <p className="eyebrow">{formatDate(event.date)} · {event.ageLimit || '21+'}</p>
      <h3 className="mt-3 text-2xl font-black tracking-[-0.03em]">{title}</h3>
      <p className="mt-2 text-white/70">{event.startTime || '22:00'}–{event.endTime || '03:00'} · {description || (lang === 'en' ? 'Details will follow soon.' : 'Details volgen binnenkort.')}</p>
      {event.ticketUrl ? <Link data-track="agenda_click" href={event.ticketUrl} target="_blank" className="mt-5 inline-flex font-black text-magenta hover:text-white">Tickets / RSVP →</Link> : null}
    </div>
  </article>
}

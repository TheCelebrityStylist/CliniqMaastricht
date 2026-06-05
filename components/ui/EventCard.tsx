import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'
import SafeImage from './SafeImage'

export function EventCard({ event, lang = 'nl', priority = false }: { event: AgendaEvent; lang?: 'nl' | 'en'; priority?: boolean }) {
  const title = lang === 'en' ? event.titleEn || event.title : event.titleNl || event.title
  const description = lang === 'en' ? event.shortDescriptionEn || event.shortDescription : event.shortDescriptionNl || event.shortDescription
  const href = lang === 'en' ? `/en/nightlife/${event.slug?.current || event._id}` : `/uitgaan/${event.slug?.current || event._id}`

  return <article className="group luxury-panel overflow-hidden rounded-[2rem]">
    <Link href={href} className="block" data-track="agenda_card_click">
      <div className="image-frame aspect-[4/5] rounded-b-none border-x-0 border-t-0">
        <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || `${title} bij Cliniq Maastricht`} fill priority={priority} sizes="(min-width:1024px) 33vw, 100vw" className="object-cover brightness-[1.08] contrast-[1.04] transition duration-700 group-hover:scale-105" objectPosition={event.imagePosition || 'center'} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {event.featured ? <span className="rounded-full bg-magenta px-3 py-1 text-xs font-black uppercase tracking-widest text-white">Featured</span> : null}
          <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">{event.ageLimit || '21+'}</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="eyebrow">{formatDate(event.date)} · {event.startTime || '22:00'}–{event.endTime || '03:00'}</p>
          <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">{title}</h3>
        </div>
      </div>
    </Link>
    <div className="p-6">
      <p className="min-h-[3.5rem] text-white/70">{description || (lang === 'en' ? 'Details will follow soon. Expect a polished Cliniq night with cocktails, music and Maastricht energy.' : 'Details volgen binnenkort. Reken op een verzorgde Cliniq-avond met cocktails, muziek en Maastrichtse energie.')}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href={href} className="font-black text-gold hover:text-white">Details →</Link>
        {event.ticketUrl ? <Link data-track="agenda_click" href={event.ticketUrl} target="_blank" className="rounded-full bg-magenta px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-ink">Tickets / RSVP</Link> : null}
      </div>
    </div>
  </article>
}

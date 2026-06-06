import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'
import SafeImage from './SafeImage'

type EventWithAlbum = AgendaEvent & { relatedAlbumSlug?: string }

export function EventCard({ event, lang = 'nl', priority = false }: { event: EventWithAlbum; lang?: 'nl' | 'en'; priority?: boolean }) {
  const title = lang === 'en' ? event.titleEn || event.title : event.titleNl || event.title
  const isSaturday = title.toLowerCase().includes('saturday') || title.toLowerCase().includes('zaterdag')
  const fallbackLine = lang === 'en'
    ? `${isSaturday ? 'Saturday' : 'Friday'} from ${event.startTime || '22:00'}.`
    : `${isSaturday ? 'Zaterdag' : 'Vrijdag'} vanaf ${event.startTime || '22:00'}.`
  const description = (lang === 'en' ? event.shortDescriptionEn || event.shortDescription : event.shortDescriptionNl || event.shortDescription) || fallbackLine
  const href = lang === 'en' ? `/en/nightlife/${event.slug?.current || event._id}` : `/uitgaan/${event.slug?.current || event._id}`

  return <article className="group">
    <Link href={href} className="block" data-track="agenda_card_click">
      <div className="image-frame aspect-[3/4] rounded-[1.5rem] border-white/5">
        <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || `${title} bij CLINIQ Maastricht`} fill priority={priority} sizes="(min-width:1024px) 33vw, 100vw" className="object-cover brightness-[1.08] contrast-[1.03] transition duration-700 group-hover:scale-105" objectPosition={event.imagePosition || 'center'} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="eyebrow">{formatDate(event.date)} · {event.startTime || '22:00'}–{event.endTime || '03:00'} · {event.ageLimit || '21+'}</p>
          <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">{title}</h3>
        </div>
      </div>
    </Link>
    <div className="pt-4">
      <p className="text-white/64">{description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link href={href} className="text-sm font-black uppercase tracking-[0.18em] text-gold hover:text-white">{lang === 'en' ? 'Details' : 'Details'} →</Link>
        {event.relatedAlbumSlug ? <Link href={lang === 'en' ? `/en/photos/${event.relatedAlbumSlug}` : `/fotos/${event.relatedAlbumSlug}`} className="text-sm font-black uppercase tracking-[0.18em] text-white/55 hover:text-white">{lang === 'en' ? 'View photos' : 'Bekijk foto’s'} →</Link> : null}
        {event.ticketUrl ? <Link data-track="agenda_click" href={event.ticketUrl} target="_blank" className="text-sm font-black uppercase tracking-[0.18em] text-magenta hover:text-white">Tickets / RSVP</Link> : null}
      </div>
    </div>
  </article>
}

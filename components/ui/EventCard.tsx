import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'
import SafeImage from './SafeImage'

type EventWithAlbum = AgendaEvent & { relatedAlbumSlug?: string }

export function EventCard({ event, lang = 'nl', priority = false }: { event: EventWithAlbum; lang?: 'nl' | 'en'; priority?: boolean }) {
  const parsedDate = new Date(`${event.date}T00:00:00`)
  const dateLooksSaturday = !Number.isNaN(parsedDate.getTime()) && parsedDate.getDay() === 6
  const fallbackTitle = lang === 'en' ? (dateLooksSaturday ? 'Saturday at CLINIQ' : 'Friday at CLINIQ') : (dateLooksSaturday ? 'CLINIQ Saturday' : 'CLINIQ Friday')
  const title = (lang === 'en' ? event.titleEn || event.title : event.titleNl || event.title) || fallbackTitle
  const lowerTitle = title.toLowerCase()
  const isSaturday = lowerTitle.includes('saturday') || lowerTitle.includes('zaterdag') || dateLooksSaturday
  const fallbackLine = lang === 'en'
    ? `${isSaturday ? 'Saturday' : 'Friday'} from ${event.startTime || '22:00'}.`
    : `${isSaturday ? 'Zaterdag' : 'Vrijdag'} vanaf ${event.startTime || '22:00'}.`
  const description = (lang === 'en' ? event.shortDescriptionEn || event.shortDescription : event.shortDescriptionNl || event.shortDescription) || fallbackLine
  const href = lang === 'en' ? `/en/nightlife/${event.slug?.current || event._id}` : `/uitgaan/${event.slug?.current || event._id}`
  const time = `${event.startTime || '22:00'}–${event.endTime || '03:00'}`

  return <article className="event-card group">
    <Link href={href} className="block" data-track="agenda_card_click" aria-label={`${title} ${time}`}>
      <div className="event-card-media">
        <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || `${title} bij CLINIQ Maastricht`} fill priority={priority} sizes="(min-width:1024px) 33vw, 100vw" className="object-cover brightness-[1.06] contrast-[1.02] transition duration-700 group-hover:scale-105" objectPosition={event.imagePosition || 'center'} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/82 via-black/28 to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <span className="event-chip">{formatDate(event.date, lang)}</span>
          <span className="event-chip">{event.ageLimit || '21+'}</span>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-[30px] font-black leading-none tracking-[-0.045em] text-white sm:text-[34px]">{title}</h3>
          <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-white/76">{time}</p>
        </div>
      </div>
    </Link>
    <div className="flex min-h-[128px] flex-col justify-between p-5 pt-4">
      <p className="line-clamp-1 text-base leading-7 text-white/70">{description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link href={href} className="cta-arrow text-sm font-black uppercase tracking-[0.18em] text-gold hover:text-white">{lang === 'en' ? 'View event' : 'Bekijk event'} <span>→</span></Link>
        {event.relatedAlbumSlug ? <Link href={lang === 'en' ? `/en/photos/${event.relatedAlbumSlug}` : `/fotos/${event.relatedAlbumSlug}`} className="cta-arrow text-sm font-black uppercase tracking-[0.18em] text-white/55 hover:text-white">{lang === 'en' ? 'View photos' : 'Bekijk foto’s'} <span>→</span></Link> : null}
        {event.ticketUrl ? <Link data-track="agenda_click" href={event.ticketUrl} target="_blank" className="cta-arrow text-sm font-black uppercase tracking-[0.18em] text-magenta hover:text-white">Tickets / RSVP <span>→</span></Link> : null}
      </div>
    </div>
  </article>
}

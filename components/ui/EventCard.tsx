import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'
import SafeImage from './SafeImage'

type EventWithAlbum = AgendaEvent & { relatedAlbumSlug?: string; source?: string; imageSource?: string }

export function EventCard({ event, lang = 'nl', priority = false }: { event: EventWithAlbum; lang?: 'nl' | 'en'; priority?: boolean }) {
  const parsedDate = new Date(`${event.date}T00:00:00`)
  const dateLooksSaturday = !Number.isNaN(parsedDate.getTime()) && parsedDate.getDay() === 6
  const fallbackTitle = lang === 'en' ? (dateLooksSaturday ? 'Saturday at CLINIQ' : 'Friday at CLINIQ') : (dateLooksSaturday ? 'CLINIQ Saturday' : 'CLINIQ Friday')
  const title = (lang === 'en' ? event.titleEn || event.title : event.titleNl || event.title) || fallbackTitle
  const description = lang === 'en' ? event.shortDescriptionEn || event.shortDescription : event.shortDescriptionNl || event.shortDescription
  const href = lang === 'en' ? `/en/nightlife/${event.slug?.current || event._id}` : `/uitgaan/${event.slug?.current || event._id}`
  const time = [event.startTime, event.endTime].filter(Boolean).join('–')
  const detailEligible = event.eventType === 'featured' || event.eventType === 'special' || event.featured
  const hasDetail = Boolean(detailEligible && (description || event.showDetailCTA || event.ticketUrl))
  const shouldLinkDetail = Boolean(detailEligible && (event.showDetailCTA || event.ticketUrl))

  const media = <div className="event-card-media">
    <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || `${title} bij CLINIQ Maastricht`} fill priority={priority} sizes="(min-width:1024px) 33vw, 100vw" className="object-cover brightness-[1.06] contrast-[1.02] transition duration-700 group-hover:scale-105" objectPosition={event.imagePosition || 'center'} />
    <div className="event-card-overlay" />
    <div className="event-chip-row">
      <span className="event-chip">{formatDate(event.date, lang)}</span>
      <span className="event-chip event-chip-age">{event.ageLimit || '21+'}</span>
    </div>
    <div className="event-title-block">
      <h3 className="event-card-title">{title}</h3>
      {time ? <p className="event-card-time">{time}</p> : null}
    </div>
  </div>

  return <article data-image-source={event.source || event.imageSource || 'unknown'} className={`event-card group ${hasDetail ? 'event-card-featured' : 'event-card-regular'}`}>
    {shouldLinkDetail ? <Link href={href} className="block" data-track="agenda_card_click" aria-label={`${title} ${time}`}>{media}</Link> : media}
    {hasDetail ? <div className="event-card-detail">
      {description ? <p className="line-clamp-1 text-base leading-7 text-white/70">{description}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {event.showDetailCTA ? <Link href={href} className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-gold hover:text-white">{lang === 'en' ? 'View event' : 'Bekijk event'} <span>→</span></Link> : null}
        {event.relatedAlbumSlug ? <Link href={lang === 'en' ? `/en/photos/${event.relatedAlbumSlug}` : `/fotos/${event.relatedAlbumSlug}`} className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-white/55 hover:text-white">{lang === 'en' ? 'View photos' : 'Bekijk foto’s'} <span>→</span></Link> : null}
        {event.ticketUrl ? <Link data-track="agenda_click" href={event.ticketUrl} target="_blank" className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-magenta hover:text-white">Tickets / RSVP <span>→</span></Link> : null}
      </div>
    </div> : null}
  </article>
}

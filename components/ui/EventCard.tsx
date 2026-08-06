import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'
import SafeImage from './SafeImage'

type EventWithAlbum = AgendaEvent & { relatedAlbumSlug?: string; source?: string; imageSource?: string }

// Featured events stay in their natural date position (no reordering) - importance is signaled
// by style, not position: a coral accent border, an UITGELICHT/FEATURED tag, and a Guestlist CTA
// instead of the plain "Bekijk event" link. Only featured events have a real detail page (see
// /uitgaan/[slug] and /en/nightlife/[slug], which redirect any non-featured slug back to the
// agenda) - so a non-featured card's own link goes to the agenda anchor, not a generated page.
export function EventCard({ event, lang = 'nl', priority = false }: { event: EventWithAlbum; lang?: 'nl' | 'en'; priority?: boolean }) {
  const parsedDate = new Date(`${event.date}T00:00:00`)
  const dateLooksSaturday = !Number.isNaN(parsedDate.getTime()) && parsedDate.getDay() === 6
  const fallbackTitle = lang === 'en' ? (dateLooksSaturday ? 'Saturday at CLINIQ' : 'Friday at CLINIQ') : (dateLooksSaturday ? 'CLINIQ Saturday' : 'CLINIQ Friday')
  const title = (lang === 'en' ? event.titleEn || event.title : event.titleNl || event.title) || fallbackTitle
  const subtitle = lang === 'en' ? event.subtitleEn || event.subtitle : event.subtitleNl || event.subtitle
  // Falls back to the event's subtitle (already-existing copy, e.g. "Clubavond bij CLINIQ") when
  // there's no shortDescription - every card gets a one-line teaser without inventing new text.
  const description =
    (lang === 'en' ? event.shortDescriptionEn || event.shortDescription : event.shortDescriptionNl || event.shortDescription) ||
    subtitle
  const time = [event.startTime, event.endTime].filter(Boolean).join('–')
  const featured = Boolean(event.featured)

  const detailHref = lang === 'en' ? `/en/nightlife/${event.slug?.current || event._id}` : `/uitgaan/${event.slug?.current || event._id}`
  const agendaAnchor = lang === 'en' ? '/en/nightlife#agenda' : '/uitgaan#agenda'
  const href = featured ? detailHref : agendaAnchor
  const hasDetail = Boolean(description || event.relatedAlbumSlug || event.ticketUrl)

  const weekdayShort = !Number.isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL', { weekday: 'short' }).slice(0, 2).toUpperCase()
    : ''

  const media = <div className="event-card-media">
    <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || `${title} bij CLINIQ Maastricht`} fill priority={priority} sizes="(min-width:1024px) 33vw, 100vw" className="object-cover brightness-[1.06] contrast-[1.02] transition duration-700 ease-out group-hover:scale-105 group-hover:brightness-[1.14]" objectPosition={event.imagePosition || 'center'} />
    <div className="event-card-overlay" />
    <div className="event-chip-row">
      {featured ? <span className="event-chip event-chip-featured">{lang === 'nl' ? 'Uitgelicht' : 'Featured'}</span> : <span className="event-chip">{formatDate(event.date, lang)}</span>}
      <span className="event-chip event-chip-age">{event.ageLimit || '21+'}</span>
    </div>
    <div className="event-title-block">
      <h3 className="event-card-title">{title}</h3>
      {time ? <p className="event-card-time">{time}</p> : null}
    </div>
  </div>

  return <>
    {/* Below md: a compact ~76px tappable row (date block, name/time, age+chevron) so several fit
       on screen at once - not a wall of full-height cards. The featured event gets the same row
       height but a coral accent border, a small thumbnail instead of the date block, and a
       Guestlist chip instead of the plain chevron. The full card (below) is hidden here, shown
       from md up, so desktop is untouched by any of this. */}
    {featured ? (
      <Link
        href={href}
        data-track="agenda_card_click"
        aria-label={`${title} ${time}`}
        className="focus-ring group flex min-h-[76px] items-center gap-3 rounded-2xl border-2 border-coral/70 bg-coral/[0.07] px-3 py-2.5 transition-colors hover:border-coral md:hidden"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt="" fill sizes="56px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-[9px] font-black uppercase tracking-wider text-magenta">{lang === 'nl' ? 'Uitgelicht' : 'Featured'}</span>
          <p className="truncate text-[15px] font-black leading-tight text-white">{title}</p>
          {time ? <p className="mt-0.5 truncate text-xs font-bold text-white/55">{time}</p> : null}
        </div>
        <span className="shrink-0 rounded-full bg-coral px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.04em] text-white">Guestlist</span>
      </Link>
    ) : (
      <Link
        href={href}
        data-track="agenda_card_click"
        aria-label={`${title} ${time}`}
        className="focus-ring group flex min-h-[76px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5 transition-colors hover:border-white/25 md:hidden"
      >
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white/5 text-center leading-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-magenta">{weekdayShort}</span>
          <span className="mt-0.5 text-xl font-black text-white">{parsedDate.getDate()}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-black leading-tight text-white">{title}</p>
          {time ? <p className="mt-0.5 truncate text-xs font-bold text-white/55">{time}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-white/50">
          <span className="text-[11px] font-bold uppercase tracking-wide">{event.ageLimit || '21+'}</span>
          <ChevronIcon />
        </div>
      </Link>
    )}

    <article
      data-image-source={event.source || event.imageSource || 'unknown'}
      className={`event-card group hidden md:block ${featured ? 'event-card-spotlight' : hasDetail ? 'event-card-featured' : 'event-card-regular'}`}
    >
      <Link href={href} className="block" data-track="agenda_card_click" aria-label={`${title} ${time}`}>{media}</Link>
      {hasDetail || featured ? <div className="event-card-detail">
        {description ? <p className="line-clamp-1 text-base leading-7 text-white/70">{description}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {featured ? (
            <>
              <Link href={detailHref} className="btn-primary" data-track="agenda_card_click">Guestlist</Link>
              <Link href={detailHref} className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-white/60 hover:text-white">{lang === 'en' ? 'More info' : 'Meer info'} <span>→</span></Link>
            </>
          ) : null}
          {event.relatedAlbumSlug ? <Link href={lang === 'en' ? `/en/photos/${event.relatedAlbumSlug}` : `/fotos/${event.relatedAlbumSlug}`} className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-white/55 hover:text-white">{lang === 'en' ? 'View photos' : 'Bekijk foto’s'} <span>→</span></Link> : null}
          {event.ticketUrl ? <Link data-track="agenda_click" href={event.ticketUrl} target="_blank" className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-magenta hover:text-white">Tickets / RSVP <span>→</span></Link> : null}
        </div>
      </div> : null}
    </article>
  </>
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

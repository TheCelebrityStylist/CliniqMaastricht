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
  const subtitle = lang === 'en' ? event.subtitleEn || event.subtitle : event.subtitleNl || event.subtitle
  // Falls back to the event's subtitle (already-existing copy, e.g. "Clubavond bij CLINIQ") when
  // there's no shortDescription - every card gets a one-line teaser without inventing new text.
  const description =
    (lang === 'en' ? event.shortDescriptionEn || event.shortDescription : event.shortDescriptionNl || event.shortDescription) ||
    subtitle
  // Every event now has a real NL/EN detail route (see /uitgaan/[slug], /en/nightlife/[slug]), so
  // every card links there and gets its teaser line - not just events explicitly flagged
  // featured/special. `hasDetail` gates the bottom info panel (nothing to show if there's truly
  // nothing to say), it no longer requires an eventType flag to unlock.
  const href = lang === 'en' ? `/en/nightlife/${event.slug?.current || event._id}` : `/uitgaan/${event.slug?.current || event._id}`
  const time = [event.startTime, event.endTime].filter(Boolean).join('–')
  const hasDetail = Boolean(description || event.relatedAlbumSlug || event.ticketUrl)
  const featured = Boolean(event.featured)

  // The Sanity-flagged featured night stays IN the same agenda grid (not a separate band above
  // it) but reads as unmistakably the hero of the grid: spans 2 columns on desktop (md:col-span-2
  // fits inside every event-grid-1/2/3 variant without special-casing grid size), a wider/shorter
  // aspect ratio instead of the normal portrait tile, a FEATURED/UITGELICHT flag, and a solid
  // Guestlist CTA button instead of the small text-arrow link the regular cards use.
  if (featured) {
    return <article data-image-source={event.source || event.imageSource || 'unknown'} className="event-card group relative flex flex-col overflow-hidden md:col-span-2">
      <Link href={href} className="relative aspect-[16/10] overflow-hidden" data-track="agenda_card_click" aria-label={`${title} ${time}`}>
        <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || `${title} bij CLINIQ Maastricht`} fill priority={priority} sizes="(min-width:1024px) 66vw, 100vw" className="object-cover brightness-[.82] contrast-[1.06] saturate-[1.05] transition duration-700 ease-out group-hover:scale-105" objectPosition={event.imagePosition || 'center'} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(8,6,7,.92),rgba(8,6,7,.25)_55%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 md:p-7">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-magenta backdrop-blur-md">
              {lang === 'nl' ? 'Uitgelicht' : 'Featured'}
            </span>
            <h3 className="font-display mt-3 text-[clamp(1.8rem,4.2vw,3rem)] font-black uppercase leading-[0.94] tracking-tight text-white">{title}</h3>
            {subtitle ? <p className="mt-1.5 text-base text-white/72 md:text-lg">{subtitle}</p> : null}
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-white/70">{formatDate(event.date, lang)} · {time || '22:00–03:00'} · {event.ageLimit || '21+'}</p>
          </div>
          <div className="font-display shrink-0 text-right leading-[0.85] text-white">
            <div className="text-[clamp(2.4rem,5vw,3.5rem)] font-black tabular-nums">{parsedDate.getDate()}</div>
            <div className="text-sm font-black uppercase tracking-[0.1em] text-coral-text">{parsedDate.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { month: 'short' })}</div>
          </div>
        </div>
      </Link>
      <div className="event-card-detail flex flex-wrap items-center gap-x-6 gap-y-3">
        {event.ticketUrl ? (
          <a data-track="agenda_click" href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Tickets / RSVP</a>
        ) : (
          <Link href={href} className="btn-primary" data-track="agenda_card_click">Guestlist</Link>
        )}
        <Link href={href} className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-white/60 hover:text-white">{lang === 'en' ? 'More info' : 'Meer info'} <span>→</span></Link>
      </div>
    </article>
  }

  const media = <div className="event-card-media">
    <SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || `${title} bij CLINIQ Maastricht`} fill priority={priority} sizes="(min-width:1024px) 33vw, 100vw" className="object-cover brightness-[1.06] contrast-[1.02] transition duration-700 ease-out group-hover:scale-105 group-hover:brightness-[1.14]" objectPosition={event.imagePosition || 'center'} />
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

  // Below md, a compact scannable row instead of the full media card: a wall of 15+ full-height
  // hero cards was the previous overcorrection (fixing the hidden horizontal carousel by stacking
  // every card at full size instead of only fixing the discoverability problem). One tappable row,
  // ~76px tall, date block + name/time + age/chevron - several fit on screen at once. The full
  // card still renders (hidden on mobile, shown from md up) so desktop is untouched.
  const weekdayShort = !Number.isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL', { weekday: 'short' }).slice(0, 2).toUpperCase()
    : ''

  return <>
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

    <article data-image-source={event.source || event.imageSource || 'unknown'} className={`event-card group hidden md:block ${hasDetail ? 'event-card-featured' : 'event-card-regular'}`}>
      <Link href={href} className="block" data-track="agenda_card_click" aria-label={`${title} ${time}`}>{media}</Link>
      {hasDetail ? <div className="event-card-detail">
        {description ? <p className="line-clamp-1 text-base leading-7 text-white/70">{description}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href={href} className="cta-arrow text-sm font-black uppercase tracking-[0.1em] text-coral-text hover:text-white">{lang === 'en' ? 'View event' : 'Bekijk event'} <span>→</span></Link>
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

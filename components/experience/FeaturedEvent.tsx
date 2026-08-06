import Link from 'next/link'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'
import { formatBigDate, isThisWeekend } from '@/lib/eventCopy'
import type { Lang } from '@/lib/i18n'
import SafeImage from '@/components/ui/SafeImage'
import EventImageReveal from '@/components/experience/EventImageRevealLoader'

// The one night that gets a poster-grade, full-bleed treatment instead of a grid tile - a single
// WebGL light-sweep (EventImageReveal) is safe to spend here because there's only ever one of
// these per page; the remaining agenda cards below stay on the cheaper CSS hover treatment
// (EventCard's existing shine-sweep + lift) so the page doesn't spin up a WebGL context per card.
export default function FeaturedEvent({ event, lang }: { event: AgendaEvent; lang: Lang }) {
  const title = (lang === 'nl' ? event.titleNl || event.title : event.titleEn || event.title) || event.title
  const theme = lang === 'nl' ? event.subtitleNl || event.subtitle : event.subtitleEn || event.subtitle
  const teaser = lang === 'nl' ? event.shortDescriptionNl || event.shortDescription : event.shortDescriptionEn || event.shortDescription
  const { weekday, day, month } = formatBigDate(event.date, lang)
  const slug = event.slug?.current || event._id
  const detailHref = lang === 'nl' ? `/uitgaan/${slug}` : `/en/nightlife/${slug}`
  const weekend = isThisWeekend(event.date)
  const doors = event.startTime || '22:00'
  const closes = event.endTime || '03:00'
  const age = event.ageLimit || '21+'

  const ctaHref = event.ticketUrl || detailHref
  const ctaLabel = event.ticketUrl ? (lang === 'nl' ? 'Tickets / RSVP' : 'Tickets / RSVP') : 'Guestlist'
  const ctaExternal = Boolean(event.ticketUrl)

  return (
    <section className="container-premium section-y !pt-0">
      <div className="reveal-up relative isolate flex min-h-[560px] flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10">
        <SafeImage
          src={event.imageUrl}
          fallbackSrc={images.fallbackEvent}
          alt={event.imageAlt || `${title} bij CLINIQ Maastricht`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover brightness-[.82] contrast-[1.08] saturate-[1.05]"
          objectPosition={event.imagePosition || 'center'}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(8,6,7,.94),rgba(8,6,7,.35)_55%,transparent),radial-gradient(ellipse_at_top_right,rgba(220,72,254,.18),transparent_60%)]" />
        <EventImageReveal />

        <div className="relative flex flex-wrap items-end justify-between gap-8 p-7 md:p-12">
          <div className="min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-magenta backdrop-blur-md">
                {lang === 'nl' ? 'Uitgelicht' : 'Featured'}
              </span>
              {weekend ? (
                <span className="inline-flex items-center rounded-full border border-coral/40 bg-coral/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-coral-text">
                  {lang === 'nl' ? 'Dit weekend' : 'This weekend'}
                </span>
              ) : null}
            </div>

            <h2 className="font-display mt-5 text-[clamp(2.4rem,6vw,4.5rem)] font-black uppercase leading-[0.92] tracking-tight text-white">
              {title}
            </h2>
            {theme ? <p className="mt-3 text-lg text-white/72 md:text-xl">{theme}</p> : null}
            {teaser ? <p className="mt-3 max-w-xl text-base leading-7 text-white/65 line-clamp-2">{teaser}</p> : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold uppercase tracking-[0.08em] text-white/70">
              <span>{doors}–{closes}</span>
              <span aria-hidden="true" className="text-magenta">•</span>
              <span>{age}</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {ctaExternal ? (
                <a data-track="featured_event_click" href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  {ctaLabel}
                </a>
              ) : (
                <Link data-track="featured_event_click" href={ctaHref} className="btn-primary">
                  {ctaLabel}
                </Link>
              )}
              <Link href={detailHref} className="focus-ring inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.1em] text-white/60 hover:text-white">
                {lang === 'nl' ? 'Meer info' : 'More info'} →
              </Link>
            </div>
          </div>

          <div className="font-display shrink-0 text-right leading-[0.82] text-white">
            <div className="text-[clamp(1.1rem,2vw,1.5rem)] font-extrabold uppercase tracking-[0.14em] text-white/70">{weekday}</div>
            <div className="text-[clamp(4rem,11vw,8rem)] font-black tabular-nums">{day}</div>
            <div className="text-[clamp(1.3rem,2.6vw,2rem)] font-black uppercase tracking-[0.1em] text-coral-text">{month}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

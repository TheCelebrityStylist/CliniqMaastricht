import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { AgendaEvent } from '@/lib/admin/types'
import { images } from '@/lib/site'
import SafeImage from './SafeImage'

// A featured event's image is a promo FLYER (title/lineup/deal already baked into the artwork by
// a designer) - never a plain photo. Rendering it inside the shared .event-card component (which
// overlays its own title + DJ line on the image) produced duplicated, ghosted text and
// flyer-copy bleed-through. This is a separate, deliberately simpler tile: the flyer is shown
// clean and uncropped, and ALL info (date, age, name, CTA) lives in a slim bar below it - never
// on top of the art. See components/ui/FeaturedEventsSection.tsx for the section that renders a
// row of these.
export function FeaturedEventCard({ event, lang = 'nl', priority = false }: { event: AgendaEvent; lang?: 'nl' | 'en'; priority?: boolean }) {
  const title = (lang === 'en' ? event.titleEn || event.title : event.titleNl || event.title) || event.title
  const detailHref = lang === 'en' ? `/en/nightlife/${event.slug?.current || event._id}` : `/uitgaan/${event.slug?.current || event._id}`
  const featuredLabel = lang === 'nl' ? 'Uitgelicht' : 'Featured'
  const moreInfoLabel = event.ticketUrl ? (lang === 'nl' ? 'Tickets' : 'Tickets') : lang === 'nl' ? 'Meer info' : 'More info'

  // Prefer the hand-uploaded flyer; a landscape fallback photo is cropped to fill the portrait
  // frame instead (there's no baked-in text to protect), matching how it already renders
  // elsewhere on the site.
  const hasFlyer = Boolean(event.flyerImageUrl)
  const imageSrc = event.flyerImageUrl || event.imageUrl
  const imageAlt = hasFlyer ? `${title} — promoflyer CLINIQ Maastricht` : event.imageAlt || `${title} bij CLINIQ Maastricht`

  return (
    <Link
      href={detailHref}
      data-track="featured_card_click"
      aria-label={`${title} — ${formatDate(event.date, lang)}`}
      className="featured-card focus-ring group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-coral/30 bg-white/[0.03] transition-colors hover:border-coral/70"
    >
      <div className="featured-card-media relative overflow-hidden bg-[#180811]">
        <SafeImage
          src={imageSrc}
          fallbackSrc={images.fallbackEvent}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 82vw"
          className={hasFlyer ? 'object-contain' : 'object-cover'}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="event-chip event-chip-featured shrink-0">{featuredLabel}</span>
          <span className="event-chip shrink-0">{formatDate(event.date, lang)}</span>
          <span className="event-chip event-chip-age shrink-0">{event.ageLimit || '21+'}</span>
        </div>
        <p className="truncate text-base font-black tracking-[-0.02em] text-white/90 sm:text-lg">{title}</p>
        <span className="cta-arrow mt-auto pt-1 text-sm font-black uppercase tracking-[0.1em] text-coral-text group-hover:text-white">
          {moreInfoLabel} <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}

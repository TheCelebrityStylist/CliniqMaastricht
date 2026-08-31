import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getAgendaEventBySlug } from '@/lib/admin/public'
import { images, site } from '@/lib/site'
import { breadcrumbSchema } from '@/lib/seo'
import { eventJsonLdDates, factualEventLineNl, isThisWeekend } from '@/lib/eventCopy'
import SafeImage from '@/components/ui/SafeImage'
import JsonLd from '@/components/ui/JsonLd'
import EventCountdown from '@/components/interactive/EventCountdownLoader'
import EventImageReveal from '@/components/experience/EventImageRevealLoader'

function formatDateNl(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Only the 5 events flagged `featured` get a dedicated detail page (see the guard in the page
// component below) — a non-featured slug is treated the same as a missing one here so it never
// gets indexed with its own metadata.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getAgendaEventBySlug(slug)
  const path = `/uitgaan/${slug}`
  if (!event || !event.featured) {
    return {
      title: 'Event niet gevonden | Uitgaan Maastricht',
      description: 'Dit Cliniq Maastricht event is niet gevonden.',
      alternates: { canonical: `${site.url}${path}` },
    }
  }
  const title = event.metaTitleNl || `${event.titleNl || event.title} — ${formatDateNl(event.date)} | Uitgaan Maastricht CLINIQ`
  const description = event.metaDescriptionNl || event.shortDescriptionNl || event.shortDescription || factualEventLineNl(event)
  return {
    title,
    description,
    alternates: {
      canonical: `${site.url}${path}`,
      languages: { 'nl-NL': `${site.url}${path}`, en: `${site.url}/en/nightlife/${slug}`, 'x-default': `${site.url}${path}` },
    },
    openGraph: { title, description, url: `${site.url}${path}`, siteName: site.name, locale: 'nl_NL', type: 'website', images: event.imageUrl ? [{ url: event.imageUrl }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: event.imageUrl ? [event.imageUrl] : undefined },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getAgendaEventBySlug(slug)
  if (!event) notFound()
  // Non-featured nights are list-only: no generated template page for them, so a stray link or
  // stale bookmark lands back on the agenda instead of a generic filled-in-with-fallbacks page.
  if (!event.featured) redirect('/uitgaan#agenda')

  const title = event.titleNl || event.title
  const subtitle = event.subtitleNl || event.subtitle
  // Only featured events reach this page (see the redirect guard above), so this NEVER falls back
  // to the "{act} achter de knoppen" template - that phrasing assumes a DJ distinct from the
  // event's own name, which reads as nonsense for a named night ("Amphitryon Inkom Party achter
  // de knoppen"). Real hand-written copy (Sanity `promoNl`, mapped to fullDescriptionNl) always
  // wins; with nothing written yet, this shows a plain factual line instead of guessing a story.
  const description = event.fullDescriptionNl || event.fullDescription || event.shortDescriptionNl || event.shortDescription || factualEventLineNl(event)

  const isPast = event.date < new Date().toISOString().slice(0, 10)

  return <section className="container-premium pt-36 pb-24">
    <Link href="/uitgaan" className="text-white/70 hover:text-white">← Terug naar uitgaan in Maastricht</Link>

    {isPast ? (
      <div className="mt-8 max-w-2xl">
        <p className="eyebrow">{event.date} · Afgelopen</p>
        <h1 className="h1 mt-5">{title}</h1>
        <p className="prose-premium mt-7">Deze avond bij CLINIQ Maastricht is al geweest. Benieuwd wat er nu speelt?</p>
        <Link href="/uitgaan" className="btn-primary mt-8">Bekijk komende events</Link>
      </div>
    ) : (
      <div className="mt-8 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div className="image-frame aspect-[4/5]"><SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || title} fill priority sizes="50vw" className="object-cover brightness-[1.08]" objectPosition={event.imagePosition || 'center'} /><EventImageReveal /></div>
        <div>
          <p className="eyebrow">{formatDateNl(event.date)} · {event.startTime || '22:00'} · {event.ageLimit || '21+'}{isThisWeekend(event.date) ? ' · Dit weekend' : ''}{event.categoryTagNl ? ` · ${event.categoryTagNl}` : ''}</p>
          <h1 className="h1 mt-5">{title}</h1>
          {event.djName ? <p className="mt-3 text-sm font-black uppercase tracking-[0.1em] text-white/50">met {event.djName}</p> : null}
          {subtitle ? <p className="mt-4 text-2xl text-coral-text">{subtitle}</p> : null}
          <p className="prose-premium mt-7">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {event.ticketUrl ? <Link href={event.ticketUrl} target="_blank" className="btn-primary">Tickets / RSVP</Link> : null}
            <Link href="/event-space#aanvraag" className="focus-ring inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.1em] text-white/60 hover:text-white">Aanvragen voor je eigen feest →</Link>
          </div>
          <div className="mt-8">
            <EventCountdown title={`${title} bij Cliniq Maastricht`} date={event.date} startTime={event.startTime} endTime={event.endTime} description={description} location={`${site.address.street}, ${site.address.postalCode} ${site.address.city}`} />
          </div>
        </div>
      </div>
    )}

    <JsonLd data={{
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: title,
      ...eventJsonLdDates(event),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: site.name, address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: 'NL' } },
      organizer: { '@type': 'Organization', name: site.name, url: site.url },
      performer: { '@type': 'PerformingGroup', name: title },
      image: event.imageUrl ? [event.imageUrl] : undefined,
      description,
      offers: event.ticketUrl ? { '@type': 'Offer', url: event.ticketUrl, availability: 'https://schema.org/InStock', priceCurrency: 'EUR' } : undefined,
    }} />
    <JsonLd data={breadcrumbSchema([
      { name: 'Home', url: site.url },
      { name: 'Uitgaan Maastricht', url: `${site.url}/uitgaan` },
      { name: title, url: `${site.url}/uitgaan/${slug}` },
    ])} />
  </section>
}

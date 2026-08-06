import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAgendaEventBySlug } from '@/lib/admin/public'
import { images, site } from '@/lib/site'
import { breadcrumbSchema } from '@/lib/seo'
import { generateEventPromoEn, isThisWeekend } from '@/lib/eventCopy'
import JsonLd from '@/components/ui/JsonLd'
import SafeImage from '@/components/ui/SafeImage'
import EventCountdown from '@/components/interactive/EventCountdownLoader'
import EventImageReveal from '@/components/experience/EventImageRevealLoader'

function formatDateEn(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getAgendaEventBySlug(slug)
  const path = `/en/nightlife/${slug}`
  if (!event) {
    return {
      title: 'Event not found | Nightlife Maastricht',
      description: 'This Cliniq Maastricht event could not be found.',
      alternates: { canonical: `${site.url}${path}` },
    }
  }
  const title = `${event.titleEn || event.title} — ${formatDateEn(event.date)} | Nightlife Maastricht CLINIQ`
  const description = event.shortDescriptionEn || event.shortDescription || generateEventPromoEn(event).slice(0, 155)
  return {
    title,
    description,
    alternates: {
      canonical: `${site.url}${path}`,
      languages: { 'nl-NL': `${site.url}/uitgaan/${slug}`, en: `${site.url}${path}`, 'x-default': `${site.url}/uitgaan/${slug}` },
    },
    openGraph: { title, description, url: `${site.url}${path}`, siteName: site.name, locale: 'en_GB', type: 'website', images: event.imageUrl ? [{ url: event.imageUrl }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: event.imageUrl ? [event.imageUrl] : undefined },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getAgendaEventBySlug(slug)
  if (!event) notFound()

  const title = event.titleEn || event.title
  const subtitle = event.subtitleEn || event.subtitle
  const description = event.fullDescriptionEn || event.fullDescription || event.shortDescriptionEn || event.shortDescription || generateEventPromoEn(event)
  const isPast = event.date < new Date().toISOString().slice(0, 10)

  return <section className="container-premium pt-36 pb-24">
    <Link href="/en/nightlife" className="text-white/70 hover:text-white">← Back to nightlife in Maastricht</Link>

    {isPast ? (
      <div className="mt-8 max-w-2xl">
        <p className="eyebrow">{event.date} · Past event</p>
        <h1 className="h1 mt-5">{title}</h1>
        <p className="prose-premium mt-7">This night at CLINIQ Maastricht has already happened. Curious what's on now?</p>
        <Link href="/en/nightlife" className="btn-primary mt-8">See upcoming events</Link>
      </div>
    ) : (
      <div className="mt-8 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"><SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || title} fill priority sizes="50vw" className="object-cover brightness-[1.08]" objectPosition={event.imagePosition || 'center'} /><EventImageReveal /></div>
        <div>
          <p className="eyebrow">{formatDateEn(event.date)} · {event.startTime || '22:00'} · {event.ageLimit || '21+'}{isThisWeekend(event.date) ? ' · This weekend' : ''}</p>
          <h1 className="h1 mt-5">{title}</h1>
          {subtitle ? <p className="mt-4 text-2xl text-coral-text">{subtitle}</p> : null}
          <p className="prose-premium mt-7">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {event.ticketUrl ? <Link data-track="event_click" href={event.ticketUrl} target="_blank" className="btn-primary">Tickets / RSVP</Link> : null}
            <Link href="/en/event-space#inquiry" className="focus-ring inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.1em] text-white/60 hover:text-white">Enquire about your own event →</Link>
          </div>
          <div className="mt-8">
            <EventCountdown title={`${title} at Cliniq Maastricht`} date={event.date} startTime={event.startTime} endTime={event.endTime} description={description} location={`${site.address.street}, ${site.address.postalCode} ${site.address.city}`} />
          </div>
        </div>
      </div>
    )}

    <JsonLd data={{
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: title,
      startDate: `${event.date}T${event.startTime || '22:00'}:00+02:00`,
      endDate: `${event.date}T${event.endTime || '03:00'}:00+02:00`,
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
      { name: 'Home', url: `${site.url}/en` },
      { name: 'Nightlife Maastricht', url: `${site.url}/en/nightlife` },
      { name: title, url: `${site.url}${`/en/nightlife/${slug}`}` },
    ])} />
  </section>
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAgendaEventBySlug } from '@/lib/admin/public'
import { images, site } from '@/lib/site'
import { breadcrumbSchema } from '@/lib/seo'
import SafeImage from '@/components/ui/SafeImage'
import JsonLd from '@/components/ui/JsonLd'
import EventCountdown from '@/components/interactive/EventCountdownLoader'
import EventImageReveal from '@/components/experience/EventImageRevealLoader'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getAgendaEventBySlug(slug)
  const path = `/uitgaan/${slug}`
  if (!event) {
    return {
      title: 'Event niet gevonden | Uitgaan Maastricht',
      description: 'Dit Cliniq Maastricht event is niet gevonden.',
      alternates: { canonical: `${site.url}${path}` },
    }
  }
  const title = `${event.titleNl || event.title} | Uitgaan Maastricht — Cliniq`
  const description = event.shortDescriptionNl || event.shortDescription || `${event.titleNl || event.title} bij Cliniq Maastricht, Platielstraat 9A. Bekijk tijden en tickets.`
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
  const title = event.titleNl || event.title
  const subtitle = event.subtitleNl || event.subtitle
  const description = event.fullDescriptionNl || event.fullDescription || event.shortDescriptionNl || event.shortDescription
  return <section className="container-premium pt-36 pb-24">
    <Link href="/uitgaan" className="text-white/70 hover:text-white">← Terug naar agenda</Link>
    <div className="mt-8 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
      <div className="image-frame aspect-[4/5]"><SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || title} fill priority sizes="50vw" className="object-cover brightness-[1.08]" objectPosition={event.imagePosition || 'center'} /><EventImageReveal /></div>
      <div><p className="eyebrow">{event.date} · {event.startTime || '22:00'} · {event.ageLimit || '21+'}</p><h1 className="h1 mt-5">{title}</h1>{subtitle ? <p className="mt-4 text-2xl text-coral-text">{subtitle}</p> : null}<p className="prose-premium mt-7">{description}</p>{event.ticketUrl ? <Link href={event.ticketUrl} target="_blank" className="btn-primary mt-8">Tickets / RSVP</Link> : null}
        <div className="mt-8">
          <EventCountdown title={`${title} bij Cliniq Maastricht`} date={event.date} startTime={event.startTime} endTime={event.endTime} description={description} location={`${site.address.street}, ${site.address.postalCode} ${site.address.city}`} />
        </div>
      </div>
    </div>
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

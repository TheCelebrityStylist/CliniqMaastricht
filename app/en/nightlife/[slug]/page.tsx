import Link from 'next/link'
import { notFound } from 'next/navigation'
import { metadata as createMetadata } from '@/lib/seo'
import { getAgendaEventBySlug } from '@/lib/admin/public'
import { images, site } from '@/lib/site'
import JsonLd from '@/components/ui/JsonLd'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getAgendaEventBySlug(slug)
  if (!event) return createMetadata('Event not found', 'This Cliniq Maastricht event could not be found.', `/en/nightlife/${slug}`, 'en')
  return createMetadata(`${event.title} | Nightlife Maastricht`, event.shortDescription || 'Club event at Cliniq Maastricht.', `/en/nightlife/${slug}`, 'en')
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getAgendaEventBySlug(slug)
  if (!event) notFound()
  const title = event.titleEn || event.title
  const subtitle = event.subtitleEn || event.subtitle
  const description = event.fullDescriptionEn || event.fullDescription || event.shortDescriptionEn || event.shortDescription
  return <section className="container-premium pt-36 pb-24">
    <Link href="/en/nightlife" className="text-white/70 hover:text-white">← Back to agenda</Link>
    <div className="mt-8 grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"><SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || title} fill priority sizes="50vw" className="object-cover brightness-[1.08]" objectPosition={event.imagePosition || 'center'} /></div><div><p className="eyebrow">{event.date} · {event.startTime || '22:00'} · {event.ageLimit || '21+'}</p><h1 className="h1 mt-5">{title}</h1>{subtitle ? <p className="mt-4 text-2xl text-gold">{subtitle}</p> : null}<p className="prose-premium mt-7">{description}</p>{event.ticketUrl ? <Link data-track="event_click" href={event.ticketUrl} target="_blank" className="btn-primary mt-8">Tickets / RSVP</Link> : null}</div></div>
    <JsonLd data={{ '@context':'https://schema.org', '@type':'Event', name:event.title, startDate:`${event.date}T${event.startTime || '22:00'}:00+02:00`, location:{ '@type':'Place', name:site.name, address:`${site.address.street}, ${site.address.postalCode} ${site.address.city}` }, description:event.shortDescription }} />
  </section>
}

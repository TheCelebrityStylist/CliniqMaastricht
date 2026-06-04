import Link from 'next/link'
import { getAgendaEvents } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsEn as faqs } from '@/lib/faqs'
import { faqSchema } from '@/lib/seo'
import { cmsMetadata } from '@/lib/pageMetadata'

export async function generateMetadata() { return cmsMetadata('nightlife', 'en') }

export default async function NightlifePage() {
  const events = await getAgendaEvents()
  return <section className="container-premium pt-36 pb-24">
    <p className="eyebrow">Agenda · Nightlife Maastricht</p><h1 className="h1 mt-5 max-w-5xl">Club nights with Maastricht character.</h1>
    <p className="prose-premium mt-7 max-w-3xl">Cliniq brings a more polished way to experience nightlife in Maastricht: curated club nights, cocktails, warm hospitality and a room designed for energy without losing style or comfort.</p>
    {events.length ? <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event) => <EventCard key={event._id} event={event} lang="en" />)}</div> : <div className="card mt-12 rounded-[2rem] p-8"><h2 className="h3">New events soon.</h2><p className="mt-3 text-white/70">There are no published upcoming events right now. Contact us for private events or check back soon.</p></div>}
    <div className="mt-16 grid gap-6 lg:grid-cols-2"><div className="card rounded-[2rem] p-8"><h2 className="h3">Nightlife Maastricht, elevated.</h2><p className="mt-4 text-white/70">Built for visitors searching for club Maastricht, nightlife Maastricht, cocktails and dancing with a premium edge.</p></div><div className="card rounded-[2rem] p-8"><h2 className="h3">Coming with a group?</h2><p className="mt-4 text-white/70">Start with a cocktail workshop or hire the venue for a corporate event, birthday or private party.</p><div className="mt-6 flex gap-3"><Link className="btn-primary" href="/en/cocktail-workshop">Workshop</Link><Link className="btn-secondary" href="/en/event-space">Venue hire</Link></div></div></div>
    <JsonLd data={events.map((event) => ({ '@context': 'https://schema.org', '@type': 'Event', name: event.title, startDate: `${event.date}T${event.startTime || '22:00'}:00+02:00`, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled', location: { '@type': 'Place', name: 'Cliniq Maastricht', address: 'Platielstraat 9A, 6211 GV Maastricht' }, image: event.imageUrl ? [event.imageUrl] : undefined, description: event.shortDescription }))} />
  <div className="mt-14"><p className="eyebrow">FAQ</p><h2 className="h2 mt-3">Plan your night.</h2><div className="mt-8 grid gap-4 lg:grid-cols-2">{faqs.map(f => <details key={f.question} className="card rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><JsonLd data={faqSchema(faqs)} /></section>
}

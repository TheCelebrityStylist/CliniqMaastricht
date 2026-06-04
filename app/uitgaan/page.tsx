import Link from 'next/link'
import { getAgendaEvents } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsNl as faqs } from '@/lib/faqs'
import { faqSchema } from '@/lib/seo'
import { cmsMetadata } from '@/lib/pageMetadata'

export async function generateMetadata() { return cmsMetadata('nightlife', 'nl') }

export default async function UitgaanPage() {
  const events = await getAgendaEvents()
  return <section className="container-premium pt-36 pb-24">
    <p className="eyebrow">Agenda · Uitgaan Maastricht</p><h1 className="h1 mt-5 max-w-5xl">Club events & nightlife agenda.</h1>
    <p className="prose-premium mt-7 max-w-3xl">Uitgaan in Maastricht mag stijlvol, warm en energiek tegelijk zijn. Bij Cliniq vind je clubnachten, DJ events, cocktails en een volwassen sfeer in het centrum van de stad — voor gasten die willen dansen, ontmoeten en de avond goed willen opbouwen.</p>
    {events.length ? <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event) => <EventCard key={event._id} event={event} />)}</div> : <div className="card mt-12 rounded-[2rem] p-8"><h2 className="h3">Binnenkort nieuwe events.</h2><p className="mt-3 text-white/70">Er zijn op dit moment geen gepubliceerde aankomende events. Neem contact op voor private events of check later opnieuw.</p></div>}
    <div className="mt-16 grid gap-6 lg:grid-cols-2"><div className="card rounded-[2rem] p-8"><h2 className="h3">Nightlife Maastricht met stijl.</h2><p className="mt-4 text-white/70">Cliniq combineert cocktailbar, club Maastricht en premium hospitality. Daarmee bouwen we lokale autoriteit rond uitgaan Maastricht, nightlife Maastricht, cocktailbar Maastricht en dansen in Maastricht zonder dat de avond massaal of generiek hoeft te voelen.</p></div><div className="card rounded-[2rem] p-8"><h2 className="h3">Privé of met groep?</h2><p className="mt-4 text-white/70">Combineer jouw avond met een cocktail workshop of huur de event space voor een bedrijfsfeest, verjaardag of private party.</p><div className="mt-6 flex gap-3"><Link className="btn-primary" href="/cocktail-workshop">Workshop</Link><Link className="btn-secondary" href="/event-space">Event space</Link></div></div></div>
    <JsonLd data={events.map((event) => ({ '@context': 'https://schema.org', '@type': 'Event', name: event.title, startDate: `${event.date}T${event.startTime || '22:00'}:00+02:00`, endDate: `${event.date}T${event.endTime || '03:00'}:00+02:00`, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled', location: { '@type': 'Place', name: 'Cliniq Maastricht', address: 'Platielstraat 9A, 6211 GV Maastricht' }, image: event.imageUrl ? [event.imageUrl] : undefined, description: event.shortDescription }))} />
  <div className="mt-14"><p className="eyebrow">FAQ</p><h2 className="h2 mt-3">Praktisch voor je avond.</h2><div className="mt-8 grid gap-4 lg:grid-cols-2">{faqs.map(f => <details key={f.question} className="card rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><JsonLd data={faqSchema(faqs)} /></section>
}

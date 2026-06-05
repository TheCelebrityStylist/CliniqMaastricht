import Link from 'next/link'
import { getAgendaEvents, getPageContent, getPhotoAlbums } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsNl as fallbackFaqs } from '@/lib/faqs'
import { faqSchema } from '@/lib/seo'
import { cmsMetadata } from '@/lib/pageMetadata'

export async function generateMetadata() { return cmsMetadata('nightlife', 'nl') }

export default async function UitgaanPage() {
  const [events, content, albums] = await Promise.all([getAgendaEvents(), getPageContent('nightlife'), getPhotoAlbums()])
  const faqs = content?.faqs?.length ? content.faqs : fallbackFaqs
  return <section className="container-premium pt-36 pb-24">
    <p className="eyebrow">Agenda · Uitgaan Maastricht</p><h1 className="h1 mt-5 max-w-5xl">{content?.heroTitle || 'Club events & nightlife agenda.'}</h1>
    <p className="prose-premium mt-7 max-w-3xl">{content?.heroSubtitle || 'Uitgaan in Maastricht mag stijlvol, warm en energiek tegelijk zijn. Bij Cliniq vind je clubnachten, DJ events, cocktails en een volwassen sfeer in het centrum van de stad — voor gasten die willen dansen, ontmoeten en de avond goed willen opbouwen.'}</p>
    {events.length ? <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="luxury-panel mt-12 rounded-[2rem] p-8"><h2 className="h3">Binnenkort nieuwe events.</h2><p className="mt-3 text-white/70">Er zijn op dit moment geen gepubliceerde aankomende events. Neem contact op voor private events of check later opnieuw.</p></div>}

    <div className="mt-16"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="eyebrow">Recent nights</p><h2 className="h2 mt-3">Club foto’s Maastricht.</h2></div><Link className="btn-secondary hidden sm:inline-flex" href="/fotos">Bekijk alle foto’s</Link></div><div className="grid gap-4 md:grid-cols-3">{albums.slice(0,3).map((album)=>{ const cover=album.cover || album.photos[0]; return <Link key={album.id} href={`/fotos/${album.slug}`} className="group image-frame aspect-[4/5] p-5"><SafeImage src={cover?.url} fallbackSrc={images.fallbackWide} alt={cover?.altNl || album.titleNl} fill sizes="33vw" className="-z-10 object-cover brightness-[1.08] transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-transparent"/><div className="absolute bottom-5 left-5 right-5"><p className="eyebrow">{album.date}</p><h3 className="mt-2 text-2xl font-black">{album.titleNl}</h3><p className="mt-3 font-black text-gold">Bekijk album →</p></div></Link>})}</div></div>

    <div className="mt-16 grid gap-6 lg:grid-cols-2"><div className="luxury-panel rounded-[2rem] p-8"><h2 className="h3">Nightlife Maastricht met stijl.</h2><p className="mt-4 text-white/70">Cliniq combineert cocktailbar, club Maastricht en premium hospitality. Daarmee bouwen we lokale autoriteit rond uitgaan Maastricht, nightlife Maastricht, cocktailbar Maastricht en dansen in Maastricht zonder dat de avond massaal of generiek hoeft te voelen.</p></div><div className="luxury-panel rounded-[2rem] p-8"><h2 className="h3">Privé of met groep?</h2><p className="mt-4 text-white/70">Combineer jouw avond met een cocktail workshop of huur de event space voor een bedrijfsfeest, verjaardag of private party.</p><div className="mt-6 flex flex-wrap gap-3"><Link className="btn-primary" href="/cocktail-workshop">Workshop</Link><Link className="btn-secondary" href="/event-space">Event space</Link></div></div></div>
    <JsonLd data={events.map((event) => ({ '@context': 'https://schema.org', '@type': 'Event', name: event.titleNl || event.title, startDate: `${event.date}T${event.startTime || '22:00'}:00+02:00`, endDate: `${event.date}T${event.endTime || '03:00'}:00+02:00`, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled', location: { '@type': 'Place', name: 'Cliniq Maastricht', address: 'Platielstraat 9A, 6211 GV Maastricht' }, image: event.imageUrl ? [event.imageUrl] : undefined, description: event.shortDescriptionNl || event.shortDescription }))} />
    <div className="mt-14"><p className="eyebrow">FAQ</p><h2 className="h2 mt-3">Praktisch voor je avond.</h2><div className="mt-8 grid gap-4 lg:grid-cols-2">{faqs.map((f) => <details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><JsonLd data={faqSchema(faqs)} /></section>
}

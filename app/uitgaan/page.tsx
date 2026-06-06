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
  return <>
    <section className="relative min-h-[78vh] overflow-hidden pt-36">
      <SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Clubavond bij CLINIQ Maastricht met rood en blauw licht" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.86),rgba(0,0,0,.42),rgba(0,0,0,.7)),linear-gradient(0deg,rgba(8,6,7,.94),transparent_45%)]" />
      <div className="container-premium py-24"><p className="eyebrow">Agenda</p><h1 className="h1 mt-5 max-w-5xl">Uitgaan bij CLINIQ</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/76">Elke donderdag, vrijdag en zaterdag. Check de agenda en neem je ID mee.</p></div>
    </section>

    <section className="container-premium py-20">{events.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="image-frame min-h-[360px] p-8"><SafeImage src={images.club} fallbackSrc={images.fallbackWide} alt="CLINIQ Maastricht dansvloer" fill sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" /><h2 className="h2 absolute bottom-8 left-8 right-8">Nieuwe events volgen.</h2></div>}</section>

    <section className="container-premium pb-20"><div className="mb-8 flex items-center justify-between gap-4"><h2 className="eyebrow">Recent nights</h2><Link className="btn-secondary" href="/fotos">Bekijk alle foto’s</Link></div><div className="grid gap-4 md:grid-cols-3">{albums.slice(0,3).map((album)=>{ const cover=album.cover || album.photos[0]; return <Link key={album.id} href={`/fotos/${album.slug}`} className="group image-frame aspect-[4/5] p-5"><SafeImage src={cover?.url} fallbackSrc={images.fallbackWide} alt={cover?.altNl || album.titleNl} fill sizes="33vw" className="-z-10 object-cover brightness-[1.08] transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-transparent"/><div className="absolute bottom-5 left-5 right-5"><p className="eyebrow">{album.date} · {album.photos.length} foto’s</p><h3 className="mt-2 text-2xl font-black">{album.titleNl}</h3><p className="mt-3 font-black text-gold">Bekijk album →</p></div></Link>})}</div></section>

    <section className="container-premium pb-24"><div className="max-w-5xl"><h2 className="eyebrow">Praktisch</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{faqs.map((f) => <details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div></section>
    <JsonLd data={events.map((event) => ({ '@context': 'https://schema.org', '@type': 'Event', name: event.titleNl || event.title, startDate: `${event.date}T${event.startTime || '22:00'}:00+02:00`, endDate: `${event.date}T${event.endTime || '03:00'}:00+02:00`, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled', location: { '@type': 'Place', name: 'Cliniq Maastricht', address: 'Platielstraat 9A, 6211 GV Maastricht' }, image: event.imageUrl ? [event.imageUrl] : undefined, description: event.shortDescriptionNl || event.shortDescription }))} />
    <JsonLd data={faqSchema(faqs)} />
  </>
}

import Link from 'next/link'
import { faqSchema } from '@/lib/seo'
import { images, site } from '@/lib/site'
import { getAgendaEvents, getPhotoAlbums } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsNl as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'
import { SEO_TEXT } from '@/lib/content'

export async function generateMetadata() { return cmsMetadata('nightlife', 'nl') }

export default async function NightlifePage() {
  const [events, albums] = await Promise.all([getAgendaEvents(), getPhotoAlbums()])
  const photos = [images.redCrowd, images.club, images.party, images.hero, images.contactInterior, images.bar]
  const eventSchemas = events.map((event) => ({
    '@type': 'Event',
    name: event.titleNl || event.title,
    startDate: `${event.date}T${event.startTime || '22:00'}:00+02:00`,
    endDate: `${event.date}T${event.endTime || '03:00'}:00+02:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: event.imageUrl ? [event.imageUrl] : undefined,
    description: event.fullDescriptionNl || event.shortDescriptionNl || event.shortDescription,
    url: `${site.url}/uitgaan/${event.slug?.current || event._id}`,
    location: { '@type': 'Place', name: site.name, address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: site.address.country } },
  }))

  return <>
    <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36">
      <SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Uitgaan bij CLINIQ Maastricht met rood en blauw licht" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/25" />
      <div className="container-premium py-24"><p className="eyebrow mb-4">Agenda</p><h1 className="h1 max-w-5xl">Uitgaan bij CLINIQ</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Donderdag (18+), vrijdag en zaterdag (21+) open vanaf 22:00. Cliniq staat op de Platielstraat, midden in het centrum.</p></div>
    </section>

    <section className="event-section py-24"><div className="container-premium"><div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">Deze week bij CLINIQ</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">Eerstvolgende avonden aan de Platielstraat.</p></div><Link className="btn-secondary hidden shrink-0 sm:inline-flex" href="/uitgaan">Alle events</Link></div>{events.length ? <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">Nieuwe events worden binnenkort toegevoegd.</div>}</div></section>

    <section className="container-premium pb-24"><div className="grid auto-rows-[180px] gap-4 md:grid-cols-6 md:auto-rows-[240px]">{photos.map((src, index)=><div key={src} className={`photo-tile image-frame ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Uitgaan Maastricht sfeerbeeld ${index + 1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><div className="mb-8"><p className="eyebrow">Fotoalbums</p><h2 className="h2 mt-3">Recente avonden</h2></div><AlbumGrid albums={albums.slice(0, 3)} /></section>

    <section className="container-premium pb-24"><p className="eyebrow">Praktisch</p><h2 className="h2 mt-4">Goed om te weten</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Practical title="Openingstijden" text="CLINIQ is normaal geopend op donderdag, vrijdag en zaterdag. Controleer per event de actuele tijden." /><Practical title="Minimumleeftijd" text="De leeftijd kan per avond verschillen. Neem altijd een geldig ID mee." /><Practical title="Deurbeleid" text="We letten op sfeer, veiligheid en respect. Kom op tijd en verzorgd." /><Practical title="Lockers" text="Lockers regel je via de officiële lockerlink op de website." /><Practical title="Locatie" text="Platielstraat 9A, op loopafstand van Vrijthof, Markt en uitgaansstraten." /></div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Uitgaan in Maastricht</h2></div><div className="prose-premium">{SEO_TEXT.uitgaan.nl.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p><Link href="/cocktail-workshop" className="text-gold hover:text-white">Cocktail workshop Maastricht</Link> · <Link href="/event-space" className="text-gold hover:text-white">ruimte huren Maastricht</Link> · <Link href="/fotos" className="text-gold hover:text-white">foto’s</Link> · <Link href="/contact" className="text-gold hover:text-white">contact</Link></p></div></div></section>

    <section className="container-premium pb-24"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Maastricht nightlife</p><h2 className="h2 mt-4">Voor groepen, vrienden en late plannen</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">CLINIQ zit precies waar je wilt zijn als je avond in Maastricht niet bij één drankje hoeft te blijven.</p></div><div className="space-y-5 text-lg leading-[1.7] text-white/72"><p>Wie zoekt naar uitgaan in Maastricht, club Maastricht, nachtleven Maastricht of stappen met vrienden, zoekt meestal geen uitleg van drie alinea’s voordat de avond begint. Je wilt weten wanneer er iets gebeurt, hoe laat je moet komen, wat de sfeer is en of je met je groep goed zit. Daarom houdt CLINIQ de agenda duidelijk en praktisch.</p><p>De locatie aan de Platielstraat maakt CLINIQ handig voor groepen die eerst ergens eten, borrelen of verzamelen en daarna willen doorpakken. Het Vrijthof, de Markt, hotels, parkeergarages en andere uitgaansplekken liggen dichtbij. Dat maakt CLINIQ geschikt voor spontane avonden uit, geplande verjaardagen, vrijgezellenavonden en groepen die in Maastricht willen starten zonder extra omweg.</p><p>Kom op tijd, neem een geldig ID mee en check per event de minimumleeftijd, openingstijden en eventuele ticketinformatie. Voor grotere groepen of een besloten invulling kun je ook contact opnemen over ruimte huren of een private event.</p></div></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section>
    <JsonLd data={faqSchema(faqs)} /><JsonLd data={{ '@context': 'https://schema.org', '@graph': eventSchemas }} />
  </>
}
function Practical({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article> }

import type { Metadata } from 'next'
import Link from 'next/link'
import { faqSchema } from '@/lib/seo'
import { images, site } from '@/lib/site'
import { getAgendaEvents, getPhotoAlbums } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsNl as faqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'

export const metadata: Metadata = {
  title: 'Uitgaan Maastricht | Club Cliniq — Donderdag, Vrijdag & Zaterdag',
  description: 'Cliniq Maastricht is hét adres voor een avondje stappen. Donderdag 18+, vrijdag en zaterdag 21+, open vanaf 22:00 aan de Platielstraat 9A in het centrum van Maastricht.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/uitgaan',
  },
  openGraph: {
    title: 'Uitgaan Maastricht | Club Cliniq',
    description: 'Donderdag 18+, vrijdag en zaterdag 21+, open vanaf 22:00. Platielstraat 9A, Maastricht.',
    url: 'https://www.cliniqmaastricht.nl/uitgaan',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
  },
}


export default async function NightlifePage() {
  const [events, albums] = await Promise.all([getAgendaEvents(), getPhotoAlbums()])
  const photos = [images.redCrowd, images.club, images.party, images.hero, images.contactInterior, images.bar]
  const eventSchemas = events.map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${event.titleNl || event.title} bij Cliniq Maastricht`,
    startDate: `${event.date}T22:00:00+01:00`,
    location: {
      '@type': 'Place',
      name: 'Cliniq Maastricht',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Platielstraat 9A',
        addressLocality: 'Maastricht',
        postalCode: '6211 GV',
        addressCountry: 'NL',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Cliniq Maastricht',
      url: 'https://www.cliniqmaastricht.nl',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  }))

  return <>
    <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36">
      <SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Uitgaan bij CLINIQ Maastricht met rood en blauw licht" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/25" />
      <div className="container-premium py-24"><p className="eyebrow mb-4">Cliniq — Platielstraat 9A</p><h1 className="h1 max-w-5xl">Uitgaan in<br/>Maastricht.</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Donderdag (18+), vrijdag en zaterdag (21+) open vanaf 22:00. Platielstraat 9A, midden in het centrum.</p></div>
    </section>

    <section className="event-section py-24"><div className="container-premium"><div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">Deze week bij CLINIQ</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">Eerstvolgende avonden aan de Platielstraat.</p></div><Link className="btn-secondary hidden shrink-0 sm:inline-flex" href="/uitgaan">Alle events</Link></div>{events.length ? <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">Nieuwe events worden binnenkort toegevoegd.</div>}</div></section>

    <section className="container-premium pb-24"><div className="grid auto-rows-[180px] gap-4 md:grid-cols-6 md:auto-rows-[240px]">{photos.map((src, index)=><div key={src} className={`photo-tile image-frame ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Uitgaan Maastricht sfeerbeeld ${index + 1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><div className="mb-8"><p className="eyebrow">Fotoalbums</p><h2 className="h2 mt-3">Recente avonden</h2></div><AlbumGrid albums={albums.slice(0, 3)} /></section>

    <section className="container-premium pb-24"><p className="eyebrow">Praktisch</p><h2 className="h2 mt-4">Goed om te weten</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Practical title="Openingstijden" text="CLINIQ is normaal geopend op donderdag, vrijdag en zaterdag. Controleer per event de actuele tijden." /><Practical title="Minimumleeftijd" text="De leeftijd kan per avond verschillen. Neem altijd een geldig ID mee." /><Practical title="Deurbeleid" text="We letten op sfeer, veiligheid en respect. Kom op tijd en verzorgd." /><Practical title="Lockers" text="Lockers regel je via de officiële lockerlink op de website." /><Practical title="Locatie" text="Platielstraat 9A, op loopafstand van Vrijthof, Markt en uitgaansstraten." /></div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Uitgaan in Maastricht</h2></div><div className="prose-premium"><p>Cliniq Maastricht is hét adres voor een avondje stappen in het centrum. Drie avonden per week open — donderdag, vrijdag en zaterdag — aan de Platielstraat 9A, op loopafstand van de Vrijthof en het Onze-Lieve-Vrouweplein.</p><p>Donderdag is voor iedereen vanaf 18 jaar. Vrijdag en zaterdag (21+) trekt Cliniq een gemengd publiek van studenten, locals en bezoekers uit de regio. Het muziekprogramma wisselt per avond — van house en tech-house tot urban en pop.</p><p>Dresscode geldt: kom er netjes bij. Tracksuits en sportschoenen zijn niet welkom. Neem altijd een geldig legitimatiebewijs mee.</p><p>Vrijgezellenavond of groepsuitje plannen? Cliniq is ook beschikbaar voor privéfeesten en exclusieve groepsboekingen. Vraag vrijblijvend via het contactformulier of WhatsApp.</p></div></div></section>

    <section className="container-premium pb-24"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Maastricht nightlife</p><h2 className="h2 mt-4">Voor groepen, vrienden en late plannen</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">CLINIQ zit precies waar je wilt zijn als je avond in Maastricht niet bij één drankje hoeft te blijven.</p></div><div className="space-y-5 text-lg leading-[1.7] text-white/72"><p>Wie zoekt naar uitgaan in Maastricht, club Maastricht, nachtleven Maastricht of stappen met vrienden, zoekt meestal geen uitleg van drie alinea’s voordat de avond begint. Je wilt weten wanneer er iets gebeurt, hoe laat je moet komen, wat de sfeer is en of je met je groep goed zit. Daarom houdt CLINIQ de agenda duidelijk en praktisch.</p><p>De locatie aan de Platielstraat maakt CLINIQ handig voor groepen die eerst ergens eten, borrelen of verzamelen en daarna willen doorpakken. Het Vrijthof, de Markt, hotels, parkeergarages en andere uitgaansplekken liggen dichtbij. Dat maakt CLINIQ geschikt voor spontane avonden uit, geplande verjaardagen, vrijgezellenavonden en groepen die in Maastricht willen starten zonder extra omweg.</p><p>Kom op tijd, neem een geldig ID mee en check per event de minimumleeftijd, openingstijden en eventuele ticketinformatie. Voor grotere groepen of een besloten invulling kun je ook contact opnemen over ruimte huren of een private event.</p></div></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{f.question}</h3></summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section>
    <JsonLd data={faqSchema(faqs)} /><JsonLd data={{ '@context': 'https://schema.org', '@graph': eventSchemas }} />
  </>
}
function Practical({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article> }

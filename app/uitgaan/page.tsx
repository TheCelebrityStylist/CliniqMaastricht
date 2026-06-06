import Link from 'next/link'
import { faqSchema } from '@/lib/seo'
import { images } from '@/lib/site'
import { getAgendaEvents, getPhotoAlbums } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsNl as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('nightlife', 'nl') }

export default async function NightlifePage() {
  const [events, albums] = await Promise.all([getAgendaEvents(), getPhotoAlbums()])
  const photos = [images.redCrowd, images.club, images.party, images.hero, images.contactInterior, images.bar]

  return <>
    <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36">
      <SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Uitgaan bij CLINIQ Maastricht met rood en blauw licht" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/25" />
      <div className="container-premium py-24"><p className="eyebrow mb-4">Agenda</p><h1 className="h1 max-w-5xl">Uitgaan bij CLINIQ</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Elke donderdag, vrijdag en zaterdag verandert CLINIQ in een clubavond met DJ’s, cocktails en een volwassen sfeer midden in Maastricht. Check de agenda, kom op tijd en neem je ID mee.</p></div>
    </section>

    <section className="container-premium py-24"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Upcoming</p><h2 className="h2 mt-3">Aankomende events</h2></div><Link className="btn-secondary" href="/fotos">Bekijk foto’s</Link></div>{events.length ? <div className="mt-10 grid gap-7 md:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">Nieuwe events worden binnenkort toegevoegd.</div>}</section>

    <section className="container-premium pb-24"><div className="grid auto-rows-[180px] gap-4 md:grid-cols-6 md:auto-rows-[240px]">{photos.map((src, index)=><div key={src} className={`photo-tile image-frame ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Uitgaan Maastricht sfeerbeeld ${index + 1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><div className="mb-8"><p className="eyebrow">Fotoalbums</p><h2 className="h2 mt-3">Recente avonden</h2></div><AlbumGrid albums={albums.slice(0, 3)} /></section>

    <section className="container-premium grid gap-8 pb-24 lg:grid-cols-[.85fr_1.15fr]"><div><p className="eyebrow">Praktisch</p><h2 className="h2 mt-4">Goed om te weten</h2><div className="mt-8 grid gap-4 text-white/72 sm:grid-cols-2"><p>Donderdag, vrijdag en zaterdag.</p><p>Controleer de minimumleeftijd per event.</p><p>Neem altijd een geldig ID mee.</p><p>Lockers regel je via /lockers.</p></div></div><div className="seo-panel rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-9"><h2 className="h3">Club Maastricht, agenda en nightlife</h2><p className="mt-5 text-lg leading-8 text-white/70">CLINIQ is een club en cocktailbar in Maastricht voor wie een avond uit zoekt zonder standaard kroeggevoel. De locatie ligt aan de Platielstraat, op loopafstand van het Vrijthof, de Markt en de belangrijkste uitgaansstraten. In de agenda vind je de aankomende clubavonden, speciale events en thema-avonden. De minimumleeftijd kan per avond verschillen; controleer daarom altijd de eventinformatie voordat je komt.</p></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section>
    <JsonLd data={faqSchema(faqs)} />
  </>
}

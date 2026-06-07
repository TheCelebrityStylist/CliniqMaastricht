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
      <div className="container-premium py-24"><p className="eyebrow mb-4">Agenda</p><h1 className="h1 max-w-5xl">Uitgaan bij CLINIQ</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Op donderdag, vrijdag en zaterdag is CLINIQ open voor clubavonden, groepen en avonden die rustig beginnen maar vaak later eindigen dan gepland. Midden in Maastricht, met muziek, drankjes en een volwassen sfeer.</p></div>
    </section>

    <section className="event-section py-24"><div className="container-premium"><div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">Deze week bij CLINIQ</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">Eerstvolgende avonden aan de Platielstraat.</p></div><Link className="btn-secondary hidden shrink-0 sm:inline-flex" href="/uitgaan">Alle events</Link></div>{events.length ? <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">Nieuwe events worden binnenkort toegevoegd.</div>}<PhotoStrip photos={photos} href="/fotos" label="Bekijk foto’s" /></div></section>

    <section className="container-premium pb-24"><div className="grid auto-rows-[180px] gap-4 md:grid-cols-6 md:auto-rows-[240px]">{photos.map((src, index)=><div key={src} className={`photo-tile image-frame ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Uitgaan Maastricht sfeerbeeld ${index + 1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><div className="mb-8"><p className="eyebrow">Fotoalbums</p><h2 className="h2 mt-3">Recente avonden</h2></div><AlbumGrid albums={albums.slice(0, 3)} /></section>

    <section className="container-premium pb-24"><p className="eyebrow">Praktisch</p><h2 className="h2 mt-4">Goed om te weten</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Practical title="Openingstijden" text="CLINIQ is normaal geopend op donderdag, vrijdag en zaterdag. Controleer per event de actuele tijden." /><Practical title="Minimumleeftijd" text="De leeftijd kan per avond verschillen. Neem altijd een geldig ID mee." /><Practical title="Deurbeleid" text="We letten op sfeer, veiligheid en respect. Kom op tijd en verzorgd." /><Practical title="Lockers" text="Lockers regel je via de officiële lockerlink op de website." /><Practical title="Locatie" text="Platielstraat 9A, op loopafstand van Vrijthof, Markt en uitgaansstraten." /></div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Uitgaan in Maastricht zonder standaard kroeggevoel</h2></div><div className="prose-premium"><p>CLINIQ ligt aan de Platielstraat, midden in het centrum van Maastricht. Je komt hier voor clubavonden, muziek, drankjes en een volwassen sfeer die anders voelt dan een standaard kroeg. De agenda wisselt per week, met avonden op donderdag, vrijdag en zaterdag. Zoek je een plek om op stap te gaan in Maastricht, een avondje uit met vrienden te plannen of met een groep te starten? Dan is CLINIQ een logische plek om in de gaten te houden.</p><p><Link href="/cocktail-workshop" className="text-gold hover:text-white">Cocktail workshop Maastricht</Link> · <Link href="/event-space" className="text-gold hover:text-white">ruimte huren Maastricht</Link> · <Link href="/fotos" className="text-gold hover:text-white">foto’s</Link> · <Link href="/contact" className="text-gold hover:text-white">contact</Link></p></div></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section>
    <JsonLd data={faqSchema(faqs)} />
  </>
}
function PhotoStrip({ photos, href, label }: { photos: string[]; href: string; label: string }) {
  return <div className="photo-strip mt-14"><div className="photo-strip-grid">{photos.slice(0, 6).map((src, index) => <Link key={`${src}-${index}`} href={href} className={`photo-strip-item group ${index % 3 === 1 ? 'photo-strip-item-tall' : ''}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Uitgaan bij CLINIQ Maastricht ${index + 1}`} fill sizes="(min-width:1024px) 16vw, 45vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div><Link href={href} className="cta-arrow mt-6 inline-flex text-sm font-black uppercase tracking-[0.18em] text-gold hover:text-white">{label} <span>→</span></Link></div>
}

function Practical({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article> }

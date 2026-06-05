import Link from 'next/link'
import { images, imageSets, site } from '@/lib/site'
import { getAgendaEvents, getPageContent } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import { cmsMetadata } from '@/lib/pageMetadata'

export async function generateMetadata() { return cmsMetadata('home', 'nl') }

export default async function Home() {
  const content = await getPageContent('home')
  const gallery = content?.images?.length ? content.images : imageSets.home.map((url) => ({ url, alt: 'Cliniq Maastricht sfeerbeeld', focalPoint: 'center' }))
  const heroImage = gallery[0]?.url || images.hero
  const events = (await getAgendaEvents()).filter((event) => event.featured).slice(0, 3)

  return <>
    <section className="section-lift relative min-h-[94vh] overflow-hidden pt-32">
      <SafeImage src={heroImage} fallbackSrc={images.fallbackHero} alt="Cliniq Maastricht premium nightlife, cocktails en event space" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.08] contrast-[1.05]" objectPosition={gallery[0]?.focalPoint || 'center'} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.55),rgba(54,16,31,.20)),linear-gradient(0deg,rgba(8,6,7,.95),transparent_40%)]" />
      <div className="container-premium py-20">
        <div className="max-w-5xl reveal"><p className="eyebrow">Nightlife · Cocktails · Event space</p><h1 className="h1 mt-5">{content?.heroTitle || 'Premium nightlife in Maastricht.'}</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/75">{content?.heroSubtitle || 'Cliniq Maastricht is de stijlvolle club, cocktailbar en eventlocatie in het hart van de stad — gebouwd voor avonden die blijven hangen.'}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link data-track="cta_click" className="btn-primary" href="/uitgaan">Bekijk agenda</Link><Link data-track="cta_click" className="btn-secondary" href="/event-space">Vraag ruimte aan</Link></div></div>
        <div className="mt-16 grid gap-3 md:grid-cols-4">{['Platielstraat 9A','Club Maastricht','Cocktail workshop','Private event space'].map((item)=><div key={item} className="luxury-panel rounded-3xl p-4 text-sm font-black uppercase tracking-[0.16em] text-white/75">{item}</div>)}</div>
      </div>
    </section>

    <section className="section-lift container-premium py-24"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]"><div className="sticky top-28 h-fit"><p className="eyebrow">Waarom Cliniq</p><h2 className="h2 mt-3">De avond begint zodra je binnenloopt.</h2><p className="prose-premium mt-6">Geen lege zaal, geen anonieme clubnacht, geen standaard groepsactiviteit. Cliniq combineert de warmte van een cocktailbar met de energie van een club en de flexibiliteit van een eventlocatie. Dat maakt de locatie sterk voor uitgaan Maastricht, cocktail workshop Maastricht en ruimte huren Maastricht.</p><Link className="btn-secondary mt-8" href="/contact">Plan je bezoek</Link></div><div className="grid gap-4 sm:grid-cols-2">{gallery.slice(1,5).map((item, index)=><div key={`${item.url}-${index}`} className={`image-frame ${index === 0 ? 'sm:mt-16' : ''} aspect-[4/5]`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt || `Cliniq Maastricht sfeerbeeld ${index + 1}`} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 hover:scale-105" objectPosition={item.focalPoint || 'center'} /></div>)}</div></div></section>

    <section className="container-premium py-24"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">Featured events.</h2><p className="prose-premium mt-4 max-w-2xl">Ontdek de avonden die Cliniq laten leven: premium clubnights, specials en events in hartje Maastricht.</p></div><Link href="/uitgaan" className="btn-secondary hidden sm:inline-flex">Alle events</Link></div>{events.length ? <div className="grid gap-6 md:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="luxury-panel rounded-3xl p-8"><h3 className="h3">Nieuwe events verschijnen binnenkort.</h3><p className="mt-3 text-white/70">De agenda wordt vanuit de admin beheerd. Tot die tijd kun je Cliniq boeken voor private events, workshops en groepsavonden.</p></div>}</section>

    <section className="container-premium grid gap-6 pb-24 lg:grid-cols-2"><Promo href="/cocktail-workshop" image={gallery[2]?.url || images.bar} label="Cocktail workshop Maastricht" title="Shake, stir & celebrate." text="Een premium workshop voor vrijgezellenfeest, bedrijfsuitje, verjaardag of vriendenweekend — met echte barenergie in plaats van een standaard cursus." /><Promo href="/event-space" image={gallery[3]?.url || images.crowd} label="Ruimte huren Maastricht" title="Jouw private event bij Cliniq." text="Van bedrijfsfeest tot gala: licht, sound, bar, cocktails en hospitality staan klaar voor een avond die niet voelt als zaalhuur." /></section>

    <section className="bg-ivory py-20 text-ink"><div className="container-premium grid gap-8 lg:grid-cols-[1fr_.8fr]"><div><p className="font-black uppercase tracking-[0.28em] text-magenta">Contact</p><h2 className="h2 mt-3">Klaar voor Cliniq?</h2></div><div className="text-lg leading-8"><p>{site.address.street}, {site.address.city}. Bekijk de agenda, plan een cocktail workshop of vraag de ruimte aan voor jouw event. Eén plek voor club Maastricht, cocktailbar Maastricht en private events.</p><div className="mt-7 flex flex-wrap gap-3"><Link className="btn-primary" href="/contact">Neem contact op</Link><Link className="btn-secondary border-ink/20 bg-ink text-white" href="/cocktail-workshop">Workshop boeken</Link></div></div></div></section>
  </>
}

function Promo({ href, image, label, title, text }: { href: string; image: string; label: string; title: string; text: string }) { return <Link href={href} className="group image-frame min-h-[480px] rounded-[2rem] p-8"><SafeImage src={image} fallbackSrc={images.fallbackWide} alt={label} fill sizes="50vw" className="-z-10 object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/55 to-transparent" /><p className="eyebrow">{label}</p><h2 className="h2 mt-52 max-w-lg">{title}</h2><p className="mt-4 max-w-md text-white/75">{text}</p></Link> }

import Image from 'next/image'
import Link from 'next/link'
import { metadata as createMetadata } from '@/lib/seo'
import { images, pages, site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/sanity/client'
import { EventCard } from '@/components/ui/EventCard'

export const metadata = createMetadata(pages[0].title, pages[0].description, '/')

export default async function Home() {
  const events = (await getAgendaEvents()).filter((e) => e.featured).slice(0, 3)
  return <>
    <section className="relative min-h-[92vh] overflow-hidden pt-32">
      <Image src={images.hero} alt="Cliniq Maastricht premium nightlife crowd and cocktail atmosphere" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-burgundy/25" />
      <div className="container-premium py-20">
        <p className="eyebrow">Nightlife · Cocktails · Event space</p>
        <h1 className="h1 mt-5 max-w-5xl">Premium nightlife in Maastricht.</h1>
        <p className="mt-7 max-w-2xl text-xl leading-8 text-white/70">Cliniq Maastricht is de stijlvolle club, cocktailbar en eventlocatie in het hart van de stad — gebouwd voor avonden die blijven hangen.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="btn-primary" href="/uitgaan">Bekijk agenda</Link><Link className="btn-secondary" href="/event-space">Vraag ruimte aan</Link></div>
      </div>
    </section>
    <section className="border-y border-white/10 bg-white/[0.04] py-5"><div className="container-premium grid gap-4 text-sm font-black uppercase tracking-[0.18em] text-white/70 md:grid-cols-4"><span>Platielstraat 9A</span><span>Club Maastricht</span><span>Cocktail workshops</span><span>Private events</span></div></section>
    <section className="container-premium py-24"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">Featured events.</h2></div><Link href="/uitgaan" className="btn-secondary hidden sm:inline-flex">Alle events</Link></div>{events.length ? <div className="grid gap-6 md:grid-cols-3">{events.map((event) => <EventCard key={event._id} event={event} />)}</div> : <p className="card rounded-3xl p-8 text-white/70">Nieuwe events verschijnen binnenkort. Volg Cliniq voor de laatste agenda.</p>}</section>
    <section className="container-premium grid gap-6 pb-24 lg:grid-cols-2"><Promo href="/cocktail-workshop" image={images.bar} label="Cocktail workshop Maastricht" title="Shake, stir & celebrate." text="Een premium workshop voor vrijgezellenfeest, bedrijfsuitje en vriendengroepen." /><Promo href="/event-space" image={images.crowd} label="Ruimte huren Maastricht" title="Jouw private event bij Cliniq." text="Van bedrijfsfeest tot gala: licht, sound, bar en sfeer staan klaar." /></section>
    <section className="container-premium pb-24"><div className="grid gap-4 md:grid-cols-3">{[images.hero, images.club, images.party].map((src, i) => <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"><Image src={src} alt={`Atmosfeerfoto ${i + 1} van Cliniq Maastricht`} fill sizes="33vw" className="object-cover" /></div>)}</div></section>
    <section className="bg-ivory py-20 text-ink"><div className="container-premium grid gap-8 lg:grid-cols-[1fr_.8fr]"><div><p className="font-black uppercase tracking-[0.28em] text-magenta">Contact</p><h2 className="h2 mt-3">Klaar voor Cliniq?</h2></div><div className="text-lg leading-8"><p>{site.address.street}, {site.address.city}. Bekijk de agenda, plan een cocktail workshop of vraag de ruimte aan voor jouw event.</p><div className="mt-7 flex flex-wrap gap-3"><Link className="btn-primary" href="/contact">Neem contact op</Link><Link className="btn-secondary border-ink/20 bg-ink text-white" href="/cocktail-workshop">Workshop boeken</Link></div></div></div></section>
  </>
}

function Promo({ href, image, label, title, text }: { href: string; image: string; label: string; title: string; text: string }) { return <Link href={href} className="card group relative min-h-[440px] overflow-hidden rounded-[2rem] p-8"><Image src={image} alt={label} fill sizes="50vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-transparent" /><p className="eyebrow">{label}</p><h2 className="h2 mt-44 max-w-lg">{title}</h2><p className="mt-4 max-w-md text-white/70">{text}</p></Link> }

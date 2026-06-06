import Link from 'next/link'
import { images, site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import { cmsMetadata } from '@/lib/pageMetadata'
import { ui } from '@/lib/i18n'

export async function generateMetadata() { return cmsMetadata('home', 'nl') }

export default async function Home() {
  const t = ui.nl
  const events = (await getAgendaEvents()).slice(0, 3)
  const photos = [images.crowd, images.bar, images.mojito, images.party, images.club, images.contactInterior, images.redCrowd, images.whiskey]

  return <>
    <section className="hero-section relative min-h-screen overflow-hidden pt-28">
      <SafeImage src={images.hero} fallbackSrc={images.fallbackHero} alt="Dansvloer van CLINIQ Maastricht met warm licht en publiek" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08] contrast-[1.04]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.28),rgba(0,0,0,.66)),linear-gradient(0deg,rgba(8,6,7,.96),transparent_42%)]" />
      <div className="container-premium flex min-h-[calc(100vh-7rem)] items-end pb-20">
        <div className="reveal max-w-5xl">
          <p className="eyebrow mb-4">Platielstraat 9A</p>
          <h1 className="h1">CLINIQ Maastricht</h1>
          <p className="mt-5 text-2xl font-black tracking-[-0.03em] text-white/84 sm:text-4xl">Club, cocktails en events aan de Platielstraat.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link data-track="cta_click" className="btn-primary" href="/uitgaan">{t.common.viewAgenda}</Link><Link data-track="cta_click" className="btn-secondary" href="/event-space">{t.common.requestVenue}</Link></div>
        </div>
      </div>
    </section>

    <section className="container-premium py-24">
      <SectionIntro eyebrow="Agenda" title="Deze week bij CLINIQ" text="Donderdag, vrijdag en zaterdag draait het bij CLINIQ om muziek, cocktails en een volle dansvloer. Check de agenda voor de eerstvolgende avonden." ctaHref="/uitgaan" ctaLabel={t.common.allEvents} />
      {events.length ? <div className="mt-10 grid gap-7 md:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="image-frame mt-10 min-h-[360px] p-8"><SafeImage src={images.club} fallbackSrc={images.fallbackWide} alt="CLINIQ Maastricht clubavond" fill sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" /><h3 className="h2 absolute bottom-8 left-8 right-8">Nieuwe events volgen.</h3></div>}
    </section>

    <section className="container-premium pb-24">
      <SectionIntro eyebrow="Foto’s" title="Sfeer van de afgelopen avonden" text="Een selectie uit recente clubnachten, borrels en events." ctaHref="/fotos" ctaLabel={t.common.allPhotos} />
      <div className="mt-10 grid auto-rows-[180px] gap-4 md:grid-cols-8 md:auto-rows-[220px]">{photos.map((src, index) => <Link key={src} href="/fotos" className={`photo-tile image-frame group rounded-3xl ${index === 0 || index === 5 ? 'md:col-span-3 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Sfeerfoto CLINIQ Maastricht ${index + 1}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div>
      <Link href="/fotos" className="btn-primary mt-8 sm:hidden">{t.common.allPhotos}</Link>
    </section>

    <section className="container-premium grid gap-6 pb-24 lg:grid-cols-2">
      <EditorialBlock href="/cocktail-workshop" image={images.workshopBar} eyebrow="Groepen" title="Cocktail workshop in Maastricht" text="Voor groepen die meer willen dan een standaard borrel. Je staat samen achter de bar, maakt meerdere cocktails en krijgt begeleiding van onze bartenders. Populair voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen." cta="Bekijk workshop" />
      <EditorialBlock href="/event-space" image={images.redRoom} eyebrow="Private events" title="Ruimte huren bij CLINIQ" text="CLINIQ is beschikbaar voor borrels, bedrijfsfeesten, verjaardagen, vrijgezellenfeesten en private events. Met bar, licht, geluid en de sfeer van een clubavond in hartje Maastricht." cta="Bekijk mogelijkheden" />
    </section>

    <section className="container-premium pb-24">
      <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr]">
        <div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Uitgaan, cocktails en events in hartje Maastricht</h2></div>
        <div className="prose-premium"><p>CLINIQ ligt aan de Platielstraat, midden in het centrum van Maastricht. Door de combinatie van club, cocktailbar en eventruimte is CLINIQ geschikt voor een gewone avond uit, een cocktail workshop met een groep of het huren van een ruimte voor een besloten feest. Zoek je een club in Maastricht, een cocktailbar in Maastricht of een feestlocatie met meer sfeer dan een standaard zaal? Dan zit je bij CLINIQ op de juiste plek.</p></div>
      </div>
    </section>

    <section className="container-premium pb-24">
      <div className="border-y border-white/10 py-8"><h2 className="eyebrow">Praktisch</h2><div className="mt-6 grid gap-6 text-white/70 md:grid-cols-3"><p>Donderdag, vrijdag en zaterdag.</p><p>Neem altijd je ID mee.</p><p>Lockers regel je via de lockerlink.</p></div></div>
    </section>

    <section className="bg-ivory py-20 text-ink">
      <div className="container-premium grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-end">
        <div><h2 className="text-5xl font-black leading-none tracking-[-0.055em] sm:text-7xl">CLINIQ Maastricht</h2><p className="mt-5 text-2xl font-bold leading-tight">{site.address.street}. Club, cocktailbar en eventlocatie in het centrum van Maastricht.</p></div>
        <div className="flex flex-wrap gap-3 lg:justify-end"><Link className="btn-primary" href="/contact">Neem contact op</Link><Link className="btn-secondary border-ink/25 bg-ink text-white hover:border-ink hover:bg-ink/90 hover:text-white" href="/cocktail-workshop">Workshop aanvragen</Link></div>
      </div>
    </section>
  </>
}

function SectionIntro({ eyebrow, title, text, ctaHref, ctaLabel }: { eyebrow: string; title: string; text: string; ctaHref: string; ctaLabel: string }) {
  return <div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">{eyebrow}</p><h2 className="h2 mt-3">{title}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-white/66">{text}</p></div><Link href={ctaHref} className="btn-secondary hidden shrink-0 sm:inline-flex">{ctaLabel}</Link></div>
}

function EditorialBlock({ href, image, eyebrow, title, text, cta }: { href: string; image: string; eyebrow: string; title: string; text: string; cta: string }) {
  return <Link href={href} className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] transition duration-300 hover:border-white/25 lg:grid-cols-[.95fr_1.05fr]">
    <div className="image-frame min-h-[360px] rounded-none border-0"><SafeImage src={image} fallbackSrc={images.fallbackWide} alt={title} fill sizes="50vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></div>
    <div className="flex flex-col justify-end p-7 md:p-9"><p className="eyebrow">{eyebrow}</p><h2 className="h2 mt-4">{title}</h2><p className="mt-5 text-lg leading-8 text-white/70">{text}</p><span className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-magenta">{cta} →</span></div>
  </Link>
}

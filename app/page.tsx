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
  const photos = [images.crowd, images.bar, images.mojito, images.party, images.club, images.contactInterior]

  return <>
    <section className="hero-section relative min-h-screen overflow-hidden pt-28">
      <SafeImage src={images.hero} fallbackSrc={images.fallbackHero} alt="Dansvloer van CLINIQ Maastricht met warm licht en publiek" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08] contrast-[1.04]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.28),rgba(0,0,0,.66)),linear-gradient(0deg,rgba(8,6,7,.96),transparent_42%)]" />
      <div className="container-premium flex min-h-[calc(100vh-7rem)] items-end pb-20">
        <div className="reveal max-w-5xl">
          <p className="eyebrow mb-4">Platielstraat 9A</p>
          <h1 className="h1">CLINIQ Maastricht</h1>
          <p className="mt-5 max-w-3xl text-2xl font-black tracking-[-0.03em] text-white/84 sm:text-4xl">Club, cocktailbar en eventlocatie aan de Platielstraat.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link data-track="cta_click" className="btn-primary" href="/uitgaan">{t.common.viewAgenda}</Link><Link data-track="cta_click" className="btn-secondary" href="/event-space">{t.common.requestVenue}</Link></div>
        </div>
      </div>
    </section>

    <section className="container-premium py-24">
      <SectionIntro eyebrow="Agenda" title="Deze week bij CLINIQ" text="Donderdag, vrijdag en zaterdag draait het bij CLINIQ om muziek, cocktails en een volle dansvloer. Check de agenda voor de eerstvolgende avonden." ctaHref="/uitgaan" ctaLabel={t.common.allEvents} />
      {events.length ? <div className="mt-10 grid gap-7 md:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="image-frame mt-10 min-h-[360px] p-8"><SafeImage src={images.club} fallbackSrc={images.fallbackWide} alt="Clubavond bij CLINIQ aan de Platielstraat" fill sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" /><h3 className="h2 absolute bottom-8 left-8 right-8">Nieuwe events volgen.</h3></div>}
    </section>

    <section className="container-premium pb-24">
      <SectionIntro eyebrow="Foto’s" title="Foto’s van recente avonden" text="Bekijk de sfeer van clubnachten, borrels en events bij CLINIQ." ctaHref="/fotos" ctaLabel={t.common.allPhotos} />
      <div className="mt-10 grid auto-rows-[190px] gap-4 md:grid-cols-6 md:auto-rows-[230px]">{photos.map((src, index) => <Link key={src} href="/fotos" className={`photo-tile image-frame group rounded-3xl ${index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Sfeerfoto van CLINIQ Maastricht ${index + 1}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div>
      <Link href="/fotos" className="btn-primary mt-8 sm:hidden">{t.common.allPhotos}</Link>
    </section>

    <section className="container-premium space-y-8 pb-24">
      <ServiceRow href="/cocktail-workshop" image={images.workshopBar} eyebrow="Cocktails" title="Cocktail workshop in Maastricht" text="Een cocktail workshop bij CLINIQ is geen standaard borreltafel. Je staat samen achter de bar, maakt meerdere cocktails en krijgt begeleiding van onze bartenders. Geschikt voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen die iets actiefs willen doen voor of tijdens een avond uit in Maastricht." cta="Bekijk workshop" />
      <ServiceRow href="/event-space" image={images.redRoom} eyebrow="Events" title="Ruimte huren bij CLINIQ" text="CLINIQ is beschikbaar voor borrels, bedrijfsfeesten, verjaardagen, vrijgezellenfeesten en private events. Met bar, licht, geluid en clubgevoel is de ruimte geschikt voor groepen die geen standaard zaal zoeken, maar een locatie met sfeer in hartje Maastricht." cta="Bekijk mogelijkheden" reverse />
    </section>

    <section className="container-premium pb-24">
      <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr]">
        <div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Uitgaan, cocktails en events in hartje Maastricht</h2></div>
        <div className="prose-premium"><p>CLINIQ ligt aan de Platielstraat, midden in het centrum van Maastricht. De locatie combineert club, cocktailbar en eventruimte onder één dak. Daardoor kun je bij CLINIQ terecht voor een avond uit, een cocktail workshop met een groep of het huren van een ruimte voor een besloten feest. Zoek je een club in Maastricht, een cocktailbar in Maastricht of een feestlocatie met meer sfeer dan een standaard zaal, dan is CLINIQ een logische plek om te beginnen.</p></div>
      </div>
    </section>

    <section className="bg-ivory py-20 text-ink">
      <div className="container-premium grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-end">
        <div><h2 className="text-[40px] font-black leading-none tracking-[-0.055em] sm:text-6xl">CLINIQ Maastricht</h2><p className="mt-5 text-2xl font-bold leading-tight">{site.address.street}. Club, cocktailbar en eventlocatie in het centrum van Maastricht.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><Link className="btn-primary" href="/contact">Neem contact op</Link><Link className="btn-secondary border-ink/25 bg-ink text-white hover:border-ink hover:bg-ink/90 hover:text-white" href="/cocktail-workshop">Workshop aanvragen</Link></div>
      </div>
    </section>
  </>
}

function SectionIntro({ eyebrow, title, text, ctaHref, ctaLabel }: { eyebrow: string; title: string; text: string; ctaHref: string; ctaLabel: string }) {
  return <div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">{eyebrow}</p><h2 className="h2 mt-3">{title}</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">{text}</p></div><Link href={ctaHref} className="btn-secondary hidden shrink-0 sm:inline-flex">{ctaLabel}</Link></div>
}

function ServiceRow({ href, image, eyebrow, title, text, cta, reverse = false }: { href: string; image: string; eyebrow: string; title: string; text: string; cta: string; reverse?: boolean }) {
  return <article className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] lg:grid-cols-[45fr_55fr]">
    <Link href={href} className={`image-frame group min-h-[360px] rounded-none border-0 ${reverse ? 'lg:order-2' : ''}`}><SafeImage src={image} fallbackSrc={images.fallbackWide} alt={title} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>
    <div className="flex flex-col justify-center p-7 md:p-10"><p className="eyebrow">{eyebrow}</p><h2 className="mt-4 max-w-3xl text-[32px] font-black leading-tight tracking-[-0.04em] md:text-[42px]">{title}</h2><p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{text}</p><Link className="btn-primary mt-8 w-fit" href={href}>{cta}</Link></div>
  </article>
}

import Link from 'next/link'
import { images, site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import HeroFrame from '@/components/ui/HeroFrame'
import { cmsMetadata } from '@/lib/pageMetadata'
import { ui } from '@/lib/i18n'

export async function generateMetadata() { return cmsMetadata('home', 'nl') }

export default async function Home() {
  const t = ui.nl
  const events = (await getAgendaEvents()).slice(0, 3)
  const photos = [images.crowd, images.redCrowd, images.party, images.club, images.contactInterior, images.hero]

  return <>
    <HeroFrame>
      <SafeImage src={images.hero} fallbackSrc={images.fallbackHero} alt="Dansvloer van CLINIQ Maastricht met warm licht en publiek" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08] contrast-[1.04]" />
      <div className="hero-light" />
      <div className="hero-grain" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.82),rgba(0,0,0,.20),rgba(0,0,0,.58)),linear-gradient(0deg,rgba(8,6,7,.96),transparent_48%)]" />
      <div className="container-premium flex min-h-[calc(100vh-7rem)] items-end pb-20">
        <div className="max-w-6xl">
          <p className="eyebrow mb-4">Platielstraat 9A</p>
          <h1 className="hero-cover-title"><span>CLINIQ</span><span>Maastricht</span></h1>
          <p className="hero-cover-subline">De plek waar Maastricht samenkomt.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link data-track="cta_click" className="btn-primary" href="/uitgaan">{t.common.viewAgenda}</Link><Link data-track="cta_click" className="btn-secondary" href="/event-space">{t.common.requestVenue}</Link></div>
        </div>
      </div>
    </HeroFrame>

    <NightTicker text="CLINIQ · PLATIELSTRAAT 9A · DONDERDAG · VRIJDAG · ZATERDAG · MUSIC · DRINKS · LATE" />

    <section className="event-section py-24">
      <div className="container-premium">
        <SectionIntro eyebrow="Agenda" title="Deze week bij CLINIQ" text="Eerstvolgende avonden aan de Platielstraat." ctaHref="/uitgaan" ctaLabel={t.common.allEvents} />
        {events.length ? <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="image-frame mt-10 min-h-[360px] p-8"><SafeImage src={images.club} fallbackSrc={images.fallbackWide} alt="Clubavond bij CLINIQ aan de Platielstraat" fill sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" /><h3 className="h2 absolute bottom-8 left-8 right-8">Nieuwe events volgen.</h3></div>}
        <PhotoStrip photos={photos} href="/fotos" label="Bekijk foto’s" />
      </div>
    </section>

    <section className="container-premium pb-24">
      <SectionIntro eyebrow="Foto’s" title="Foto’s van recente avonden" text="Bekijk de sfeer van clubnachten, borrels en events bij CLINIQ." ctaHref="/fotos" ctaLabel={t.common.allPhotos} />
      <div className="mt-10 grid auto-rows-[190px] gap-4 md:grid-cols-6 md:auto-rows-[230px]">{photos.map((src, index) => <Link key={src} href="/fotos" className={`photo-tile image-frame group rounded-3xl ${index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Sfeerfoto van CLINIQ Maastricht ${index + 1}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div>
      <Link href="/fotos" className="btn-primary mt-8 sm:hidden">{t.common.allPhotos}</Link>
    </section>

    <section className="container-premium pb-24">
      <div className="proof-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
        <div><p className="eyebrow">Social proof</p><h2 className="h2 mt-4">Een vaste naam in Maastricht.</h2><p className="mt-5 text-lg leading-[1.65] text-white/70 md:text-xl">CLINIQ is geen concept op papier, maar een plek waar groepen, verenigingen, bedrijven en vriendengroepen al jaren samenkomen.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">{['Clubavonden', 'Studentenverenigingen', 'Bedrijven', 'Verjaardagen', 'Vrijgezellenavonden', 'Vriendengroepen'].map((item)=><div key={item} className="proof-item"><span>{item}</span></div>)}</div>
      </div>
    </section>

    <section className="container-premium space-y-8 pb-24">
      <ServiceRow href="/cocktail-workshop" image={images.workshopBar} eyebrow="Cocktails" title="Cocktail workshop in Maastricht" text="Een cocktail workshop bij CLINIQ is geen standaard borreltafel. Je staat samen achter de bar, maakt meerdere cocktails en krijgt begeleiding van onze bartenders. Geschikt voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen die iets actiefs willen doen voor of tijdens een avond uit in Maastricht." cta="Bekijk workshop" />
      <ServiceRow href="/event-space" image={images.redRoom} eyebrow="Events" title="Ruimte huren bij CLINIQ" text="CLINIQ is beschikbaar voor borrels, bedrijfsfeesten, verjaardagen, vrijgezellenfeesten en private events. Met bar, licht, geluid en clubgevoel is de ruimte geschikt voor groepen die geen standaard zaal zoeken, maar een locatie met sfeer in hartje Maastricht." cta="Bekijk mogelijkheden" reverse />
    </section>

    <section className="container-premium pb-24">
      <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr]">
        <div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Uitgaan, workshops en events in hartje Maastricht</h2></div>
        <div className="prose-premium"><p>CLINIQ ligt aan de Platielstraat, midden in het centrum van Maastricht. Je komt hier voor clubavonden, een avondje uit met vrienden, vrijgezellenavonden, private events en cocktail workshops. Door de combinatie van muziek, bar, licht, geluid en een centrale ligging is CLINIQ een logische plek voor wie wil stappen in Maastricht of een groepsevent zoekt dat niet voelt als een standaard zaal.</p></div>
      </div>
    </section>

    <section className="bg-ivory py-20 text-ink">
      <div className="container-premium grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-end">
        <div><h2 className="text-[40px] font-black leading-none tracking-[-0.055em] sm:text-6xl">CLINIQ Maastricht</h2><p className="mt-5 text-2xl font-bold leading-tight">{site.address.street}. Clubavonden, groepen en events in het centrum van Maastricht.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><Link className="btn-primary" href="/contact">Neem contact op</Link><Link className="btn-secondary border-ink/25 bg-ink text-white hover:border-ink hover:bg-ink/90 hover:text-white" href="/cocktail-workshop">Workshop aanvragen</Link></div>
      </div>
    </section>
  </>
}

function NightTicker({ text }: { text: string }) {
  return <div className="night-ticker border-y border-white/10 bg-black/35 py-3 text-gold/85"><div className="night-ticker-track"><span>{text}</span><span>{text}</span><span>{text}</span></div></div>
}

function PhotoStrip({ photos, href, label }: { photos: string[]; href: string; label: string }) {
  return <div className="photo-strip mt-14"><div className="photo-strip-grid">{photos.slice(0, 6).map((src, index) => <Link key={`${src}-${index}`} href={href} className={`photo-strip-item group ${index % 3 === 1 ? 'photo-strip-item-tall' : ''}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`CLINIQ Maastricht sfeerbeeld ${index + 1}`} fill sizes="(min-width:1024px) 16vw, 45vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div><Link href={href} className="cta-arrow mt-6 inline-flex text-sm font-black uppercase tracking-[0.18em] text-gold hover:text-white">{label} <span>→</span></Link></div>
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

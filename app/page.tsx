import Link from 'next/link'
import { images, site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import HeroFrame from '@/components/ui/HeroFrame'
import { cmsMetadata } from '@/lib/pageMetadata'
import { ui } from '@/lib/i18n'
import ClosingCTA from '@/components/layout/ClosingCTA'

export async function generateMetadata() { return cmsMetadata('home', 'nl') }

export default async function Home() {
  const t = ui.nl
  const events = (await getAgendaEvents()).slice(0, 3)
  const photos = [images.crowd, images.redCrowd, images.party, images.club, images.contactInterior, images.hero]

  return <>
    <HeroFrame className="hero-clean">
      <SafeImage src={images.hero} fallbackSrc={images.fallbackHero} alt="Dansvloer van CLINIQ Maastricht met warm licht en publiek" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08] contrast-[1.04]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.20),rgba(0,0,0,.54)),linear-gradient(0deg,rgba(8,6,7,.92),transparent_46%)]" />
      <div className="container-premium flex min-h-[calc(100vh-7rem)] items-end pb-20">
        <div className="max-w-4xl">
          <p className="eyebrow mb-4">Platielstraat 9A</p>
          <h1 className="hero-clean-title">CLINIQ Maastricht</h1>
          <p className="hero-clean-subline">Uitgaan, events en workshops aan de Platielstraat.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link data-track="cta_click" className="btn-primary" href="/uitgaan">{t.common.viewAgenda}</Link><Link data-track="cta_click" className="btn-secondary" href="/fotos">{t.home.heroCta2}</Link></div>
        </div>
      </div>
    </HeroFrame>

    <section className="event-section py-24">
      <div className="container-premium">
        <SectionIntro eyebrow="Agenda" title={t.home.eventsTitle} text="De eerstvolgende avonden bij CLINIQ." ctaHref="/uitgaan" ctaLabel={t.common.allEvents} />
        {events.length ? <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="image-frame mt-10 min-h-[360px] p-8"><SafeImage src={images.club} fallbackSrc={images.fallbackWide} alt="Clubavond bij CLINIQ aan de Platielstraat" fill sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" /><h3 className="h2 absolute bottom-8 left-8 right-8">Nieuwe events volgen.</h3></div>}
      </div>
    </section>

    <section className="container-premium pb-24">
      <SectionIntro eyebrow="Foto’s" title="Foto’s" text="Recente avonden bij CLINIQ." ctaHref="/fotos" ctaLabel={t.common.allPhotos} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.map((src, index) => <Link key={src} href="/fotos" className={`photo-tile image-frame group rounded-3xl ${index % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[5/4]'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Sfeerfoto van CLINIQ Maastricht ${index + 1}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div>
      <Link href="/fotos" className="btn-primary mt-8 sm:hidden">{t.common.allPhotos}</Link>
    </section>

    <section className="container-premium space-y-8 pb-24">
      <ServiceRow href="/cocktail-workshop" image={images.workshopBar} eyebrow="Workshop" title="Cocktail workshop" text="Cocktails maken met je groep, onder begeleiding van onze bartenders. Geschikt voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen." cta="Cocktail workshop bekijken" />
      <ServiceRow href="/event-space" image={images.redRoom} eyebrow="Events" title="Ruimte huren" text="CLINIQ is beschikbaar voor borrels, bedrijfsfeesten, verjaardagen, vrijgezellenavonden en private events." cta="Mogelijkheden bekijken" reverse />
    </section>

    <section className="container-premium pb-24">
      <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr]">
        <div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Uitgaan en events in Maastricht</h2></div>
        <div className="prose-premium"><p>CLINIQ ligt aan de Platielstraat, midden in het centrum van Maastricht. Je vindt hier clubavonden, groepsactiviteiten, cocktail workshops en mogelijkheden om de ruimte te huren voor een besloten avond. De agenda wisselt per week en via de fotopagina zie je een indruk van recente avonden.</p><p>Voor wie zoekt naar uitgaan in Maastricht, op stap gaan met vrienden, een vrijgezellenavond, een cocktail workshop of een ruimte voor een borrel of bedrijfsfeest, is CLINIQ een centrale plek in de stad. Controleer altijd de agenda voor actuele tijden, leeftijdsindicatie en eventuele details per avond.</p></div>
      </div>
    </section>

    <ClosingCTA />
  </>
}

function SectionIntro({ eyebrow, title, text, ctaHref, ctaLabel }: { eyebrow: string; title: string; text: string; ctaHref: string; ctaLabel: string }) {
  return <div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">{eyebrow}</p><h2 className="h2 mt-3">{title}</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">{text}</p></div><Link href={ctaHref} className="btn-secondary hidden shrink-0 sm:inline-flex">{ctaLabel}</Link></div>
}

function ServiceRow({ href, image, eyebrow, title, text, cta, reverse = false }: { href: string; image: string; eyebrow: string; title: string; text: string; cta: string; reverse?: boolean }) {
  return <article className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] lg:grid-cols-[45fr_55fr]">
    <Link href={href} className={`image-frame group min-h-[360px] rounded-none border-0 ${reverse ? 'lg:order-2' : ''}`}><SafeImage src={image} fallbackSrc={images.fallbackWide} alt={title} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>
    <div className="flex flex-col justify-center p-7 md:p-10"><p className="eyebrow">{eyebrow}</p><h2 className="mt-4 max-w-3xl text-[32px] font-black leading-tight tracking-[-0.025em] md:text-[42px]">{title}</h2><p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{text}</p><Link className="btn-primary mt-8 w-fit" href={href}>{cta}</Link></div>
  </article>
}

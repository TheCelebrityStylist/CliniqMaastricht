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
    <section className="relative min-h-screen overflow-hidden pt-28">
      <SafeImage src={images.hero} fallbackSrc={images.fallbackHero} alt="Dansvloer van CLINIQ Maastricht met warm licht en publiek" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.08] contrast-[1.04]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.86),rgba(0,0,0,.34),rgba(0,0,0,.72)),linear-gradient(0deg,rgba(8,6,7,.96),transparent_38%)]" />
      <div className="container-premium flex min-h-[calc(100vh-7rem)] items-end pb-20">
        <div className="reveal max-w-5xl">
          <h1 className="h1">CLINIQ Maastricht</h1>
          <p className="mt-5 text-2xl font-black tracking-[-0.03em] text-white/82 sm:text-4xl">Club. Cocktails. Events.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link data-track="cta_click" className="btn-primary" href="/uitgaan">{t.common.viewAgenda}</Link><Link data-track="cta_click" className="btn-secondary" href="/event-space">{t.common.requestVenue}</Link></div>
        </div>
      </div>
    </section>

    <section className="container-premium py-20">
      <div className="mb-8 flex items-center justify-between gap-4"><h2 className="eyebrow">This week at CLINIQ</h2><Link href="/uitgaan" className="btn-secondary hidden sm:inline-flex">{t.common.allEvents}</Link></div>
      {events.length ? <div className="grid gap-6 md:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}</div> : <div className="image-frame min-h-[360px] p-8"><SafeImage src={images.club} fallbackSrc={images.fallbackWide} alt="CLINIQ Maastricht clubavond" fill sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" /><h3 className="h2 absolute bottom-8 left-8 right-8">Nieuwe events volgen.</h3></div>}
    </section>

    <section className="container-premium pb-20">
      <div className="mb-8 flex items-center justify-between gap-4"><h2 className="eyebrow">Photo highlights</h2><Link href="/fotos" className="btn-secondary hidden sm:inline-flex">{t.common.allPhotos}</Link></div>
      <div className="grid auto-rows-[190px] gap-4 md:grid-cols-6 md:auto-rows-[230px]">{photos.map((src, index) => <Link key={src} href="/fotos" className={`image-frame group rounded-3xl ${index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`CLINIQ Maastricht foto ${index + 1}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div>
      <Link href="/fotos" className="btn-primary mt-8 sm:hidden">{t.common.allPhotos}</Link>
    </section>

    <section className="container-premium grid gap-5 pb-20 lg:grid-cols-2">
      <Promo href="/cocktail-workshop" image={images.workshopBar} title="Cocktail workshop." text="Voor groepen die iets leukers zoeken dan een standaard borrel." cta="Meer informatie" />
      <Promo href="/event-space" image={images.redRoom} title="Ruimte huren." text="Voor bedrijfsfeesten, verjaardagen, borrels en private events." cta="Bekijk mogelijkheden" />
    </section>

    <section className="bg-ivory py-20 text-ink">
      <div className="container-premium grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-end">
        <div><h2 className="text-5xl font-black leading-none tracking-[-0.055em] sm:text-7xl">CLINIQ Maastricht</h2><p className="mt-5 text-2xl font-bold leading-tight">{site.address.street}.<br/>Midden in Maastricht.</p></div>
        <div className="flex flex-wrap gap-3 lg:justify-end"><Link className="btn-primary" href="/contact">Neem contact op</Link><Link className="btn-secondary border-ink/25 bg-ink text-white hover:border-ink hover:bg-ink/90 hover:text-white" href="/cocktail-workshop">Workshop aanvragen</Link></div>
      </div>
    </section>
  </>
}

function Promo({ href, image, title, text, cta }: { href: string; image: string; title: string; text: string; cta: string }) {
  return <Link href={href} className="group image-frame min-h-[520px] rounded-[2rem] p-8">
    <SafeImage src={image} fallbackSrc={images.fallbackWide} alt={title} fill sizes="50vw" className="-z-10 object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" />
    <div className="absolute bottom-8 left-8 right-8"><h2 className="h2 max-w-lg">{title}</h2><p className="mt-4 max-w-md text-xl font-semibold text-white/78">{text}</p><p className="mt-7 font-black uppercase tracking-[0.18em] text-gold">{cta} →</p></div>
  </Link>
}

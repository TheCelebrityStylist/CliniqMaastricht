import Link from 'next/link'
import { images, imageSets, site } from '@/lib/site'
import { getAgendaEvents, getPageContent, getPhotoAlbums } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import { cmsMetadata } from '@/lib/pageMetadata'
import { ui } from '@/lib/i18n'

export async function generateMetadata() { return cmsMetadata('home', 'en') }

export default async function EnglishHome() {
  const content = await getPageContent('home', 'en')
  const t = ui.en
  const gallery = content?.images?.length ? content.images : imageSets.home.map((url) => ({ url, alt: 'Cliniq Maastricht atmosphere', focalPoint: 'center' }))
  const heroImage = gallery[0]?.url || images.hero
  const events = (await getAgendaEvents()).filter((event) => event.featured).slice(0, 3)
  const albums = (await getPhotoAlbums()).slice(0, 3)

  return <>
    <section className="section-lift relative min-h-[94vh] overflow-hidden pt-32">
      <SafeImage src={heroImage} fallbackSrc={images.fallbackHero} alt="Cliniq Maastricht club night with cocktails and event atmosphere" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.55),rgba(54,16,31,.20)),linear-gradient(0deg,rgba(8,6,7,.95),transparent_40%)]" />
      <div className="container-premium py-20"><p className="eyebrow">{t.home.eyebrow}</p><h1 className="h1 mt-5 max-w-5xl">{content?.heroTitle || t.home.hero}</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/70">{content?.heroSubtitle || t.home.intro}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="btn-primary" href="/en/nightlife">{t.common.viewAgenda}</Link><Link className="btn-secondary" href="/en/event-space">{t.common.requestVenue}</Link></div><div className="mt-16 grid gap-3 md:grid-cols-4">{t.home.proof.map((item)=><div key={item} className="luxury-panel rounded-3xl p-4 text-sm font-black uppercase tracking-[0.16em] text-white/75">{item}</div>)}</div></div>
    </section>
    <section className="container-premium py-24 grid gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="eyebrow">{t.home.whyEyebrow}</p><h2 className="h2 mt-3">{t.home.whyTitle}</h2><p className="prose-premium mt-6">{content?.body || t.home.whyText}</p></div><div className="grid gap-4 sm:grid-cols-2">{gallery.slice(1,5).map((item,i)=><div key={`${item.url}-${i}`} className="image-frame aspect-[4/5]"><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt || `Cliniq Maastricht atmosphere ${i+1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>
    <section className="container-premium py-24"><div className="mb-10 flex items-end justify-between"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">{t.home.eventsTitle}</h2><p className="prose-premium mt-4 max-w-2xl">{t.home.eventsText}</p></div><Link href="/en/nightlife" className="btn-secondary hidden sm:inline-flex">{t.common.allEvents}</Link></div><div className="grid gap-6 md:grid-cols-3">{events.length ? events.map((event)=><EventCard key={event._id} event={event} lang="en" />) : <div className="luxury-panel rounded-3xl p-8 md:col-span-3"><h3 className="h3">{t.home.noEventsTitle}</h3><p className="mt-3 text-white/70">{t.home.noEventsText}</p></div>}</div></section>
    <section className="container-premium pb-24"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="eyebrow">Nights at Cliniq</p><h2 className="h2 mt-3">{t.home.albumsTitle}</h2><p className="prose-premium mt-4 max-w-2xl">{t.home.albumsText}</p></div><Link href="/en/photos" className="btn-secondary hidden sm:inline-flex">{t.common.allPhotos}</Link></div><div className="grid gap-5 md:grid-cols-3">{albums.map((album) => { const cover = album.cover || album.photos[0]; const title = album.titleEn || album.titleNl; return <Link key={album.id} href={`/en/photos/${album.slug}`} className="group image-frame aspect-[4/5] p-5"><SafeImage src={cover?.url} fallbackSrc={images.fallbackWide} alt={cover?.altEn || title} fill sizes="33vw" className="-z-10 object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" objectPosition={cover?.focalPoint || 'center'} /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-transparent"/><div className="absolute bottom-5 left-5 right-5"><p className="eyebrow">{album.date} · {album.photos.length} {t.common.photos}</p><h3 className="mt-2 text-3xl font-black">{title}</h3><p className="mt-3 font-black text-gold">{t.common.allPhotos} →</p></div></Link> })}</div></section>
    <section className="bg-ivory py-20 text-ink"><div className="container-premium grid gap-8 lg:grid-cols-[1fr_.8fr]"><div><p className="font-black uppercase tracking-[0.28em] text-magenta">Contact</p><h2 className="h2 mt-3">{t.home.readyTitle}</h2></div><div className="text-lg leading-8"><p>{site.address.street}, {site.address.city}. {t.home.readyText}</p><div className="mt-7 flex flex-wrap gap-3"><Link className="btn-primary" href="/en/contact">{t.common.contact}</Link><Link className="btn-secondary border-ink/20 bg-ink text-white" href="/en/cocktail-workshop">{t.common.bookWorkshop}</Link></div></div></div></section>
  </>
}

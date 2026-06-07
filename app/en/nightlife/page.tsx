import Link from 'next/link'
import { faqSchema } from '@/lib/seo'
import { images } from '@/lib/site'
import { getAgendaEvents, getPhotoAlbums } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsEn as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('nightlife', 'en') }

export default async function NightlifePageEn() {
  const [events, albums] = await Promise.all([getAgendaEvents(), getPhotoAlbums()])
  const photos = [images.redCrowd, images.club, images.party, images.hero, images.contactInterior, images.bar]

  return <>
    <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36"><SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Nightlife at CLINIQ Maastricht with red and blue light" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/25" /><div className="container-premium py-24"><p className="eyebrow mb-4">Agenda</p><h1 className="h1 max-w-5xl">Nightlife at CLINIQ</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">On Thursday, Friday and Saturday, CLINIQ is open for club nights, groups and evenings that start calmly but often end later than planned. In central Maastricht, with music, drinks and a grown-up atmosphere.</p></div></section>
    <section className="container-premium py-24"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Upcoming</p><h2 className="h2 mt-3">Upcoming events</h2></div><Link className="btn-secondary" href="/en/photos">View photos</Link></div>{events.length ? <div className="mt-10 grid gap-7 md:grid-cols-3">{events.map((event, index) => <EventCard key={event._id} event={event} lang="en" priority={index === 0} />)}</div> : <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">New events will be added soon.</div>}</section>
    <section className="container-premium pb-24"><div className="grid auto-rows-[180px] gap-4 md:grid-cols-6 md:auto-rows-[240px]">{photos.map((src, index)=><div key={src} className={`photo-tile image-frame ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Nightlife Maastricht atmosphere ${index + 1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>
    <section className="container-premium pb-24"><div className="mb-8"><p className="eyebrow">Photo albums</p><h2 className="h2 mt-3">Recent nights</h2></div><AlbumGrid albums={albums.slice(0, 3)} lang="en" /></section>
    <section className="container-premium pb-24"><p className="eyebrow">Practical</p><h2 className="h2 mt-4">Good to know</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Practical title="Opening hours" text="CLINIQ is usually open on Thursday, Friday and Saturday. Check current times per event." /><Practical title="Minimum age" text="Age limits can differ per night. Always bring valid ID." /><Practical title="Door policy" text="We look at atmosphere, safety and respect. Arrive on time and well-presented." /><Practical title="Lockers" text="Lockers are handled through the official locker link on the website." /><Practical title="Location" text="Platielstraat 9A, within walking distance of Vrijthof, Markt and nightlife streets." /></div></section>
    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Club and nightlife in Maastricht</h2></div><p className="text-lg leading-[1.65] text-white/72 md:text-xl">Looking for a place to go out in Maastricht, plan a night with friends or visit a club with a group? CLINIQ is located on Platielstraat, central to Maastricht nightlife. The agenda shows what is planned per night, opening times and minimum age. For groups, bachelor and bachelorette evenings and spontaneous nights out, CLINIQ is an accessible place with the atmosphere of a club night.</p></div></section>
    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Frequently asked questions</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section><JsonLd data={faqSchema(faqs)} />
  </>
}
function Practical({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article> }

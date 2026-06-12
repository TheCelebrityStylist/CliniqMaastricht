import Link from 'next/link'
import { faqSchema } from '@/lib/seo'
import { images, site } from '@/lib/site'
import { getAgendaEvents, getPhotoAlbums } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsEn as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'
import { SEO_TEXT } from '@/lib/content'

export async function generateMetadata() { return cmsMetadata('nightlife', 'en') }

export default async function NightlifePageEn() {
  const [events, albums] = await Promise.all([getAgendaEvents(), getPhotoAlbums()])
  const photos = [images.redCrowd, images.club, images.party, images.hero, images.contactInterior, images.bar]
  const eventSchemas = events.map((event) => ({
    '@type': 'Event',
    name: event.titleEn || event.title,
    startDate: `${event.date}T${event.startTime || '22:00'}:00+02:00`,
    endDate: `${event.date}T${event.endTime || '03:00'}:00+02:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: event.imageUrl ? [event.imageUrl] : undefined,
    description: event.fullDescriptionEn || event.shortDescriptionEn || event.shortDescription,
    url: `${site.url}/en/nightlife/${event.slug?.current || event._id}`,
    location: { '@type': 'Place', name: site.name, address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: site.address.country } },
  }))

  return <>
    <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36"><SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Nightlife at CLINIQ Maastricht with red and blue light" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/25" /><div className="container-premium py-24"><p className="eyebrow mb-4">Cliniq — Platielstraat 9A</p><h1 className="h1 max-w-5xl">Nightlife in<br/>Maastricht.</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Thursday (18+), Friday and Saturday (21+) from 22:00. Platielstraat 9A, central Maastricht.</p></div></section>
    <section className="event-section py-24"><div className="container-premium"><div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">This week at CLINIQ</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">Next nights on Platielstraat.</p></div><Link className="btn-secondary hidden shrink-0 sm:inline-flex" href="/en/nightlife">All events</Link></div>{events.length ? <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>{events.map((event, index) => <EventCard key={event._id} event={event} lang="en" priority={index === 0} />)}</div> : <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">New events will be added soon.</div>}</div></section>
    <section className="container-premium pb-24"><div className="grid auto-rows-[180px] gap-4 md:grid-cols-6 md:auto-rows-[240px]">{photos.map((src, index)=><div key={src} className={`photo-tile image-frame ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Nightlife Maastricht atmosphere ${index + 1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>
    <section className="container-premium pb-24"><div className="mb-8"><p className="eyebrow">Photo albums</p><h2 className="h2 mt-3">Recent nights</h2></div><AlbumGrid albums={albums.slice(0, 3)} lang="en" /></section>
    <section className="container-premium pb-24"><p className="eyebrow">Practical</p><h2 className="h2 mt-4">Good to know</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Practical title="Opening hours" text="CLINIQ is usually open on Thursday, Friday and Saturday. Check current times per event." /><Practical title="Minimum age" text="Age limits can differ per night. Always bring valid ID." /><Practical title="Door policy" text="We look at atmosphere, safety and respect. Arrive on time and well-presented." /><Practical title="Lockers" text="Lockers are handled through the official locker link on the website." /><Practical title="Location" text="Platielstraat 9A, within walking distance of Vrijthof, Markt and nightlife streets." /></div></section>
    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Nightlife in central Maastricht</h2></div><div className="prose-premium">{SEO_TEXT.uitgaan.en.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p><Link href="/en/cocktail-workshop" className="text-gold hover:text-white">Cocktail workshop Maastricht</Link> · <Link href="/en/event-space" className="text-gold hover:text-white">venue hire Maastricht</Link> · <Link href="/en/photos" className="text-gold hover:text-white">photos</Link> · <Link href="/en/contact" className="text-gold hover:text-white">contact</Link></p></div></div></section>
    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Frequently asked questions</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section><JsonLd data={faqSchema(faqs)} /><JsonLd data={{ '@context': 'https://schema.org', '@graph': eventSchemas }} />
  </>
}
function Practical({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article> }

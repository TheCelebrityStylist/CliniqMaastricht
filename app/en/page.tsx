import Image from 'next/image'
import Link from 'next/link'
import { images, site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/sanity/client'
import { EventCard } from '@/components/ui/EventCard'
import { cmsMetadata } from '@/lib/pageMetadata'

export async function generateMetadata() { return cmsMetadata('home', 'en') }

export default async function HomeEn() {
  const events = (await getAgendaEvents()).filter((event) => event.featured).slice(0, 3)
  return <>
    <section className="relative min-h-[92vh] overflow-hidden pt-32">
      <Image src={images.hero} alt="Cliniq Maastricht premium nightlife and cocktail atmosphere" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-burgundy/25" />
      <div className="container-premium py-20"><p className="eyebrow">Nightlife · Cocktails · Venue hire</p><h1 className="h1 mt-5 max-w-5xl">Premium nightlife in Maastricht.</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/70">Cliniq is a polished Maastricht destination for late nights, cocktails and private events — designed for guests who want atmosphere without giving up style.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="btn-primary" href="/en/nightlife">View agenda</Link><Link className="btn-secondary" href="/en/event-space">Request venue</Link></div></div>
    </section>
    <section className="border-y border-white/10 bg-white/[0.04] py-5"><div className="container-premium grid gap-4 text-sm font-black uppercase tracking-[0.18em] text-white/70 md:grid-cols-4"><span>{site.address.street}</span><span>Club Maastricht</span><span>Cocktail workshops</span><span>Private events</span></div></section>
    <section className="container-premium py-24"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="eyebrow">Agenda</p><h2 className="h2 mt-3">Featured events.</h2></div><Link href="/en/nightlife" className="btn-secondary hidden sm:inline-flex">All events</Link></div>{events.length ? <div className="grid gap-6 md:grid-cols-3">{events.map((event) => <EventCard key={event._id} event={event} />)}</div> : <p className="card rounded-3xl p-8 text-white/70">New events will be announced soon. Follow Cliniq for the latest agenda.</p>}</section>
    <section className="container-premium grid gap-6 pb-24 lg:grid-cols-2"><Promo href="/en/cocktail-workshop" image={images.bar} label="Cocktail workshop Maastricht" title="Shake, stir and start the night properly." text="A premium group activity for team events, birthdays, bachelor and bachelorette weekends." /><Promo href="/en/event-space" image={images.crowd} label="Venue hire Maastricht" title="Your private event at Cliniq." text="From corporate parties to launches: sound, lighting, bar and atmosphere are ready." /></section>
  </>
}
function Promo({ href, image, label, title, text }: { href: string; image: string; label: string; title: string; text: string }) { return <Link href={href} className="card group relative min-h-[440px] overflow-hidden rounded-[2rem] p-8"><Image src={image} alt={label} fill sizes="50vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-transparent" /><p className="eyebrow">{label}</p><h2 className="h2 mt-44 max-w-lg">{title}</h2><p className="mt-4 max-w-md text-white/70">{text}</p></Link> }

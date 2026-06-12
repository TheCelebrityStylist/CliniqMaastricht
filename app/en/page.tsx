import Link from 'next/link'
import { images, site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import HeroFrame from '@/components/ui/HeroFrame'
import { cmsMetadata } from '@/lib/pageMetadata'
import { ui } from '@/lib/i18n'
import ClosingCTA from '@/components/layout/ClosingCTA'

export async function generateMetadata() { return cmsMetadata('home', 'en') }

export default async function HomeEn() {
  const t = ui.en
  const events = (await getAgendaEvents()).slice(0, 3)
  const photos = [images.crowd, images.redCrowd, images.party, images.club, images.contactInterior, images.hero]

  return <>
    <HeroFrame className="hero-clean"><SafeImage src={images.hero} fallbackSrc={images.fallbackHero} alt="CLINIQ Maastricht dance floor with warm light and guests" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08] contrast-[1.04]" /><div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.20),rgba(0,0,0,.54)),linear-gradient(0deg,rgba(8,6,7,.92),transparent_46%)]" /><div className="container-premium flex min-h-[calc(100vh-7rem)] items-end pb-20"><div className="max-w-4xl"><p className="eyebrow mb-4">Platielstraat 9A</p><h1 className="hero-clean-title">CLINIQ Maastricht</h1><p className="hero-clean-subline">Nights out, events and workshops on Platielstraat.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link data-track="cta_click" className="btn-primary" href="/en/nightlife">{t.common.viewAgenda}</Link><Link data-track="cta_click" className="btn-secondary" href="/en/photos">{t.home.heroCta2}</Link></div></div></div></HeroFrame>

    <section className="event-section py-24"><div className="container-premium"><SectionIntro eyebrow="Agenda" title={t.home.eventsTitle} text="The next nights at CLINIQ." ctaHref="/en/nightlife" ctaLabel={t.common.allEvents} />{events.length ? <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>{events.map((event, index) => <EventCard key={event._id} event={event} lang="en" priority={index === 0} />)}</div> : <div className="image-frame mt-10 min-h-[360px] p-8"><SafeImage src={images.club} fallbackSrc={images.fallbackWide} alt="Club night at CLINIQ on Platielstraat" fill sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" /><h3 className="h2 absolute bottom-8 left-8 right-8">New events coming soon.</h3></div>}</div></section>

    <section className="container-premium pb-24"><SectionIntro eyebrow="Photos" title="Photos" text="Recent nights at CLINIQ." ctaHref="/en/photos" ctaLabel={t.common.allPhotos} /><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.map((src, index) => <Link key={src} href="/en/photos" className={`photo-tile image-frame group rounded-3xl ${index % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[5/4]'}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`CLINIQ Maastricht atmosphere photo ${index + 1}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link>)}</div><Link href="/en/photos" className="btn-primary mt-8 sm:hidden">{t.common.allPhotos}</Link></section>

    <section className="container-premium space-y-8 pb-24"><ServiceRow href="/en/cocktail-workshop" image={images.workshopBar} eyebrow="Workshop" title="Cocktail workshop" text="Make cocktails with your group, guided by our bartenders. Suitable for bachelor and bachelorette parties, team nights, birthdays and groups of friends." cta="View cocktail workshop" /><ServiceRow href="/en/event-space" image={images.redRoom} eyebrow="Events" title="Venue hire" text="CLINIQ is available for drinks, company events, birthdays, bachelor and bachelorette parties and private events." cta="View options" reverse /></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Nightlife and events in Maastricht</h2></div><div className="prose-premium"><p>CLINIQ is located on Platielstraat, in the centre of Maastricht. You’ll find club nights, group activities, cocktail workshops and options to hire the venue for a private evening. The agenda changes weekly and the photos page gives an impression of recent nights.</p><p>For anyone looking for nightlife in Maastricht, a night out with friends, a bachelor or bachelorette night, a cocktail workshop or a venue for drinks or a company event, CLINIQ is a central location in the city. Always check the agenda for current times, age indication and event-specific details.</p></div></div></section>

    <ClosingCTA />
  </>
}

function SectionIntro({ eyebrow, title, text, ctaHref, ctaLabel }: { eyebrow: string; title: string; text: string; ctaHref: string; ctaLabel: string }) { return <div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">{eyebrow}</p><h2 className="h2 mt-3">{title}</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">{text}</p></div><Link href={ctaHref} className="btn-secondary hidden shrink-0 sm:inline-flex">{ctaLabel}</Link></div> }
function ServiceRow({ href, image, eyebrow, title, text, cta, reverse = false }: { href: string; image: string; eyebrow: string; title: string; text: string; cta: string; reverse?: boolean }) { return <article className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] lg:grid-cols-[45fr_55fr]"><Link href={href} className={`image-frame group min-h-[360px] rounded-none border-0 ${reverse ? 'lg:order-2' : ''}`}><SafeImage src={image} fallbackSrc={images.fallbackWide} alt={title} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" /></Link><div className="flex flex-col justify-center p-7 md:p-10"><p className="eyebrow">{eyebrow}</p><h2 className="mt-4 max-w-3xl text-[32px] font-black leading-tight tracking-[-0.025em] md:text-[42px]">{title}</h2><p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{text}</p><Link className="btn-primary mt-8 w-fit" href={href}>{cta}</Link></div></article> }

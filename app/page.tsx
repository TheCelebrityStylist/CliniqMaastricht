import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { images } from '@/lib/site'
import { getAgendaEvents, getPageContent, getSectionPhotoMedia, getSeoSettings } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import SafeImage from '@/components/ui/SafeImage'
import HeroFrame from '@/components/ui/HeroFrame'
import { ui } from '@/lib/i18n'
import ClosingCTA from '@/components/layout/ClosingCTA'
import AtmosphereFX from '@/components/interactive/AtmosphereFXLoader'
import MagneticCTAs from '@/components/interactive/MagneticCTAsLoader'
import EventTicker from '@/components/experience/EventTicker'
import NextNightLine from '@/components/experience/NextNightLine'
import HeroTitle from '@/components/ui/HeroTitle'
import PhotoPile from '@/components/experience/PhotoPile'
import { getPilePhotos } from '@/lib/photoPile'
import { sortFeaturedFirst } from '@/lib/eventCopy'

export const revalidate = 60

// Homepage title keeps the brand first — branded queries ("cliniq maastricht") already rank ~#2, don't touch what works.
//
// Title variants tested:
// A (shipped) — brand + three core offers, matches task-specified pattern:
//   "Cliniq Maastricht — Uitgaan, Cocktails & Events aan de Platielstraat"
// B — brand + days open, practical hook:
//   "Cliniq Maastricht — Club aan de Platielstraat | Open Do, Vr & Za"
// C — brand + broader positioning:
//   "Cliniq Maastricht — Nachtclub, Cocktail Workshops & Feestlocatie"
//
// Description variants tested:
// A (shipped):
//   "Cliniq Maastricht aan de Platielstraat 9A: club, cocktail workshops en feestlocatie tot 400 personen. Open do, vr & za tot 03:00. Bekijk de agenda."
// B — hook on the three services with CTA:
//   "Uitgaan, cocktails of een feest vieren in Maastricht? Cliniq zit aan de Platielstraat 9A en is open do, vr & za. Bekijk wat er deze week speelt."
// C — short and brand-forward:
//   "Cliniq Maastricht — dé club aan de Platielstraat. Clubavonden, cocktail workshops en ruimte voor besloten feesten. Open do, vr & za."
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings('home', 'nl')
  const title = seo?.seoTitle || 'Cliniq Maastricht — Uitgaan, Cocktails & Events aan de Platielstraat'
  const description =
    seo?.metaDescription ||
    'Cliniq Maastricht aan de Platielstraat 9A: club, cocktail workshops en feestlocatie tot 400 personen. Open do, vr & za tot 03:00. Bekijk de agenda.'
  const ogTitle = seo?.ogTitle || 'CLINIQ Maastricht — Club, Events & Workshops'
  const ogDescription =
    seo?.ogDescription ||
    'Op stap in Maastricht? Cliniq is open elke donderdag, vrijdag en zaterdag aan de Platielstraat 9A.'
  const socialImages = seo?.socialImageUrl ? [{ url: seo.socialImageUrl }] : undefined

  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.cliniqmaastricht.nl',
      languages: {
        'nl-NL': 'https://www.cliniqmaastricht.nl',
        en: 'https://www.cliniqmaastricht.nl/en',
        'x-default': 'https://www.cliniqmaastricht.nl',
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: 'https://www.cliniqmaastricht.nl',
      siteName: 'Cliniq Maastricht',
      locale: 'nl_NL',
      type: 'website',
      images: socialImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: seo?.socialImageUrl ? [seo.socialImageUrl] : undefined,
    },
  }
}

export default async function Home() {
  const t = ui.nl

  const [rawEvents, pageContent, homepagePhotos] = await Promise.all([
    getAgendaEvents(),
    getPageContent('home'),
    getSectionPhotoMedia('homepage', [
      images.crowd,
      images.redCrowd,
      images.party,
      images.club,
      images.contactInterior,
      images.hero,
    ]),
  ])
  const events = sortFeaturedFirst(rawEvents)

  const gallerySources = pageContent?.gallery?.length ? pageContent.gallery : homepagePhotos
  const photos = gallerySources.map((photo) => photo.url).filter(Boolean)
  const carouselPhotos = photos.length ? [...photos, ...photos] : []
  const heroPhoto = pageContent?.imageUrl || homepagePhotos[0]?.url || images.hero
  const pilePhotos = getPilePhotos('nl')

  const heroTitle = pageContent?.heroTitleNl || 'Maastricht After Dark.'
  const heroSubtitle = pageContent?.heroSubtitleNl || 'Uitgaan, events en workshops aan de Platielstraat.'
  const primaryCta = pageContent?.primaryCtaNl || t.common.viewAgenda
  const secondaryCta = pageContent?.secondaryCtaNl || t.home.heroCta2
  const seoBodyNl = pageContent?.bodyNl

  return (
    <>
      <HeroFrame className="hero-clean">
        <SafeImage
          src={heroPhoto}
          fallbackSrc={images.fallbackHero}
          alt="CLINIQ Maastricht nachtclub op de Platielstraat"
          fill
          priority
          sizes="100vw"
          className="hero-media -z-10 object-cover brightness-[.72] contrast-[1.1] saturate-[1.05]"
        />

        <div className="hero-scrim absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.62),rgba(0,0,0,.20),rgba(0,0,0,.54)),linear-gradient(0deg,rgba(8,6,7,.92),transparent_46%)]" />
        <AtmosphereFX />
        <MagneticCTAs />

        <div className="container-premium flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-14">
          <div className="max-w-4xl min-w-0">
            <p className="eyebrow mb-3">Platielstraat 9A</p>
            <HeroTitle title={heroTitle} fillImage={heroPhoto} />
            <p className="hero-clean-subline">{heroSubtitle}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link data-track="cta_click" className="btn-primary" href="/uitgaan">
                {primaryCta}
              </Link>

              <Link data-track="cta_click" className="focus-ring inline-flex min-h-11 items-center text-white/70 underline-offset-4 transition hover:text-white hover:underline" href="/event-space#aanvraag">
                Aanvragen voor feesten
              </Link>
            </div>
          </div>
        </div>
      </HeroFrame>

      <EventTicker events={events.map((event) => ({ title: event.titleNl || event.title, date: event.date }))} lang="nl" />

      <section className="event-section section-y">
        <div className="container-premium">
          <NextNightLine events={events.map((event) => ({ title: event.title, titleNl: event.titleNl, titleEn: event.titleEn, date: event.date, startTime: event.startTime, slug: event.slug?.current }))} lang="nl" />

          <SectionIntro
            eyebrow="Agenda"
            title={t.home.eventsTitle}
            text="De eerstvolgende avonden bij CLINIQ."
            ctaHref="/uitgaan"
            ctaLabel={t.common.allEvents}
          />

          {events.length ? (
            <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>
              {events.slice(0, 3).map((event, index) => (
                <EventCard key={event._id} event={event} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="image-frame mt-10 min-h-[360px] p-8">
              <SafeImage
                src={images.club}
                fallbackSrc={images.fallbackWide}
                alt="Clubavond bij CLINIQ aan de Platielstraat"
                fill
                sizes="100vw"
                className="-z-10 object-cover brightness-[1.08]"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <h3 className="h2 absolute bottom-8 left-8 right-8">Nieuwe events volgen.</h3>
            </div>
          )}

          {events.length > 3 ? (
            <Link href="/uitgaan" className="focus-ring mt-4 inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.1em] text-coral-text hover:text-white md:hidden">
              {t.common.allEvents} →
            </Link>
          ) : null}
        </div>
      </section>

      {pilePhotos.length ? (
        <section className="container-premium section-y">
          <p className="eyebrow">Laatste zaterdag</p>
          <h2 className="h2 mt-4">Sleep de foto's</h2>
          <div className="mt-8"><PhotoPile photos={pilePhotos} lang="nl" /></div>
        </section>
      ) : null}

      <section className="overflow-hidden section-y">
        <div className="container-premium">
          <SectionIntro eyebrow="Foto’s" title="Foto’s" text="Recente avonden bij CLINIQ." />
        </div>

        <div className="relative mt-10 overflow-hidden">
          <div className="flex w-max animate-[photoMarquee_42s_linear_infinite] gap-5 px-6 hover:[animation-play-state:paused]">
            {carouselPhotos.map((src, index) => (
              <Link
                key={`${src}-${index}`}
                href="/fotos"
                className="image-frame group relative h-[420px] w-[320px] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] sm:w-[420px] lg:w-[500px]"
              >
                <SafeImage
                  src={src}
                  fallbackSrc={images.fallbackWide}
                  alt={`Sfeerbeeld clubavond CLINIQ Maastricht ${index + 1}`}
                  fill
                  sizes="(min-width:1024px) 500px, 80vw"
                  className="object-cover brightness-[1.08] contrast-[1.03] transition duration-700 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#12030a] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#12030a] to-transparent" />
        </div>

        <div className="container-premium mt-8 flex justify-center">
          <Link href="/fotos" className="btn-primary">
            {t.common.allPhotos}
          </Link>
        </div>

        <style>{`
          @keyframes photoMarquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      <section className="container-premium section-y space-y-8">
        <ServiceRow
          href="/cocktail-workshop"
          image={images.workshopBar}
          eyebrow="Workshop"
          title="Cocktail workshop"
          text={
            <>
              Cocktails maken met je groep, onder begeleiding van onze bartenders. Geschikt voor vrijgezellenfeesten,
              bedrijfsuitjes, verjaardagen en vriendengroepen. Bekijk de{' '}
              <Link href="/cocktail-workshop" className="text-coral-text hover:text-white">
                cocktail workshop Maastricht
              </Link>
              .
            </>
          }
          cta="Cocktail workshop bekijken"
        />

        <ServiceRow
          href="/event-space"
          image={images.redRoom}
          eyebrow="Events"
          title="Ruimte huren"
          text={
            <>
              CLINIQ is beschikbaar voor borrels, bedrijfsfeesten, verjaardagen, vrijgezellenavonden en private events.
              Meer over{' '}
              <Link href="/event-space" className="text-coral-text hover:text-white">
                ruimte huren Maastricht
              </Link>
              .
            </>
          }
          cta="Mogelijkheden bekijken"
          reverse
        />
      </section>

      <section className="container-premium section-y">
        <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Maastricht</p>
            <h2 className="h2 mt-4">Uitgaan en events in Maastricht</h2>
          </div>

          <div className="prose-premium">
            {seoBodyNl ? (
              <p>{seoBodyNl}</p>
            ) : (
              <>
                <p>Elke donderdag, vrijdag en zaterdag open in het centrum van Maastricht. Goede muziek, de juiste mensen en een dansvloer die pas leegloopt als het licht aangaat. Maar Cliniq is meer dan een club. Cocktail workshop met je vriendinnen, vrijgezellenfeest, bedrijfsborrel zonder saaie zaal of een verjaardag waarbij je de hele tent voor jezelf hebt — wij regelen het. Of je nu de week afsluit met vrienden, een feest viert of gewoon de beste club in Maastricht zoekt, je bent hier op het juiste adres. Check de agenda en we zien je snel.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  )
}

function SectionIntro({
  eyebrow,
  title,
  text,
  ctaHref,
  ctaLabel,
}: {
  eyebrow: string
  title: string
  text: string
  ctaHref?: string
  ctaLabel?: string
}) {
  return (
    <div className="reveal-up flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2 mt-3">{title}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">{text}</p>
      </div>

      {ctaHref && ctaLabel ? (
        <Link href={ctaHref} className="btn-secondary hidden shrink-0 sm:inline-flex">
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  )
}

function ServiceRow({
  href,
  image,
  eyebrow,
  title,
  text,
  cta,
  reverse = false,
}: {
  href: string
  image: string
  eyebrow: string
  title: string
  text: ReactNode
  cta: string
  reverse?: boolean
}) {
  return (
    <article className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] lg:grid-cols-[45fr_55fr]">
      <Link
        href={href}
        className={`image-frame group min-h-[360px] rounded-none border-0 ${reverse ? 'lg:order-2' : ''}`}
      >
        <SafeImage
          src={image}
          fallbackSrc={images.fallbackWide}
          alt={title === 'Ruimte huren' ? 'Ruimte huren Maastricht CLINIQ' : 'Cocktail workshop Maastricht bij CLINIQ'}
          fill
          sizes="(min-width:1024px) 45vw, 100vw"
          className="object-cover brightness-[1.08] transition duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col justify-center p-7 md:p-10">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[32px] font-black leading-tight tracking-[-0.025em] md:text-[42px]">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{text}</p>

        <Link className="btn-primary mt-8 w-fit" href={href}>
          {cta}
        </Link>
      </div>
    </article>
  )
}

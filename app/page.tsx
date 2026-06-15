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

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings('home', 'en')
  const title = seo?.seoTitle || 'CLINIQ Maastricht — Club, Events & Workshops'
  const description =
    seo?.metaDescription ||
    'Going out in Maastricht? CLINIQ is open every Thursday, Friday and Saturday at Platielstraat 9A. Club nights, private events and cocktail workshops in the city centre.'
  const ogTitle = seo?.ogTitle || title
  const ogDescription = seo?.ogDescription || description
  const socialImages = seo?.socialImageUrl ? [{ url: seo.socialImageUrl }] : undefined

  return {
    title,
    description,
    alternates: { canonical: 'https://www.cliniqmaastricht.nl/en' },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: 'https://www.cliniqmaastricht.nl/en',
      siteName: 'CLINIQ Maastricht',
      locale: 'en_GB',
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

export default async function HomeEn() {
  const t = ui.en

  const [events, pageContent, homepagePhotos] = await Promise.all([
    getAgendaEvents(),
    getPageContent('home', 'en'),
    getSectionPhotoMedia('homepage', [
      images.crowd,
      images.redCrowd,
      images.party,
      images.club,
      images.contactInterior,
      images.hero,
    ]),
  ])

  const gallerySources = pageContent?.gallery?.length ? pageContent.gallery : homepagePhotos
  const photos = gallerySources.map((photo) => photo.url).filter(Boolean)
  const carouselPhotos = photos.length ? [...photos, ...photos] : []
  const heroPhoto = pageContent?.imageUrl || homepagePhotos[0]?.url || images.hero

  const heroTitle = pageContent?.heroTitleEn || pageContent?.heroTitleNl || 'Maastricht After Dark.'
  const heroSubtitle =
    pageContent?.heroSubtitleEn ||
    pageContent?.heroSubtitleNl ||
    'Nightlife, events and workshops on Platielstraat.'
  const primaryCta = pageContent?.primaryCtaEn || t.common.viewAgenda
  const secondaryCta = pageContent?.secondaryCtaEn || t.home.heroCta2
  const seoBody = pageContent?.bodyEn || pageContent?.bodyNl

  return (
    <>
      <HeroFrame className="hero-clean">
        <SafeImage
          src={heroPhoto}
          fallbackSrc={images.fallbackHero}
          alt="CLINIQ Maastricht nightclub on Platielstraat"
          fill
          priority
          sizes="100vw"
          className="hero-media -z-10 object-cover brightness-[1.08] contrast-[1.04]"
        />

        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.20),rgba(0,0,0,.54)),linear-gradient(0deg,rgba(8,6,7,.92),transparent_46%)]" />

        <div className="container-premium flex min-h-[calc(100vh-7rem)] items-end pb-20">
          <div className="max-w-4xl">
            <p className="eyebrow mb-4">Platielstraat 9A</p>
            <h1 className="hero-clean-title">{heroTitle}</h1>
            <p className="hero-clean-subline">{heroSubtitle}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link data-track="cta_click" className="btn-primary" href="/en/nightlife">
                {primaryCta}
              </Link>

              <Link data-track="cta_click" className="btn-secondary" href="/en/photos">
                {secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </HeroFrame>

      <section className="event-section py-24">
        <div className="container-premium">
          <SectionIntro
            eyebrow="Agenda"
            title={t.home.eventsTitle}
            text="The next nights at CLINIQ."
            ctaHref="/en/nightlife"
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
                alt="Club night at CLINIQ Maastricht"
                fill
                sizes="100vw"
                className="-z-10 object-cover brightness-[1.08]"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <h3 className="h2 absolute bottom-8 left-8 right-8">New events coming soon.</h3>
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden pb-24">
        <div className="container-premium">
          <SectionIntro eyebrow="Photos" title="Photos" text="Recent nights at CLINIQ." />
        </div>

        <div className="relative mt-10 overflow-hidden">
          <div className="flex w-max animate-[photoMarquee_42s_linear_infinite] gap-5 px-6 hover:[animation-play-state:paused]">
            {carouselPhotos.map((src, index) => (
              <Link
                key={`${src}-${index}`}
                href="/en/photos"
                className="image-frame group relative h-[420px] w-[320px] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] sm:w-[420px] lg:w-[500px]"
              >
                <SafeImage
                  src={src}
                  fallbackSrc={images.fallbackWide}
                  alt={`CLINIQ Maastricht atmosphere photo ${index + 1}`}
                  fill
                  sizes="(min-width:1024px) 500px, 80vw"
                  className="object-cover brightness-[1.08] contrast-[1.03] transition duration-700 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#080607] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#080607] to-transparent" />
        </div>

        <div className="container-premium mt-8 flex justify-center">
          <Link href="/en/photos" className="btn-primary">
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

      <section className="container-premium space-y-8 pb-24">
        <ServiceRow
          href="/en/cocktail-workshop"
          image={images.workshopBar}
          eyebrow="Workshop"
          title="Cocktail workshop"
          text={
            <>
              Make cocktails with your group, guided by our bartenders. Perfect for bachelorette parties, company
              outings, birthdays and groups of friends. Discover our{' '}
              <Link href="/en/cocktail-workshop" className="text-gold hover:text-white">
                cocktail workshops
              </Link>
              .
            </>
          }
          cta="View cocktail workshop"
        />

        <ServiceRow
          href="/en/event-space"
          image={images.redRoom}
          eyebrow="Events"
          title="Private event space"
          text={
            <>
              CLINIQ is available for drinks, company parties, birthdays, bachelorette nights and private events. Learn
              more about{' '}
              <Link href="/en/event-space" className="text-gold hover:text-white">
                hiring the venue
              </Link>
              .
            </>
          }
          cta="View possibilities"
          reverse
        />
      </section>

      <section className="container-premium pb-24">
        <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Maastricht</p>
            <h2 className="h2 mt-4">Nightlife and events in Maastricht</h2>
          </div>

          <div className="prose-premium">
            {seoBody ? (
              <p>{seoBody}</p>
            ) : (
              <>
                <p>
                  CLINIQ is located on Platielstraat, right in the centre of Maastricht. You will find club nights, group
                  activities, cocktail workshops and options to hire the venue for a private night.
                </p>
                <p>
                  For anyone looking for nightlife in Maastricht, a night out with friends, a bachelorette party, a
                  cocktail workshop or a private event venue, CLINIQ is a central spot in the city.
                </p>
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
          alt={title}
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { faqSchema } from '@/lib/seo'
import { images, site } from '@/lib/site'
import { getAgendaEvents, getPageContent, getPhotoAlbums, getSectionPhotoMedia, getSeoSettings } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import JsonLd from '@/components/ui/JsonLd'
import { nightlifeFaqsNl as fallbackFaqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings('nightlife', 'nl')
  const title = seo?.seoTitle || 'Uitgaan Maastricht | Club Cliniq — Donderdag, Vrijdag & Zaterdag'
  const description =
    seo?.metaDescription ||
    'Cliniq Maastricht is hét adres voor een avondje stappen. Donderdag 18+, vrijdag en zaterdag 21+, open vanaf 22:00 aan de Platielstraat 9A in het centrum van Maastricht.'
  const ogTitle = seo?.ogTitle || title
  const ogDescription = seo?.ogDescription || description
  const socialImages = seo?.socialImageUrl ? [{ url: seo.socialImageUrl }] : undefined

  return {
    title,
    description,
    alternates: { canonical: 'https://www.cliniqmaastricht.nl/uitgaan' },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: 'https://www.cliniqmaastricht.nl/uitgaan',
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

type PracticalCard = {
  titleNl?: string
  textNl?: string
}

type ExtendedPageContent = Awaited<ReturnType<typeof getPageContent>> & {
  bodyEyebrowNl?: string
  bodyTitleNl?: string
  practicalCards?: PracticalCard[]
  extraEyebrowNl?: string
  extraTitleNl?: string
  extraIntroNl?: string
  extraBodyNl?: string
}

const fallbackPracticalCards: PracticalCard[] = [
  {
    titleNl: 'Openingstijden',
    textNl: 'CLINIQ is normaal geopend op donderdag, vrijdag en zaterdag. Controleer per event de actuele tijden.',
  },
  {
    titleNl: 'Minimumleeftijd',
    textNl: 'De leeftijd kan per avond verschillen. Neem altijd een geldig ID mee.',
  },
  {
    titleNl: 'Deurbeleid',
    textNl: 'We letten op sfeer, veiligheid en respect. Kom op tijd en verzorgd.',
  },
  {
    titleNl: 'Locatie',
    textNl: 'Platielstraat 9A, op loopafstand van Vrijthof, Markt en uitgaansstraten.',
  },
  {
    titleNl: 'Groepen',
    textNl: 'Kom je met een groep of plan je een speciale avond? Neem vooraf contact op.',
  },
]

export default async function NightlifePage() {
  const [events, albums, rawPageContent, sectionPhotos] = await Promise.all([
    getAgendaEvents(),
    getPhotoAlbums(),
    getPageContent('nightlife', 'nl'),
    getSectionPhotoMedia('uitgaan', [
      images.redCrowd,
      images.club,
      images.party,
      images.hero,
      images.contactInterior,
      images.bar,
    ]),
  ])

  const pageContent = rawPageContent as ExtendedPageContent

  const photos = (pageContent?.gallery?.length ? pageContent.gallery : sectionPhotos)
    .map((photo) => photo.url)
    .filter(Boolean)

  const carouselPhotos = photos.length ? [...photos, ...photos] : []
  const heroImage = pageContent?.imageUrl || images.redCrowd

  const heroTitle = pageContent?.heroTitleNl || 'Uitgaan in Maastricht.'
  const heroSubtitle =
    pageContent?.heroSubtitleNl ||
    'Donderdag 18+, vrijdag en zaterdag 21+. Open vanaf 22:00 aan de Platielstraat 9A, midden in het centrum.'

  const primaryCta = pageContent?.primaryCtaNl || 'Bekijk agenda'
  const secondaryCta = pageContent?.secondaryCtaNl || 'Bekijk foto’s'

  const bodyEyebrow = pageContent?.bodyEyebrowNl || 'Maastricht'
  const bodyTitle = pageContent?.bodyTitleNl || 'Uitgaan in Maastricht'
  const seoBody = pageContent?.bodyNl

  const practicalCards =
    pageContent?.practicalCards?.length ? pageContent.practicalCards : fallbackPracticalCards

  const extraEyebrow = pageContent?.extraEyebrowNl || 'Maastricht nightlife'
  const extraTitle = pageContent?.extraTitleNl || 'Voor groepen, vrienden en late plannen'
  const extraIntro =
    pageContent?.extraIntroNl ||
    'CLINIQ zit precies waar je wilt zijn als je avond in Maastricht niet bij één drankje hoeft te blijven.'
  const extraBody = pageContent?.extraBodyNl

  const pageFaqs = pageContent?.faqs?.length
    ? pageContent.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
    : fallbackFaqs

  const eventSchemas = events.map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${event.titleNl || event.title} bij Cliniq Maastricht`,
    startDate: `${event.date}T${event.startTime || '22:00'}:00+01:00`,
    location: {
      '@type': 'Place',
      name: 'Cliniq Maastricht',
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        postalCode: site.address.postalCode,
        addressCountry: 'NL',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Cliniq Maastricht',
      url: 'https://www.cliniqmaastricht.nl',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: event.imageUrl ? [event.imageUrl] : undefined,
  }))

  return (
    <>
      <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36">
        <SafeImage
          src={heroImage}
          fallbackSrc={images.fallbackHero}
          alt="Uitgaan bij CLINIQ Maastricht"
          fill
          priority
          sizes="100vw"
          className="hero-media -z-10 object-cover brightness-[1.08]"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/25" />

        <div className="container-premium py-24">
          <p className="eyebrow mb-4">Cliniq — Platielstraat 9A</p>
          <h1 className="h1 max-w-5xl">{heroTitle}</h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">{heroSubtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#agenda" className="btn-primary">
              {primaryCta}
            </Link>

            <Link href="/fotos" className="btn-secondary">
              {secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section id="agenda" className="event-section py-24">
        <div className="container-premium">
          <SectionIntro eyebrow="Agenda" title="Deze week bij CLINIQ" text="Eerstvolgende avonden aan de Platielstraat." />

          {events.length ? (
            <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">
              Nieuwe events worden binnenkort toegevoegd.
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden pb-24">
        <div className="container-premium">
          <SectionIntro eyebrow="Sfeer" title="Een indruk van CLINIQ" text="Foto’s van recente avonden en events." />
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
                  alt={`Uitgaan Maastricht sfeerbeeld ${index + 1}`}
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
          <Link href="/fotos" className="btn-primary">
            Bekijk alle foto’s
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

      <section className="container-premium pb-24">
        <div className="mb-8">
          <p className="eyebrow">Fotoalbums</p>
          <h2 className="h2 mt-3">Recente avonden</h2>
        </div>

        <AlbumGrid albums={albums.slice(0, 3)} />
      </section>

      <section className="container-premium pb-24">
        <p className="eyebrow">Praktisch</p>
        <h2 className="h2 mt-4">Goed om te weten</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {practicalCards.map((card, index) => (
            <Practical
              key={`${card.titleNl || 'card'}-${index}`}
              title={card.titleNl || 'Praktisch'}
              text={card.textNl || ''}
            />
          ))}
        </div>
      </section>

      <section className="container-premium pb-24">
        <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">{bodyEyebrow}</p>
            <h2 className="h2 mt-4">{bodyTitle}</h2>
          </div>

          <div className="prose-premium">
            {seoBody ? (
              <TextBlock text={seoBody} />
            ) : (
              <>
                <p>
                  Cliniq Maastricht is hét adres voor een avondje stappen in het centrum. Drie avonden per week open —
                  donderdag, vrijdag en zaterdag — aan de Platielstraat 9A.
                </p>
                <p>
                  Kom op tijd, neem altijd een geldig legitimatiebewijs mee en controleer per event de minimumleeftijd,
                  openingstijden en eventuele ticketinformatie.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container-premium pb-24">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="eyebrow">{extraEyebrow}</p>
            <h2 className="h2 mt-4">{extraTitle}</h2>
            <p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">{extraIntro}</p>
          </div>

          <div className="space-y-5 text-lg leading-[1.7] text-white/72">
            {extraBody ? (
              <TextBlock text={extraBody} />
            ) : (
              <>
                <p>
                  Wie zoekt naar uitgaan in Maastricht, club Maastricht, nachtleven Maastricht of stappen met vrienden,
                  zoekt vooral een duidelijke agenda, een goede sfeer en een centrale locatie.
                </p>
                <p>
                  De locatie aan de Platielstraat maakt CLINIQ handig voor groepen die eerst ergens eten, borrelen of
                  verzamelen en daarna willen doorpakken.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container-premium pb-24">
        <p className="eyebrow">FAQ</p>
        <h2 className="h2 mt-4">Veelgestelde vragen</h2>

        <div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">
          {pageFaqs.map((f) => (
            <details key={f.question} className="luxury-panel rounded-2xl p-5">
              <summary className="cursor-pointer">
                <h3 className="inline font-black">{f.question}</h3>
              </summary>
              <p className="mt-3 text-white/70">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd data={faqSchema(pageFaqs)} />
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': eventSchemas }} />
    </>
  )
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="reveal-up">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h2 mt-3">{title}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">{text}</p>
    </div>
  )
}

function Practical({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
      <h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3>
      <p className="mt-3 text-white/66">{text}</p>
    </article>
  )
}

function TextBlock({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
    </>
  )
}

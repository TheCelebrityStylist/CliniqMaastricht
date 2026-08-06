import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { breadcrumbSchema, faqSchema } from '@/lib/seo'
import { images, site } from '@/lib/site'
import { getAgendaEvents, getPageContent, getPhotoAlbums, getSectionPhotoMedia, getSeoSettings } from '@/lib/admin/public'
import { EventCard } from '@/components/ui/EventCard'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import JsonLd from '@/components/ui/JsonLd'
import ChoreographedContent from '@/components/ui/ChoreographedContent'
import PhotoPile from '@/components/experience/PhotoPile'
import { getPilePhotos } from '@/lib/photoPile'
import { weekendAnswerNl, sortFeaturedFirst } from '@/lib/eventCopy'
import { nightlifeFaqsNl as fallbackFaqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'

import AtmosphereFX from '@/components/interactive/AtmosphereFXLoader'
import MagneticCTAs from '@/components/interactive/MagneticCTAsLoader'

const GalleryLightbox = dynamic(() => import('@/components/interactive/GalleryLightbox'))
const LightboxImageLink = dynamic(() => import('@/components/interactive/GalleryLightbox').then((mod) => ({ default: mod.LightboxImageLink })))
const LocationBlock = dynamic(() => import('@/components/interactive/LocationBlock'))

export const revalidate = 60

// CTR-first rewrite for /uitgaan — position ~10.6, 0.78% CTR vs 0.93% sitewide.
// Query cluster: "uitgaan maastricht", "club maastricht", "clubs maastricht", "nachtclub maastricht", "stappen maastricht".
//
// Title variants tested:
// A (shipped) — question hook + brand + concrete offer, matches task-specified pattern:
//   "Uitgaan in Maastricht? Dit is Cliniq — Club & Cocktails aan de Platielstraat"
// B — benefit-led, DJ's + late hours as the hook:
//   "Uitgaan Maastricht: Cliniq Club — DJ's, Cocktails & Dansen tot 03:00"
// C — freshness/urgency hook for "this week" searchers:
//   "Uitgaan in Maastricht Vanavond? Cliniq Club — Bekijk de Agenda"
//
// Description variants tested:
// A (shipped) — repeats query, concrete hooks (DJ's, cocktails, Platielstraat, hours), CTA:
//   "Uitgaan in Maastricht? Cliniq is open do, vr & za tot 03:00 aan de Platielstraat 9A. DJ's, cocktails en een dansvloer die niet leegloopt. Check nu de agenda van deze week."
// B — social proof / crowd-led:
//   "Cliniq Maastricht: club aan de Platielstraat met wisselende DJ's, cocktails en een gemengd publiek van studenten en locals. Open do, vr & za tot 03:00. Bekijk wie er draait."
// C — practical/decision-led:
//   "Club zoeken in Maastricht? Cliniq zit centraal aan de Platielstraat 9A, open do, vr & za tot 03:00. DJ's, cocktailbar en dansvloer. Bekijk de actuele agenda."
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings('nightlife', 'nl')
  const title = seo?.seoTitle || 'Uitgaan in Maastricht? Dit is Cliniq — Club & Cocktails aan de Platielstraat'
  const description =
    seo?.metaDescription ||
    'Uitgaan in Maastricht? Cliniq is open do, vr & za tot 03:00 aan de Platielstraat 9A. DJ\'s, cocktails en een dansvloer die niet leegloopt. Check nu de agenda van deze week.'
  const ogTitle = seo?.ogTitle || title
  const ogDescription = seo?.ogDescription || description
  const socialImages = seo?.socialImageUrl ? [{ url: seo.socialImageUrl }] : [{ url: images.redCrowd, width: 1200, height: 1500 }]

  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.cliniqmaastricht.nl/uitgaan',
      languages: { 'nl-NL': 'https://www.cliniqmaastricht.nl/uitgaan', en: 'https://www.cliniqmaastricht.nl/en/nightlife', 'x-default': 'https://www.cliniqmaastricht.nl/uitgaan' },
    },
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
      images: seo?.socialImageUrl ? [seo.socialImageUrl] : [images.redCrowd],
    },
  }
}

type PracticalCard = {
  titleNl?: string
  textNl?: string
}

type FaqItem = {
  question: string
  answer: string
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
    textNl: 'Donderdag is vaak 18+. Vrijdag en zaterdag zijn vaak 21+. De leeftijd kan per avond verschillen.',
  },
  {
    titleNl: 'Deurbeleid',
    textNl: 'We letten op sfeer, veiligheid en respect. Kom op tijd, verzorgd en neem altijd een geldig ID mee.',
  },
  {
    titleNl: 'Locatie',
    textNl: 'Platielstraat 9A, midden in het centrum van Maastricht, vlak bij het Vrijthof en de Markt.',
  },
  {
    titleNl: 'Groepen',
    textNl: 'Kom je met een groep of wil je een avond combineren met een borrel, workshop of private event? Neem vooraf contact op.',
  },
]

const seoFaqs: FaqItem[] = [
  {
    question: 'Waar kun je goed uitgaan in Maastricht?',
    answer:
      'Voor wie zoekt naar uitgaan in Maastricht is CLINIQ een centrale club aan de Platielstraat 9A, vlak bij het Vrijthof en de Markt. Je vindt er clubnachten, DJ-avonden, studentenavonden en events op donderdag, vrijdag en zaterdag.',
  },
  {
    question: 'Is CLINIQ een club in Maastricht?',
    answer:
      'Ja. CLINIQ is een club in het centrum van Maastricht en organiseert wekelijks clubnachten, DJ-events en speciale avonden voor studenten, locals, groepen en bezoekers van de stad.',
  },
  {
    question: 'Wat zijn populaire clubs in Maastricht?',
    answer:
      'Maastricht heeft verschillende bars en clubs in het centrum. CLINIQ onderscheidt zich door de ligging aan de Platielstraat, de combinatie van clubnachten en events, en de mogelijkheid om avonden te combineren met cocktail workshops of besloten feesten.',
  },
  {
    question: 'Wanneer is CLINIQ Maastricht open?',
    answer:
      'CLINIQ is normaal geopend op donderdag, vrijdag en zaterdag. De tijden en leeftijdsindicatie kunnen per event verschillen, dus controleer altijd de actuele agenda.',
  },
  {
    question: 'Waar ligt CLINIQ Maastricht?',
    answer:
      'CLINIQ ligt aan de Platielstraat 9A in het centrum van Maastricht, op loopafstand van het Vrijthof, de Markt, restaurants, hotels en andere uitgaansplekken.',
  },
  {
    question: 'Kun je met een groep naar CLINIQ?',
    answer:
      'Ja. Groepen kunnen langskomen tijdens reguliere clubnachten of vooraf contact opnemen voor verjaardagen, vrijgezellenfeesten, bedrijfsborrels, cocktail workshops en besloten feesten.',
  },
]

const nightlifeOptions = [
  {
    title: 'Donderdag uitgaan',
    text: 'Donderdag is ideaal voor studenten, vriendengroepen en iedereen die de week vroeg wil starten. Check de agenda voor leeftijd, tijden en het actuele concept.',
  },
  {
    title: 'Vrijdag clubavond',
    text: 'Vrijdag draait om weekendenergie: DJ’s, dansvloer en een centrale plek om na eten of borrelen door te gaan in Maastricht.',
  },
  {
    title: 'Zaterdag nachtleven',
    text: 'Zaterdag is de klassieke stapavond voor locals, studenten, bezoekers uit Limburg en groepen die een complete avond uit zoeken.',
  },
]

export default async function NightlifePage() {
  const [rawEvents, albums, rawPageContent, sectionPhotos] = await Promise.all([
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
  const events = sortFeaturedFirst(rawEvents)

  const pageContent = rawPageContent as ExtendedPageContent
  const photos = (pageContent?.gallery?.length ? pageContent.gallery : sectionPhotos)
    .map((photo) => photo.url)
    .filter(Boolean)
  const carouselPhotos = photos.length ? [...photos, ...photos] : []
  const pilePhotos = getPilePhotos('nl')
  const heroImage = pageContent?.imageUrl || images.redCrowd
  const heroTitle = pageContent?.heroTitleNl || 'Uitgaan in Maastricht.'
  const heroSubtitle =
    pageContent?.heroSubtitleNl ||
    'Clubnachten, DJ’s, events en late avonden aan de Platielstraat 9A. Donderdag, vrijdag en zaterdag open in het centrum van Maastricht.'
  const primaryCta = pageContent?.primaryCtaNl || 'Bekijk agenda'
  const secondaryCta = pageContent?.secondaryCtaNl || 'Bekijk foto’s'
  const bodyEyebrow = pageContent?.bodyEyebrowNl || 'Uitgaan Maastricht'
  const bodyTitle = pageContent?.bodyTitleNl || 'Club, nachtleven en stappen in Maastricht'
  const seoBody = pageContent?.bodyNl
  const practicalCards = pageContent?.practicalCards?.length ? pageContent.practicalCards : fallbackPracticalCards
  const extraEyebrow = pageContent?.extraEyebrowNl || 'Stappen in Maastricht'
  const extraTitle = pageContent?.extraTitleNl || 'Voor vrienden, groepen en spontane avonden uit'
  const extraIntro =
    pageContent?.extraIntroNl ||
    'CLINIQ ligt precies waar je wilt zijn als je avond in Maastricht niet bij één drankje hoeft te blijven.'
  const extraBody = pageContent?.extraBodyNl
  const pageFaqs = pageContent?.faqs?.length
    ? pageContent.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
    : fallbackFaqs
  const allFaqs = [...pageFaqs]
  seoFaqs.forEach((faq) => {
    if (!allFaqs.some((item) => item.question.toLowerCase() === faq.question.toLowerCase())) allFaqs.push(faq)
  })

  // GEO answer block: "wat is er dit weekend te doen in Maastricht" - the one freshness-driven
  // block that references the actual upcoming events, not a static claim. NEW copy (generated,
  // listed for approval). Rendered as its own standalone section (like the matching blocks on
  // /nachtclub-maastricht and /cocktail-workshop) and mirrored into the FAQPage schema.
  const weekendGeo = { question: 'Wat is er dit weekend te doen in Maastricht?', answer: weekendAnswerNl(events) }

  const eventSchemas = events.map((event) => ({
    '@type': 'Event',
    '@id': `https://www.cliniqmaastricht.nl/uitgaan/${event.slug?.current || event._id}#event`,
    name: `${event.titleNl || event.title} bij Cliniq Maastricht`,
    startDate: `${event.date}T${event.startTime || '22:00'}:00+01:00`,
    endDate: `${event.date}T${event.endTime || '03:00'}:00+01:00`,
    description: event.shortDescriptionNl || event.shortDescription || `${event.titleNl || event.title} bij Cliniq Maastricht, Platielstraat 9A.`,
    url: `https://www.cliniqmaastricht.nl/uitgaan/${event.slug?.current || event._id}`,
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
    organizer: { '@type': 'Organization', name: 'Cliniq Maastricht', url: 'https://www.cliniqmaastricht.nl' },
    performer: { '@type': 'PerformingGroup', name: event.titleNl || event.title },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: event.imageUrl ? [event.imageUrl] : undefined,
    offers: event.ticketUrl
      ? { '@type': 'Offer', url: event.ticketUrl, availability: 'https://schema.org/InStock', priceCurrency: 'EUR' }
      : undefined,
  }))

  return (
    <>
      <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36">
        <SafeImage src={heroImage} fallbackSrc={images.fallbackHero} alt="CLINIQ Maastricht nachtclub aan de Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/25" />
        <AtmosphereFX />
        <MagneticCTAs />
        <div className="container-premium py-24">
          <p className="eyebrow mb-4">Club Maastricht — Platielstraat 9A</p>
          <h1 className="h1 max-w-5xl">{heroTitle}</h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">{heroSubtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#agenda" className="btn-primary">{primaryCta}</Link>
            <Link href="/fotos" className="btn-secondary">{secondaryCta}</Link>
          </div>
        </div>
      </section>

      <section id="agenda" className="event-section py-24">
        <div className="container-premium">
          <SectionIntro eyebrow="Agenda" title="Agenda: uitgaan bij CLINIQ Maastricht" text="Bekijk de eerstvolgende clubnachten, DJ-avonden en events aan de Platielstraat." />
          {events.length ? (
            <div className={`event-grid event-grid-${Math.min(events.length, 3)} mt-10`}>
              {events.map((event, index) => <EventCard key={event._id} event={event} priority={index === 0} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-white/10 p-8 text-white/70">Nieuwe events worden binnenkort toegevoegd.</div>
          )}
        </div>
      </section>

      <section className="container-premium section-y">
        <h2 className="h2">{weekendGeo.question}</h2>
        <p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{weekendGeo.answer}</p>
      </section>

      {pilePhotos.length ? (
        <section className="container-premium section-y">
          <p className="eyebrow">Laatste zaterdag</p>
          <h2 className="h2 mt-4">Sleep de foto's</h2>
          <div className="mt-8"><PhotoPile photos={pilePhotos} lang="nl" /></div>
        </section>
      ) : null}

      <section className="container-premium section-y">
        <div className="mb-8">
          <p className="eyebrow">Uitgaan Maastricht gids</p>
          <h2 className="h2 mt-3">Waar ga je uit in Maastricht?</h2>
          <p className="mt-4 max-w-4xl text-lg leading-[1.65] text-white/70 md:text-xl">
            Wie zoekt naar uitgaan Maastricht, club Maastricht, clubs Maastricht of stappen in Maastricht wil vooral weten waar de sfeer goed is, welke avond past en hoe centraal de locatie ligt. CLINIQ ligt aan de Platielstraat 9A, midden in de binnenstad, op loopafstand van het Vrijthof, de Markt en het Onze-Lieve-Vrouweplein.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {nightlifeOptions.map((item) => <InfoCard key={item.title} title={item.title} text={item.text} />)}
        </div>
      </section>

      <section className="overflow-hidden section-y">
        <div className="container-premium">
          <SectionIntro eyebrow="Sfeer" title="Zo voelt een avond uit bij CLINIQ" text="Een indruk van recente clubnachten, events en avonden in Maastricht." />
        </div>
        <GalleryLightbox images={photos.map((src, index) => ({ src, alt: `Sfeerbeeld clubavond CLINIQ Maastricht ${index + 1}` }))}>
          <div className="relative mt-10 overflow-hidden">
            <div className="flex w-max animate-[photoMarquee_42s_linear_infinite] gap-5 px-6 hover:[animation-play-state:paused]">
              {carouselPhotos.map((src, index) => (
                <LightboxImageLink key={`${src}-${index}`} href="/fotos" index={index % Math.max(photos.length, 1)} className="image-frame group relative h-[420px] w-[320px] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] sm:w-[420px] lg:w-[500px]">
                  <SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Sfeerbeeld clubavond CLINIQ Maastricht ${index + 1}`} fill sizes="(min-width:1024px) 500px, 80vw" className="object-cover brightness-[1.08] contrast-[1.03] transition duration-700 group-hover:scale-105" />
                </LightboxImageLink>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#12030a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#12030a] to-transparent" />
          </div>
        </GalleryLightbox>
        <div className="container-premium mt-8 flex justify-center"><Link href="/fotos" className="btn-primary">Bekijk alle foto’s</Link></div>
        <style>{`@keyframes photoMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </section>

      <section className="container-premium section-y">
        <div className="mb-8"><p className="eyebrow">Fotoalbums</p><h2 className="h2 mt-3">Recente avonden in de club</h2></div>
        <AlbumGrid albums={albums.slice(0, 3)} />
      </section>

      <section className="container-premium section-y">
        <p className="eyebrow">Praktisch</p>
        <h2 className="h2 mt-4">Goed om te weten voor je gaat stappen</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {practicalCards.map((card, index) => <Practical key={`${card.titleNl || 'card'}-${index}`} title={card.titleNl || 'Praktisch'} text={card.textNl || ''} />)}
        </div>
      </section>

      <section className="container-premium section-y">
        <p className="eyebrow">Route</p>
        <h2 className="h2 mt-4">Zo kom je bij CLINIQ</h2>
        <div className="mt-8 max-w-3xl"><LocationBlock /></div>
      </section>

      <section className="container-premium section-y">
        <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="eyebrow">{bodyEyebrow}</p><h2 className="h2 mt-4">{bodyTitle}</h2></div>
          <div className="prose-premium">
            {seoBody && seoBody.split(/\n\s*\n/).filter((p) => p.trim()).length > 1 ? (
              <ChoreographedContent
                headline={seoBody.split(/\n\s*\n/)[0]?.trim()}
                paragraphs={seoBody
                  .split(/\n\s*\n/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)}
                moreLabel="Lees meer"
              />
            ) : seoBody ? (
              <p>{seoBody}</p>
            ) : (
              <ChoreographedContent
                headline="CLINIQ ligt midden in het centrum van Maastricht, op loopafstand van het Vrijthof en de Markt."
                quote="Vrijdag en zaterdag draaien wisselende DJ's tot sluitingstijd."
                stats={[
                  { value: 'Do·Vr·Za', label: 'open in het centrum' },
                  { value: 'tot 03:00', label: 'sluitingstijd' },
                  { value: '18+ / 21+', label: 'leeftijd per avond' },
                  { value: '9A', label: 'Platielstraat, bij het Vrijthof' },
                ]}
                moreLabel="Lees meer"
                paragraphs={[
                  <>CLINIQ ligt midden in het centrum van Maastricht, op loopafstand van het Vrijthof en de Markt. Elke donderdag, vrijdag en zaterdag open. Donderdag is studentenavond. Vrijdag en zaterdag draaien wisselende DJ&apos;s tot sluitingstijd. Check altijd de agenda voor actuele tijden, leeftijdsindicatie en eventuele ticketinfo.</>,
                ]}
              />
            )}
          </div>
        </div>
      </section>

      <section className="container-premium section-y">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div><p className="eyebrow">{extraEyebrow}</p><h2 className="h2 mt-4">{extraTitle}</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">{extraIntro}</p></div>
          <div className="space-y-5 text-lg leading-[1.7] text-white/72">
            {extraBody && extraBody.split(/\n\s*\n/).filter((p) => p.trim()).length > 1 ? (
              <ChoreographedContent
                headline={extraBody.split(/\n\s*\n/)[0]?.trim()}
                paragraphs={extraBody
                  .split(/\n\s*\n/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)}
                moreLabel="Lees meer"
              />
            ) : extraBody ? (
              <p>{extraBody}</p>
            ) : (
              <ChoreographedContent
                headline="Een avond uit in Maastricht begint vaak in het centrum."
                moreLabel="Lees meer"
                paragraphs={[
                  <>Een avond uit in Maastricht begint vaak in het centrum. CLINIQ zit precies waar je wilt zijn — geen taxi nodig, geen gedoe. Geschikt voor spontane avonden, verjaardagen, vrijgezellenfeesten en groepen die later willen aansluiten. Wil je iets organiseren voor een grotere groep? Bekijk de mogelijkheden voor <Link href="/event-space" className="text-coral-text hover:text-white">ruimte huren in Maastricht</Link> of combineer je avond met een <Link href="/cocktail-workshop" className="text-coral-text hover:text-white">cocktail workshop Maastricht</Link>.</>,
                ]}
              />
            )}
          </div>
        </div>
      </section>

      <section className="container-premium section-y">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.75fr_1.25fr]">
          <div><p className="eyebrow">Waarom CLINIQ?</p><h2 className="h2 mt-4">Meer dan alleen een club in Maastricht</h2></div>
          <div className="prose-premium">
            <ChoreographedContent
              headline="CLINIQ is interessant voor bezoekers die zoeken naar het nachtleven van Maastricht, maar ook voor groepen die hun avond willen uitbreiden."
              quote="Je kunt starten met een diner of borrel in de binnenstad, doorgaan naar CLINIQ voor een clubnacht of vooraf een cocktail workshop boeken voor een verjaardag, vrijgezellenfeest of bedrijfsuitje."
              moreLabel="Lees meer"
              paragraphs={[
                <>CLINIQ is interessant voor bezoekers die zoeken naar het nachtleven van Maastricht, maar ook voor groepen die hun avond willen uitbreiden. Je kunt starten met een diner of borrel in de binnenstad, doorgaan naar CLINIQ voor een clubnacht of vooraf een cocktail workshop boeken voor een verjaardag, vrijgezellenfeest of bedrijfsuitje.</>,
                <>Door de centrale ligging aan de Platielstraat is CLINIQ makkelijk te combineren met hotels, restaurants, bars en parkeergarages in het centrum. Dat maakt de locatie praktisch voor studenten, locals, weekendbezoekers en groepen uit Limburg, België en de Euregio.</>,
                <>Bekijk ook onze pagina’s over <Link href="/cocktail-workshop" className="text-coral-text hover:text-white">cocktail workshops in Maastricht</Link>, <Link href="/event-space" className="text-coral-text hover:text-white">ruimte huren in Maastricht</Link> en <Link href="/fotos" className="text-coral-text hover:text-white">recente foto’s van CLINIQ</Link>.</>,
              ]}
            />
          </div>
        </div>
      </section>

      <section className="container-premium section-y">
        <p className="eyebrow">FAQ</p>
        <h2 className="h2 mt-4">Veelgestelde vragen over uitgaan in Maastricht</h2>
        <div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">
          {allFaqs.map((f) => <details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{f.question}</h3></summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}
        </div>
      </section>

      <JsonLd data={faqSchema([weekendGeo, ...allFaqs])} />
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': eventSchemas }} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.cliniqmaastricht.nl' },
        { name: 'Uitgaan Maastricht', url: 'https://www.cliniqmaastricht.nl/uitgaan' },
      ])} />
    </>
  )
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="reveal-up"><p className="eyebrow">{eyebrow}</p><h2 className="h2 mt-3">{title}</h2><p className="mt-4 max-w-3xl text-lg leading-[1.65] text-white/70 md:text-xl">{text}</p></div>
}

function Practical({ title, text }: { title: string; text: string }) {
  return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article>
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><h3 className="text-2xl font-black tracking-[-0.035em]">{title}</h3><p className="mt-4 text-white/66">{text}</p></article>
}

import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { breadcrumbSchema, eventVenueSchema, faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent, getSectionPhotoMedia, getSeoSettings } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import ChoreographedContent from '@/components/ui/ChoreographedContent'
import EventTypeCards from '@/components/ui/EventTypeCards'
import { eventSpaceFaqsNl as fallbackFaqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'

import AtmosphereFX from '@/components/interactive/AtmosphereFXLoader'
import MagneticCTAs from '@/components/interactive/MagneticCTAsLoader'

const GalleryLightbox = dynamic(() => import('@/components/interactive/GalleryLightbox'))
const LightboxImageButton = dynamic(() => import('@/components/interactive/GalleryLightbox').then((mod) => ({ default: mod.LightboxImageButton })))
const RoomAcrossNight = dynamic(() => import('@/components/experience/RoomAcrossNight'))

export const revalidate = 60

// Targets "eventlocatie maastricht" / "zakelijk evenement maastricht" — position ~11, CTR < 0.4%.
// Also the canonical target for the /business-event-space-maastricht redirect (still ranking on Google).
//
// Title variants tested:
// A (shipped) — capacity + centre-of-town hook:
//   "Eventlocatie Maastricht | Cliniq — Feestzaal Centrum, Tot 400 Personen"
// B — zakelijk-evenement angle:
//   "Zakelijk Evenement Maastricht | Cliniq — Eventlocatie Platielstraat"
// C — venue-hire angle, broadest match:
//   "Ruimte Huren Maastricht | Cliniq Eventlocatie — Bedrijfsfeest & Privéfeest"
//
// Description variants tested:
// A (shipped):
//   "Eventlocatie in het centrum van Maastricht. Cliniq aan de Platielstraat 9A biedt exclusieve zaalverhuur tot 400 personen — voor bedrijfsfeesten, borrels, privéfeesten en vrijgezellenavonden."
// B — zakelijk-evenement led:
//   "Zakelijk evenement organiseren in Maastricht? Cliniq is een eventlocatie in het centrum met bar, licht, geluid en dansvloer al aanwezig. Tot 400 personen, Platielstraat 9A."
// C — quote/quality hook:
//   "Feestlocatie of eventlocatie huren in Maastricht? Cliniq biedt exclusieve zaalverhuur tot 400 personen aan de Platielstraat, midden in het centrum. Vraag vrijblijvend een offerte aan."
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings('event-space', 'nl')

  const title = seo?.seoTitle || 'Eventlocatie Maastricht | Cliniq — Feestzaal Centrum, Tot 400 Personen'
  const description =
    seo?.metaDescription ||
    'Eventlocatie in het centrum van Maastricht. Cliniq aan de Platielstraat 9A biedt exclusieve zaalverhuur tot 400 personen — voor bedrijfsfeesten, borrels, privéfeesten en vrijgezellenavonden.'
  const ogTitle = seo?.ogTitle || title
  const ogDescription = seo?.ogDescription || description
  const socialImages = seo?.socialImageUrl ? [{ url: seo.socialImageUrl }] : [{ url: images.redRoom, width: 1200, height: 1500 }]

  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.cliniqmaastricht.nl/event-space',
      languages: { 'nl-NL': 'https://www.cliniqmaastricht.nl/event-space', en: 'https://www.cliniqmaastricht.nl/en/event-space', 'x-default': 'https://www.cliniqmaastricht.nl/event-space' },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: 'https://www.cliniqmaastricht.nl/event-space',
      siteName: 'Cliniq Maastricht',
      locale: 'nl_NL',
      type: 'website',
      images: socialImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: seo?.socialImageUrl ? [seo.socialImageUrl] : [images.redRoom],
    },
  }
}

type EditableCard = {
  titleNl?: string
  titleEn?: string
  textNl?: string
  textEn?: string
}

// GEO answer block: standalone factual paragraph for "eventlocatie maastricht centrum" —
// mirrored in the FAQPage schema. New copy, not an edit of any existing sentence.
const geoAnswer = {
  question: 'Wat is een goede eventlocatie in het centrum van Maastricht?',
  answer:
    'Cliniq aan de Platielstraat 9A is een eventlocatie in het centrum van Maastricht, op loopafstand van het Vrijthof en de Markt. De ruimte is exclusief te huren op donderdag, vrijdag en zaterdag voor tot 400 gasten, met bar, licht, geluid en dansvloer al aanwezig — geschikt voor bedrijfsfeesten, borrels en privéfeesten.',
}

type ExtendedPageContent = Awaited<ReturnType<typeof getPageContent>> & {
  eventTypeEyebrowNl?: string
  eventTypeTitleNl?: string
  eventTypeCards?: EditableCard[]

  facilityEyebrowNl?: string
  facilityTitleNl?: string
  facilityIntroNl?: string
  facilityCards?: EditableCard[]

  bodyEyebrowNl?: string
  bodyTitleNl?: string

  galleryEyebrowNl?: string
  galleryTitleNl?: string

  requestEyebrowNl?: string
  requestTitleNl?: string
  requestIntroNl?: string
}

const fallbackEventTypes: EditableCard[] = [
  {
    titleNl: 'Bedrijfsfeest',
    textNl: 'Bedrijfsborrel of personeelsfeest? Cliniq heeft de ruimte, de bar en het geluid. Jij regelt de gasten.',
  },
  {
    titleNl: 'Privéfeest',
    textNl: 'Van kleine verjaardagsfeestjes tot grote jubileumvieringen. Cliniq is exclusief voor jou en je gasten.',
  },
  {
    titleNl: 'Vrijgezellenfeest',
    textNl: 'Cocktail workshop als opener, daarna de club in. Cliniq is een van de populairste locaties voor vrijgezellenavonden in Maastricht.',
  },
  {
    titleNl: 'Borrel',
    textNl: 'Voor groepen die informeel willen samenkomen met bar en muziek dichtbij.',
  },
  {
    titleNl: 'Private party',
    textNl: 'Een eigen avond met deurbeleid, bar en invulling op maat.',
  },
  {
    titleNl: 'Studentenfeest',
    textNl: 'Geschikt voor grotere groepen met muziek, licht en duidelijke afspraken.',
  },
  {
    titleNl: 'Productlancering',
    textNl: 'Presenteer je merk of product in een setting die mensen bijblijft. Podium, scherm, bar en licht aanwezig.',
  },
  {
    titleNl: 'Gala / besloten avond',
    textNl: 'Voor een nettere avond met ontvangst, bar en clubgevoel later op de avond.',
  },
]

const EVENT_TYPE_PHOTOS = [images.redRoom, images.party, images.workshopBar, images.club, images.crowd, images.bar, images.contactInterior, images.redCrowd]

const fallbackFacilities: EditableCard[] = [
  {
    titleNl: 'Bar',
    textNl: 'Een vaste baropstelling met team en drankmogelijkheden.',
  },
  {
    titleNl: 'Licht en geluid',
    textNl: 'De basis voor muziek, speeches en dansen is aanwezig.',
  },
  {
    titleNl: 'DJ mogelijkheden',
    textNl: 'We denken mee over DJ, muziekstijl en timing van de avond.',
  },
  {
    titleNl: 'Dansvloer',
    textNl: 'De ruimte voelt direct als een avond uit, niet als een lege zaal.',
  },
  {
    titleNl: 'Cocktailmogelijkheden',
    textNl: 'Cocktails, welkomstdrankjes of drankafspraken zijn mogelijk.',
  },
  {
    titleNl: 'Centrale locatie',
    textNl: 'Platielstraat 9A, midden in het centrum van Maastricht.',
  },
  {
    titleNl: 'Hospitality team',
    textNl: 'Een team dat gewend is aan drukke avonden en groepen.',
  },
  {
    titleNl: 'Garderobe / lockers',
    textNl: 'Lockers en garderobe-afspraken kunnen per event worden afgestemd.',
  },
]

export default async function EventSpacePage() {
  const [rawContent, driveGallery] = await Promise.all([
    getPageContent('event-space', 'nl'),
    getSectionPhotoMedia('event-space', imageSets.eventSpace),
  ])

  const content = rawContent as ExtendedPageContent

  const pageFaqs = content?.faqs?.length
    ? content.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
    : fallbackFaqs

  const gallerySource = content?.gallery?.length ? content.gallery : driveGallery
  const gallery = gallerySource.map((photo) => ({
    url: photo.url,
    alt: photo.altNl || 'Feestlocatie CLINIQ Maastricht',
  }))

  const heroImage = content?.imageUrl || images.redRoom
  const heroTitle = content?.heroTitleNl || 'Feestzaal & Eventlocatie Maastricht'
  const heroSubtitle =
    content?.heroSubtitleNl ||
    'Exclusief te huren voor feesten, bedrijfsevents en private parties. Tot 400 personen.'
  const primaryCta = content?.primaryCtaNl || 'Vrijblijvende aanvraag'

  const eventTypeEyebrow = content?.eventTypeEyebrowNl || 'Event types'
  const eventTypeTitle = content?.eventTypeTitleNl || 'Waarvoor kun je CLINIQ huren?'
  const eventTypeCards = content?.eventTypeCards?.length ? content.eventTypeCards : fallbackEventTypes

  const facilityEyebrow = content?.facilityEyebrowNl || 'Faciliteiten'
  const facilityTitle = content?.facilityTitleNl || 'Wat is er aanwezig?'
  const facilityIntro =
    content?.facilityIntroNl ||
    'CLINIQ heeft de basis voor een complete avond al in huis: bar, licht, geluid, dansvloer en een team dat gewend is aan drukke avonden.'
  const facilityCards = content?.facilityCards?.length ? content.facilityCards : fallbackFacilities

  const bodyEyebrow = content?.bodyEyebrowNl || 'Maastricht'
  const bodyTitle = content?.bodyTitleNl || 'Ruimte huren in Maastricht'
  const bodyText = content?.bodyNl

  const galleryEyebrow = content?.galleryEyebrowNl || 'Beeld'
  const galleryTitle = content?.galleryTitleNl || 'De ruimte'

  const requestEyebrow = content?.requestEyebrowNl || 'Aanvraag'
  const requestTitle = content?.requestTitleNl || 'Vrijblijvende aanvraag'
  const requestIntro =
    content?.requestIntroNl ||
    'Vertel ons je datum, groepsgrootte en type event. Dan denken we mee over beschikbaarheid, indeling en mogelijkheden.'

  return (
    <>
      <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36">
        <SafeImage
          src={heroImage}
          fallbackSrc={images.fallbackWide}
          alt="Feestzaal huren Maastricht — Cliniq evenementenlocatie"
          fill
          priority
          sizes="100vw"
          className="hero-media -z-10 object-cover brightness-[1.08]"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/62 to-plum/10" />
        <AtmosphereFX />
        <MagneticCTAs />

        <div className="container-premium py-24">
          <p className="eyebrow mb-4">Events</p>
          <h1 className="h1 max-w-5xl">{heroTitle}</h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">{heroSubtitle}</p>

          <a href="#aanvraag" className="btn-primary mt-8">
            {primaryCta}
          </a>
        </div>
      </section>

      <section className="container-premium section-y">
        <p className="eyebrow">{eventTypeEyebrow}</p>
        <h2 className="h2 mt-4">{eventTypeTitle}</h2>

        <div className="mt-8">
          <EventTypeCards
            cards={eventTypeCards.map((card, index) => ({
              title: card.titleNl || 'Event type',
              image: EVENT_TYPE_PHOTOS[index % EVENT_TYPE_PHOTOS.length],
              href: '#aanvraag',
              description: card.textNl,
            }))}
          />
        </div>
      </section>

      <section className="container-premium section-y">
        <div className="max-w-4xl">
          <p className="eyebrow">{facilityEyebrow}</p>
          <h2 className="h2 mt-4">{facilityTitle}</h2>
          <p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">{facilityIntro}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facilityCards.map((card, index) => (
            <InfoCard
              key={`${card.titleNl || 'facility'}-${index}`}
              title={card.titleNl || 'Faciliteit'}
              text={card.textNl || ''}
            />
          ))}
        </div>
      </section>

      <section className="container-premium section-y">
        <div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">{bodyEyebrow}</p>
            <h2 className="h2 mt-4">{bodyTitle}</h2>
          </div>

          <div className="prose-premium">
            {bodyText && bodyText.split(/\n\s*\n/).filter((p) => p.trim()).length > 1 ? (
              <ChoreographedContent
                headline={bodyText.split(/\n\s*\n/)[0]?.trim()}
                paragraphs={bodyText
                  .split(/\n\s*\n/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)}
                moreLabel="Lees meer"
              />
            ) : bodyText ? (
              <p>{bodyText}</p>
            ) : (
              <ChoreographedContent
                headline="Cliniq Maastricht is exclusief te huren op donderdag, vrijdag en zaterdag."
                quote="Cliniq is een van de meest geboekte evenementenlocaties in de regio voor verjaardagen, jubilea en bedrijfsfeesten."
                stats={[
                  { value: '400', label: 'gasten staand' },
                  { value: 'Do · Vr · Za', label: 'exclusief te huren' },
                  { value: 'Bar, licht,\ngeluid, vloer', label: 'volledig inclusief' },
                  { value: 'Catering', label: 'op aanvraag mogelijk' },
                ]}
                moreLabel="Lees de volledige mogelijkheden"
                paragraphs={[
                  <>
                    Cliniq Maastricht is exclusief te huren op donderdag, vrijdag en zaterdag. De ruimte biedt plek aan
                    tot 400 gasten staand, volledig inclusief bar, professioneel geluid, licht en dansvloer. Catering is
                    op aanvraag mogelijk.
                  </>,
                  <>
                    Feestlocatie huren in Maastricht voor een privéfeest? Cliniq is een van de meest geboekte
                    evenementenlocaties in de regio voor verjaardagen, jubilea en bedrijfsfeesten.
                  </>,
                  <>
                    Bedrijfsfeest of borrel organiseren in Maastricht? Cliniq leent zich uitstekend voor personeelsfeesten,
                    netwerkevenementen en productlanceringen.
                  </>,
                  <>
                    Na een besloten event kunnen gasten, afhankelijk van de planning, door naar het reguliere{' '}
                    <Link href="/uitgaan" className="text-coral-text hover:text-white">
                      nachtleven van CLINIQ Maastricht
                    </Link>
                    .
                  </>,
                  <>
                    Vrijgezellenavond plannen? Combineer een{' '}
                    <Link href="/cocktail-workshop" className="text-coral-text hover:text-white">
                      cocktail workshop
                    </Link>{' '}
                    met{' '}
                    <Link href="/uitgaan" className="text-coral-text hover:text-white">
                      uitgaan in Maastricht en een exclusieve clubavond
                    </Link>
                    .
                  </>,
                ]}
              />
            )}
          </div>
        </div>
      </section>

      <section className="container-premium section-y">
        <p className="eyebrow">{galleryEyebrow}</p>
        <h2 className="h2 mt-4">{galleryTitle}</h2>

        <GalleryLightbox images={gallery.slice(0, 5).map((item) => ({ src: item.url, alt: item.alt }))}>
          <div className="mt-8 grid auto-rows-[190px] gap-4 md:grid-cols-6 md:auto-rows-[230px]">
            {gallery.slice(0, 5).map((item, index) => (
              <LightboxImageButton
                key={`${item.url}-${index}`}
                index={index}
                label={item.alt}
                className={`photo-tile image-frame block w-full text-left ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'
                }`}
              >
                <SafeImage
                  src={item.url}
                  fallbackSrc={images.fallbackWide}
                  alt={item.alt}
                  fill
                  sizes="33vw"
                  className="object-cover brightness-[1.08]"
                />
              </LightboxImageButton>
            ))}
          </div>
        </GalleryLightbox>
      </section>

      <RoomAcrossNight ctaHref="#aanvraag" />

      <section className="container-premium section-y">
        <h2 className="h2">{geoAnswer.question}</h2>
        <p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{geoAnswer.answer}</p>
      </section>

      <section className="container-premium section-y">
        <p className="eyebrow">FAQ</p>
        <h2 className="h2 mt-4">Veelgestelde vragen</h2>

        <div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">
          {pageFaqs.map((faq) => (
            <details key={faq.question} className="luxury-panel rounded-2xl p-5">
              <summary className="cursor-pointer">
                <h3 className="inline font-black">{faq.question}</h3>
              </summary>
              <p className="mt-3 text-base leading-7 text-white/72 md:text-lg">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">{requestEyebrow}</p>
          <h2 className="h2 mt-4">{requestTitle}</h2>
          <p className="mt-6 text-lg leading-[1.65] text-white/72">{requestIntro}</p>
        </div>

        <InquiryForm
          type="event-space"
          fields={[
            { name: 'name', label: 'Naam', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'phone', label: 'Telefoon' },
            {
              name: 'eventType',
              label: 'Type event',
              options: [
                'Bedrijfsfeest',
                'Verjaardag',
                'Vrijgezellenfeest',
                'Gala',
                'Studentenfeest',
                'Private party',
                'Borrel',
                'Product launch',
              ],
            },
            { name: 'preferredDate', label: 'Gewenste datum', type: 'date' },
            { name: 'guests', label: 'Aantal gasten', type: 'number' },
            { name: 'message', label: 'Bericht', required: true },
          ]}
        />
      </section>

      <JsonLd data={faqSchema([geoAnswer, ...pageFaqs])} />
      <JsonLd data={eventVenueSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.cliniqmaastricht.nl' },
        { name: 'Ruimte Huren Maastricht', url: 'https://www.cliniqmaastricht.nl/event-space' },
      ])} />
    </>
  )
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
      <h3 className="text-2xl font-black tracking-[-0.035em]">{title}</h3>
      <p className="mt-3 text-white/66">{text}</p>
    </article>
  )
}

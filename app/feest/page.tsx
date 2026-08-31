import type { Metadata } from 'next'
import { AdLandingHeader, AdLandingFooter } from '@/components/landing/AdLandingChrome'
import InquiryForm from '@/components/forms/InquiryForm'
import StatStrip from '@/components/ui/StatStrip'
import SafeImage from '@/components/ui/SafeImage'
import JsonLd from '@/components/ui/JsonLd'
import { breadcrumbSchema, eventVenueSchema } from '@/lib/seo'
import { images, site } from '@/lib/site'
import { BOOKING_END_TIME_NOTE } from '@/lib/booking'
import PhotoStrip from '@/components/landing/PhotoStrip'
import { getPilePhotos } from '@/lib/photoPile'

// Ad-landing variant of /event-space: same form, same Thu/Fri/Sat rule, same backend - built for
// paid/social traffic (Instagram bio, ad click-throughs) where the whole page is the pitch for
// one click: fill the form. No nav, no long copy, one or two scrolls to the form on mobile.
//
// Indexable by default (evergreen, on-topic content - no reason to noindex a page that ranks for
// exactly what it's built to convert on) with its own canonical, per the brief's stated default.
// Flagged in the report for the owner to confirm rather than assumed silently.
export const metadata: Metadata = {
  title: 'Feest Organiseren in Maastricht | CLINIQ — Eventlocatie Huren, Tot 400 Gasten',
  description: 'Feest organiseren in Maastricht? CLINIQ aan de Platielstraat 9A is een eventlocatie te huren voor private party\'s, bedrijfsfeesten en verjaardagen. Bar, licht en geluid inbegrepen. Vraag direct aan.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/feest',
    languages: { 'nl-NL': 'https://www.cliniqmaastricht.nl/feest', en: 'https://www.cliniqmaastricht.nl/en/party', 'x-default': 'https://www.cliniqmaastricht.nl/feest' },
  },
  openGraph: {
    title: 'Feest Organiseren in Maastricht | CLINIQ',
    description: 'Eventlocatie huren aan de Platielstraat. Bar, licht en geluid inbegrepen, tot 400 gasten. Vraag direct aan.',
    url: 'https://www.cliniqmaastricht.nl/feest',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
    images: [{ url: images.redCrowd, width: 1200, height: 1500 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feest Organiseren in Maastricht | CLINIQ',
    description: 'Eventlocatie huren aan de Platielstraat. Bar, licht en geluid inbegrepen, tot 400 gasten.',
    images: [images.redCrowd],
  },
}

export default function FeestPage() {
  const pilePhotos = getPilePhotos('nl')
  return <div className="bg-ink text-white">
    <AdLandingHeader lang="nl" formAnchor="aanvraag" ctaLabel="Aanvragen" />

    <section className="relative flex min-h-[92vh] items-end overflow-hidden pt-24">
      <SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Volle dansvloer bij CLINIQ Maastricht" fill priority sizes="100vw" className="-z-10 object-cover brightness-[0.62] saturate-[0.85]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-plum/55 to-ink/30" />
      <div className="container-premium pb-16 pt-10">
        <p className="eyebrow mb-4">Feest bij CLINIQ</p>
        <h1 className="h1 max-w-3xl">Jouw avond. Onze club.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/80 md:text-xl">Eventlocatie huren aan de Platielstraat — bar, licht en geluid al inbegrepen. Vraag in twee minuten je datum aan.</p>
        <a href="#aanvraag" className="btn-primary mt-7">Start je aanvraag</a>

        <div className="mt-10 max-w-3xl">
          <StatStrip
            stats={[
              { value: '400', label: 'gasten capaciteit' },
              { value: 'Compleet', label: 'Bar, licht & geluid inbegrepen' },
              { value: 'Centrum', label: 'Platielstraat, hart van Maastricht' },
              { value: 'Zo–Wo', label: 'Beschikbaar voor jouw feest' },
            ]}
          />
        </div>
      </div>
    </section>

    <PhotoStrip photos={pilePhotos} />

    <section id="aanvraag" className="container-premium py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Aanvraag</p>
        <h2 className="h2 mt-3">Vrijblijvende aanvraag</h2>
        <p className="mt-4 text-white/70">Vertel ons je datum, groepsgrootte en type feest. We reageren snel met beschikbaarheid.</p>

        <div className="mt-8">
          <InquiryForm
            type="event-space"
            sourcePage="/feest"
            legend="Velden met * zijn verplicht."
            fields={[
              {
                name: 'eventType',
                label: 'Type event',
                required: true,
                options: ['Verjaardag', 'Ticketed event', 'Private party', 'Vrijgezellenfeest', 'Bedrijfsfeest', 'Anders'],
              },
              {
                name: 'preferredDate',
                label: 'Datum (optie 1)',
                type: 'booking-schedule',
                required: true,
                date2Name: 'preferredDate2',
                date2Label: 'Datum (optie 2, optioneel)',
                timeName: 'time',
                timeLabel: 'Gewenste tijd',
                timeHelper: BOOKING_END_TIME_NOTE.nl,
              },
              { name: 'name', label: 'Naam', required: true },
              { name: 'email', label: 'E-mail', type: 'email', required: true },
              { name: 'phone', label: 'Telefoon', type: 'tel', required: true },
              {
                name: 'music',
                label: 'Muziek',
                options: ['Ik regel mijn eigen DJ', 'CLINIQ regelt de muziek', 'Weet ik nog niet'],
              },
              {
                name: 'howHeard',
                label: 'Hoe hoorde je van ons?',
                options: ['Instagram', 'Google', 'Via vrienden', 'Was hier eerder', 'Anders'],
              },
              { name: 'message', label: 'Bericht', placeholder: 'Groepsgrootte en eventuele wensen.' },
            ]}
          />
        </div>
      </div>
    </section>

    <AdLandingFooter lang="nl" />

    <JsonLd data={eventVenueSchema()} />
    <JsonLd data={breadcrumbSchema([
      { name: 'Home', url: site.url },
      { name: 'Feest Organiseren Maastricht', url: `${site.url}/feest` },
    ])} />
  </div>
}

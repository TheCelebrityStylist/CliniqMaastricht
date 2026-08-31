import type { Metadata } from 'next'
import { AdLandingHeader, AdLandingFooter } from '@/components/landing/AdLandingChrome'
import InquiryForm from '@/components/forms/InquiryForm'
import StatStrip from '@/components/ui/StatStrip'
import SafeImage from '@/components/ui/SafeImage'
import JsonLd from '@/components/ui/JsonLd'
import { breadcrumbSchema, eventVenueSchema } from '@/lib/seo'
import { images, site } from '@/lib/site'
import { BOOKING_END_TIME_NOTE } from '@/lib/booking'

// English counterpart of /feest - see that file for the full rationale (ad-landing variant of
// /event-space, same form/rule/backend, indexable by default per the brief).
export const metadata: Metadata = {
  title: 'Organise a Private Party in Maastricht | CLINIQ — Hire an Event Location, Up to 400 Guests',
  description: 'Organising a party in Maastricht? CLINIQ on Platielstraat 9A is an event location to hire for private parties, corporate events and birthdays. Bar, lighting and sound included. Request a date now.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/en/party',
    languages: { 'nl-NL': 'https://www.cliniqmaastricht.nl/feest', en: 'https://www.cliniqmaastricht.nl/en/party', 'x-default': 'https://www.cliniqmaastricht.nl/feest' },
  },
  openGraph: {
    title: 'Organise a Private Party in Maastricht | CLINIQ',
    description: 'Hire an event location on Platielstraat. Bar, lighting and sound included, up to 400 guests. Request a date now.',
    url: 'https://www.cliniqmaastricht.nl/en/party',
    siteName: 'Cliniq Maastricht',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: images.redCrowd, width: 1200, height: 1500 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organise a Private Party in Maastricht | CLINIQ',
    description: 'Hire an event location on Platielstraat. Bar, lighting and sound included, up to 400 guests.',
    images: [images.redCrowd],
  },
}

export default function PartyPage() {
  return <div className="bg-ink text-white">
    <AdLandingHeader lang="en" formAnchor="inquiry" ctaLabel="Request" />

    <section className="relative flex min-h-[92vh] items-end overflow-hidden pt-24">
      <SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Packed dancefloor at CLINIQ Maastricht" fill priority sizes="100vw" className="-z-10 object-cover brightness-[0.62] saturate-[0.85]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-plum/55 to-ink/30" />
      <div className="container-premium pb-16 pt-10">
        <p className="eyebrow mb-4">Party at CLINIQ</p>
        <h1 className="h1 max-w-3xl">Your night. Our venue.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/80 md:text-xl">Hire an event location on Platielstraat — bar, lighting and sound already included. Request your date in two minutes.</p>
        <a href="#inquiry" className="btn-primary mt-7">Start your request</a>

        <div className="mt-10 max-w-3xl">
          <StatStrip
            stats={[
              { value: '400', label: 'guest capacity' },
              { value: 'All-in', label: 'Bar, lighting & sound included' },
              { value: 'Central', label: 'Platielstraat, heart of Maastricht' },
              { value: 'Sun–Wed', label: 'Available for your event' },
            ]}
          />
        </div>
      </div>
    </section>

    <section id="inquiry" className="container-premium py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Inquiry</p>
        <h2 className="h2 mt-3">Request proposal</h2>
        <p className="mt-4 text-white/70">Tell us your date, group size and type of event. We respond fast with availability.</p>

        <div className="mt-8">
          <InquiryForm
            type="event-space"
            sourcePage="/en/party"
            legend="Fields marked * are required."
            fields={[
              {
                name: 'eventType',
                label: 'Event type',
                required: true,
                options: ['Birthday', 'Ticketed event', 'Private party', 'Bachelorette party', 'Corporate event', 'Other'],
              },
              { name: 'preferredDate', label: 'Date (option 1)', type: 'booking-date', required: true },
              { name: 'preferredDate2', label: 'Date (option 2, optional)', type: 'booking-date' },
              { name: 'name', label: 'Name', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phone', label: 'Phone', type: 'tel', required: true },
              { name: 'time', label: 'Preferred time', placeholder: 'e.g. 20:00 – 01:00', helper: BOOKING_END_TIME_NOTE.en },
              {
                name: 'music',
                label: 'Music',
                options: ['I’ll bring my own DJ', 'CLINIQ provides the music', 'Still deciding'],
              },
              {
                name: 'howHeard',
                label: 'How did you hear about us?',
                options: ['Instagram', 'Google', 'Friends', 'Been here before', 'Other'],
              },
              { name: 'message', label: 'Message', placeholder: 'Group size and any wishes.' },
            ]}
          />
        </div>
      </div>
    </section>

    <AdLandingFooter lang="en" />

    <JsonLd data={eventVenueSchema()} />
    <JsonLd data={breadcrumbSchema([
      { name: 'Home', url: `${site.url}/en` },
      { name: 'Organise a Party in Maastricht', url: `${site.url}/en/party` },
    ])} />
  </div>
}

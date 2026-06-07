import type { Metadata } from 'next'
import LandingLayout from '@/components/landing/LandingLayout'
import { PHOTOS } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Bedrijfsfeest Maastricht | Cliniq — Personeelsfeest & Borrel tot 400 pers.',
  description: 'Bedrijfsfeest of personeelsborrel organiseren in Maastricht? Cliniq biedt exclusieve zaalverhuur voor teams tot 400 personen. Professionele AV, eigen bar, catering op aanvraag.',
}

const whatsapp = 'https://wa.me/31612530987?text=Hoi%2C%20ik%20wil%20een%20bedrijfsfeest%20plannen'

export default function BedrijfsfeestPage() {
  return <LandingLayout
    meta={metadata as { title: string; description: string }}
    hero={{
      photo: PHOTOS.venue3,
      eyebrow: 'Bedrijfsfeest Maastricht',
      h1: "Het feest dat je collega's nog maanden napraten.",
      sub: 'Exclusieve zaalverhuur voor teams tot 400 personen. Platielstraat 9A.',
      ctaLabel: 'Vrijblijvend aanvragen',
      ctaHref: '/event-space#aanvraag',
    }}
    features={[
      { title: 'Tot 400 personen', body: 'Staand, zittend of gemengd. Flexibele opstelling op aanvraag.' },
      { title: 'Professioneel geluid & licht', body: 'Club-grade installatie. Geen gehuurde boxen.' },
      { title: 'Volledige bar', body: 'Eigen barpersoneel. Drankpakket op maat te regelen.' },
      { title: 'Catering op aanvraag', body: 'Van borrelhapjes tot buffet. We regelen het via ons netwerk.' },
    ]}
    steps={[
      { n: 1, title: 'Stuur een aanvraag', body: 'Vul het formulier in of stuur een WhatsApp. We reageren binnen 24 uur.' },
      { n: 2, title: 'Rondleiding & offerte', body: 'Kom de ruimte bekijken. We maken een offerte op maat.' },
      { n: 3, title: 'Jullie avond', body: 'Aankomst, bar open, programma draait. Wij zorgen dat alles klopt.' },
    ]}
    practical={[
      { label: 'Capaciteit', value: 'Tot 400 personen (staand)' },
      { label: 'Beschikbaarheid', value: 'Donderdag t/m zaterdag (ook overdag op aanvraag)' },
      { label: 'Bar', value: 'Inbegrepen, drankpakket bespreekbaar' },
      { label: 'Catering', value: 'Op aanvraag' },
      { label: 'AV', value: 'Professioneel geluid & licht inbegrepen' },
      { label: 'Reactietijd', value: 'Binnen 24 uur' },
    ]}
    ctaPrimary={{ label: 'Aanvraag versturen', href: '/event-space#aanvraag' }}
    ctaSecondary={{ label: 'WhatsApp ons', href: whatsapp }}
    quote="Alles op één plek: bar, geluid, licht en een team dat snapt hoe een avond moet lopen."
  />
}

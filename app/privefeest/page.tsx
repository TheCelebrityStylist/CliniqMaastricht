import type { Metadata } from 'next'
import LandingLayout from '@/components/landing/LandingLayout'
import { PHOTOS } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Privéfeest Maastricht | Cliniq — Verjaardag & Jubileum tot 400 pers.',
  description: 'Privéfeest huren in Maastricht bij Cliniq. Volledig exclusief voor jou en je gasten. Verjaardag, jubileum of privé clubavond. Tot 400 personen. Platielstraat 9A.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/privefeest',
  },
  openGraph: {
    title: 'Privéfeest Maastricht | Cliniq',
    description: 'Volledig exclusief voor jou en je gasten. Tot 400 personen. Platielstraat 9A, Maastricht.',
    url: 'https://www.cliniqmaastricht.nl/privefeest',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
  },
}

const whatsapp = 'https://wa.me/31612530987?text=Hoi%2C%20ik%20wil%20een%20privéfeest%20plannen'

export default function PrivefeestPage() {
  return <LandingLayout
    meta={metadata as { title: string; description: string }}
    hero={{
      photo: PHOTOS.crowd,
      eyebrow: 'Privéfeest Maastricht',
      h1: 'Privéfeest in Maastricht',
      sub: 'Volledig exclusief voor jou en je gasten. Platielstraat 9A.',
      ctaLabel: 'Plan jouw feest',
      ctaHref: whatsapp,
    }}
    features={[
      { title: 'Volledig exclusief', body: 'Geen andere gasten. De club is helemaal van jou.' },
      { title: 'Eigen DJ of onze resident', body: 'Breng je eigen DJ mee of gebruik ons systeem en onze DJ.' },
      { title: 'Volledige bar', body: 'Eigen barpersoneel aanwezig. Welkomstdrankje voor de groep mogelijk.' },
      { title: 'Decoratie op aanvraag', body: 'Eigen decoratie welkom. Theming en styling in overleg.' },
    ]}
    steps={[
      { n: 1, title: 'Neem contact op', body: 'WhatsApp of e-mail met je datum en groepsgrootte.' },
      { n: 2, title: 'We bevestigen snel', body: 'Datum en details vastgelegd. Geen lange wachttijden.' },
      { n: 3, title: 'Jouw avond', body: 'Gasten welkom, bar open, muziek aan. Jullie feest, onze club.' },
    ]}
    practical={[
      { label: 'Capaciteit', value: 'Tot 400 personen (staand)' },
      { label: 'Minimumgroep', value: 'Geen minimum — ook kleinere feesten bespreekbaar' },
      { label: 'Bar', value: 'Inbegrepen, pakket op maat mogelijk' },
      { label: 'DJ', value: 'Eigen DJ of resident DJ beschikbaar' },
      { label: 'Beschikbaar', value: 'Do, vr, za (ook andere dagen op aanvraag)' },
    ]}
    ctaPrimary={{ label: 'Plan via WhatsApp', href: whatsapp }}
    ctaSecondary={{ label: 'Mail ons', href: 'mailto:contact@cafecliniq.com?subject=Privéfeest' }}
    quote="Je eigen clubavond zonder omwegen: duidelijk geregeld, centrale locatie, goede energie."
    seo={{
      heading: 'Privéfeest huren in Maastricht',
      paragraphs: [
        <>Cliniq Maastricht is volledig exclusief te huren voor privéfeesten. Verjaardag, jubileum of gewoon een avond met vrienden — de club is helemaal van jou. Geen andere gasten, eigen programma, eigen DJ of de onze.</>,
        <>Tot 400 personen, inclusief professioneel geluid, licht en dansvloer. Bar inbegrepen. Catering op aanvraag.</>,
        <>Platielstraat 9A, midden in het centrum van Maastricht. Op loopafstand van hotels, restaurants en parkeergarages.</>,
      ],
    }}
  />
}

import type { Metadata } from 'next'
import LandingLayout from '@/components/landing/LandingLayout'
import { PHOTOS } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Privéfeest Maastricht | Cliniq — Verjaardag & Jubileum tot 400 personen',
  description: 'Privéfeest huren in Maastricht bij Cliniq. Verjaardag, jubileum of privé clubavond voor je groep. Exclusief gebruik, eigen bar, professionele installatie.',
}

const whatsapp = 'https://wa.me/31612530987?text=Hoi%2C%20ik%20wil%20een%20privéfeest%20plannen'

export default function PrivefeestPage() {
  return <LandingLayout
    meta={metadata as { title: string; description: string }}
    hero={{
      photo: PHOTOS.crowd,
      eyebrow: 'Privéfeest Maastricht',
      h1: 'Jouw avond. Onze club.',
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
  />
}

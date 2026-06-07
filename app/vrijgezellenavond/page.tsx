import type { Metadata } from 'next'
import LandingLayout from '@/components/landing/LandingLayout'
import { PHOTOS } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Vrijgezellenavond Maastricht | Cliniq — Workshop + Club',
  description: 'De beste vrijgezellenavond in Maastricht bij Cliniq. Cocktail workshop gevolgd door een exclusieve clubavond. Voor groepen van 15+. Boek via WhatsApp.',
}

const whatsapp = 'https://wa.me/31612530987?text=Hoi%2C%20ik%20wil%20een%20vrijgezellenavond%20plannen%20bij%20Cliniq'

export default function VrijgezellenavondPage() {
  return <LandingLayout
    meta={metadata as { title: string; description: string }}
    hero={{
      photo: PHOTOS.workshop1,
      eyebrow: 'Vrijgezellenavond Maastricht',
      h1: 'De avond die ze nog jaren navertelt.',
      sub: 'Cocktail workshop. Exclusive club. Platielstraat 9A.',
      ctaLabel: 'Plan via WhatsApp',
      ctaHref: whatsapp,
    }}
    features={[
      { title: 'Cocktail workshop', body: 'Jullie eigen bartender. Minimaal 3 cocktails per persoon.' },
      { title: 'Exclusief gebruik', body: 'De ruimte is voor jullie. Geen andere gasten tijdens de workshop.' },
      { title: 'Daarna de club in', body: 'Na de workshop direct door. Jullie avond gaat gewoon verder.' },
      { title: 'Alles geregeld', body: 'Wij regelen muziek, bar en timing. Jij regelt de groep.' },
    ]}
    steps={[
      { n: 1, title: 'Stuur een WhatsApp', body: 'Geef je datum, groepsgrootte en wensen door. We reageren binnen een dag.' },
      { n: 2, title: 'We plannen samen', body: 'Datum bevestigd, tijden afgesproken. Geen gedoe, geen formulieren.' },
      { n: 3, title: 'Jullie avond begint', body: 'Aankomst, workshop, daarna de club. Zo simpel is het.' },
    ]}
    practical={[
      { label: 'Prijs', value: '€15 per cocktail (min. 3 p.p.)' },
      { label: 'Groepsgrootte', value: 'Minimaal 15 personen' },
      { label: 'Start', value: 'Tussen 19:00 en 20:30 (in overleg)' },
      { label: 'Daarna', value: 'Welkom voor de reguliere clubavond' },
      { label: 'Locatie', value: 'Platielstraat 9A, Maastricht' },
    ]}
    ctaPrimary={{ label: 'Plan via WhatsApp', href: whatsapp }}
    ctaSecondary={{ label: 'Mail ons', href: 'mailto:contact@cafecliniq.com?subject=Vrijgezellenavond' }}
    quote="Workshop gedaan, daarna meteen door. Precies wat je wilt met een groep in Maastricht."
  />
}

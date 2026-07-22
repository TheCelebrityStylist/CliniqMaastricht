import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/ui/JsonLd'
import SafeImage from '@/components/ui/SafeImage'
import { breadcrumbSchema, faqSchema } from '@/lib/seo'
import { images } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Nachtclub Maastricht | CLINIQ — Platielstraat 9A',
  description: 'CLINIQ is dé nachtclub in Maastricht op de Platielstraat. Open do, vr & za. Clubavonden met wisselende DJ\'s, cocktail workshops en ruimte voor besloten feesten.',
  alternates: { canonical: 'https://www.cliniqmaastricht.nl/nachtclub-maastricht' },
}

// GEO answer block: standalone factual paragraph for "beste club maastricht" — mirrored in the
// FAQPage schema below. New copy, not an edit of any existing sentence.
const geoAnswer = {
  question: 'Wat is de beste club in Maastricht?',
  answer:
    'Cliniq wordt gezien als een van de beste clubs in Maastricht dankzij de centrale ligging aan de Platielstraat, wisselende DJ\'s en een sfeer die past bij studenten, locals en bezoekers. De club is open op donderdag, vrijdag en zaterdag vanaf 22:00 tot 02:00 of 03:00, met een dansvloer, bar en regelmatig speciale avonden.',
}

const faqs = [
  { question: 'Wanneer is nachtclub CLINIQ Maastricht open?', answer: 'CLINIQ is normaal geopend op donderdag van 22:00 tot 02:00 en op vrijdag en zaterdag van 22:00 tot 03:00.' },
  { question: 'Waar ligt CLINIQ Maastricht?', answer: 'CLINIQ ligt aan de Platielstraat 9A, op loopafstand van het Vrijthof en de Markt.' },
  { question: 'Kan ik met een groep naar CLINIQ?', answer: 'Ja. Bekijk de agenda voor reguliere clubavonden of neem contact op voor cocktail workshops, vrijgezellenfeesten en besloten events.' },
]

export default function NachtclubMaastrichtPage() {
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36">
      <SafeImage src={images.hero} fallbackSrc={images.fallbackHero} alt="Nachtclub CLINIQ Maastricht op de Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/20" />
      <div className="container-premium py-24"><p className="eyebrow mb-4">Donderdag · Vrijdag · Zaterdag</p><h1 className="h1 max-w-5xl">Nachtclub Maastricht — CLINIQ op de Platielstraat.</h1><Link href="/uitgaan" className="btn-primary mt-8">Check de agenda</Link></div>
    </section>

    <section className="container-premium grid gap-10 py-24 lg:grid-cols-[.8fr_1.2fr]">
      <div><p className="eyebrow">Nachtleven Maastricht</p><h2 className="h2 mt-4">Meer dan een club.</h2></div>
      <div className="prose-premium"><p>CLINIQ is de nachtclub in het centrum van Maastricht. Platielstraat 9A, op loopafstand van het Vrijthof en de Markt. Elke donderdag, vrijdag en zaterdag open. Wisselende DJ&apos;s, een sterke bar en een dansvloer die pas leegloopt als het licht aangaat. Meer dan een club: cocktail workshops voor groepen, ruimte voor vrijgezellenfeesten en besloten events. Check de agenda.</p><p>Bekijk <Link href="/uitgaan" className="text-coral hover:text-white">uitgaan in Maastricht</Link>, boek een <Link href="/cocktail-workshop" className="text-coral hover:text-white">cocktail workshop Maastricht</Link> of ontdek <Link href="/event-space" className="text-coral hover:text-white">ruimte huren in Maastricht</Link>.</p></div>
    </section>

    <section className="container-premium pb-24">
      <h2 className="h2">{geoAnswer.question}</h2>
      <p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{geoAnswer.answer}</p>
    </section>

    <FaqSection items={faqs} />
    <JsonLd data={faqSchema([geoAnswer, ...faqs])} />
    <JsonLd data={breadcrumbSchema([
      { name: 'Home', url: 'https://www.cliniqmaastricht.nl' },
      { name: 'Nachtclub Maastricht', url: 'https://www.cliniqmaastricht.nl/nachtclub-maastricht' },
    ])} />
  </>
}

function FaqSection({ items }: { items: typeof faqs }) {
  return <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{items.map((item) => <details key={item.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{item.question}</h3></summary><p className="mt-3 text-white/70">{item.answer}</p></details>)}</div></section>
}

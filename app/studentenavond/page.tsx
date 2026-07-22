import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/ui/JsonLd'
import SafeImage from '@/components/ui/SafeImage'
import { breadcrumbSchema, faqSchema } from '@/lib/seo'
import { images } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Studentenavond Maastricht | CLINIQ — Elke Donderdag Open',
  description: 'Studentenavond in Maastricht bij CLINIQ. Elke donderdag open op de Platielstraat. Goede muziek, een volle dansvloer en een vaste crowd. Geen reservering nodig.',
  alternates: { canonical: 'https://www.cliniqmaastricht.nl/studentenavond' },
}

const faqs = [
  { question: 'Hoe laat opent CLINIQ op donderdagavond?', answer: 'CLINIQ is op donderdag open vanaf 22:00.' },
  { question: 'Is er een dresscode voor de studentenavond?', answer: 'Geen strenge dresscode, kom verzorgd en neem een geldig ID mee.' },
  { question: 'Wat is de minimumleeftijd op donderdag?', answer: 'Donderdag is 18+. Controleer de agenda voor de specifieke avond.' },
]

export default function StudentenavondPage() {
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36">
      <SafeImage src={images.redCrowd} fallbackSrc={images.fallbackHero} alt="Studentenavond bij CLINIQ Maastricht op de Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/20" />
      <div className="container-premium py-24">
        <p className="eyebrow mb-4">Elke donderdag · 18+</p>
        <h1 className="h1 max-w-5xl">Studentenavond Maastricht.</h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Elke donderdag is CLINIQ dé plek voor studenten in Maastricht. Platielstraat 9A, midden in het centrum.</p>
        <Link href="/uitgaan" className="btn-primary mt-8">Check de agenda</Link>
      </div>
    </section>

    <section className="container-premium grid gap-10 py-24 lg:grid-cols-[.8fr_1.2fr]">
      <div><p className="eyebrow">Donderdagavond</p><h2 className="h2 mt-4">Vaste crowd. Volle dansvloer.</h2></div>
      <div className="prose-premium">
        <p>Geen dresscode, geen gedoe. Gewoon een volle dansvloer, wisselende muziek en een vaste crowd die weet hoe het moet. Deuren open om 22:00. Check de agenda voor deze week.</p>
        <p>Bekijk meer over <Link href="/uitgaan" className="text-coral hover:text-white">uitgaan in Maastricht</Link>, bekijk de <Link href="/fotos" className="text-coral hover:text-white">foto&apos;s van CLINIQ</Link> of begin je avond met een <Link href="/cocktail-workshop" className="text-coral hover:text-white">cocktail workshop Maastricht</Link>.</p>
      </div>
    </section>

    <FaqSection items={faqs} />
    <JsonLd data={faqSchema(faqs)} />
    <JsonLd data={breadcrumbSchema([
      { name: 'Home', url: 'https://www.cliniqmaastricht.nl' },
      { name: 'Studentenavond Maastricht', url: 'https://www.cliniqmaastricht.nl/studentenavond' },
    ])} />
  </>
}

function FaqSection({ items }: { items: typeof faqs }) {
  return <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{items.map((item) => <details key={item.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{item.question}</h3></summary><p className="mt-3 text-white/70">{item.answer}</p></details>)}</div></section>
}

import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/ui/JsonLd'
import SafeImage from '@/components/ui/SafeImage'
import { breadcrumbSchema, faqSchema } from '@/lib/seo'
import { images } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Discotheek Maastricht | CLINIQ — Club op de Platielstraat',
  description: 'Op zoek naar een discotheek in Maastricht? CLINIQ op de Platielstraat 9A is open elke donderdag, vrijdag en zaterdag. Clubavonden met DJ\'s, cocktail workshops en private events.',
  alternates: { canonical: 'https://www.cliniqmaastricht.nl/discotheek-maastricht' },
}

const faqs = [
  { question: 'Wat is de beste discotheek in Maastricht?', answer: 'CLINIQ op de Platielstraat 9A is een van de populairste clubs in het centrum van Maastricht, open op donderdag, vrijdag en zaterdag.' },
  { question: 'Hoe laat opent de club?', answer: 'Vrijdag en zaterdag vanaf 22:00 tot 03:00. Donderdag 22:00 tot 02:00.' },
  { question: 'Is er parkeren bij de discotheek in Maastricht?', answer: 'CLINIQ ligt in het centrum van Maastricht. Meerdere parkeergarages op loopafstand.' },
]

export default function DiscotheekMaastrichtPage() {
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36">
      <SafeImage src={images.club} fallbackSrc={images.fallbackHero} alt="Discotheek CLINIQ Maastricht aan de Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/20" />
      <div className="container-premium py-24"><p className="eyebrow mb-4">Platielstraat 9A</p><h1 className="h1 max-w-5xl">Discotheek Maastricht — CLINIQ.</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Open elke donderdag, vrijdag en zaterdag in het centrum van Maastricht.</p><Link href="/uitgaan" className="btn-primary mt-8">Check de agenda</Link></div>
    </section>

    <section className="container-premium grid gap-10 py-24 lg:grid-cols-[.8fr_1.2fr]">
      <div><p className="eyebrow">Club Maastricht</p><h2 className="h2 mt-4">Midden in het centrum.</h2></div>
      <div className="prose-premium"><p>CLINIQ is de club aan de Platielstraat 9A, midden in het centrum van Maastricht. Open elke donderdag, vrijdag en zaterdag. Wisselende DJ&apos;s, een volle dansvloer en een bar die klopt. Of je nu zoekt naar een discotheek in Maastricht voor een spontane avond, een vrijgezellenfeest of een studentenavond — dit is het adres. Check de agenda en we zien je snel.</p><p>Lees meer over <Link href="/uitgaan" className="text-coral hover:text-white">uitgaan in Maastricht</Link>, onze <Link href="/studentenavond" className="text-coral hover:text-white">studentenavond Maastricht</Link> en <Link href="/vrijgezellenavond" className="text-coral hover:text-white">vrijgezellenavonden in Maastricht</Link>.</p></div>
    </section>

    <FaqSection items={faqs} />
    <JsonLd data={faqSchema(faqs)} />
    <JsonLd data={breadcrumbSchema([
      { name: 'Home', url: 'https://www.cliniqmaastricht.nl' },
      { name: 'Discotheek Maastricht', url: 'https://www.cliniqmaastricht.nl/discotheek-maastricht' },
    ])} />
  </>
}

function FaqSection({ items }: { items: typeof faqs }) {
  return <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{items.map((item) => <details key={item.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{item.question}</h3></summary><p className="mt-3 text-white/70">{item.answer}</p></details>)}</div></section>
}

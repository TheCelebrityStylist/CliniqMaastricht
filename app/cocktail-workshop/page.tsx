import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent, getSectionPhotoMedia } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import ChoreographedContent from '@/components/ui/ChoreographedContent'
import { workshopFaqsNl as faqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'
import { breadcrumbSchema, cocktailWorkshopSchema } from '@/lib/seo'

import AtmosphereFX from '@/components/interactive/AtmosphereFXLoader'
import MagneticCTAs from '@/components/interactive/MagneticCTAsLoader'

const CocktailTeaser = dynamic(() => import('@/components/interactive/CocktailTeaser'))

export const revalidate = 600

// "cocktail workshop maastricht" ranks #6.4 at 10.6% CTR — best-converting cluster, push to top 3.
// "cocktail workshop maastricht vrijgezellenfeest" converts at 35% CTR — "vrijgezellenfeest" must be in the description.
//
// Title variants tested:
// A (shipped) — keeps existing price hook, already performing well:
//   "Cocktail Workshop Maastricht | Cliniq — Boek nu vanaf €15"
// B — vrijgezellenfeest-led:
//   "Cocktail Workshop Maastricht | Cliniq — Ideaal voor een Vrijgezellenfeest"
// C — group-size + price combined:
//   "Cocktail Workshop Maastricht vanaf €15 p.p. | Cliniq — Groepen v.a. 15"
//
// Description variants tested:
// A (shipped) — adds "vrijgezellenfeest" up front, keeps price/group hooks:
//   "Cocktail workshop Maastricht voor een vrijgezellenfeest, bedrijfsuitje of verjaardag. 2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p. Groepen v.a. 15 personen. Boek direct."
// B — vrijgezellenfeest as the primary framing:
//   "Vrijgezellenfeest in Maastricht? Boek de cocktail workshop bij Cliniq: 2 uur cocktails maken, daarna de club in. €15 per cocktail, min. 3 p.p. Groepen v.a. 15 personen."
// C — broader group-occasion framing:
//   "Cocktail workshop bij Cliniq Maastricht — voor vrijgezellenfeesten, bedrijfsuitjes en verjaardagen. €15 per cocktail, minimaal 3 p.p. Groepen vanaf 15 personen."
export const metadata: Metadata = {
  title: 'Cocktail Workshop Maastricht | Cliniq — Boek nu vanaf €15',
  description: 'Cocktail workshop Maastricht voor een vrijgezellenfeest, bedrijfsuitje of verjaardag. 2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p. Groepen v.a. 15 personen. Boek direct.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/cocktail-workshop',
    languages: { 'nl-NL': 'https://www.cliniqmaastricht.nl/cocktail-workshop', en: 'https://www.cliniqmaastricht.nl/en/cocktail-workshop', 'x-default': 'https://www.cliniqmaastricht.nl/cocktail-workshop' },
  },
  openGraph: {
    title: 'Cocktail Workshop Maastricht | Cliniq',
    description: 'Voor vrijgezellenfeesten en bedrijfsuitjes: 2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p. Groepen v.a. 15 personen.',
    url: 'https://www.cliniqmaastricht.nl/cocktail-workshop',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
    images: [{ url: images.workshopBar, width: 1200, height: 1500 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cocktail Workshop Maastricht | Cliniq',
    description: 'Voor vrijgezellenfeesten en bedrijfsuitjes: 2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p.',
    images: [images.workshopBar],
  },
}

// GEO answer block: standalone factual paragraph for "cocktail workshop maastricht
// vrijgezellenfeest" (35% CTR converting query) — mirrored in the FAQPage schema below.
const geoAnswer = {
  question: 'Is een cocktail workshop geschikt voor een vrijgezellenfeest in Maastricht?',
  answer:
    'Ja: de cocktail workshop bij Cliniq Maastricht is een van de populairste activiteiten voor een vrijgezellenfeest in de stad. Groepen vanaf 15 personen maken samen cocktails onder begeleiding van de bartenders aan de Platielstraat 9A, waarna ze kunnen doorgaan naar de reguliere clubavond. Prijs vanaf €15 per cocktail.',
}

const workshopFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: geoAnswer.question, acceptedAnswer: { '@type': 'Answer', text: geoAnswer.answer } },
    { '@type': 'Question', name: 'Wat kost een cocktail workshop bij Cliniq?', acceptedAnswer: { '@type': 'Answer', text: '€15 per cocktail, minimaal 3 per persoon. Geen extra kosten voor ruimte of bartenders.' } },
    { '@type': 'Question', name: 'Hoeveel personen zijn minimaal nodig voor een cocktail workshop?', acceptedAnswer: { '@type': 'Answer', text: 'De cocktail workshop is beschikbaar vanaf 15 personen.' } },
    { '@type': 'Question', name: 'Op welke dagen is de cocktail workshop beschikbaar?', acceptedAnswer: { '@type': 'Answer', text: 'Donderdag, vrijdag en zaterdag. De workshop start in overleg tussen 19:00 en 20:30.' } },
    { '@type': 'Question', name: 'Kan ik na de cocktail workshop blijven voor de avond?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. Na afloop van de workshop ben je welkom voor de reguliere clubavond.' } },
    { '@type': 'Question', name: 'Is de cocktail workshop geschikt voor een vrijgezellenavond?', acceptedAnswer: { '@type': 'Answer', text: 'Ja, de cocktail workshop is een van de populairste activiteiten voor vrijgezellenfeesten bij Cliniq. Exclusief gebruik van de ruimte en totaalpakketten zijn mogelijk.' } },
  ],
}


const groupTypes = ['Vrijgezellenfeest', 'Bedrijfsuitje', 'Verjaardag', 'Vriendengroep', 'Teamavond', 'Voorafgaand aan uitgaan']

export default async function WorkshopPage(){
  const [content, driveGallery] = await Promise.all([getPageContent('cocktail-workshop'), getSectionPhotoMedia('workshop', imageSets.workshop)])
  const pageFaqs = faqs
  const gallerySource = content?.gallery?.length ? content.gallery : driveGallery
  const gallery = gallerySource.map((photo) => ({ url: photo.url, alt: photo.altNl || 'Cocktail workshop bij CLINIQ Maastricht' }))
  const heroImage = content?.imageUrl || images.workshopBar
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={heroImage} fallbackSrc={images.fallbackWide} alt="Cocktail workshop Maastricht Cliniq Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/58 to-black/18"/><AtmosphereFX /><MagneticCTAs /><div className="container-premium py-24"><p className="eyebrow mb-4">Workshop</p><h1 className="h1 max-w-5xl">Cocktail Workshop Maastricht</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Voor groepen van 15+. Cocktails maken, daarna uitgaan in Maastricht.</p><a href="#aanvraag" className="btn-primary mt-8">Cocktail workshop aanvragen</a></div></section>

    <CocktailTeaser />

    <section className="container-premium section-y"><div className="grid gap-4 md:grid-cols-4"><Fact title={content?.price || '€15 per cocktail'} text="Inclusief meerdere cocktails, materialen en begeleiding." /><Fact title={content?.minimumGroupSize ? `Minimaal ${content.minimumGroupSize} personen` : 'Minimaal 15 personen'} text="Ideaal voor groepen die samen iets actiefs willen doen." /><Fact title="3 cocktails inbegrepen" text="Je maakt en proeft meerdere cocktails tijdens de workshop." /><Fact title="Begeleiding van bartenders" text="Onze bartenders helpen met smaken, techniek en serveren." /></div></section>

    <section className="container-premium section-y grid gap-10 lg:grid-cols-2 lg:items-center"><div><p className="eyebrow">Workshop</p><h2 className="h2 mt-4">Wat je doet</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">Onze bartenders leren jou en je groep alles over mixen, shaken en garneren. Gewoon doen, niet kijken. Elke deelnemer maakt minimaal 3 cocktails. Je drinkt wat je maakt. Daarna kun je samen verder voor{' '}<Link href="/uitgaan" className="text-coral-text hover:text-white">uitgaan in Maastricht</Link>.</p><ul className="mt-8 grid gap-3 text-white/78"><li>• Meerdere cocktails maken</li><li>• Werken met bar tools, ingrediënten en glaswerk</li><li>• Begeleiding van ervaren bartenders</li><li>• Tijd om te borrelen met je groep</li></ul></div><div className="grid grid-cols-2 gap-4">{gallery.slice(0,4).map((item)=><div key={item.url} className="photo-tile image-frame aspect-square"><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={`${item.alt} — cocktail workshop Maastricht`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium section-y"><div className="max-w-3xl"><p className="eyebrow">Groepen</p><h2 className="h2 mt-4">Voor welke groepen?</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">De cocktail workshop is vooral geschikt voor groepen die iets willen doen zonder dat het formeel wordt. Denk aan vrijgezellenfeesten, bedrijfsuitjes, verjaardagen, teamavonden of vriendengroepen die de avond goed willen beginnen.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groupTypes.map((type)=><article key={type} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><h3 className="text-2xl font-black tracking-[-0.03em]">{type}</h3><p className="mt-3 text-white/66">Actief, sociaal en makkelijk te combineren met borrelen of uitgaan in Maastricht.</p></article>)}</div></section>

    <section className="container-premium section-y"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Cocktail workshop in Maastricht</h2></div><div className="prose-premium"><ChoreographedContent
              headline="Een cocktail workshop organiseren in Maastricht? Dat doe je bij Cliniq op de Platielstraat."
              quote="Cliniq is een van de populairste locaties in de regio voor bachelorette en vrijgezellenfeesten."
              stats={[
                { value: '15+', label: 'personen minimaal' },
                { value: '3', label: 'cocktails per persoon' },
                { value: '€15', label: 'per cocktail' },
                { value: 'Do · Vr · Za', label: '19:00–20:30 starttijd' },
              ]}
              moreLabel="Lees de volledige mogelijkheden"
              paragraphs={[
                <>Een cocktail workshop organiseren in Maastricht? Dat doe je bij Cliniq op de Platielstraat. Beschikbaar op donderdag, vrijdag en zaterdag, start in overleg tussen 19:00 en 20:30. Na afloop kun je blijven voor de{' '}<Link href="/uitgaan" className="text-coral-text hover:text-white">reguliere clubavond en het nachtleven van Maastricht</Link>.</>,
                <>Geschikt voor groepen van minimaal 15 personen. Iedereen maakt minstens drie cocktails (€15 per cocktail), begeleid door onze bartenders. Geen voorkennis nodig.</>,
                <>Cocktail workshop Maastricht voor een <Link href="/vrijgezellenavond" className="text-coral-text hover:text-white">vrijgezellenavond in Maastricht</Link>? Cliniq is een van de populairste locaties in de regio voor bachelorette en vrijgezellenfeesten. Exclusief gebruik van de ruimte mogelijk, drankpakket op aanvraag.</>,
                <>Maastricht is goed bereikbaar vanuit Luik, Hasselt, Heerlen en Sittard. Parkeren kan in meerdere garages op loopafstand van de Platielstraat.</>,
                <>Ook handig als <Link href="/bedrijfsfeest" className="text-coral-text hover:text-white">bedrijfsuitje</Link> met je team.</>,
              ]}
            /></div></div></section>

    <section className="container-premium section-y"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Details</p><h2 className="h2 mt-4">Wat je vooraf wilt weten</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">De workshop is bedoeld voor groepen die iets actiefs willen doen zonder dat het stijf wordt. Je hoeft geen ervaring te hebben; onze bartenders bouwen rustig op en zorgen dat iedereen mee kan doen.</p></div><div className="space-y-5 text-lg leading-[1.7] text-white/72"><p>Meestal starten we met een korte uitleg over smaken, glaswerk, ijs, balans en techniek. Daarna gaat de groep zelf aan de slag. Je maakt meerdere cocktails, proeft tussendoor en krijgt praktische tips over shaken, stirren, garneren en serveren. Daardoor voelt het niet als een les, maar als samen achter de bar staan.</p><p>Voor vrijgezellenfeesten werkt de cocktail workshop goed omdat iedereen meteen iets te doen heeft. Voor bedrijfsuitjes en teamavonden is het juist handig dat de activiteit laagdrempelig is: niemand hoeft op een podium, maar er gebeurt wel genoeg om de groep los te maken. Ook verjaardagen, vriendinnenuitjes en groepen vrienden combineren de workshop vaak met borrelen of{' '}<Link href="/uitgaan" className="text-coral-text hover:text-white">uitgaan in Maastricht</Link>.</p><p>Stuur bij je aanvraag de gewenste datum, het aantal personen en eventuele wensen mee. Denk aan een bepaalde starttijd, allergieën, alcoholvrije opties of de wens om na de workshop te blijven hangen. Dan kunnen we gericht reageren met beschikbaarheid, prijs en een voorstel dat past bij de groep.</p></div></div></section>

    <section className="container-premium section-y">
      <h2 className="h2">{geoAnswer.question}</h2>
      <p className="mt-5 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">{geoAnswer.answer}</p>
    </section>

    <section className="container-premium section-y"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{f.question}</h3></summary><p className="mt-3 text-base leading-7 text-white/72 md:text-lg">{f.answer}</p></details>)}</div></section>

    <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Aanvraag</p><h2 className="h2 mt-4">Cocktail workshop aanvragen</h2><p className="mt-6 text-lg leading-[1.65] text-white/72">Stuur je datum, groepsgrootte en wensen mee. Dan reageren we met beschikbaarheid en een passend voorstel.</p></div><InquiryForm type="workshop" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'groupSize',label:'Groepsgrootte',type:'number'},{name:'message',label:'Bericht',required:true,placeholder:'Datum, groepsgrootte en eventuele wensen.'}]} /></section><JsonLd data={workshopFaqSchema} />
    <JsonLd data={cocktailWorkshopSchema()} />
    <JsonLd data={breadcrumbSchema([
      { name: 'Home', url: 'https://www.cliniqmaastricht.nl' },
      { name: 'Cocktail Workshop Maastricht', url: 'https://www.cliniqmaastricht.nl/cocktail-workshop' },
    ])} />
  </>
}

function Fact({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h2 className="text-2xl font-black tracking-[-0.035em]">{title}</h2><p className="mt-3 text-white/66">{text}</p></article> }

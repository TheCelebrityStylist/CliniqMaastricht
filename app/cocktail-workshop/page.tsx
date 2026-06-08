import type { Metadata } from 'next'
import Link from 'next/link'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import { workshopFaqsNl as faqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'

export const metadata: Metadata = {
  title: 'Cocktail Workshop Maastricht | Cliniq — Boek nu vanaf €15',
  description: 'Cocktail workshop in Maastricht bij Cliniq. 2 uur lang cocktails leren maken. Prijs: €15 per cocktail, minimaal 3 p.p. Ideaal voor vrijgezellenfeesten en bedrijfsuitjes. Groepen v.a. 15 pers.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/cocktail-workshop',
  },
  openGraph: {
    title: 'Cocktail Workshop Maastricht | Cliniq',
    description: '2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p. Voor vrijgezellenfeesten en bedrijfsuitjes. Groepen v.a. 15 personen.',
    url: 'https://www.cliniqmaastricht.nl/cocktail-workshop',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
  },
}

const workshopFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Wat kost een cocktail workshop bij Cliniq?', acceptedAnswer: { '@type': 'Answer', text: '€15 per cocktail, minimaal 3 per persoon. Geen extra kosten voor ruimte of bartenders.' } },
    { '@type': 'Question', name: 'Hoeveel personen zijn minimaal nodig voor een cocktail workshop?', acceptedAnswer: { '@type': 'Answer', text: 'De cocktail workshop is beschikbaar vanaf 15 personen.' } },
    { '@type': 'Question', name: 'Op welke dagen is de cocktail workshop beschikbaar?', acceptedAnswer: { '@type': 'Answer', text: 'Donderdag, vrijdag en zaterdag. De workshop start in overleg tussen 19:00 en 20:30.' } },
    { '@type': 'Question', name: 'Kan ik na de cocktail workshop blijven voor de avond?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. Na afloop van de workshop ben je welkom voor de reguliere clubavond.' } },
    { '@type': 'Question', name: 'Is de cocktail workshop geschikt voor een vrijgezellenavond?', acceptedAnswer: { '@type': 'Answer', text: 'Ja, de cocktail workshop is een van de populairste activiteiten voor vrijgezellenfeesten bij Cliniq. Exclusief gebruik van de ruimte en totaalpakketten zijn mogelijk.' } },
  ],
}


const groupTypes = ['Vrijgezellenfeest', 'Bedrijfsuitje', 'Verjaardag', 'Vriendengroep', 'Teamavond', 'Voorafgaand aan uitgaan']

export default async function WorkshopPage(){
  const content = await getPageContent('cocktail-workshop')
  const pageFaqs = content?.faqs?.length ? content.faqs : faqs
  const gallery = imageSets.workshop.map((url) => ({ url, alt: 'Cocktail workshop bij CLINIQ Maastricht' }))
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={images.workshopBar} fallbackSrc={images.fallbackWide} alt="Cocktail workshop Maastricht Cliniq Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/58 to-black/18"/><div className="container-premium py-24"><p className="eyebrow mb-4">Workshop</p><h1 className="h1 max-w-5xl">Cocktail Workshop Maastricht</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Voor groepen van 15+. Cocktails maken, daarna de avond in.</p><a href="#aanvraag" className="btn-primary mt-8">Cocktail workshop aanvragen</a></div></section>

    <section className="container-premium py-24"><div className="grid gap-4 md:grid-cols-4"><Fact title={content?.price || '€15 per cocktail'} text="Inclusief meerdere cocktails, materialen en begeleiding." /><Fact title={content?.minimumGroupSize ? `Minimaal ${content.minimumGroupSize} personen` : 'Minimaal 15 personen'} text="Ideaal voor groepen die samen iets actiefs willen doen." /><Fact title="3 cocktails inbegrepen" text="Je maakt en proeft meerdere cocktails tijdens de workshop." /><Fact title="Begeleiding van bartenders" text="Onze bartenders helpen met smaken, techniek en serveren." /></div></section>

    <section className="container-premium grid gap-10 pb-24 lg:grid-cols-2 lg:items-center"><div><p className="eyebrow">Workshop</p><h2 className="h2 mt-4">Wat je doet</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">Onze bartenders leren jou en je groep alles over mixen, shaken en garneren. Gewoon doen, niet kijken. Elke deelnemer maakt minimaal 3 cocktails. Je drinkt wat je maakt. Daarna ben je welkom voor de rest van de avond.</p><ul className="mt-8 grid gap-3 text-white/78"><li>• Meerdere cocktails maken</li><li>• Werken met bar tools, ingrediënten en glaswerk</li><li>• Begeleiding van ervaren bartenders</li><li>• Tijd om te borrelen met je groep</li></ul></div><div className="grid grid-cols-2 gap-4">{gallery.slice(0,4).map((item)=><div key={item.url} className="photo-tile image-frame aspect-square"><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><div className="max-w-3xl"><p className="eyebrow">Groepen</p><h2 className="h2 mt-4">Voor welke groepen?</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">De cocktail workshop is vooral geschikt voor groepen die iets willen doen zonder dat het formeel wordt. Denk aan vrijgezellenfeesten, bedrijfsuitjes, verjaardagen, teamavonden of vriendengroepen die de avond goed willen beginnen.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groupTypes.map((type)=><article key={type} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><h3 className="text-2xl font-black tracking-[-0.03em]">{type}</h3><p className="mt-3 text-white/66">Actief, sociaal en makkelijk te combineren met borrelen of uitgaan in Maastricht.</p></article>)}</div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Cocktail workshop in Maastricht</h2></div><div className="prose-premium"><p>Een cocktail workshop organiseren in Maastricht? Dat doe je bij Cliniq op de Platielstraat. Beschikbaar op donderdag, vrijdag en zaterdag, start in overleg tussen 19:00 en 20:30. Na afloop ben je welkom voor de reguliere clubavond.</p><p>Geschikt voor groepen van minimaal 15 personen. Iedereen maakt minstens drie cocktails (€15 per cocktail), begeleid door onze bartenders. Geen voorkennis nodig.</p><p>Cocktail workshop Maastricht voor een <Link href="/vrijgezellenavond" className="text-gold hover:text-white">vrijgezellenavond in Maastricht</Link>? Cliniq is een van de populairste locaties in de regio voor bachelorette en vrijgezellenfeesten. Exclusief gebruik van de ruimte mogelijk, drankpakket op aanvraag.</p><p>Maastricht is goed bereikbaar vanuit Luik, Hasselt, Heerlen en Sittard. Parkeren kan in meerdere garages op loopafstand van de Platielstraat.</p><p>Ook handig als <Link href="/bedrijfsfeest" className="text-gold hover:text-white">bedrijfsuitje</Link> met je team.</p></div></div></section>

    <section className="container-premium pb-24"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Details</p><h2 className="h2 mt-4">Wat je vooraf wilt weten</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">De workshop is bedoeld voor groepen die iets actiefs willen doen zonder dat het stijf wordt. Je hoeft geen ervaring te hebben; onze bartenders bouwen rustig op en zorgen dat iedereen mee kan doen.</p></div><div className="space-y-5 text-lg leading-[1.7] text-white/72"><p>Meestal starten we met een korte uitleg over smaken, glaswerk, ijs, balans en techniek. Daarna gaat de groep zelf aan de slag. Je maakt meerdere cocktails, proeft tussendoor en krijgt praktische tips over shaken, stirren, garneren en serveren. Daardoor voelt het niet als een les, maar als samen achter de bar staan.</p><p>Voor vrijgezellenfeesten werkt de cocktail workshop goed omdat iedereen meteen iets te doen heeft. Voor bedrijfsuitjes en teamavonden is het juist handig dat de activiteit laagdrempelig is: niemand hoeft op een podium, maar er gebeurt wel genoeg om de groep los te maken. Ook verjaardagen, vriendinnenuitjes en groepen vrienden combineren de workshop vaak met borrelen of uitgaan in Maastricht.</p><p>Stuur bij je aanvraag de gewenste datum, het aantal personen en eventuele wensen mee. Denk aan een bepaalde starttijd, allergieën, alcoholvrije opties of de wens om na de workshop te blijven hangen. Dan kunnen we gericht reageren met beschikbaarheid, prijs en een voorstel dat past bij de groep.</p></div></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{f.question}</h3></summary><p className="mt-3 text-base leading-7 text-white/72 md:text-lg">{f.answer}</p></details>)}</div></section>

    <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Aanvraag</p><h2 className="h2 mt-4">Cocktail workshop aanvragen</h2><p className="mt-6 text-lg leading-[1.65] text-white/72">Stuur je datum, groepsgrootte en wensen mee. Dan reageren we met beschikbaarheid en een passend voorstel.</p></div><InquiryForm type="workshop" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'groupSize',label:'Groepsgrootte',type:'number'},{name:'message',label:'Bericht',required:true,placeholder:'Datum, groepsgrootte en eventuele wensen.'}]} /></section><JsonLd data={workshopFaqSchema} />
  </>
}

function Fact({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h2 className="text-2xl font-black tracking-[-0.035em]">{title}</h2><p className="mt-3 text-white/66">{text}</p></article> }

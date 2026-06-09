import type { Metadata } from 'next'
import Link from 'next/link'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent, getSectionPhotoMedia } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import { eventSpaceFaqsNl as faqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Ruimte Huren Maastricht | Feestzaal & Eventlocatie Cliniq — Tot 400 pers.',
  description: 'Feestlocatie of eventruimte huren in Maastricht? Cliniq biedt exclusieve zaalverhuur voor tot 400 personen. Voor privéfeesten, bedrijfsfeesten en vrijgezellenavonden. Platielstraat 9A.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/event-space',
  },
  openGraph: {
    title: 'Ruimte Huren Maastricht | Cliniq — Tot 400 personen',
    description: 'Exclusieve zaalverhuur in Maastricht voor privéfeesten, bedrijfsfeesten en vrijgezellenavonden. Tot 400 personen. Platielstraat 9A.',
    url: 'https://www.cliniqmaastricht.nl/event-space',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
  },
}

const eventSpaceFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Hoeveel personen passen er in de zaal van Cliniq?', acceptedAnswer: { '@type': 'Answer', text: 'Cliniq Maastricht biedt ruimte voor tot 400 gasten staand. Voor zittende evenementen adviseren wij maximaal 250 gasten.' } },
    { '@type': 'Question', name: 'Kan ik de zaal van Cliniq exclusief huren?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. Bij een privé-evenement huur je de volledige ruimte exclusief. Jij en je gasten hebben de gehele club voor jezelf.' } },
    { '@type': 'Question', name: 'Is catering mogelijk bij een evenement in Cliniq?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. We kunnen hapjes, een buffet of een volledige cateringservice regelen. Drankarrangementen zijn ook beschikbaar.' } },
    { '@type': 'Question', name: 'Hoe snel ontvang ik een reactie op mijn aanvraag?', acceptedAnswer: { '@type': 'Answer', text: 'We streven ernaar binnen 24 uur te reageren. Heb je spoed? Stuur een WhatsApp naar +31612530987.' } },
  ],
}


const eventTypes = [
  ['Bedrijfsfeest', 'Bedrijfsborrel of personeelsfeest? Cliniq heeft de ruimte, de bar en het geluid. Jij regelt de gasten.'],
  ['Privéfeest', 'Van kleine verjaardagsfeestjes tot grote jubileumvieringen. Cliniq is exclusief voor jou en je gasten.'],
  ['Vrijgezellenfeest', 'Cocktail workshop als opener, daarna de club in. Cliniq is een van de populairste locaties voor vrijgezellenavonden in Maastricht.'],
  ['Borrel', 'Voor groepen die informeel willen samenkomen met bar en muziek dichtbij.'],
  ['Private party', 'Een eigen avond met deurbeleid, bar en invulling op maat.'],
  ['Studentenfeest', 'Geschikt voor grotere groepen met muziek, licht en duidelijke afspraken.'],
  ['Productlancering', 'Presenteer je merk of product in een setting die mensen bijblijft. Podium, scherm, bar en licht aanwezig.'],
  ['Gala / besloten avond', 'Voor een nettere avond met ontvangst, bar en clubgevoel later op de avond.'],
]

const facilities = [
  ['Bar', 'Een vaste baropstelling met team en drankmogelijkheden.'],
  ['Licht en geluid', 'De basis voor muziek, speeches en dansen is aanwezig.'],
  ['DJ mogelijkheden', 'We denken mee over DJ, muziekstijl en timing van de avond.'],
  ['Dansvloer', 'De ruimte voelt direct als een avond uit, niet als een lege zaal.'],
  ['Cocktailmogelijkheden', 'Cocktails, welkomstdrankjes of drankafspraken zijn mogelijk.'],
  ['Centrale locatie', 'Platielstraat 9A, midden in het centrum van Maastricht.'],
  ['Hospitality team', 'Een team dat gewend is aan drukke avonden en groepen.'],
  ['Garderobe / lockers', 'Lockers en garderobe-afspraken kunnen per event worden afgestemd.'],
]

export default async function EventSpacePage(){
  const [content, driveGallery] = await Promise.all([getPageContent('event-space'), getSectionPhotoMedia('event-space', imageSets.eventSpace)])
  const pageFaqs = content?.faqs?.length ? content.faqs : faqs
  const gallerySource = content?.gallery?.length ? content.gallery : driveGallery
  const gallery = gallerySource.map((photo) => ({ url: photo.url, alt: photo.altNl || 'Feestlocatie CLINIQ Maastricht' }))
  const heroImage = content?.imageUrl || images.redRoom
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={heroImage} fallbackSrc={images.fallbackWide} alt="Feestzaal huren Maastricht — Cliniq evenementenlocatie tot 400 personen" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/62 to-burgundy/10"/><div className="container-premium py-24"><p className="eyebrow mb-4">Events</p><h1 className="h1 max-w-5xl">Feestzaal & Eventlocatie Maastricht</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Exclusief te huren voor feesten, bedrijfsevents en private parties. Tot 400 personen.</p><a href="#aanvraag" className="btn-primary mt-8">Vrijblijvende aanvraag</a></div></section>

    <section className="container-premium py-24"><p className="eyebrow">Event types</p><h2 className="h2 mt-4">Waarvoor kun je CLINIQ huren?</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{eventTypes.map(([title,text])=><InfoCard key={title} title={title} text={text} />)}</div></section>

    <section className="container-premium pb-24"><div className="max-w-4xl"><p className="eyebrow">Faciliteiten</p><h2 className="h2 mt-4">Wat is er aanwezig?</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">CLINIQ heeft de basis voor een complete avond al in huis: bar, licht, geluid, dansvloer en een team dat gewend is aan drukke avonden.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{facilities.map(([title,text])=><InfoCard key={title} title={title} text={text} />)}</div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Ruimte huren in Maastricht</h2></div><div className="prose-premium"><p>Cliniq Maastricht is exclusief te huren op donderdag, vrijdag en zaterdag. De ruimte biedt plek aan tot 400 gasten staand, volledig inclusief bar, professioneel geluid, licht en dansvloer. Catering is op aanvraag mogelijk.</p><p>Feestlocatie huren in Maastricht voor een privéfeest? Cliniq is een van de meest geboekte evenementenlocaties in de regio voor verjaardagen, jubilea en <Link href="/bedrijfsfeest" className="text-gold hover:text-white">bedrijfsfeesten</Link>. Bij exclusief gebruik heb je de volledige club voor jou en je gasten.</p><p><Link href="/bedrijfsfeest" className="text-gold hover:text-white">Bedrijfsfeest</Link> of borrel organiseren in Maastricht? Cliniq leent zich uitstekend voor personeelsfeesten, netwerkevenementen en productlanceringen. Professionele AV-faciliteiten, branding mogelijk, flexibele opstellingen.</p><p><Link href="/vrijgezellenavond" className="text-gold hover:text-white">Vrijgezellenavond</Link> plannen? Combineer een <Link href="/cocktail-workshop" className="text-gold hover:text-white">cocktail workshop</Link> met een exclusieve clubavond. Populair bij groepen uit heel Limburg, maar ook bereikbaar vanuit Eindhoven, Hasselt en Luik.</p></div></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">Beeld</p><h2 className="h2 mt-4">De ruimte</h2><div className="mt-8 grid auto-rows-[190px] gap-4 md:grid-cols-6 md:auto-rows-[230px]">{gallery.slice(0,5).map((item,i)=><div key={`${item.url}-${i}`} className={`photo-tile image-frame ${i===0?'md:col-span-2 md:row-span-2':'md:col-span-2'}`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{f.question}</h3></summary><p className="mt-3 text-base leading-7 text-white/72 md:text-lg">{f.answer}</p></details>)}</div></section>

    <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Aanvraag</p><h2 className="h2 mt-4">Vrijblijvende aanvraag</h2><p className="mt-6 text-lg leading-[1.65] text-white/72">Vertel ons je datum, groepsgrootte en type event. Dan denken we mee over beschikbaarheid, indeling en mogelijkheden.</p></div><InquiryForm type="event-space" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'eventType',label:'Type event',options:['Bedrijfsfeest','Verjaardag','Vrijgezellenfeest','Gala','Studentenfeest','Private party','Borrel','Product launch']},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'guests',label:'Aantal gasten',type:'number'},{name:'message',label:'Bericht',required:true}]} /></section><JsonLd data={eventSpaceFaqSchema} />
  </>
}
function InfoCard({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-2xl font-black tracking-[-0.035em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article> }

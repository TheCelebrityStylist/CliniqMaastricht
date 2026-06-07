import { faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import { eventSpaceFaqsNl as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('eventSpace', 'nl') }

const eventTypes = [
  ['Bedrijfsfeest', 'Voor teams die een avond willen met bar, muziek en genoeg ruimte om te bewegen.'],
  ['Verjaardag', 'Een besloten verjaardag met cocktails, dansvloer en een centrale locatie in Maastricht.'],
  ['Vrijgezellenfeest', 'Goed te combineren met cocktails, DJ of een workshop vooraf.'],
  ['Borrel', 'Voor groepen die informeel willen samenkomen zonder standaard zaalsfeer.'],
  ['Private party', 'Een eigen avond met deurbeleid, bar en invulling op maat.'],
  ['Studentenfeest', 'Geschikt voor grotere groepen met muziek, licht en duidelijke afspraken.'],
  ['Product launch', 'Een setting met sfeer voor presentaties, borrel en avondprogramma.'],
  ['Gala / besloten avond', 'Voor een nettere avond met ontvangst, bar en clubgevoel later op de avond.'],
]

const facilities = [
  ['Bar', 'Een vaste baropstelling met team en drankmogelijkheden.'],
  ['Licht en geluid', 'De basis voor muziek, speeches en een volle dansvloer is aanwezig.'],
  ['DJ mogelijkheden', 'We denken mee over DJ, muziekstijl en timing van de avond.'],
  ['Dansvloer', 'De ruimte voelt direct als een avond uit, niet als een lege zaal.'],
  ['Cocktailmogelijkheden', 'Cocktails, welkomstdrankjes of drankafspraken zijn mogelijk.'],
  ['Centrale locatie', 'Platielstraat 9A, midden in het centrum van Maastricht.'],
  ['Hospitality team', 'Een team dat gewend is aan drukke avonden en groepen.'],
  ['Garderobe / lockers', 'Lockers en garderobe-afspraken kunnen per event worden afgestemd.'],
]

export default async function EventSpacePage(){
  const content = await getPageContent('event-space')
  const pageFaqs = content?.faqs?.length ? content.faqs : faqs
  const gallery = imageSets.eventSpace.map((url) => ({ url, alt: 'Feestlocatie CLINIQ Maastricht' }))
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={images.redRoom} fallbackSrc={images.fallbackWide} alt="Feestlocatie CLINIQ Maastricht met bar en verlichting" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/62 to-burgundy/10"/><div className="container-premium py-24"><p className="eyebrow mb-4">Events</p><h1 className="h1 max-w-5xl">Ruimte huren in Maastricht</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">CLINIQ is beschikbaar voor borrels, bedrijfsfeesten, verjaardagen, vrijgezellenavonden en private parties. Geen standaard zaal, maar een locatie met bar, licht, geluid en clubgevoel.</p><a href="#aanvraag" className="btn-primary mt-8">Vrijblijvende aanvraag</a></div></section>

    <section className="container-premium py-24"><p className="eyebrow">Event types</p><h2 className="h2 mt-4">Waarvoor kun je CLINIQ huren?</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{eventTypes.map(([title,text])=><InfoCard key={title} title={title} text={text} />)}</div></section>

    <section className="container-premium pb-24"><div className="max-w-4xl"><p className="eyebrow">Faciliteiten</p><h2 className="h2 mt-4">Wat is er aanwezig?</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">CLINIQ heeft de basis voor een complete avond al in huis: bar, licht, geluid, dansvloer en een team dat gewend is aan drukke avonden.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{facilities.map(([title,text])=><InfoCard key={title} title={title} text={text} />)}</div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Feestlocatie en event space in Maastricht</h2></div><p className="text-lg leading-[1.65] text-white/72 md:text-xl">Wie een ruimte wil huren in Maastricht voor een groep zoekt vaak meer dan alleen vier muren en een bar. CLINIQ is geschikt voor bedrijfsfeesten, verjaardagen, borrels, vrijgezellenavonden en private events waarbij sfeer belangrijk is. Door de centrale ligging aan de Platielstraat, de clubsetting en de aanwezige faciliteiten voelt de avond meteen minder standaard.</p></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">Beeld</p><h2 className="h2 mt-4">De ruimte</h2><div className="mt-8 grid auto-rows-[190px] gap-4 md:grid-cols-6 md:auto-rows-[230px]">{gallery.slice(0,5).map((item,i)=><div key={`${item.url}-${i}`} className={`photo-tile image-frame ${i===0?'md:col-span-2 md:row-span-2':'md:col-span-2'}`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-base leading-7 text-white/72 md:text-lg">{f.answer}</p></details>)}</div></section>

    <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Aanvraag</p><h2 className="h2 mt-4">Vrijblijvende aanvraag</h2><p className="mt-6 text-lg leading-[1.65] text-white/72">Vertel ons je datum, groepsgrootte en type event. Dan denken we mee over beschikbaarheid, indeling en mogelijkheden.</p></div><InquiryForm type="event-space" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'eventType',label:'Type event',options:['Bedrijfsfeest','Verjaardag','Vrijgezellenfeest','Gala','Studentenfeest','Private party','Borrel','Product launch']},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'guests',label:'Aantal gasten',type:'number'},{name:'message',label:'Bericht',required:true}]} /></section><JsonLd data={faqSchema(pageFaqs)} />
  </>
}
function InfoCard({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h3 className="text-2xl font-black tracking-[-0.035em]">{title}</h3><p className="mt-3 text-white/66">{text}</p></article> }

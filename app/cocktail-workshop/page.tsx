import { faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import { workshopFaqsNl as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('workshop', 'nl') }

export default async function WorkshopPage(){
  const content = await getPageContent('cocktail-workshop')
  const pageFaqs = content?.faqs?.length ? content.faqs : faqs
  const gallery = imageSets.workshop.map((url) => ({ url, alt: 'Cocktail workshop Maastricht bij CLINIQ' }))
  return <>
    <section className="hero-section relative min-h-[80vh] overflow-hidden pt-36"><SafeImage src={images.workshopBar} fallbackSrc={images.fallbackWide} alt="Cocktail workshop bij CLINIQ Maastricht achter de bar" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/56 to-black/12"/><div className="container-premium py-24"><p className="eyebrow mb-4">Cocktailbar</p><h1 className="h1 max-w-5xl">Cocktail workshop bij CLINIQ</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Samen achter de bar, cocktails maken en rustig opbouwen richting de avond. De workshop is geschikt voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen.</p><a href="#aanvraag" className="btn-primary mt-8">Workshop aanvragen</a></div></section>

    <section className="container-premium py-24"><div className="grid gap-6 md:grid-cols-3"><Info title="Vanaf" value={content?.price || 'Vanaf €45 p.p.'} /><Info title="Groep" value={content?.minimumGroupSize ? `Vanaf ${content.minimumGroupSize} personen` : 'Vanaf 15 personen'} /><Info title="Duur" value="Ongeveer 2 uur" /></div></section>

    <section className="container-premium grid gap-10 pb-24 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Inbegrepen</p><h2 className="h2 mt-4">Wat je doet</h2><div className="mt-8 grid gap-4 text-white/72 sm:grid-cols-2"><p>Meerdere cocktails maken.</p><p>Begeleiding van bartenders.</p><p>Bar tools, ingrediënten en glaswerk.</p><p>Ruimte om te borrelen met je groep.</p></div></div><div className="grid grid-cols-2 gap-4">{gallery.slice(0,4).map((item,i)=><div key={`${item.url}-${i}`} className={`photo-tile image-frame aspect-[4/5] ${i===0?'row-span-2':''}`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Cocktail workshop in Maastricht</h2></div><p className="text-lg leading-8 text-white/70">Een cocktail workshop in Maastricht is een goede keuze als je met een groep iets wilt doen dat actief is, maar niet te formeel voelt. Bij CLINIQ vindt de workshop plaats in een echte cocktailbar, waardoor de sfeer direct anders is dan in een standaard workshopruimte. Je maakt meerdere cocktails, krijgt uitleg van onze bartenders en hebt ruimte om de workshop te combineren met een borrel of avond uit in Maastricht.</p></div></section>

    <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-2"><div><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Vragen over de workshop</h2><div className="faq-grid mt-8 space-y-4">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><InquiryForm type="workshop" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'groupSize',label:'Groepsgrootte',type:'number'},{name:'message',label:'Bericht',required:true,placeholder:'Datum, groepsgrootte en eventuele wensen.'}]} /></section><JsonLd data={faqSchema(pageFaqs)} />
  </>
}

function Info({ title, value }: { title: string; value: string }) { return <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7"><p className="eyebrow">{title}</p><p className="mt-4 text-3xl font-black tracking-[-0.04em]">{value}</p></div> }

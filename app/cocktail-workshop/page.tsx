import Link from 'next/link'
import { faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import { workshopFaqsNl as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('workshop', 'nl') }
export default async function WorkshopPage() {
  const content = await getPageContent('cocktail-workshop')
  const pageFaqs = content?.faqs?.length ? content.faqs : faqs
  const gallery = content?.images?.length ? content.images : imageSets.workshop.map((url) => ({ url, alt: 'Cocktail workshop bij Cliniq Maastricht', focalPoint: 'center' }))
  const heroImage = gallery[0]?.url || images.bar
  return <>
    <section className="relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={heroImage} fallbackSrc={images.fallbackWide} alt="Cocktail workshop met cocktails en barteam bij Cliniq Maastricht" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.1]" objectPosition={gallery[0]?.focalPoint || 'center'} /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/65 to-transparent"/><div className="container-premium py-24"><p className="eyebrow">Cocktail workshop Maastricht</p><h1 className="h1 mt-5 max-w-4xl">{content?.heroTitle || 'Cocktail workshop bij CLINIQ'}</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/75">{content?.heroSubtitle || 'Geen standaard borrel, maar samen achter de bar. Tijdens de cocktail workshop maak je meerdere cocktails onder begeleiding van onze bartenders. Ideaal voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen.'}</p><Link href="#form" className="btn-primary mt-8">Aanvraag doen</Link></div></section>
    <section className="container-premium grid gap-12 py-24 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Vanaf €45 p.p.</p><h2 className="h2 mt-3">Meer dan een workshop: het begin van je avond.</h2><p className="prose-premium mt-6">Ideaal voor vrijgezellenfeest Maastricht, bedrijfsuitje, verjaardag of vriendenweekend. Je maakt meerdere cocktails, leert waarom balans en presentatie werken, en ervaart de sfeer van een echte cocktailbar in het centrum van Maastricht.</p></div><div className="grid gap-4 sm:grid-cols-2">{['Professionele bartender','Minimaal 3 cocktails','Ook voor beginners','Centrum Maastricht'].map((x)=><div className="luxury-panel rounded-3xl p-6" key={x}><h3 className="text-xl font-black">{x}</h3><p className="mt-2 text-white/65">Praktisch geregeld, stijlvol uitgevoerd en makkelijk te combineren met diner of uitgaan.</p></div>)}</div></section>
    <section className="container-premium pb-20"><div className="grid gap-4 md:grid-cols-3">{gallery.slice(0,3).map((item,i)=><div key={`${item.url}-${i}`} className="image-frame aspect-[4/5]"><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt || `Cocktail workshop Maastricht foto ${i+1}`} fill sizes="33vw" className="object-cover brightness-[1.08]" objectPosition={item.focalPoint || 'center'} /></div>)}</div></section>
    <section id="form" className="container-premium grid gap-8 pb-24 lg:grid-cols-2"><div><p className="eyebrow">Aanvragen</p><h2 className="h2 mt-3">Plan jouw workshop.</h2><div className="mt-8 space-y-4">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><InquiryForm type="workshop" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'groupSize',label:'Groepsgrootte',type:'number'},{name:'message',label:'Bericht',required:true,placeholder:'Vertel ons over je groep en wensen.'}]} /></section><JsonLd data={faqSchema(pageFaqs)} />
  </>
}

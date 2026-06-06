import { faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import { eventSpaceFaqsNl as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('eventSpace', 'nl') }
export default async function EventSpacePage(){
  const content = await getPageContent('event-space')
  const pageFaqs = content?.faqs?.length ? content.faqs : faqs
  const gallery = imageSets.eventSpace.map((url) => ({ url, alt: 'Ruimte huren Maastricht' }))
  return <>
    <section className="relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={images.redRoom} fallbackSrc={images.fallbackWide} alt="CLINIQ bar en ruimte met rode verlichting" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/62 to-burgundy/10"/><div className="container-premium py-24"><h1 className="h1 max-w-5xl">Ruimte huren</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/76">Voor borrels, verjaardagen, bedrijfsfeesten en private events in hartje Maastricht.</p><a href="#aanvraag" className="btn-primary mt-8">Aanvraag doen</a></div></section>
    <section className="container-premium py-20"><div className="grid gap-4 md:grid-cols-5">{gallery.slice(0,5).map((item,i)=><div key={`${item.url}-${i}`} className={`image-frame ${i===0?'md:col-span-2 md:row-span-2':''} aspect-[4/5]`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>
    <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-2"><div><h2 className="eyebrow">Praktisch</h2><div className="mt-6 space-y-4">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><InquiryForm type="event-space" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'eventType',label:'Type event',options:['Bedrijfsfeest','Verjaardag','Vrijgezellenfeest','Gala','Studentenfeest','Private party','Borrel','Product launch']},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'guests',label:'Aantal gasten',type:'number'},{name:'message',label:'Bericht',required:true}]} /></section><JsonLd data={faqSchema(pageFaqs)} />
  </>
}

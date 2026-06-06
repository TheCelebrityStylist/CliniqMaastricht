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
  const gallery = imageSets.workshop.map((url) => ({ url, alt: 'Cocktail workshop Maastricht', focalPoint: 'center' }))
  return <>
    <section className="relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={images.workshopBar} fallbackSrc={images.fallbackWide} alt="Gasten maken cocktails achter de bar bij CLINIQ Maastricht" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.1]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/56 to-transparent"/><div className="container-premium py-24"><h1 className="h1 max-w-5xl">Cocktail workshop</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/76">Samen achter de bar. Cocktails maken, proeven en rustig opbouwen richting de avond.</p><Link href="#form" className="btn-primary mt-8">Workshop aanvragen</Link></div></section>
    <section className="container-premium py-20"><div className="grid gap-4 md:grid-cols-4">{gallery.map((item,i)=><div key={`${item.url}-${i}`} className={`image-frame ${i===0?'md:col-span-2 md:row-span-2':''} aspect-[4/5]`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>
    <section id="form" className="container-premium grid gap-8 pb-24 lg:grid-cols-2"><div><h2 className="eyebrow">Praktisch</h2><div className="mt-6 space-y-4">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><InquiryForm type="workshop" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'groupSize',label:'Groepsgrootte',type:'number'},{name:'message',label:'Bericht',required:true,placeholder:'Datum, groepsgrootte en eventuele wensen.'}]} /></section><JsonLd data={faqSchema(pageFaqs)} />
  </>
}

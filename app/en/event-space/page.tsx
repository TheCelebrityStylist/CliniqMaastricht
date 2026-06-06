import { faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import JsonLd from '@/components/ui/JsonLd'
import SafeImage from '@/components/ui/SafeImage'
import { eventSpaceFaqsEn as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'

export async function generateMetadata() { return cmsMetadata('eventSpace', 'en') }
export default async function EventSpacePage(){
  const gallery = imageSets.eventSpace.map((url) => ({ url, alt: 'Venue hire at CLINIQ Maastricht' }))
  return <>
    <section className="relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={images.redRoom} fallbackSrc={images.fallbackWide} alt="CLINIQ bar and venue with red lighting" fill priority sizes="100vw" className="-z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/62 to-burgundy/10"/><div className="container-premium py-24"><h1 className="h1 max-w-5xl">Hire CLINIQ for your event</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-white/76">Looking for a venue in Maastricht that does not feel like a standard room? CLINIQ works for company parties, birthdays, drinks, bachelor and bachelorette parties and private events with bar, lighting, sound and club atmosphere.</p><a href="#inquiry" className="btn-primary mt-8">Request proposal</a></div></section>
    <section className="container-premium py-20"><div className="grid gap-4 md:grid-cols-5">{gallery.slice(0,5).map((item,i)=><div key={`${item.url}-${i}`} className={`image-frame ${i===0?'md:col-span-2 md:row-span-2':''} aspect-[4/5]`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>
    <section id="inquiry" className="container-premium grid gap-8 pb-24 lg:grid-cols-2"><div><h2 className="eyebrow">Practical</h2><div className="mt-6 space-y-4">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><InquiryForm type="event-space" sourcePage="/en/event-space" fields={[{name:'name',label:'Name',required:true},{name:'email',label:'Email',type:'email',required:true},{name:'phone',label:'Phone'},{name:'eventType',label:'Event type',options:['Corporate event','Birthday','Bachelorette party','Gala','Student party','Private party','Drinks','Product launch']},{name:'preferredDate',label:'Preferred date',type:'date'},{name:'guests',label:'Guests',type:'number'},{name:'message',label:'Message',required:true}]} /></section><JsonLd data={faqSchema(faqs)} />
  </>
}

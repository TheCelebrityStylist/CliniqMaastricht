import { faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import JsonLd from '@/components/ui/JsonLd'
import { workshopFaqsEn as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('workshop', 'en') }

export default function WorkshopPageEn(){
  const gallery = imageSets.workshop.map((url) => ({ url, alt: 'Cocktail workshop Maastricht at CLINIQ' }))
  return <>
    <section className="hero-section relative min-h-[80vh] overflow-hidden pt-36"><SafeImage src={images.workshopBar} fallbackSrc={images.fallbackWide} alt="Cocktail workshop at CLINIQ Maastricht behind the bar" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/56 to-black/12"/><div className="container-premium py-24"><p className="eyebrow mb-4">Cocktail bar</p><h1 className="h1 max-w-5xl">Cocktail workshop at CLINIQ</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Step behind the bar, make cocktails and ease into the evening. The workshop works well for bachelor and bachelorette parties, team nights, birthdays and groups of friends.</p><a href="#inquiry" className="btn-primary mt-8">Request workshop</a></div></section>
    <section className="container-premium py-24"><div className="grid gap-6 md:grid-cols-3"><Info title="From" value="From €45 p.p." /><Info title="Group" value="From 15 guests" /><Info title="Duration" value="Around 2 hours" /></div></section>
    <section className="container-premium grid gap-10 pb-24 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Included</p><h2 className="h2 mt-4">What you do</h2><div className="mt-8 grid gap-4 text-white/72 sm:grid-cols-2"><p>Make several cocktails.</p><p>Guidance from bartenders.</p><p>Bar tools, ingredients and glassware.</p><p>Space to have drinks with your group.</p></div></div><div className="grid grid-cols-2 gap-4">{gallery.slice(0,4).map((item,i)=><div key={`${item.url}-${i}`} className={`photo-tile image-frame aspect-[4/5] ${i===0?'row-span-2':''}`}><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="33vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>
    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Cocktail workshop in Maastricht</h2></div><p className="text-lg leading-8 text-white/70">A cocktail workshop in Maastricht is a good option when you want to do something active with a group without making it too formal. At CLINIQ, the workshop takes place in a real cocktail bar, which gives it a different atmosphere from a standard workshop room. You make several cocktails, get guidance from our bartenders and can easily combine the workshop with drinks or a night out in Maastricht.</p></div></section>
    <section id="inquiry" className="container-premium grid gap-8 pb-24 lg:grid-cols-2"><div><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Workshop questions</h2><div className="faq-grid mt-8 space-y-4">{faqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></div><InquiryForm type="workshop" sourcePage="/en/cocktail-workshop" fields={[{name:'name',label:'Name',required:true},{name:'email',label:'Email',type:'email',required:true},{name:'phone',label:'Phone'},{name:'preferredDate',label:'Preferred date',type:'date'},{name:'groupSize',label:'Group size',type:'number'},{name:'message',label:'Message',required:true,placeholder:'Date, group size and any wishes.'}]} /></section><JsonLd data={faqSchema(faqs)} />
  </>
}

function Info({ title, value }: { title: string; value: string }) { return <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7"><p className="eyebrow">{title}</p><p className="mt-4 text-3xl font-black tracking-[-0.04em]">{value}</p></div> }

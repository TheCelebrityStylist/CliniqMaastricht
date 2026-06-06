import Link from 'next/link'
import { images, site } from '@/lib/site'
import { getSiteSettings } from '@/lib/admin/public'
import InquiryForm from '@/components/forms/InquiryForm'
import JsonLd from '@/components/ui/JsonLd'
import { faqSchema } from '@/lib/seo'
import { contactFaqsEn as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'
export async function generateMetadata() { return cmsMetadata('contact', 'en') }
export default async function ContactPage(){
  const settings = await getSiteSettings()
  return <>
    <section className="hero-section relative min-h-[70vh] overflow-hidden pt-36"><SafeImage src={images.contactInterior} fallbackSrc={images.fallbackWide} alt="Interior of CLINIQ Maastricht on Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/58 to-black/20"/><div className="container-premium py-20"><p className="eyebrow mb-4">Platielstraat 9A</p><h1 className="h1">Contact</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Questions about the agenda, a cocktail workshop or hiring CLINIQ? Contact us or visit us at Platielstraat 9A.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" href={`mailto:${settings.email || site.email}`}>Contact us</Link><Link className="btn-secondary" href="/en/cocktail-workshop">Request workshop</Link></div></div></section>
    <section className="container-premium grid gap-8 py-24 lg:grid-cols-2"><div className="space-y-6"><div className="card rounded-[2rem] p-8"><h2 className="h3">CLINIQ Maastricht</h2><p className="mt-4 text-white/70">{settings.address || `${site.address.street}, ${site.address.postalCode} ${site.address.city}`}</p><p className="mt-4"><a href={`tel:${settings.phone || site.phone}`}>{settings.phone || site.phone}</a><br/><a href={`mailto:${settings.email || site.email}`}>{settings.email || site.email}</a></p><div className="mt-6 space-y-2 text-white/64">{(settings.openingHours || site.hours).map((hour)=><p key={hour}>{hour}</p>)}</div></div><div className="card overflow-hidden rounded-[2rem]"><iframe title="Route to CLINIQ Maastricht" src={site.maps} className="h-80 w-full border-0" loading="lazy"/></div></div><InquiryForm type="contact" sourcePage="/en/contact" fields={[{name:'name',label:'Name',required:true},{name:'email',label:'Email',type:'email',required:true},{name:'phone',label:'Phone'},{name:'message',label:'Message',required:true}]} /></section>
    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Directions</p><h2 className="h2 mt-4">Central Maastricht</h2></div><p className="text-lg leading-8 text-white/70">CLINIQ is located at Platielstraat 9A in the centre of Maastricht, close to Vrijthof, the Markt and nearby parking garages. Contact us for questions about the agenda, lockers, a cocktail workshop, venue hire or an existing inquiry.</p></div></section>
    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Practical questions</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map(f => <details key={f.question} className="card rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section><JsonLd data={faqSchema(faqs)} />
  </>
}

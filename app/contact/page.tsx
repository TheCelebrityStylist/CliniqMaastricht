import type { Metadata } from 'next'
import Link from 'next/link'
import { images, site } from '@/lib/site'
import { getSectionPhotoMedia, getSiteSettings } from '@/lib/admin/public'
import InquiryForm from '@/components/forms/InquiryForm'
import JsonLd from '@/components/ui/JsonLd'
import { faqSchema } from '@/lib/seo'
import { contactFaqsNl as faqs } from '@/lib/faqs'
import SafeImage from '@/components/ui/SafeImage'

export const revalidate = 600
export const metadata: Metadata = {
  title: 'Contact | CLINIQ Maastricht — Platielstraat 9A, 6211 GV',
  description: 'Neem contact op met Cliniq Maastricht. Platielstraat 9A, 6211 GV Maastricht. Open donderdag, vrijdag en zaterdag. Vragen over lockers, dresscode, ruimte huren of cocktail workshops?',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/contact',
  },
  openGraph: {
    title: 'Contact | CLINIQ Maastricht',
    description: 'Platielstraat 9A, 6211 GV Maastricht. Open do, vr en za. Snel antwoord via WhatsApp of e-mail.',
    url: 'https://www.cliniqmaastricht.nl/contact',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
  },
}

export default async function ContactPage(){
  const [settings, contactPhotos] = await Promise.all([getSiteSettings(), getSectionPhotoMedia('contact', [images.contactInterior])])
  const contactImage = contactPhotos[0]?.url || images.contactInterior
  return <>
    <section className="hero-section relative min-h-[70vh] overflow-hidden pt-36"><SafeImage src={contactImage} fallbackSrc={images.fallbackWide} alt="Interieur van CLINIQ Maastricht aan de Platielstraat" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/58 to-black/20"/><div className="container-premium py-20"><p className="eyebrow mb-4">Platielstraat 9A</p><h1 className="h1">Contact Cliniq Maastricht</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Vragen over de agenda, een cocktail workshop of het huren van CLINIQ? Neem contact met ons op of kom langs aan de Platielstraat 9A.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" href={`mailto:${settings.email || site.email}`}>Neem contact op</Link><Link className="btn-secondary" href="/cocktail-workshop">Workshop aanvragen</Link></div></div></section>
    <section className="container-premium grid gap-8 py-24 lg:grid-cols-2"><div className="space-y-6"><div className="card rounded-[2rem] p-8"><h2 className="h3">CLINIQ Maastricht</h2><p className="mt-4 text-white/70">{settings.address || `${site.address.street}, ${site.address.postalCode} ${site.address.city}`}</p><p className="mt-4"><a href={`tel:${settings.phone || site.phone}`}>{settings.phone || site.phone}</a><br/><a href={`mailto:${settings.email || site.email}`}>{settings.email || site.email}</a></p><div className="mt-6 space-y-2 text-white/64">{(settings.openingHours || site.hours).map((hour)=><p key={hour}>{hour}</p>)}</div><div className="mt-7 flex flex-wrap gap-3"><Link className="btn-secondary" href="/uitgaan">Agenda</Link><Link className="btn-secondary" href="/cocktail-workshop">Workshop</Link><Link className="btn-secondary" href="/event-space">Ruimte huren</Link></div></div><div className="card overflow-hidden rounded-[2rem]"><iframe title="Route naar CLINIQ Maastricht" src={site.maps} className="h-80 w-full border-0" loading="lazy"/></div></div><InquiryForm type="contact" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'message',label:'Bericht',required:true}]} /></section>
    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Route</p><h2 className="h2 mt-4">Midden in Maastricht</h2></div><p className="text-lg leading-8 text-white/70">CLINIQ zit aan de Platielstraat 9A, midden in het centrum van Maastricht en dicht bij het Vrijthof, de Markt en omliggende parkeergarages. Neem contact op voor vragen over de agenda, lockers, een cocktail workshop, het huren van de ruimte of een bestaande aanvraag.</p></div></section>
    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Praktische vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{faqs.map(f => <details key={f.question} className="card rounded-2xl p-5"><summary className="cursor-pointer"><h3 className="inline font-black">{f.question}</h3></summary><p className="mt-3 text-white/70">{f.answer}</p></details>)}</div></section><JsonLd data={faqSchema(faqs)} />
  </>
}

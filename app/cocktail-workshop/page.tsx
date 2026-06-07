import { faqSchema } from '@/lib/seo'
import { images, imageSets } from '@/lib/site'
import InquiryForm from '@/components/forms/InquiryForm'
import { getPageContent } from '@/lib/admin/public'
import JsonLd from '@/components/ui/JsonLd'
import { workshopFaqsNl as faqs } from '@/lib/faqs'
import { cmsMetadata } from '@/lib/pageMetadata'
import SafeImage from '@/components/ui/SafeImage'

export async function generateMetadata() { return cmsMetadata('workshop', 'nl') }

const groupTypes = ['Vrijgezellenfeest', 'Bedrijfsuitje', 'Verjaardag', 'Vriendengroep', 'Teamavond', 'Voorafgaand aan uitgaan']

export default async function WorkshopPage(){
  const content = await getPageContent('cocktail-workshop')
  const pageFaqs = content?.faqs?.length ? content.faqs : faqs
  const gallery = imageSets.workshop.map((url) => ({ url, alt: 'Cocktail workshop bij CLINIQ Maastricht' }))
  return <>
    <section className="hero-section relative min-h-[78vh] overflow-hidden pt-36"><SafeImage src={images.workshopBar} fallbackSrc={images.fallbackWide} alt="Cocktail workshop bij CLINIQ Maastricht achter de bar" fill priority sizes="100vw" className="hero-media -z-10 object-cover brightness-[1.08]" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/58 to-black/18"/><div className="container-premium py-24"><p className="eyebrow mb-4">Workshop</p><h1 className="h1 max-w-5xl">Cocktail workshop Maastricht</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">Een cocktail workshop bij CLINIQ is gemaakt voor groepen die iets actiefs willen doen voordat de avond echt begint. Je maakt meerdere cocktails, krijgt begeleiding van bartenders en hebt genoeg tijd om samen te proeven, lachen en borrelen.</p><a href="#aanvraag" className="btn-primary mt-8">Cocktail workshop aanvragen</a></div></section>

    <section className="container-premium py-24"><div className="grid gap-4 md:grid-cols-4"><Fact title={content?.price || 'Vanaf €45 p.p.'} text="Inclusief meerdere cocktails, materialen en begeleiding." /><Fact title={content?.minimumGroupSize ? `Minimaal ${content.minimumGroupSize} personen` : 'Minimaal 15 personen'} text="Ideaal voor groepen die samen iets actiefs willen doen." /><Fact title="3 cocktails inbegrepen" text="Je maakt en proeft meerdere cocktails tijdens de workshop." /><Fact title="Begeleiding van bartenders" text="Onze bartenders helpen met smaken, techniek en serveren." /></div></section>

    <section className="container-premium grid gap-10 pb-24 lg:grid-cols-2 lg:items-center"><div><p className="eyebrow">Workshop</p><h2 className="h2 mt-4">Wat je doet</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">Tijdens de workshop ga je zelf aan de slag achter de bar. Onze bartenders leggen uit hoe je smaken opbouwt, welke technieken je gebruikt en hoe je cocktails goed serveert. Je maakt meerdere cocktails, proeft tussendoor en hebt genoeg ruimte om samen te borrelen.</p><ul className="mt-8 grid gap-3 text-white/78"><li>• Meerdere cocktails maken</li><li>• Werken met bar tools, ingrediënten en glaswerk</li><li>• Begeleiding van ervaren bartenders</li><li>• Tijd om te borrelen met je groep</li></ul></div><div className="grid grid-cols-2 gap-4">{gallery.slice(0,4).map((item)=><div key={item.url} className="photo-tile image-frame aspect-square"><SafeImage src={item.url} fallbackSrc={images.fallbackWide} alt={item.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover brightness-[1.08]" /></div>)}</div></section>

    <section className="container-premium pb-24"><div className="max-w-3xl"><p className="eyebrow">Groepen</p><h2 className="h2 mt-4">Voor welke groepen?</h2><p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">De cocktail workshop is vooral geschikt voor groepen die iets willen doen zonder dat het formeel wordt. Denk aan vrijgezellenfeesten, bedrijfsuitjes, verjaardagen, teamavonden of vriendengroepen die de avond goed willen beginnen.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groupTypes.map((type)=><article key={type} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><h3 className="text-2xl font-black tracking-[-0.03em]">{type}</h3><p className="mt-3 text-white/66">Actief, sociaal en makkelijk te combineren met borrelen of uitgaan in Maastricht.</p></article>)}</div></section>

    <section className="container-premium pb-24"><div className="seo-panel grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 md:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Maastricht</p><h2 className="h2 mt-4">Cocktail workshop in Maastricht</h2></div><p className="text-lg leading-[1.65] text-white/72 md:text-xl">Een cocktail workshop in Maastricht is populair voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen, vriendinnenuitjes en groepen die samen iets willen doen in het centrum van de stad. Bij CLINIQ sta je niet in een standaard workshopruimte, maar in een echte uitgaansomgeving. Je leert cocktails maken, gebruikt bar tools en ingrediënten, en kunt de workshop makkelijk combineren met een avondje uit in Maastricht.</p></div></section>

    <section className="container-premium pb-24"><p className="eyebrow">FAQ</p><h2 className="h2 mt-4">Veelgestelde vragen</h2><div className="faq-grid mt-8 grid gap-4 lg:grid-cols-2">{pageFaqs.map((f)=><details key={f.question} className="luxury-panel rounded-2xl p-5"><summary className="cursor-pointer font-black">{f.question}</summary><p className="mt-3 text-base leading-7 text-white/72 md:text-lg">{f.answer}</p></details>)}</div></section>

    <section id="aanvraag" className="container-premium grid gap-8 pb-24 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Aanvraag</p><h2 className="h2 mt-4">Cocktail workshop aanvragen</h2><p className="mt-6 text-lg leading-[1.65] text-white/72">Stuur je datum, groepsgrootte en wensen mee. Dan reageren we met beschikbaarheid en een passend voorstel.</p></div><InquiryForm type="workshop" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'preferredDate',label:'Gewenste datum',type:'date'},{name:'groupSize',label:'Groepsgrootte',type:'number'},{name:'message',label:'Bericht',required:true,placeholder:'Datum, groepsgrootte en eventuele wensen.'}]} /></section><JsonLd data={faqSchema(pageFaqs)} />
  </>
}

function Fact({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><h2 className="text-2xl font-black tracking-[-0.035em]">{title}</h2><p className="mt-3 text-white/66">{text}</p></article> }

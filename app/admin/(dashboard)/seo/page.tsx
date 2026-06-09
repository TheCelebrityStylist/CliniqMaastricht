import { readStore } from '@/lib/admin/store'
import { saveSeoAction } from '@/lib/admin/actions'
import MediaUploadField from '@/components/admin/MediaUploadField'

const base = 'https://www.cliniqmaastricht.nl'
type RecommendedSeo = { title: string; description: string; ogTitle: string; ogDescription: string; canonical: string }
const recommended: Record<string, Record<'nl' | 'en', RecommendedSeo>> = {
  home: {
    nl: { title: 'CLINIQ Maastricht | Uitgaan, Clubavonden & Events', description: 'CLINIQ Maastricht aan de Platielstraat voor uitgaan, clubavonden, vrijgezellenavonden, cocktail workshops en private events in het centrum.', ogTitle: 'CLINIQ Maastricht | Uitgaan, Clubavonden & Events', ogDescription: 'Uitgaan, clubavonden, workshops en private events in het centrum van Maastricht.', canonical: base },
    en: { title: 'CLINIQ Maastricht | Nightlife, Club Nights & Events', description: 'CLINIQ Maastricht on Platielstraat for nightlife, club nights, hen parties, cocktail workshops and private events in the city centre.', ogTitle: 'CLINIQ Maastricht | Nightlife, Club Nights & Events', ogDescription: 'Nightlife, club nights, workshops and private events in Maastricht city centre.', canonical: `${base}/en` },
  },
  uitgaan: {
    nl: { title: 'Uitgaan Maastricht | Clubavonden & Op Stap bij CLINIQ', description: 'Ga op stap bij CLINIQ Maastricht. Bekijk de agenda voor clubavonden, avondjes uit met vrienden, groepen en events aan de Platielstraat.', ogTitle: 'Uitgaan Maastricht | CLINIQ', ogDescription: 'Bekijk de agenda voor clubavonden, groepen en events aan de Platielstraat.', canonical: `${base}/uitgaan` },
    en: { title: 'Nightlife Maastricht | Club Nights at CLINIQ', description: 'Go out at CLINIQ Maastricht. View the agenda for club nights, nights out with friends, groups and events on Platielstraat.', ogTitle: 'Nightlife Maastricht | CLINIQ', ogDescription: 'View the agenda for club nights, groups and events on Platielstraat.', canonical: `${base}/en/nightlife` },
  },
  'cocktail-workshop': {
    nl: { title: 'Cocktail Workshop Maastricht | Cocktails Maken bij CLINIQ', description: 'Boek een cocktail workshop in Maastricht bij CLINIQ. Ideaal voor vrijgezellenfeest, bedrijfsuitje, verjaardag, vriendinnenuitje of avondje uit.', ogTitle: 'Cocktail Workshop Maastricht | CLINIQ', ogDescription: 'Cocktails maken bij CLINIQ voor vrijgezellenfeest, bedrijfsuitje of avondje uit.', canonical: `${base}/cocktail-workshop` },
    en: { title: 'Cocktail Workshop Maastricht | Make Cocktails at CLINIQ', description: 'Book a cocktail workshop in Maastricht at CLINIQ. Ideal for hen parties, team events, birthdays, girls nights or nights out.', ogTitle: 'Cocktail Workshop Maastricht | CLINIQ', ogDescription: 'Make cocktails at CLINIQ for hen parties, team events or nights out.', canonical: `${base}/en/cocktail-workshop` },
  },
  'event-space': {
    nl: { title: 'Ruimte Huren Maastricht | Eventlocatie CLINIQ', description: 'Huur CLINIQ Maastricht voor bedrijfsfeest, borrel, verjaardag, vrijgezellenavond of private party met bar, licht, geluid en clubgevoel.', ogTitle: 'Ruimte Huren Maastricht | CLINIQ', ogDescription: 'Huur CLINIQ voor bedrijfsfeest, borrel, verjaardag of private party.', canonical: `${base}/event-space` },
    en: { title: 'Hire Venue Maastricht | Event Space CLINIQ', description: 'Hire CLINIQ Maastricht for corporate events, drinks, birthdays, hen parties or private parties with bar, lights, sound and club feeling.', ogTitle: 'Hire Venue Maastricht | CLINIQ', ogDescription: 'Hire CLINIQ for corporate events, birthdays, drinks or private parties.', canonical: `${base}/en/event-space` },
  },
  contact: {
    nl: { title: 'Contact CLINIQ Maastricht | Platielstraat 9A', description: 'Neem contact op met CLINIQ Maastricht voor agenda, cocktail workshops, ruimte huren, events of algemene vragen.', ogTitle: 'Contact CLINIQ Maastricht', ogDescription: 'Neem contact op voor agenda, workshops, ruimte huren, events of vragen.', canonical: `${base}/contact` },
    en: { title: 'Contact CLINIQ Maastricht | Platielstraat 9A', description: 'Contact CLINIQ Maastricht for the agenda, cocktail workshops, venue hire, events or general questions.', ogTitle: 'Contact CLINIQ Maastricht', ogDescription: 'Contact us for the agenda, workshops, venue hire, events or questions.', canonical: `${base}/en/contact` },
  },
  fotos: {
    nl: { title: "Foto's CLINIQ Maastricht | Clubavonden & Events", description: "Bekijk foto's van CLINIQ Maastricht: clubavonden, events, cocktail workshops en private parties aan de Platielstraat.", ogTitle: "Foto's CLINIQ Maastricht", ogDescription: "Foto's van clubavonden, events en workshops bij CLINIQ.", canonical: `${base}/fotos` },
    en: { title: 'Photos CLINIQ Maastricht | Club Nights & Events', description: 'View photos from CLINIQ Maastricht: club nights, events, cocktail workshops and private parties on Platielstraat.', ogTitle: 'Photos CLINIQ Maastricht', ogDescription: 'Photos from club nights, events and workshops at CLINIQ.', canonical: `${base}/en/photos` },
  },
  vacatures: {
    nl: { title: 'Vacatures CLINIQ Maastricht | Werken in de Horeca', description: 'Werken bij CLINIQ Maastricht? Bekijk vacatures voor horeca, bar en hospitality aan de Platielstraat.', ogTitle: 'Vacatures CLINIQ Maastricht', ogDescription: 'Werken in de horeca bij CLINIQ Maastricht.', canonical: `${base}/vacatures` },
    en: { title: 'Jobs CLINIQ Maastricht | Hospitality & Bar Work', description: 'Work at CLINIQ Maastricht. View hospitality and bar jobs on Platielstraat.', ogTitle: 'Jobs CLINIQ Maastricht', ogDescription: 'Hospitality and bar jobs at CLINIQ Maastricht.', canonical: `${base}/en/jobs` },
  },
  'house-rules': {
    nl: { title: 'Huisregels CLINIQ Maastricht', description: 'Lees de huisregels van CLINIQ Maastricht voor leeftijd, dresscode, ID, rookbeleid en gedrag in de club.', ogTitle: 'Huisregels CLINIQ Maastricht', ogDescription: 'Leeftijd, dresscode, ID, rookbeleid en gedrag in de club.', canonical: `${base}/house-rules` },
    en: { title: 'House Rules CLINIQ Maastricht', description: 'Read the house rules of CLINIQ Maastricht for age, dress code, ID, smoking policy and behaviour in the club.', ogTitle: 'House Rules CLINIQ Maastricht', ogDescription: 'Age, dress code, ID, smoking policy and club behaviour.', canonical: `${base}/en/house-rules` },
  },
}

function recommendedFor(pageKey: string, language: 'nl' | 'en') {
  return recommended[pageKey]?.[language] || { title: `${pageKey} | CLINIQ Maastricht`, description: 'CLINIQ Maastricht aan de Platielstraat 9A.', ogTitle: 'CLINIQ Maastricht', ogDescription: 'CLINIQ Maastricht aan de Platielstraat 9A.', canonical: `${base}/${pageKey}` }
}

type SearchParams = { pageKey?: string; language?: string; recommended?: string; saved?: string }

export default async function SeoAdminPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const [store, params] = await Promise.all([readStore(), searchParams])
  const pageKey = params?.pageKey || store.pages[0]?.key || 'home'
  const language = (params?.language || 'nl') as 'nl' | 'en'
  const saved = store.seo.find((seo) => seo.pageKey === pageKey && seo.language === language)
  const defaults = recommendedFor(pageKey, language)
  const useRecommended = params?.recommended === '1'
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const values = {
    seoTitle: useRecommended ? defaults.title : saved?.seoTitle || defaults.title,
    metaDescription: useRecommended ? defaults.description : saved?.metaDescription || defaults.description,
    ogTitle: useRecommended ? defaults.ogTitle : saved?.ogTitle || defaults.ogTitle,
    ogDescription: useRecommended ? defaults.ogDescription : saved?.ogDescription || defaults.ogDescription,
    canonicalUrl: useRecommended ? defaults.canonical : saved?.canonicalUrl || defaults.canonical,
    socialImageId: saved?.socialImageId || '',
  }

  return <div className="grid gap-8 xl:grid-cols-[1fr_460px]">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Search & social</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">SEO Settings</h1>
      <p className="mt-3 max-w-3xl text-black/60">Edit page titles and social previews in plain language. Every field starts with a strong recommended default so nothing launches empty.</p>
      {params?.saved ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">SEO saved.</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {store.pages.map((page) => {
          const current = store.seo.find((seo) => seo.pageKey === page.key && seo.language === 'nl')
          const def = recommendedFor(page.key, 'nl')
          return <a key={page.key} href={`/admin/seo?pageKey=${page.key}&language=nl`} className="rounded-[1.5rem] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xs font-black uppercase tracking-widest text-[#f02688]">{page.key === 'home' ? '/' : `/${page.key}`}</p>
            <h2 className="mt-2 text-xl font-black">{page.titleNl}</h2>
            <p className="mt-2 text-sm font-bold text-blue-700">{current?.seoTitle || def?.title || `${page.titleNl} | CLINIQ Maastricht`}</p>
            <p className="mt-1 line-clamp-2 text-sm text-black/55">{current?.metaDescription || def?.description || 'Recommended text available.'}</p>
          </a>
        })}
      </div>
    </section>

    <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Edit SEO</h2>
      <div className="mt-4 rounded-2xl border border-black/10 p-4">
        <p className="text-xs text-[#188038]">{values.canonicalUrl}</p>
        <p className="mt-1 text-lg font-medium text-[#1a0dab]">{values.seoTitle}</p>
        <p className="mt-1 text-sm text-[#4d5156]">{values.metaDescription}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`/admin/seo?pageKey=${pageKey}&language=${language}&recommended=1`} className="rounded-full border border-black/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-black/70">Use recommended SEO text</a>
      </div>
      <form action={saveSeoAction} className="mt-6 grid gap-4">
        <Select name="pageKey" label="Page" value={pageKey} options={store.pages.map((p) => [p.key, p.titleNl])}/>
        <Select name="language" label="Language" value={language} options={[["nl","Nederlands"],["en","English"]]}/>
        <Field name="seoTitle" label="SEO title" defaultValue={values.seoTitle}/>
        <Area name="metaDescription" label="Meta description" defaultValue={values.metaDescription}/>
        <Field name="ogTitle" label="OG title" defaultValue={values.ogTitle}/>
        <Area name="ogDescription" label="OG description" defaultValue={values.ogDescription}/>
        <Field name="canonicalUrl" label="Canonical URL" defaultValue={values.canonicalUrl}/>
        <Select name="socialImageId" label="Social image" value={values.socialImageId} options={[["","Default"],...store.media.map((m) => [m.id,m.title])]}/>
        <MediaUploadField name="seoImageFiles" multiple={false} disabled={!hasBlob} label="Upload new OG image" />
        <button className="min-h-11 rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">Save SEO</button>
      </form>
    </aside>
  </div>
}
function Field({ name, label, defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} defaultValue={defaultValue || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }
function Area({ name, label, defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<textarea name={name} defaultValue={defaultValue || ''} rows={4} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }
function Select({ name, label, options, value }: { name:string; label:string; options:string[][]; value?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<select name={name} defaultValue={value || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label> }

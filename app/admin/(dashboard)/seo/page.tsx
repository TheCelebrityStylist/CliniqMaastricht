import { readStore } from '@/lib/admin/store'
import { saveSeoAction } from '@/lib/admin/actions'

const base = 'https://www.cliniqmaastricht.nl'
const recommended: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; canonical: string }> = {
  home: { title: 'CLINIQ Maastricht — Club, Events & Workshops | Platielstraat 9A', description: 'Op stap in Maastricht? Cliniq is open elke donderdag, vrijdag en zaterdag aan de Platielstraat 9A. Club, feestlocatie en cocktail workshops in het centrum van Maastricht.', ogTitle: 'CLINIQ Maastricht — Club, Events & Workshops', ogDescription: 'Op stap in Maastricht? Cliniq is open elke donderdag, vrijdag en zaterdag aan de Platielstraat 9A.', canonical: base },
  uitgaan: { title: 'Uitgaan Maastricht | Club Cliniq — Donderdag, Vrijdag & Zaterdag', description: 'Cliniq Maastricht is hét adres voor een avondje stappen. Donderdag 18+, vrijdag en zaterdag 21+, open vanaf 22:00 aan de Platielstraat 9A in het centrum van Maastricht.', ogTitle: 'Uitgaan Maastricht | Club Cliniq', ogDescription: 'Donderdag 18+, vrijdag en zaterdag 21+, open vanaf 22:00. Platielstraat 9A, Maastricht.', canonical: `${base}/uitgaan` },
  'cocktail-workshop': { title: 'Cocktail Workshop Maastricht | Cliniq — Boek nu vanaf €15', description: 'Cocktail workshop in Maastricht bij Cliniq. 2 uur lang cocktails leren maken. Prijs: €15 per cocktail, minimaal 3 p.p. Ideaal voor vrijgezellenfeesten en bedrijfsuitjes. Groepen v.a. 15 pers.', ogTitle: 'Cocktail Workshop Maastricht | Cliniq', ogDescription: '2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p. Voor vrijgezellenfeesten en bedrijfsuitjes. Groepen v.a. 15 personen.', canonical: `${base}/cocktail-workshop` },
  'event-space': { title: 'Ruimte Huren Maastricht | Feestzaal & Eventlocatie Cliniq — Tot 400 pers.', description: 'Feestlocatie of eventruimte huren in Maastricht? Cliniq biedt exclusieve zaalverhuur voor tot 400 personen. Voor privéfeesten, bedrijfsfeesten en vrijgezellenavonden. Platielstraat 9A.', ogTitle: 'Ruimte Huren Maastricht | Cliniq — Tot 400 personen', ogDescription: 'Exclusieve zaalverhuur in Maastricht voor privéfeesten, bedrijfsfeesten en vrijgezellenavonden. Tot 400 personen. Platielstraat 9A.', canonical: `${base}/event-space` },
  contact: { title: 'Contact | CLINIQ Maastricht — Platielstraat 9A, 6211 GV', description: 'Neem contact op met Cliniq Maastricht. Platielstraat 9A, 6211 GV Maastricht. Open donderdag, vrijdag en zaterdag. Vragen over lockers, dresscode, ruimte huren of cocktail workshops?', ogTitle: 'Contact | CLINIQ Maastricht', ogDescription: 'Platielstraat 9A, 6211 GV Maastricht. Open do, vr en za. Snel antwoord via WhatsApp of e-mail.', canonical: `${base}/contact` },
  fotos: { title: "Foto's Cliniq Maastricht — Clubavonden, Events & Workshops", description: "Bekijk foto's van Cliniq Maastricht. Sfeerimpressies van clubavonden, privéfeesten, cocktail workshops en events op de Platielstraat 9A in het centrum van Maastricht.", ogTitle: "Foto's | CLINIQ Maastricht", ogDescription: "Sfeerimpressies van clubavonden, events en cocktail workshops. Platielstraat 9A, Maastricht.", canonical: `${base}/fotos` },
  vacatures: { title: 'Vacatures Cliniq Maastricht — Werken in de horeca', description: 'Werken bij Cliniq Maastricht? Bekijk onze openstaande vacatures voor barmedewerkers en hospitality personeel. Platielstraat 9A, Maastricht.', ogTitle: 'Vacatures Cliniq Maastricht', ogDescription: 'Werken bij Cliniq Maastricht? Bekijk onze openstaande vacatures.', canonical: `${base}/vacatures` },
  'house-rules': { title: 'Huisregels | CLINIQ Maastricht', description: 'De huisregels van Cliniq Maastricht. Minimumleeftijd, dresscode, rookbeleid en meer. Lees voor je komst wat er van je wordt verwacht.', ogTitle: 'Huisregels | CLINIQ Maastricht', ogDescription: 'Minimumleeftijd, dresscode, rookbeleid en meer.', canonical: `${base}/house-rules` },
}

type SearchParams = { pageKey?: string; language?: string; recommended?: string; saved?: string }

export default async function SeoAdminPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const [store, params] = await Promise.all([readStore(), searchParams])
  const pageKey = params?.pageKey || store.pages[0]?.key || 'home'
  const language = (params?.language || 'nl') as 'nl' | 'en'
  const saved = store.seo.find((seo) => seo.pageKey === pageKey && seo.language === language)
  const defaults = recommended[pageKey] || { title: `${store.pages.find((p) => p.key === pageKey)?.titleNl || pageKey} | CLINIQ Maastricht`, description: 'CLINIQ Maastricht aan de Platielstraat 9A.', ogTitle: 'CLINIQ Maastricht', ogDescription: 'CLINIQ Maastricht aan de Platielstraat 9A.', canonical: `${base}/${pageKey}` }
  const useRecommended = params?.recommended === '1'
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
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Google & social</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">SEO Settings</h1>
      <p className="mt-3 max-w-3xl text-black/60">Edit page titles and social previews in plain language. Every field starts with a strong recommended default so nothing launches empty.</p>
      {params?.saved ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">SEO saved.</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {store.pages.map((page) => {
          const current = store.seo.find((seo) => seo.pageKey === page.key && seo.language === 'nl')
          const def = recommended[page.key]
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
        <button className="min-h-11 rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">Save SEO</button>
      </form>
    </aside>
  </div>
}
function Field({ name, label, defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} defaultValue={defaultValue || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }
function Area({ name, label, defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<textarea name={name} defaultValue={defaultValue || ''} rows={4} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }
function Select({ name, label, options, value }: { name:string; label:string; options:string[][]; value?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<select name={name} defaultValue={value || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label> }

import { savePageAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'

export default async function PagesAdminPage({ searchParams }: { searchParams?: Promise<{ key?: string }> }) {
  const query = await searchParams
  const store = await readStore()
  const page = store.pages.find((item) => item.key === (query?.key || 'home')) || store.pages[0]
  const hero = store.media.find((media) => media.id === page.heroImageId)
  const galleryIds = new Set(page.galleryImageIds || [])

  return <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
    <aside className="rounded-[2rem] bg-white p-4 shadow-sm"><h2 className="p-2 text-xl font-black">Pages</h2>{store.pages.map((item)=><a key={item.key} href={`/admin/pages?key=${item.key}`} className={`block rounded-2xl p-3 font-bold ${item.key===page.key?'bg-[#f02688] text-white':'hover:bg-black/5'}`}>{item.titleNl}<span className="block text-xs opacity-60">{item.titleEn}</span></a>)}<a href="/admin/seo" className="mt-4 block rounded-2xl bg-black p-3 text-sm font-black uppercase tracking-widest text-white">SEO settings →</a></aside>
    <section className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.28em] text-[#f02688]">Page editor</p><h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">{page.titleNl}</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]"><div className="rounded-3xl bg-[#f7f1e7] p-5"><p className="text-xs font-black uppercase tracking-widest text-black/50">Preview</p><h2 className="mt-2 text-3xl font-black">{page.heroTitleNl}</h2><p className="mt-2 text-black/60">{page.heroSubtitleNl}</p></div><div className="relative min-h-48 overflow-hidden rounded-3xl bg-black/10"><SafeImage src={hero?.url} fallbackSrc={images.fallbackWide} alt={hero?.altNl || page.titleNl} fill className="object-cover" objectPosition={hero?.focalPoint || 'center'} /></div></div>
      <form action={savePageAction} className="mt-8 grid gap-6"><input type="hidden" name="key" value={page.key}/>
        <div className="grid gap-5 lg:grid-cols-2"><div><h2 className="mb-4 text-2xl font-black">Nederlands</h2><Field name="heroTitleNl" label="Hero headline NL" defaultValue={page.heroTitleNl}/><Area name="heroSubtitleNl" label="Hero subtitle NL" defaultValue={page.heroSubtitleNl}/><Area name="bodyNl" label="Section body / SEO copy NL" defaultValue={page.bodyNl}/><Field name="primaryCtaNl" label="Primary CTA NL" defaultValue={page.primaryCtaNl}/><Field name="secondaryCtaNl" label="Secondary CTA NL" defaultValue={page.secondaryCtaNl}/></div><div><h2 className="mb-4 text-2xl font-black">English</h2><Field name="heroTitleEn" label="Hero headline EN" defaultValue={page.heroTitleEn}/><Area name="heroSubtitleEn" label="Hero subtitle EN" defaultValue={page.heroSubtitleEn}/><Area name="bodyEn" label="Section body / SEO copy EN" defaultValue={page.bodyEn}/><Field name="primaryCtaEn" label="Primary CTA EN" defaultValue={page.primaryCtaEn}/><Field name="secondaryCtaEn" label="Secondary CTA EN" defaultValue={page.secondaryCtaEn}/></div></div>
        <div className="grid gap-5 lg:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Hero image<select name="heroImageId" defaultValue={page.heroImageId || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="">Default fallback</option>{store.media.map((media)=><option key={media.id} value={media.id}>{media.title}</option>)}</select></label><label className="grid gap-2 text-sm font-bold">Gallery images<select name="galleryImageIds" multiple defaultValue={[...galleryIds]} className="min-h-40 rounded-2xl border border-black/10 bg-white px-4 py-3">{store.media.map((media)=><option key={media.id} value={media.id}>{media.title}</option>)}</select><span className="text-xs text-black/45">Hold Ctrl/Cmd to select multiple images.</span></label></div>
        <div className="grid gap-3 sm:grid-cols-3">{[...(page.galleryImageIds || [])].map((id) => { const media=store.media.find((item)=>item.id===id); return media ? <div key={id} className="relative aspect-[4/3] overflow-hidden rounded-2xl"><SafeImage src={media.url} alt={media.altNl || media.title} fill className="object-cover" objectPosition={media.focalPoint || 'center'} /></div> : null })}</div>
        <button className="w-fit rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Save page</button>
      </form>
    </section>
  </div>
}
function Field({ name,label,defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="mb-4 grid gap-2 text-sm font-bold">{label}<input name={name} defaultValue={defaultValue||''} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }
function Area({ name,label,defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="mb-4 grid gap-2 text-sm font-bold">{label}<textarea name={name} defaultValue={defaultValue||''} rows={5} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }

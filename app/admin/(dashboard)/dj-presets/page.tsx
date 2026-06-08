import { saveDjPresetAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'

type SearchParams = { edit?: string; saved?: string }

export default async function DjPresetsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const [store, params] = await Promise.all([readStore(), searchParams])
  const edit = store.djPresets.find((preset) => preset.id === params?.edit) || store.djPresets[0]
  const presetImage = store.media.find((media) => media.id === edit?.defaultImageId)

  return <div className="grid gap-8 xl:grid-cols-[1fr_440px]">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">DJ Presets</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Automatic event images</h1>
      <p className="mt-3 max-w-3xl text-black/60">Set a default image once per DJ. Regular events automatically use the DJ preset unless you override the image on the event.</p>
      {params?.saved ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">DJ preset saved.</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {store.djPresets.map((preset) => {
          const media = store.media.find((item) => item.id === preset.defaultImageId)
          return <a href={`/admin/dj-presets?edit=${preset.id}`} key={preset.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/3]"><SafeImage src={media?.url || images.fallbackEvent} fallbackSrc={images.fallbackEvent} alt={media?.altNl || preset.name} fill className="object-cover" objectPosition={media?.focalPoint || 'center'} /></div>
            <div className="p-5"><div className="flex flex-wrap gap-2"><Badge>{preset.active ? 'Active' : 'Inactive'}</Badge><Badge>{media ? 'Image set' : 'Needs image'}</Badge></div><h2 className="mt-3 text-2xl font-black">{preset.name}</h2><p className="mt-1 text-sm text-black/50">Aliases: {preset.aliases.length ? preset.aliases.join(', ') : 'None'}</p><p className="mt-1 text-sm text-black/50">Fallback: {preset.fallbackCategory}</p></div>
          </a>
        })}
      </div>
    </section>

    <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Edit DJ preset</h2>
      {edit ? <div className="mt-4 overflow-hidden rounded-3xl bg-black/5"><div className="relative aspect-[4/3]"><SafeImage src={presetImage?.url || images.fallbackEvent} fallbackSrc={images.fallbackEvent} alt={presetImage?.altNl || edit.name} fill className="object-cover" objectPosition={presetImage?.focalPoint || 'center'} /></div></div> : null}
      <form action={saveDjPresetAction} className="mt-6 grid gap-4">
        <input type="hidden" name="id" value={edit?.id || ''} />
        <Field name="name" label="DJ name" defaultValue={edit?.name} required />
        <Field name="aliases" label="Aliases (comma separated)" defaultValue={edit?.aliases.join(', ')} />
        <label className="grid gap-2 text-sm font-bold">Default image<select name="defaultImageId" defaultValue={edit?.defaultImageId || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="">No DJ image yet</option>{store.media.map((media) => <option key={media.id} value={media.id}>{media.title}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold">Fallback image category<select name="fallbackCategory" defaultValue={edit?.fallbackCategory || 'dj'} className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="dj">DJ</option><option value="event">Event</option><option value="uitgaan">Uitgaan</option><option value="crowd">Crowd</option><option value="homepage">Homepage</option></select></label>
        <input type="hidden" name="active" value="false" /><label className="flex items-center gap-3 font-bold"><input type="checkbox" name="active" defaultChecked={edit?.active !== false} /> Active</label>
        <button className="min-h-11 rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">Save DJ preset</button>
      </form>
    </aside>
  </div>
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-[#f02688] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">{children}</span> }
function Field({ name, label, defaultValue, required=false }: { name:string; label:string; defaultValue?:string; required?:boolean }) { return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} defaultValue={defaultValue || ''} required={required} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }

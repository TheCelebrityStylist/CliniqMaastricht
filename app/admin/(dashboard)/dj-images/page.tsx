import { removeDjImageAction, saveDjImageAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'

type SearchParams = { saved?: string; removed?: string; error?: string }

export default async function DjImagesPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const [store, params] = await Promise.all([readStore(), searchParams])
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

  return <div className="grid gap-8">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">DJ Images</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">DJ Images</h1>
      <p className="mt-3 max-w-3xl text-black/60">Set one image per DJ. Regular events automatically use this image.</p>
      {!hasBlob ? <p className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-900">Image uploads are not active yet. Add BLOB_READ_WRITE_TOKEN in Vercel → Project Settings → Environment Variables. Redeploy after adding it.</p> : null}
      {params?.saved ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">DJ image updated. Regular events for this DJ now use it automatically.</p> : null}
      {params?.removed ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">DJ image removed.</p> : null}
      {params?.error ? <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">Upload failed. Use JPG, PNG or WebP images up to 10MB.</p> : null}
    </section>

    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {store.djImages.map((dj) => <article key={dj.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <div className="relative aspect-[4/5] bg-black/5"><SafeImage src={dj.imageUrl || images.fallbackEvent} fallbackSrc={images.fallbackEvent} alt={dj.imageAltNl} fill className="object-cover" /></div>
        <div className="grid gap-4 p-5">
          <div><div className="flex flex-wrap gap-2"><Badge>{dj.imageUrl ? 'Image set' : 'Needs image'}</Badge>{dj.active ? <Badge>Active</Badge> : null}</div><h2 className="mt-3 text-3xl font-black">{dj.name}</h2>{dj.aliases.length ? <p className="mt-1 text-sm text-black/55">Aliases: {dj.aliases.join(', ')}</p> : null}</div>
          <form action={saveDjImageAction} className="grid gap-3">
            <input type="hidden" name="id" value={dj.id} />
            <input type="hidden" name="name" value={dj.name} />
            <input type="hidden" name="returnTo" value="/admin/dj-images" />
            <label className={`grid gap-2 rounded-2xl border-2 border-dashed p-4 text-center text-sm font-bold ${hasBlob ? 'cursor-pointer border-black/20 bg-[#f7f1e7] hover:border-[#f02688]' : 'cursor-not-allowed border-amber-300 bg-amber-50 text-amber-900'}`}>
              Replace image
              <input disabled={!hasBlob} type="file" name="image" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" />
            </label>
            <button disabled={!hasBlob} className="min-h-11 rounded-full bg-[#f02688] px-5 py-3 text-xs font-black uppercase tracking-widest text-white disabled:opacity-40">Upload DJ image</button>
          </form>
          <form action={removeDjImageAction}><input type="hidden" name="id" value={dj.id} />
            <input type="hidden" name="name" value={dj.name} />
            <input type="hidden" name="returnTo" value="/admin/dj-images" /><button disabled={!dj.imageUrl} className="min-h-11 rounded-full border border-black/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-black/65 disabled:opacity-35">Remove image</button></form>
        </div>
      </article>)}
    </section>
  </div>
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-[#f02688] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">{children}</span> }

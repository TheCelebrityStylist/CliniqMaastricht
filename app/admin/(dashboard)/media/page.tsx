import Image from 'next/image'
import { readStore } from '@/lib/admin/store'
import { saveMediaAction } from '@/lib/admin/actions'

type MediaSearchParams = { error?: string; saved?: string }

export default async function MediaAdminPage({ searchParams }: { searchParams?: Promise<MediaSearchParams> }) {
  const [store, query] = await Promise.all([readStore(), searchParams])
  const errorMessage = query?.error === 'blob-token'
    ? 'Upload failed because Vercel Blob is not connected yet. Add BLOB_READ_WRITE_TOKEN in Vercel, redeploy, or paste an already-hosted Cliniq image URL instead.'
    : query?.error === 'image-required'
      ? 'Add an image file or paste an image URL before saving.'
      : ''

  return <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f02688]">Photos</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.05em]">Media Library</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {store.media.map((media) => <article key={media.id} className="overflow-hidden rounded-[2rem] bg-white">
          <div className="relative aspect-[4/3]"><Image src={media.url} alt={media.altNl || media.title} fill className="object-cover" /></div>
          <div className="p-4"><strong>{media.title}</strong><p className="mt-1 text-sm text-black/50">{media.usage?.join(', ')}</p></div>
        </article>)}
      </div>
    </section>
    <aside className="rounded-[2rem] bg-white p-6">
      <h2 className="text-2xl font-black">Add uploaded photo</h2>
      <p className="mt-2 text-sm text-black/60">Upload approved Cliniq photos directly, or paste a hosted Cliniq image URL. Direct uploads use Vercel Blob when <code>BLOB_READ_WRITE_TOKEN</code> is configured.</p>
      {errorMessage ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{errorMessage}</p> : null}
      {query?.saved ? <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Image saved.</p> : null}
      <form action={saveMediaAction} className="mt-6 grid gap-4">
        <Field name="title" label="Image title" required />
        <label className="grid gap-2 text-sm font-bold">Upload photo<input name="file" type="file" accept="image/*" className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label>
        <Field name="url" label="Image URL (optional if uploading file)" />
        <Field name="altNl" label="Alt text NL" />
        <Field name="altEn" label="Alt text EN" />
        <Field name="usage" label="Usage tags, comma separated" />
        <button className="rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Save image</button>
      </form>
    </aside>
  </div>
}

function Field({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} required={required} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label>
}

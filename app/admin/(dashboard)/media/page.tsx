import { deleteMediaAction, saveMediaAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import MediaUploadField from '@/components/admin/MediaUploadField'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'

type MediaSearchParams = { error?: string; saved?: string; deleted?: string; tag?: string }
const tags = ['all', 'nightlife', 'cocktail workshop', 'event space', 'bar', 'hero', 'gallery', 'event poster']

export default async function MediaAdminPage({ searchParams }: { searchParams?: Promise<MediaSearchParams> }) {
  const [store, query] = await Promise.all([readStore(), searchParams])
  const activeTag = query?.tag || 'all'
  const filteredMedia = activeTag === 'all' ? store.media : store.media.filter((media) => media.usage?.some((tag) => tag.toLowerCase().includes(activeTag)))
  const usedBy = (id: string) => [
    ...store.pages.filter((page) => page.heroImageId === id || page.galleryImageIds?.includes(id)).map((page) => page.titleNl),
    ...store.events.filter((event) => event.imageUrl && store.media.find((media) => media.id === id)?.url === event.imageUrl).map((event) => event.titleNl || event.title),
  ]
  const errorMessage = query?.error === 'blob-token'
    ? 'Upload failed because Vercel Blob is not connected yet. Add BLOB_READ_WRITE_TOKEN in Vercel, redeploy, or paste hosted Cliniq image URLs instead.'
    : query?.error === 'image-required'
      ? 'Add one or more image files or paste at least one image URL before saving.'
      : query?.error === 'in-use'
        ? 'This image is still used by a page or event. Replace it there before deleting.'
        : ''

  return <div className="grid gap-8 xl:grid-cols-[1fr_440px]">
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.28em] text-[#f02688]">Photos</p><h1 className="mt-3 text-5xl font-black tracking-[-0.05em]">Media Library</h1><p className="mt-3 max-w-2xl text-black/60">Upload real Cliniq images, tag them by use, and assign them to pages or events. The public site uses these images first and branded fallbacks only when needed.</p></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{tags.map((tag) => <a key={tag} href={`/admin/media?tag=${encodeURIComponent(tag)}`} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${activeTag === tag ? 'bg-[#f02688] text-white' : 'bg-white text-black/65 hover:bg-black hover:text-white'}`}>{tag}</a>)}</div>
      {errorMessage ? <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{errorMessage}</p> : null}
      {query?.saved ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Image saved.</p> : null}
      {query?.deleted ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Unused image deleted.</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMedia.map((media) => {
          const usage = usedBy(media.id)
          return <article key={media.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="relative aspect-[4/3]"><SafeImage src={media.url} fallbackSrc={images.fallbackWide} alt={media.altNl || media.title} fill className="object-cover" objectPosition={media.focalPoint || 'center'} /></div>
            <div className="space-y-3 p-4">
              <div><strong>{media.title}</strong><p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#f02688]">{media.usage?.join(' · ') || 'untagged'}</p></div>
              <p className="text-sm text-black/60">Used by: {usage.length ? usage.join(', ') : 'Not assigned yet'}</p>
              <p className="text-xs text-black/45">Focal point: {media.focalPoint || 'center'}</p>
              <form action={deleteMediaAction}><input type="hidden" name="id" value={media.id} /><button className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-black">Delete if unused</button></form>
            </div>
          </article>
        })}
      </div>
    </section>
    <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Upload Cliniq photos</h2>
      <p className="mt-2 text-sm text-black/60">Drag photos onto the file field or select multiple files. Add tags once and the images are ready to choose in Events and Pages.</p>
      <form action={saveMediaAction} className="mt-6 grid gap-4">
        <Field name="title" label="Image title / batch name" required />
        <MediaUploadField />
        <label className="grid gap-2 text-sm font-bold">Or paste hosted image URLs<textarea name="url" rows={4} placeholder="One image URL per line" className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label>
        <Field name="altNl" label="Alt text NL" />
        <Field name="altEn" label="Alt text EN" />
        <label className="grid gap-2 text-sm font-bold">Usage tags<select name="usage" defaultValue="nightlife, hero" className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option>nightlife, hero</option><option>cocktail workshop, gallery</option><option>event space, gallery</option><option>bar, cocktail workshop</option><option>event poster, nightlife</option></select></label>
        <label className="grid gap-2 text-sm font-bold">Focal point<select name="focalPoint" defaultValue="center" className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></label>
        <button className="rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Save images</button>
      </form>
    </aside>
  </div>
}

function Field({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} required={required} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label>
}

import { bulkDeleteMediaAction, deleteMediaAction, saveMediaAction, updateMediaAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import MediaUploadField from '@/components/admin/MediaUploadField'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'

type MediaSearchParams = { error?: string; saved?: string; deleted?: string; tag?: string; q?: string }
const tags = ['all', 'homepage', 'uitgaan', 'cocktail-workshop', 'ruimte-huren', 'event', 'album', 'bar', 'crowd', 'dj', 'workshop', 'private-event']

export default async function MediaAdminPage({ searchParams }: { searchParams?: Promise<MediaSearchParams> }) {
  const [store, query] = await Promise.all([readStore(), searchParams])
  const activeTag = query?.tag || 'all'
  const search = (query?.q || '').toLowerCase().trim()
  const filteredMedia = store.media.filter((media) => {
    const tagMatch = activeTag === 'all' || media.usage?.some((tag) => tag.toLowerCase().includes(activeTag))
    const searchMatch = !search || [media.title, media.altNl, media.altEn, media.url, ...(media.usage || [])].join(' ').toLowerCase().includes(search)
    return tagMatch && searchMatch
  })
  const usedBy = (id: string) => [
    ...store.pages.filter((page) => page.heroImageId === id || page.galleryImageIds?.includes(id)).map((page) => page.titleNl),
    ...store.events.filter((event) => event.imageUrl && store.media.find((media) => media.id === id)?.url === event.imageUrl).map((event) => event.titleNl || event.title),
    ...store.albums.filter((album) => album.coverImageId === id || album.imageIds.includes(id)).map((album) => album.titleNl),
  ]
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const errorMessage = query?.error === 'blob-token'
    ? 'Upload failed because Vercel Blob is not connected yet. Add BLOB_READ_WRITE_TOKEN in Vercel, redeploy, or paste hosted Cliniq image URLs instead.'
    : query?.error === 'image-required'
      ? 'Add one or more image files or paste at least one image URL before saving.'
      : query?.error === 'in-use'
        ? 'This image is still used by a page, event or album. Replace it there before deleting.'
        : ''

  return <div className="grid gap-8 xl:grid-cols-[1fr_440px]">
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Photos</p><h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Media Library</h1><p className="mt-3 max-w-2xl text-black/60">Drag, drop, tag and reuse photos directly inside CLINIQ admin. No Google Drive, no URL spreadsheet, no developer workflow.</p></div>
      </div>
      {!process.env.BLOB_READ_WRITE_TOKEN ? <p className="mt-6 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-800">Uploads are not active yet. Add BLOB_READ_WRITE_TOKEN in Vercel → Project Settings → Environment Variables. After redeploy, drag-and-drop upload will work.</p> : null}
      <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black">Simple upload flow</h2>
        <div className="mt-4 grid gap-3 text-sm text-black/60 md:grid-cols-3">
          <p className="rounded-2xl bg-[#f7f1e7] p-4"><strong>1. Upload</strong><br />Drag one or many images into the upload field.</p>
          <p className="rounded-2xl bg-[#f7f1e7] p-4"><strong>2. Tag</strong><br />Pick tags like homepage, uitgaan, event, album or workshop.</p>
          <p className="rounded-2xl bg-[#f7f1e7] p-4"><strong>3. Reuse</strong><br />Select photos in events, pages and albums visually.</p>
        </div>
      </div>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row"><input name="q" defaultValue={query?.q || ''} placeholder="Search title, alt text or tag" className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold"/><input type="hidden" name="tag" value={activeTag}/><button className="rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Search</button></form>
      <div className="mt-4 flex flex-wrap gap-2">{tags.map((tag) => <a key={tag} href={`/admin/media?tag=${encodeURIComponent(tag)}${query?.q ? `&q=${encodeURIComponent(query.q)}` : ''}`} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${activeTag === tag ? 'bg-[#f02688] text-white' : 'bg-white text-black/65 hover:bg-black hover:text-white'}`}>{tag}</a>)}</div>
      {errorMessage ? <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{errorMessage}</p> : null}
      {query?.saved ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Media saved.</p> : null}
      {query?.deleted ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Unused image deleted.</p> : null}

      <form action={bulkDeleteMediaAction} className="mt-6 rounded-[2rem] bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="text-lg font-black">Bulk delete unused images</h2><p className="mt-1 text-sm text-black/55">Select multiple unused images. Images used by pages, events or albums are protected.</p></div><button className="rounded-full border border-red-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-600">Delete selected</button></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{filteredMedia.map((media)=><label key={media.id} className="flex items-center gap-2 rounded-2xl bg-[#f7f1e7] px-3 py-2 text-xs font-bold"><input type="checkbox" name="mediaIds" value={media.id}/><span className="truncate">{media.title}</span></label>)}</div></form>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMedia.map((media) => {
          const usage = usedBy(media.id)
          return <article key={media.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="relative aspect-[4/3]"><SafeImage src={media.url} fallbackSrc={images.fallbackWide} alt={media.altNl || media.title} fill className="object-cover" objectPosition={media.focalPoint || 'center'} /></div>
            <div className="space-y-3 p-4">
              <form action={updateMediaAction} className="grid gap-2"><input type="hidden" name="id" value={media.id}/><Field name="title" label="Title" defaultValue={media.title}/><Field name="altNl" label="Alt NL" defaultValue={media.altNl}/><Field name="altEn" label="Alt EN" defaultValue={media.altEn}/><Field name="usage" label="Tags" defaultValue={media.usage?.join(', ')}/><label className="grid gap-1 text-xs font-black uppercase tracking-widest text-black/55">Replace image upload<input name="replacementFiles" type="file" accept="image/*" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm normal-case tracking-normal" /></label><Field name="replacementUrl" label="Replace image globally with URL" placeholder="Optional Cliniq/Squarespace image URL"/><label className="grid gap-1 text-xs font-black uppercase tracking-widest text-black/55">Focal point<select name="focalPoint" defaultValue={media.focalPoint || 'center'} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm normal-case tracking-normal"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></label><button className="rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white">Save image</button></form>
              <p className="text-sm text-black/60">Used by: {usage.length ? usage.join(', ') : 'Not assigned yet'}</p>
              <form action={deleteMediaAction}><input type="hidden" name="id" value={media.id} /><button className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-black">Delete if unused</button></form>
            </div>
          </article>
        })}
      </div>
    </section>
    <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Upload Cliniq photos</h2>
      <p className="mt-2 text-sm text-black/60">Drag photos onto the field or select multiple files. URL paste remains as a backup for existing Cliniq/Squarespace assets.</p>
      <form action={saveMediaAction} className="mt-6 grid gap-4">
        <Field name="title" label="Image title / batch name" required />
        <MediaUploadField disabled={!hasBlob} />
        <label className="grid gap-2 text-sm font-bold">Backup: hosted Cliniq image URLs<textarea name="url" rows={4} placeholder="One Cliniq/Squarespace URL per line" className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label>
        <Field name="altNl" label="Alt text NL" />
        <Field name="altEn" label="Alt text EN" />
        <label className="grid gap-2 text-sm font-bold">Usage tags<select name="usage" defaultValue="nightlife, hero" className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option>homepage, hero</option><option>uitgaan, crowd</option><option>cocktail-workshop, workshop</option><option>ruimte-huren, private-event</option><option>event, dj</option><option>album, gallery</option></select></label>
        <label className="grid gap-2 text-sm font-bold">Focal point<select name="focalPoint" defaultValue="center" className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></label>
        <button className="rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">Save photos</button>
      </form>
    </aside>
  </div>
}
function Field({ name, label, defaultValue, placeholder, required=false }: { name:string; label:string; defaultValue?:string; placeholder?:string; required?:boolean }) { return <label className="grid gap-1 text-xs font-black uppercase tracking-widest text-black/55">{label}<input name={name} defaultValue={defaultValue || ''} placeholder={placeholder || ''} required={required} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm normal-case tracking-normal" /></label> }

import { deleteAlbumAction, saveAlbumAction, toggleAlbumPublishedAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import MediaUploadField from '@/components/admin/MediaUploadField'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'

type AlbumSearchParams = { edit?: string; saved?: string; deleted?: string }

export default async function AlbumsAdminPage({ searchParams }: { searchParams?: Promise<AlbumSearchParams> }) {
  const [store, query] = await Promise.all([readStore(), searchParams])
  const edit = store.albums.find((album) => album.id === query?.edit)
  const albumImageIds = edit?.imageIds || []
  const sortedAlbums = [...store.albums].sort((a, b) => b.date.localeCompare(a.date))

  return <div className="grid gap-8 xl:grid-cols-[1fr_480px]">
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Photo albums</p><h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Albums</h1><p className="mt-3 max-w-2xl text-black/60">Create a night, upload a batch, pick the cover, publish. Albums feed /fotos, /en/photos and the public gallery blocks.</p></div><a href="/admin/albums" className="rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-white">New album</a></div>
      {!process.env.BLOB_READ_WRITE_TOKEN ? <p className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-800">Image uploads are not configured yet. Add BLOB_READ_WRITE_TOKEN in Vercel.</p> : null}
      {query?.saved ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Album saved.</p> : null}
      {query?.deleted ? <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">Album deleted.</p> : null}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {sortedAlbums.map((album) => {
          const cover = store.media.find((media) => media.id === album.coverImageId) || store.media.find((media) => media.id === album.imageIds[0])
          return <article key={album.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="relative aspect-[4/3]"><SafeImage src={cover?.url} fallbackSrc={images.fallbackWide} alt={cover?.altNl || album.titleNl} fill className="object-cover" objectPosition={cover?.focalPoint || 'center'} /></div>
            <div className="space-y-3 p-5"><div className="flex flex-wrap gap-2"><Badge>{album.published ? 'Published' : 'Draft'}</Badge><Badge>{album.imageIds.length} photos</Badge>{!cover ? <Badge tone="warn">Needs cover</Badge> : null}</div><h2 className="text-2xl font-black">{album.titleNl}</h2><p className="line-clamp-2 text-sm text-black/60">{album.descriptionNl || 'No Dutch album description yet.'}</p><p className="text-sm text-black/55">{album.date} · /fotos/{album.slug}</p><div className="flex flex-wrap gap-2"><a href={`/admin/albums?edit=${album.id}`} className="rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white">Edit</a><form action={toggleAlbumPublishedAction}><input type="hidden" name="id" value={album.id}/><button className="rounded-full bg-[#f02688] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">{album.published ? 'Unpublish' : 'Publish'}</button></form><form action={deleteAlbumAction}><input type="hidden" name="id" value={album.id}/><button className="rounded-full border border-red-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-600">Delete</button></form></div></div>
          </article>
        })}
      </div>
    </section>
    <aside className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">{edit ? 'Edit album' : 'Create album'}</h2><p className="mt-2 text-sm text-black/60">Mass upload real Cliniq photos. URL paste is only a backup for already-hosted Cliniq/Squarespace images.</p>
      <form action={saveAlbumAction} className="mt-6 grid gap-4"><input type="hidden" name="id" defaultValue={edit?.id}/>
        <Field name="titleNl" label="Album title NL" defaultValue={edit?.titleNl} required />
        <Field name="titleEn" label="Album title EN" defaultValue={edit?.titleEn} />
        <Area name="descriptionNl" label="Album description NL" defaultValue={edit?.descriptionNl} />
        <Area name="descriptionEn" label="Album description EN" defaultValue={edit?.descriptionEn} />
        <Field name="date" label="Album date" type="date" defaultValue={edit?.date} required />
        <label className="grid gap-2 text-sm font-bold">Related event<select name="relatedEventId" defaultValue={edit?.relatedEventId || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="">No event</option>{store.events.map((event)=><option key={event._id} value={event._id}>{event.titleNl || event.title}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold">Cover image<select name="coverImageId" defaultValue={edit?.coverImageId || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="">First image</option>{store.media.map((media)=><option key={media.id} value={media.id}>{media.title}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold">Existing photos<select name="imageIds" multiple defaultValue={[...albumImageIds]} className="min-h-44 rounded-2xl border border-black/10 bg-white px-4 py-3">{store.media.map((media)=><option key={media.id} value={media.id}>{media.title}</option>)}</select><span className="text-xs text-black/45">Select in the order you want them shown; uploaded photos are appended after selected images.</span></label>
        <MediaUploadField />
        <label className="grid gap-2 text-sm font-bold">Focal point for uploaded photos<select name="focalPoint" defaultValue="center" className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></label>
        <input type="hidden" name="published" value="false" /><label className="flex items-center gap-3 font-bold"><input type="checkbox" name="published" defaultChecked={edit?.published !== false} /> Published</label>
        <button className="rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">Save album</button>
      </form>
    </aside>
  </div>
}
function Badge({ children, tone='default' }: { children: React.ReactNode; tone?: 'default' | 'warn' }) { return <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${tone === 'warn' ? 'bg-amber-100 text-amber-800' : 'bg-[#f02688] text-white'}`}>{children}</span> }
function Field({ name, label, defaultValue, type='text', required=false }: { name:string; label:string; defaultValue?:string; type?:string; required?:boolean }) { return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} type={type} defaultValue={defaultValue || ''} required={required} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }
function Area({ name, label, defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<textarea name={name} rows={4} defaultValue={defaultValue || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }

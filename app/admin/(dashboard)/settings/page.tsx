import { defaultStore } from '@/lib/admin/defaults'
import { getDatabaseStatus, readStore } from '@/lib/admin/store'
import { saveSettingsAction, testDatabaseAction } from '@/lib/admin/actions'

type SearchParams = { dbTest?: string; dbMessage?: string; marker?: string; saved?: string }

export default async function SettingsAdminPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = await searchParams
  const dbStatus = await getDatabaseStatus()
  const storeResult = await readStore()
    .then((store) => ({ store, error: '' }))
    .catch((error) => ({ store: defaultStore, error: error instanceof Error ? error.message : 'Admin data could not be loaded.' }))
  const store = storeResult.store
  const s = store.settings
  const uploadsActive = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const latestImage = store.media[0]
  const customDjImages = store.djImages.filter((dj) => dj.imageUrl).length
  const customPageHeroes = store.pages.filter((page) => page.heroImageId || page.heroImageUrl).length
  const dbTone = dbStatus.status === 'Connected' ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'

  return <div className="grid max-w-4xl gap-6">
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Global</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Settings</h1>
      <div className={`mt-6 rounded-3xl p-5 ${dbTone}`}>
        <h2 className="text-2xl font-black">Database status: {dbStatus.status}</h2>
        <p className="mt-2 text-sm font-bold">Provider: {dbStatus.provider}</p>
        <p className="mt-1 text-sm font-bold">{dbStatus.message}</p>
        {storeResult.error ? <p className="mt-3 rounded-2xl bg-white/70 p-3 text-sm font-black">Admin data read error: {storeResult.error}</p> : null}
        <form action={testDatabaseAction} className="mt-4">
          <button className="rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">Test database save</button>
        </form>
        {params?.dbTest === 'success' ? <p className="mt-3 rounded-2xl bg-white/70 p-3 text-sm font-black">Database test saved, read back and cleaned up successfully. Marker: {params.marker}</p> : null}
        {params?.dbTest === 'fail' ? <p className="mt-3 rounded-2xl bg-white/70 p-3 text-sm font-black">Database test failed: {params.dbMessage}</p> : null}
      </div>
      <div className={`mt-6 rounded-3xl p-5 ${uploadsActive ? 'bg-green-50 text-green-900' : 'bg-yellow-50 text-yellow-900'}`}>
        <h2 className="text-2xl font-black">Upload storage status: {uploadsActive ? 'Active' : 'Not configured'}</h2>
        {uploadsActive ? <p className="mt-2 text-sm font-bold">Vercel Blob uploads are active. DJ images, page images and albums can be uploaded from the admin.</p> : <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm font-bold"><li>Go to Vercel</li><li>Open project</li><li>Settings</li><li>Environment Variables</li><li>Add BLOB_READ_WRITE_TOKEN</li><li>Redeploy</li></ol>}
      </div>
      <details className="mt-5 rounded-3xl border border-black/10 p-5"><summary className="cursor-pointer font-black">Advanced · Optional import tools</summary><div className="mt-4 grid gap-3"><p className="text-sm text-black/60">Optional one-time import from Google Drive. This is not sync and not daily content management.</p><input disabled placeholder="https://drive.google.com/drive/folders/1dNwH8AbAKTq0TfACVbnbE8n7Tu5Pbgnl" className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm" /><p className="text-xs text-black/45">Could not import this folder. Make the folder public or upload the images directly.</p></div></details>
    </section>

    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Image Upload Debug</h2>
      <div className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-2">
        <p>Blob token configured: {uploadsActive ? 'yes' : 'no'}</p>
        <p>Last upload status: {latestImage ? 'saved' : 'no uploads yet'}</p>
        <p>Last saved image URL: {latestImage?.url || '—'}</p>
        <p>Storage provider: Vercel Blob + admin store</p>
        <p>Image records: {store.media.length}</p>
        <p>DJ images with custom images: {customDjImages}</p>
        <p>Pages with custom hero images: {customPageHeroes}</p>
        <p>Albums: {store.albums.length}</p>
      </div>
    </section>

    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Contact and social settings</h2>
      <form action={saveSettingsAction} className="mt-8 grid gap-4"><Field name="phone" label="Phone" defaultValue={s.phone}/><Field name="email" label="Email" defaultValue={s.email}/><Field name="whatsapp" label="WhatsApp URL" defaultValue={s.whatsapp}/><Field name="address" label="Address" defaultValue={s.address}/><Field name="instagram" label="Instagram" defaultValue={s.instagram}/><Field name="tiktok" label="TikTok" defaultValue={s.tiktok}/><label className="grid gap-2 text-sm font-bold">Opening hours<textarea name="openingHours" defaultValue={s.openingHours.join('\n')} rows={7} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label><button className="w-fit rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">Save settings</button></form>
    </section>
  </div>
}
function Field({ name,label,defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} defaultValue={defaultValue||''} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }

import Link from 'next/link'
import { deleteEventAction, saveEventAction, toggleEventPublishedAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import SafeImage from '@/components/ui/SafeImage'
import MediaUploadField from '@/components/admin/MediaUploadField'
import { images } from '@/lib/site'

const quickArtists = ['JINK', 'Paul Gouda', 'DJANBE', 'DJ Hadless', 'DJ BIG ROB', 'DJ SDNX', 'DJ AK']
const presets = [
  { label: 'Thursday regular night', startTime: '22:00', endTime: '02:00', ageLimit: '18+' },
  { label: 'Friday regular night', startTime: '22:00', endTime: '03:00', ageLimit: '21+' },
  { label: 'Saturday regular night', startTime: '22:00', endTime: '03:00', ageLimit: '21+' },
]

type SearchParams = { edit?: string; duplicate?: string; saved?: string; deleted?: string }

export default async function EventsAdminPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) || {}
  const store = await readStore()
  const events = [...store.events].sort((a, b) => `${b.date} ${b.startTime || ''}`.localeCompare(`${a.date} ${a.startTime || ''}`))
  const media = store.media.filter((item) => (item.usage || []).includes('event') || (item.usage || []).includes('uitgaan') || (item.usage || []).includes('dj') || (item.usage || []).includes('crowd'))
  const sourceEvent = store.events.find((event) => event._id === (params.edit || params.duplicate))
  const editing = params.edit ? sourceEvent : undefined
  const duplicated = params.duplicate ? sourceEvent : undefined
  const formEvent = editing || duplicated

  return <div className="grid gap-8">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Events</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Simple event manager</h1>
      <p className="mt-3 max-w-3xl text-black/60">Create, edit, duplicate, publish and image your own agenda directly inside the website. No Google Sheets. No technical CMS.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/events" className="rounded-full bg-[#12070c] px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Add Event</Link>
        <Link href="/admin/events/bulk" className="rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black/70">Bulk Events</Link>
      </div>
      {params.saved ? <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">Saved.</p> : null}
      {params.deleted ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">Deleted.</p> : null}
      {!process.env.BLOB_READ_WRITE_TOKEN ? <p className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-800">Image uploads are not configured yet. Add BLOB_READ_WRITE_TOKEN in Vercel.</p> : null}
    </section>

    <section className="rounded-[2rem] bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#f02688]">{editing ? 'Edit event' : duplicated ? 'Duplicate event' : 'Add event'}</p>
          <h2 className="mt-2 text-3xl font-black">Click date, choose artist, save.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => <span key={preset.label} className="rounded-full bg-[#f5f1ea] px-4 py-2 text-xs font-black text-black/55">{preset.label}: {preset.startTime}–{preset.endTime}, {preset.ageLimit}</span>)}
        </div>
      </div>

      <form action={saveEventAction} className="mt-8 grid gap-6">
        {editing ? <input type="hidden" name="_id" value={editing._id} /> : null}
        <datalist id="artists">{quickArtists.map((artist) => <option key={artist} value={artist} />)}</datalist>
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="grid gap-2 text-sm font-bold lg:col-span-2">Event name / DJ
            <input name="title" list="artists" defaultValue={formEvent?.title || ''} placeholder="JINK" required className="rounded-2xl border border-black/10 px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-bold">Date
            <input type="date" name="date" defaultValue={formEvent?.date || ''} required className="rounded-2xl border border-black/10 px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-bold">Event type
            <select name="eventType" defaultValue={formEvent?.eventType || 'regular'} className="rounded-2xl border border-black/10 px-4 py-3">
              <option value="regular">Regular night</option>
              <option value="featured">Featured event</option>
              <option value="special">Private/special event</option>
              <option value="private">Private night</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold">Opening time<input name="startTime" placeholder="22:00" defaultValue={formEvent?.startTime || ''} className="rounded-2xl border border-black/10 px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold">Closing time<input name="endTime" placeholder="03:00" defaultValue={formEvent?.endTime || ''} className="rounded-2xl border border-black/10 px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold">Minimum age<input name="ageLimit" placeholder="21+" defaultValue={formEvent?.ageLimit || ''} className="rounded-2xl border border-black/10 px-4 py-3" /></label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-black/10 p-4">
            <p className="text-sm font-black">Upload/select event image</p>
            <p className="mt-1 text-xs text-black/50">Drag an image here or choose one from the library.</p>
            <div className="mt-4"><MediaUploadField name="eventImageFiles" multiple={false} label="Upload event image" /></div>
            <label className="mt-4 grid gap-2 text-sm font-bold">Choose existing image
              <select name="imageUrl" defaultValue={formEvent?.imageUrl || ''} className="rounded-2xl border border-black/10 px-4 py-3">
                <option value="">Use uploaded or fallback</option>
                {media.map((item) => <option key={item.id} value={item.url}>{item.title}</option>)}
              </select>
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold">Manual image URL (backup only)<input name="manualImageUrl" placeholder="https://..." defaultValue="" className="rounded-2xl border border-black/10 px-4 py-3" /></label>
          </div>

          <div className="rounded-3xl border border-black/10 p-4">
            <p className="text-sm font-black">Featured-only details</p>
            <p className="mt-1 text-xs text-black/50">Regular nights ignore descriptions and CTAs on public cards.</p>
            <div className="mt-4 grid gap-3">
              <textarea name="shortDescriptionNl" defaultValue={formEvent?.shortDescriptionNl || ''} placeholder="Short Dutch description" className="min-h-24 rounded-2xl border border-black/10 px-4 py-3" />
              <textarea name="shortDescriptionEn" defaultValue={formEvent?.shortDescriptionEn || ''} placeholder="Short English description" className="min-h-24 rounded-2xl border border-black/10 px-4 py-3" />
              <input name="ticketUrl" defaultValue={formEvent?.ticketUrl || ''} placeholder="Ticket / CTA link" className="rounded-2xl border border-black/10 px-4 py-3" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-[#f5f1ea] p-4 text-sm font-bold">
          <input type="hidden" name="published" value="false" /><label className="inline-flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={formEvent?.published !== false} /> Published</label>
          <input type="hidden" name="featured" value="false" /><label className="inline-flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={Boolean(formEvent?.featured)} /> Featured</label>
          <input type="hidden" name="showDetailCTA" value="false" /><label className="inline-flex items-center gap-2"><input type="checkbox" name="showDetailCTA" defaultChecked={Boolean(formEvent?.showDetailCTA)} /> Show detail page / CTA</label>
        </div>

        <button className="min-h-11 rounded-full bg-[#f02688] px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-[#12070c]">Save Event</button>
      </form>
    </section>

    <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="border-b border-black/5 p-5"><h2 className="text-2xl font-black">All events</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[#12070c] text-xs uppercase tracking-widest text-white/70"><tr><th className="px-4 py-3">Image</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Age</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-black/5">
            {events.map((event) => <tr key={event._id} className="align-middle">
              <td className="px-4 py-4"><div className="relative h-16 w-12 overflow-hidden rounded-xl bg-black/5"><SafeImage src={event.imageUrl || images.fallbackEvent} fallbackSrc={images.fallbackEvent} alt={event.title} fill className="object-cover" /></div></td>
              <td className="px-4 py-4 font-black">{event.date}</td>
              <td className="px-4 py-4"><div className="font-black">{event.title}</div><div className="text-xs text-black/45">{event.slug?.current}</div></td>
              <td className="px-4 py-4">{[event.startTime, event.endTime].filter(Boolean).join('–') || '—'}</td>
              <td className="px-4 py-4">{event.ageLimit || '—'}</td>
              <td className="px-4 py-4">{event.eventType || 'regular'}</td>
              <td className="px-4 py-4">{event.published === false ? 'Draft' : 'Published'}</td>
              <td className="px-4 py-4"><div className="flex flex-wrap gap-2">
                <Link href={`/admin/events?edit=${event._id}`} className="rounded-full border border-black/10 px-3 py-2 text-xs font-black">Edit</Link>
                <Link href={`/admin/events?duplicate=${event._id}`} className="rounded-full border border-black/10 px-3 py-2 text-xs font-black">Duplicate</Link>
                <form action={toggleEventPublishedAction}><input type="hidden" name="id" value={event._id} /><button className="rounded-full border border-black/10 px-3 py-2 text-xs font-black">{event.published === false ? 'Publish' : 'Unpublish'}</button></form>
                <form action={deleteEventAction}><input type="hidden" name="id" value={event._id} /><button className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700">Delete</button></form>
              </div></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  </div>
}

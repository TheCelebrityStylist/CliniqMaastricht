import { fetchEventsFromSheet } from '@/lib/google/eventsFromSheet'
import { images } from '@/lib/site'
import SafeImage from '@/components/ui/SafeImage'

const sheetUrl = process.env.GOOGLE_EVENTS_SHEET_URL || (process.env.GOOGLE_SHEET_ID ? `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}` : '')

export default async function EventsAdminPage() {
  const sync = await fetchEventsFromSheet()
  const events = sync.events.sort((a, b) => `${a.date} ${a.openingTime}`.localeCompare(`${b.date} ${b.openingTime}`))

  return <div className="grid gap-8">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Agenda</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Google Sheet events</h1>
      <p className="mt-3 max-w-3xl text-black/60">Events are managed in Google Sheets. Edit the sheet and refresh sync.</p>
      {!sync.configured ? <p className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-800">Google sync is not configured.</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        {sheetUrl ? <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black/70">Open Google Sheet</a> : null}
        <a href="/api/events/revalidate" className="rounded-full bg-[#f02688] px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Refresh events</a>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-black/60 sm:grid-cols-3">
        <p className="rounded-2xl bg-white p-4"><strong>{sync.count}</strong> synced events</p>
        <p className="rounded-2xl bg-white p-4"><strong>{sync.skipped}</strong> skipped rows</p>
        <p className="rounded-2xl bg-white p-4">Last sync: <strong>{sync.syncedAt}</strong></p>
      </div>
    </section>

    <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[#12070c] text-xs uppercase tracking-widest text-white/70">
            <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Artist/name</th><th className="px-4 py-3">Opening-closing</th><th className="px-4 py-3">Minimum age</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Published</th><th className="px-4 py-3">Image status</th></tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {events.map((event) => <tr key={event.id} className="align-middle">
              <td className="px-4 py-4 font-black">{event.date}</td>
              <td className="px-4 py-4"><div className="font-black">{event.title.nl}</div><div className="text-xs text-black/45">{event.artistName}</div></td>
              <td className="px-4 py-4">{[event.openingTime, event.closingTime].filter(Boolean).join('–') || '—'}</td>
              <td className="px-4 py-4">{event.minimumAge || '—'}</td>
              <td className="px-4 py-4">{event.eventType}</td>
              <td className="px-4 py-4">{event.published ? 'Yes' : 'No'}</td>
              <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="relative h-12 w-12 overflow-hidden rounded-xl bg-black/5"><SafeImage src={event.imageUrl || images.fallbackEvent} fallbackSrc={images.fallbackEvent} alt={event.title.nl} fill className="object-cover" /></div>{event.imageUrl ? 'Image set' : 'Fallback'}</div></td>
            </tr>)}
            {!events.length ? <tr><td colSpan={7} className="px-4 py-10 text-center text-black/50">No Google Sheet events found. Use fallback public agenda until sync is configured.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  </div>
}

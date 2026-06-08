import Link from 'next/link'
import { saveBulkEventsAction } from '@/lib/admin/actions'

type SearchParams = { rows?: string; saved?: string }

function weekdayDefaults(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay()
  if (day === 4) return { startTime: '22:00', endTime: '02:00', ageLimit: '18+' }
  if (day === 5 || day === 6) return { startTime: '22:00', endTime: '03:00', ageLimit: '21+' }
  return { startTime: '', endTime: '', ageLimit: '' }
}

function normalizeArtistName(input: string) {
  const value = input.trim()
  const lower = value.toLowerCase()
  if (lower === 'sidney') return 'DJ SDNX'
  if (lower === 'len') return 'DJ Hadless'
  if (lower === 'big rob') return 'DJ BIG ROB'
  return value || 'CLINIQ'
}

function parseRows(rows: string) {
  return rows.split('\n').map((line, index) => {
    const [dateRaw, artistRaw] = line.split(',').map((item) => item?.trim() || '')
    const defaults = weekdayDefaults(dateRaw)
    return { row: index + 1, date: dateRaw, title: normalizeArtistName(artistRaw), valid: /^\d{4}-\d{2}-\d{2}$/.test(dateRaw), ...defaults }
  }).filter((row) => row.date || row.title !== 'CLINIQ')
}

export default async function BulkEventsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) || {}
  const rows = params.rows || '2026-06-11,JINK\n2026-06-12,Paul Gouda\n2026-06-13,DJANBE'
  const preview = parseRows(rows)
  const validCount = preview.filter((row) => row.valid).length

  return <div className="grid gap-8">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Bulk Events</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Paste dates and DJs.</h1>
      <p className="mt-3 max-w-3xl text-black/60">Paste one row per event: <strong>YYYY-MM-DD,Artist</strong>. The planner previews everything before saving, maps common artist names and fills Thursday/Friday/Saturday hours automatically.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/admin/events" className="rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black/70">Back to Events</Link></div>
      {params.saved ? <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">Created {params.saved} events.</p> : null}
    </section>

    <section className="rounded-[2rem] bg-white p-6 shadow-sm lg:p-8">
      <form className="grid gap-4" method="get">
        <label className="grid gap-2 text-sm font-bold">Paste rows
          <textarea name="rows" defaultValue={rows} className="min-h-48 rounded-3xl border border-black/10 p-4 font-mono text-sm" />
        </label>
        <button className="min-h-11 rounded-full bg-[#12070c] px-6 py-4 text-xs font-black uppercase tracking-widest text-white">Preview rows</button>
      </form>
    </section>

    <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-2xl font-black">Preview</h2><p className="text-sm text-black/50">{validCount} valid rows ready to save.</p></div>
        <form action={saveBulkEventsAction}><input type="hidden" name="rows" value={rows} /><button disabled={!validCount} className="min-h-11 rounded-full bg-[#f02688] px-6 py-3 text-xs font-black uppercase tracking-widest text-white disabled:opacity-40">Save {validCount} events</button></form>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#12070c] text-xs uppercase tracking-widest text-white/70"><tr><th className="px-4 py-3">Row</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Artist/name</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Age</th><th className="px-4 py-3">Status</th></tr></thead>
          <tbody className="divide-y divide-black/5">
            {preview.map((row) => <tr key={row.row}><td className="px-4 py-4">{row.row}</td><td className="px-4 py-4 font-black">{row.date}</td><td className="px-4 py-4">{row.title}</td><td className="px-4 py-4">{[row.startTime, row.endTime].filter(Boolean).join('–') || 'Manual day'}</td><td className="px-4 py-4">{row.ageLimit || '—'}</td><td className="px-4 py-4">{row.valid ? 'Ready' : 'Invalid date'}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  </div>
}

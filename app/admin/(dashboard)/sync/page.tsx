import { fetchEventsFromSheet } from '@/lib/google/eventsFromSheet'
import { getDriveFolderConfig, getPhotosSyncStatus } from '@/lib/google/photosFromDrive'

const sheetUrl = process.env.GOOGLE_EVENTS_SHEET_URL || (process.env.GOOGLE_SHEET_ID ? `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}` : '')
const driveUrl = process.env.GOOGLE_DRIVE_ROOT_URL || ''

export default async function SyncAdminPage() {
  const [events, photos] = await Promise.all([fetchEventsFromSheet(), getPhotosSyncStatus()])
  const driveConfig = getDriveFolderConfig()
  const eventsConfigured = events.configured
  const photosConfigured = photos.configured

  return <div className="grid gap-8">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Google Sync</p>
      <h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Sync dashboard</h1>
      <p className="mt-3 max-w-2xl text-black/60">Agenda and photos are managed in Google Sheets and Google Drive. Use this page to check status and trigger a manual refresh.</p>
    </div>

    {!eventsConfigured && !photosConfigured ? <p className="rounded-[2rem] bg-yellow-50 p-5 text-sm font-bold text-yellow-800">Google sync is not configured.</p> : null}

    <section className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Events</p>
        <h2 className="mt-2 text-3xl font-black">Google Sheet</h2>
        <dl className="mt-6 grid gap-3 text-sm">
          <Row label="Status" value={eventsConfigured ? 'OK' : 'Google sync is not configured.'} />
          <Row label="Sheet ID" value={process.env.GOOGLE_SHEET_ID || 'Missing'} />
          <Row label="Sheet name" value={process.env.GOOGLE_EVENTS_SHEET_NAME || 'Events'} />
          <Row label="Last sync time" value={events.syncedAt} />
          <Row label="Event count" value={String(events.count)} />
          <Row label="Skipped rows" value={String(events.skipped)} />
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/api/events/revalidate" className="rounded-full bg-[#f02688] px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Refresh events</a>
          {sheetUrl ? <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-black/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-black/70">Open Google Sheet</a> : null}
        </div>
      </article>

      <article className="rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Photos</p>
        <h2 className="mt-2 text-3xl font-black">Google Drive</h2>
        <dl className="mt-6 grid gap-3 text-sm">
          <Row label="Status" value={photos.status === 'Not configured' ? 'Google sync is not configured.' : photos.status} />
          <Row label="Last sync time" value={photos.syncedAt} />
          <Row label="Album count" value={String(photos.albumCount)} />
          <Row label="Homepage folder" value={driveConfig.sections.homepage.folderId || 'Missing'} />
          <Row label="Uitgaan folder" value={driveConfig.sections.uitgaan.folderId || 'Missing'} />
          <Row label="Workshop folder" value={driveConfig.sections.workshop.folderId || 'Missing'} />
          <Row label="Event-space folder" value={driveConfig.sections['event-space'].folderId || 'Missing'} />
          <Row label="Contact folder" value={driveConfig.sections.contact.folderId || 'Missing'} />
          <Row label="Albums root" value={driveConfig.albumsRootFolderId || 'Missing'} />
        </dl>
        <div className="mt-6 rounded-2xl bg-[#f7f1e7] p-4 text-sm text-black/65">
          {Object.entries(photos.folderCounts).length ? Object.entries(photos.folderCounts).map(([folder, count]) => <p key={folder}>{folder}: {count} photos</p>) : <p>No Drive folder counts available yet.</p>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/api/photos/revalidate" className="rounded-full bg-[#f02688] px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Refresh photos</a>
          {driveUrl ? <a href={driveUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-black/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-black/70">Open Google Drive</a> : null}
        </div>
      </article>
    </section>
  </div>
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 border-b border-black/5 pb-3 sm:grid-cols-[160px_1fr]"><dt className="font-black text-black/45">{label}</dt><dd className="break-all font-bold text-black/75">{value}</dd></div>
}

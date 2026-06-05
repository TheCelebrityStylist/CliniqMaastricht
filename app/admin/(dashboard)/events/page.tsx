import { saveEventAction, toggleEventPublishedAction } from '@/lib/admin/actions'
import { readStore } from '@/lib/admin/store'
import { images } from '@/lib/site'
import SafeImage from '@/components/ui/SafeImage'

export default async function EventsAdminPage({ searchParams }: { searchParams?: Promise<{ edit?: string; duplicate?: string }> }) {
  const query = await searchParams
  const store = await readStore()
  const source = store.events.find((event) => event._id === query?.edit || event._id === query?.duplicate)
  const edit = query?.duplicate ? { ...source, _id: '', title: `${source?.title || ''} copy`, published: false } : source
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = store.events.filter((event) => event.date >= today).sort((a,b)=>a.date.localeCompare(b.date))
  const past = store.events.filter((event) => event.date < today).sort((a,b)=>b.date.localeCompare(a.date))

  return <div className="grid gap-8 xl:grid-cols-[1fr_500px]">
    <section>
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f02688]">Agenda</p><h1 className="mt-3 text-5xl font-black tracking-[-0.05em]">Events Manager</h1>
      <p className="mt-3 max-w-2xl text-black/60">Fast flow: add title, date, poster, publish. Events without images use a branded fallback and never break the public agenda.</p>
      <EventTable title="Upcoming events" events={upcoming} media={store.media} />
      <EventTable title="Past archive" events={past} media={store.media} compact />
    </section>
    <aside className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">{query?.duplicate ? 'Duplicate event' : edit?._id ? 'Edit event' : 'Add event'}</h2><p className="mt-2 text-sm text-black/60">Required fields are grouped for a sub-2-minute publish workflow.</p>
      <form action={saveEventAction} className="mt-6 grid gap-4"><input type="hidden" name="_id" defaultValue={edit?._id} />
        <Field name="title" label="Internal title" defaultValue={edit?.title} required />
        <div className="grid grid-cols-2 gap-3"><Field name="date" label="Date" type="date" defaultValue={edit?.date} required /><Field name="ageLimit" label="Minimum age" defaultValue={edit?.ageLimit || '21+'} /></div>
        <div className="grid grid-cols-2 gap-3"><Field name="startTime" label="Opening" defaultValue={edit?.startTime || '22:00'} /><Field name="endTime" label="Closing" defaultValue={edit?.endTime || '03:00'} /></div>
        <label className="grid gap-2 text-sm font-bold">Event poster from Media Library<select name="imageUrl" defaultValue={edit?.imageUrl || ''} className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="">Use branded fallback image</option>{store.media.map((media)=><option key={media.id} value={media.url}>{media.title}</option>)}</select></label>
        <Field name="manualImageUrl" label="Or paste image URL" defaultValue={edit?.imageUrl} />
        <label className="grid gap-2 text-sm font-bold">Poster focal point<select name="imagePosition" defaultValue={edit?.imagePosition || 'center'} className="rounded-2xl border border-black/10 bg-white px-4 py-3"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></label>
        <h3 className="font-black">Nederlands</h3><Field name="titleNl" label="Public title NL" defaultValue={edit?.titleNl} /><Field name="subtitleNl" label="Subtitle NL" defaultValue={edit?.subtitleNl} /><Area name="shortDescriptionNl" label="Short description NL" defaultValue={edit?.shortDescriptionNl} /><Area name="fullDescriptionNl" label="Full description NL" defaultValue={edit?.fullDescriptionNl || edit?.fullDescription} />
        <h3 className="font-black">English</h3><Field name="titleEn" label="Public title EN" defaultValue={edit?.titleEn} /><Field name="subtitleEn" label="Subtitle EN" defaultValue={edit?.subtitleEn} /><Area name="shortDescriptionEn" label="Short description EN" defaultValue={edit?.shortDescriptionEn} /><Area name="fullDescriptionEn" label="Full description EN" defaultValue={edit?.fullDescriptionEn} />
        <Field name="ticketUrl" label="Ticket / RSVP link" defaultValue={edit?.ticketUrl} />
        <div className="grid gap-3 rounded-2xl bg-[#f7f1e7] p-4"><label className="flex items-center gap-3 font-bold"><input type="checkbox" name="featured" defaultChecked={edit?.featured} /> Featured on homepage</label><label className="flex items-center gap-3 font-bold"><input type="checkbox" name="published" defaultChecked={edit?.published !== false} /> Published on agenda</label></div>
        <button className="rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Save event</button>
      </form>
    </aside>
  </div>
}

function EventTable({ title, events, media, compact = false }: { title: string; events: Awaited<ReturnType<typeof readStore>>['events']; media: Awaited<ReturnType<typeof readStore>>['media']; compact?: boolean }) {
  return <div className="mt-8"><h2 className="text-2xl font-black">{title}</h2><div className="mt-4 grid gap-4">{events.map((event) => {
    const image = media.find((item) => item.url === event.imageUrl)
    return <article key={event._id} className="grid gap-4 rounded-[2rem] bg-white p-4 shadow-sm md:grid-cols-[150px_1fr_auto]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/10"><SafeImage src={event.imageUrl} fallbackSrc={images.fallbackEvent} alt={event.imageAlt || event.title} fill className="object-cover" objectPosition={event.imagePosition || image?.focalPoint || 'center'} /></div>
      <div><div className="flex flex-wrap gap-2"><Badge tone={event.published === false ? 'draft' : 'live'}>{event.published === false ? 'Draft' : 'Published'}</Badge>{event.featured ? <Badge>Featured</Badge> : null}{!event.imageUrl ? <Badge tone="warn">Fallback image</Badge> : null}</div><h3 className="mt-3 text-2xl font-black">{event.titleNl || event.title}</h3><p className="text-black/60">{event.date} · {event.startTime || '22:00'}–{event.endTime || '03:00'} · {event.ageLimit || '21+'}</p>{!compact ? <p className="mt-2 text-sm text-black/55">{event.shortDescriptionNl || 'No Dutch description yet.'}</p> : null}</div>
      <div className="flex flex-row gap-2 md:flex-col"><a className="rounded-full bg-black px-4 py-2 text-center text-xs font-black uppercase tracking-widest text-white" href={`/admin/events?edit=${event._id}`}>Edit</a><a className="rounded-full border border-black/10 px-4 py-2 text-center text-xs font-black uppercase tracking-widest" href={`/admin/events?duplicate=${event._id}`}>Duplicate</a><form action={toggleEventPublishedAction}><input type="hidden" name="id" value={event._id}/><button className="w-full rounded-full bg-[#f02688] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">{event.published === false ? 'Publish' : 'Unpublish'}</button></form></div>
    </article>
  })}{!events.length ? <p className="rounded-[2rem] bg-white p-6 text-black/55">No events in this section.</p> : null}</div></div>
}
function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'draft' | 'live' | 'warn' }) { const cls = tone === 'live' ? 'bg-green-100 text-green-800' : tone === 'draft' ? 'bg-black/10 text-black/60' : tone === 'warn' ? 'bg-amber-100 text-amber-800' : 'bg-[#f02688] text-white'; return <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cls}`}>{children}</span> }
function Field({ name, label, defaultValue, type='text', required=false }: { name:string; label:string; defaultValue?:string; type?:string; required?:boolean }) { return <label className="grid gap-2 text-sm font-bold">{label}<input name={name} type={type} defaultValue={defaultValue || ''} required={required} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }
function Area({ name, label, defaultValue }: { name:string; label:string; defaultValue?:string }) { return <label className="grid gap-2 text-sm font-bold">{label}<textarea name={name} defaultValue={defaultValue || ''} rows={4} className="rounded-2xl border border-black/10 bg-white px-4 py-3" /></label> }

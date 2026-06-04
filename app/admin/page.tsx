import Link from 'next/link'
import { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Admin login | Cliniq Maastricht',
  description: 'Owner-friendly admin start page for the Cliniq Maastricht CMS, media library, events and leads.',
  robots: { index: false, follow: false },
}

const cmsSections = [
  ['Events Manager', 'Add events, upload posters, set dates/times, feature events and publish or unpublish agenda items.'],
  ['Media Library', 'Upload approved Cliniq photos, set crop/focal point, write alt text and assign images to pages or events.'],
  ['Page Manager', 'Edit homepage, workshop, event-space, contact, jobs and house-rules copy in Dutch and English.'],
  ['SEO Manager', 'Update SEO titles, descriptions, canonical URLs and social images per page and language.'],
  ['Lead Dashboard', 'View form submissions, change status to handled and export CSV leads.'],
  ['Site Settings', 'Edit phone, email, address, socials and opening hours.'],
]

export default function AdminPage() {
  return <section className="min-h-screen bg-ivory px-5 py-32 text-ink">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-magenta">Cliniq owner area</p>
      <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-7xl">Admin login.</h1>
      <p className="mt-6 max-w-3xl text-xl leading-8 text-ink/70">
        Use this page as the simple owner start screen. The secure login itself is handled by Sanity, so there is no hardcoded website password and no separate developer-only backend.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/studio" className="inline-flex items-center justify-center rounded-full bg-magenta px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-ink">
          Open CMS
        </Link>
        <a href="https://www.sanity.io/manage" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-ink transition hover:-translate-y-0.5 hover:border-magenta hover:text-magenta">
          Sanity project settings
        </a>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-xl shadow-black/5">
          <h2 className="text-2xl font-black tracking-[-0.03em]">Login details</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-ink/70">
            <li>Go to <strong>{site.url}/admin</strong> for this owner screen.</li>
            <li>Click <strong>Open CMS</strong> and sign in with the invited Sanity account.</li>
            <li>If Sanity asks for a CORS origin, copy the exact URL shown and add it in Sanity Manage → API → CORS Origins.</li>
            <li>For daily work after launch, use <strong>{site.url}/studio</strong> or this <strong>/admin</strong> page.</li>
          </ol>
        </div>
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-xl shadow-black/5">
          <h2 className="text-2xl font-black tracking-[-0.03em]">About photos</h2>
          <p className="mt-4 leading-7 text-ink/70">
            The website now uses Cliniq Maastricht photography from the existing Cliniq image library, not generic stock nightlife photos. New photos should be uploaded in Sanity Media Library and assigned to pages or events from the CMS.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-xl shadow-black/5">
        <h2 className="text-2xl font-black tracking-[-0.03em]">What you can manage</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cmsSections.map(([title, text]) => <div key={title} className="rounded-2xl bg-ink/[0.04] p-4">
            <h3 className="font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">{text}</p>
          </div>)}
        </div>
      </div>

      <p className="mt-8 text-sm leading-6 text-ink/55">
        Important: for security, the owner must be invited to the Sanity project instead of sharing a password in the website code. This is the same safe login model used by professional CMS platforms.
      </p>
    </div>
  </section>
}

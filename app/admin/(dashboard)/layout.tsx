import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { logoutAction } from '@/lib/admin/actions'

const nav = [
  ['Dashboard', '/admin'],
  ['Events', '/admin/events'],
  ['Media Library', '/admin/media'],
  ['Albums', '/admin/albums'],
  ['Pages', '/admin/pages'],
  ['FAQs', '/admin/faqs'],
  ['Forms / Leads', '/admin/leads'],
  ['SEO', '/admin/seo'],
  ['Site Settings', '/admin/settings'],
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <div className="min-h-screen bg-[#f5f1ea] text-[#12070c]">
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-black/10 bg-[#12070c] p-6 text-white lg:block">
      <Link href="/admin" className="text-2xl font-black tracking-[0.35em]">CLINIQ</Link>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/50">Admin</p>
      <nav className="mt-10 grid gap-2">
        {nav.map(([label, href]) => <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-white/70 transition hover:bg-white/10 hover:text-white">{label}</Link>)}
      </nav>
      <form action={logoutAction} className="absolute bottom-6 left-6 right-6"><button className="w-full rounded-full border border-white/20 px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-white/70 hover:bg-white hover:text-[#12070c]">Log out</button></form>
    </aside>
    <main className="lg:pl-72">
      <div className="border-b border-black/10 bg-white/70 px-5 py-4 backdrop-blur lg:hidden"><Link href="/admin" className="font-black tracking-[0.1em]">CLINIQ ADMIN</Link></div>
      <div className="p-5 lg:p-10">{children}</div>
    </main>
  </div>
}

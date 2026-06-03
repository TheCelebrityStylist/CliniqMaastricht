import Link from 'next/link'
import { nav } from '@/lib/site'

export default function Header() {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/78 backdrop-blur-xl">
    <div className="container-premium flex h-20 items-center justify-between gap-6">
      <Link href="/" className="focus-ring text-lg font-black tracking-[0.42em] text-white">CLINIQ</Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Hoofdnavigatie">
        {nav.map(([label, href]) => <Link key={href} href={href} className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/62 transition hover:text-white">{label}</Link>)}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/uitgaan" className="hidden text-xs font-black uppercase tracking-[0.18em] text-white/70 hover:text-white sm:inline">Agenda</Link>
        <Link href="/event-space" className="btn-primary px-4 py-2 text-[10px]">Aanvragen</Link>
      </div>
    </div>
  </header>
}

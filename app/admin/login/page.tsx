import { loginAction } from '@/lib/admin/actions'

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const query = await searchParams
  return <main className="min-h-screen bg-[#12070c] px-5 py-20 text-white">
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/40">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f02688]">Cliniq Maastricht</p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">Admin login</h1>
      <p className="mt-3 text-white/60">Log in to manage events, photos, pages, FAQs, leads, SEO and site settings.</p>
      {query?.error ? <p className="mt-4 rounded-2xl bg-red-500/15 p-3 text-sm text-red-100">Invalid username or password.</p> : null}
      <form action={loginAction} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-bold">Username<input name="username" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white" autoComplete="username" required /></label>
        <label className="grid gap-2 text-sm font-bold">Password<input name="password" type="password" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white" autoComplete="current-password" required /></label>
        <button className="mt-2 rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white hover:bg-white hover:text-[#12070c]">Log in</button>
      </form>
    </div>
  </main>
}

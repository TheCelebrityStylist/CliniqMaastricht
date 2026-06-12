import { loginAction } from '@/lib/admin/actions'
import { hasAdminCredentials } from '@/lib/admin/auth'

export const dynamic = 'force-dynamic'

type LoginSearchParams = { error?: string }

function errorMessage(error?: string) {
  if (error === 'config') return 'Admin login is not configured yet. Add ADMIN_USERNAME and ADMIN_PASSWORD in Vercel, then redeploy.'
  if (error === 'invalid') return 'Invalid username or password. Usernames are not case-sensitive; passwords must match the Vercel value.'
  if (error) return 'Login failed. Check the admin credentials and try again.'
  return ''
}

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<LoginSearchParams> }) {
  const query = await searchParams
  const missingConfig = !hasAdminCredentials()
  const message = missingConfig ? errorMessage('config') : errorMessage(query?.error)

  return <main className="min-h-screen bg-[#12070c] px-5 py-20 text-white">
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/40">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Cliniq Maastricht</p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.025em]">Admin login</h1>
      <p className="mt-3 text-white/60">Log in to manage events, photos, pages, FAQs, leads, SEO and site settings.</p>
      {message ? <p className="mt-4 rounded-2xl bg-red-500/20 p-3 text-sm text-red-100" role="alert">{message}</p> : null}
      <form action={loginAction} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-bold">Username or email<input name="username" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white" autoComplete="username" required /></label>
        <label className="grid gap-2 text-sm font-bold">Password<input name="password" type="password" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white" autoComplete="current-password" required /></label>
        <button className="mt-2 rounded-full bg-[#f02688] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white hover:bg-white hover:text-[#12070c]">Log in</button>
      </form>
      <p className="mt-5 text-xs leading-6 text-white/50">After changing Vercel environment variables, redeploy the latest production deployment so the admin can read the new values.</p>
    </div>
  </main>
}

export default async function AdminDashboard() {
  return <div>
    <div className="rounded-[2rem] border border-[#f02688]/20 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.1em] text-[#f02688]">Sanity migration notice</p><h1 className="mt-3 text-5xl font-black tracking-[-0.03em]">Admin</h1><p className="mt-4 text-lg font-bold">Content is moving to Sanity. Use Sanity Studio for forms and content once configured.</p><p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">During phase 1, form submissions are saved as Sanity lead documents. Existing admin tools remain available from the sidebar during the transition.</p></div>
  </div>
}

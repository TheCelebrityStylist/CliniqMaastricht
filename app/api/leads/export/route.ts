import { NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity/client'

type LeadRow = { submittedAt?: string; type?: string; status?: string; name?: string; email?: string; phone?: string; sourcePage?: string; message?: string }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (!process.env.LEADS_EXPORT_TOKEN || searchParams.get('token') !== process.env.LEADS_EXPORT_TOKEN) return new NextResponse('Unauthorized', { status: 401 })
  const leads = await sanityFetch<LeadRow[]>('*[_type == "lead"] | order(submittedAt desc) { submittedAt, type, status, name, email, phone, sourcePage, message }', {}, [])
  const rows = [['date','type','status','name','email','phone','source','message'], ...leads.map((lead) => [lead.submittedAt || '', lead.type || '', lead.status || '', lead.name || '', lead.email || '', lead.phone || '', lead.sourcePage || '', lead.message || ''])]
  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="cliniq-leads.csv"' } })
}

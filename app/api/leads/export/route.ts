import { NextResponse } from 'next/server'
import { readStore } from '@/lib/admin/store'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (!process.env.LEADS_EXPORT_TOKEN || searchParams.get('token') !== process.env.LEADS_EXPORT_TOKEN) return new NextResponse('Unauthorized', { status: 401 })
  const store = await readStore()
  const rows = [['date','type','status','name','email','phone','source','message'], ...store.leads.map((lead) => [lead.submittedAt || lead.createdAt, (lead.type || lead.formType || 'contact'), lead.status, lead.name, lead.email, lead.phone || '', lead.sourcePage || '', lead.message || ''])]
  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="cliniq-leads.csv"' } })
}

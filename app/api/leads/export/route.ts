import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-06-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

function csvValue(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!process.env.LEADS_EXPORT_TOKEN || token !== process.env.LEADS_EXPORT_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await client.fetch(`*[_type == "formSubmission"] | order(createdAt desc) { createdAt, formType, status, sourcePage, name, email, phone, message }`)
  const headers = ['createdAt', 'formType', 'status', 'sourcePage', 'name', 'email', 'phone', 'message']
  const csv = [headers.join(','), ...rows.map((row: Record<string, unknown>) => headers.map((header) => csvValue(row[header])).join(','))].join('\n')
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="cliniq-leads.csv"' } })
}

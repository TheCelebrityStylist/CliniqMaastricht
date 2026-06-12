export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ')
}

function parseDate(dateStr: string): Date | null {
  const iso = new Date(`${dateStr}T00:00:00`)
  if (!Number.isNaN(iso.getTime())) return iso

  const parts = dateStr.split(/[-/.]/).map(Number)
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    const [day, month, year] = parts
    const parsed = new Date(year, month - 1, day)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }

  return null
}

export function formatDate(dateStr: string, lang: 'nl' | 'en' = 'nl'): string {
  const parsed = parseDate(dateStr)
  if (!parsed) return dateStr

  return new Intl.DateTimeFormat(lang === 'nl' ? 'nl-NL' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(parsed)
}

export function isUpcoming(dateStr: string): boolean {
  const parsed = parseDate(dateStr)
  if (!parsed) return true

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  parsed.setHours(0, 0, 0, 0)
  return parsed >= today
}

// Returns the next N open days (Thu/Fri/Sat) from today
export function getNextOpenDays(n = 4): Date[] {
  const days: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; days.length < n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if ([4, 5, 6].includes(d.getDay())) days.push(d)
    if (i > 60) break
  }
  return days
}

export function buildSeoTitle(page: string, siteName = 'Cliniq Maastricht') {
  return `${page} | ${siteName}`
}

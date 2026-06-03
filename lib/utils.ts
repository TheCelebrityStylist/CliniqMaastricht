import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isFuture, isToday } from 'date-fns'
import { nl } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, lang: 'nl' | 'en' = 'nl'): string {
  try {
    const d = parseISO(dateStr)
    return format(d, 'EEEE d MMMM', { locale: lang === 'nl' ? nl : undefined })
  } catch {
    const parts = dateStr.split(/[-\/.]/)
    if (parts.length === 3) {
      const d = new Date(+parts[2], +parts[1] - 1, +parts[0])
      if (!isNaN(d.getTime())) {
        return format(d, 'EEEE d MMMM', { locale: lang === 'nl' ? nl : undefined })
      }
    }
    return dateStr
  }
}

export function isUpcoming(dateStr: string): boolean {
  try {
    const parts = dateStr.split(/[-\/.]/)
    if (parts.length === 3) {
      const d = new Date(+parts[2], +parts[1] - 1, +parts[0])
      return isFuture(d) || isToday(d)
    }
    return isFuture(parseISO(dateStr)) || isToday(parseISO(dateStr))
  } catch {
    return true
  }
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

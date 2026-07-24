'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'

type Props = {
  title: string
  date: string
  startTime?: string
  endTime?: string
  description?: string
  location?: string
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toIcsDate(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
}

function buildIcs({ title, start, end, description, location }: { title: string; start: Date; end: Date; description?: string; location?: string }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cliniq Maastricht//Events//NL',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}-cliniq@cliniqmaastricht.nl`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${title.replace(/\n/g, ' ')}`,
    location ? `LOCATION:${location.replace(/\n/g, ' ')}` : '',
    description ? `DESCRIPTION:${description.replace(/\n/g, ' ')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return lines.join('\r\n')
}

function googleCalendarUrl({ title, start, end, description, location }: { title: string; start: Date; end: Date; description?: string; location?: string }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toIcsDate(start)}/${toIcsDate(end)}`,
    details: description || '',
    location: location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function EventCountdown({ title, date, startTime = '22:00', endTime = '03:00', description, location }: Props) {
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang].countdown
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const start = new Date(`${date}T${startTime}:00`)
  let end = new Date(`${date}T${endTime}:00`)
  if (end.getTime() <= start.getTime()) end = new Date(end.getTime() + 24 * 60 * 60 * 1000)

  if (!now) return <div className="h-[92px] rounded-3xl border border-white/10 bg-white/[0.03]" aria-hidden="true" />

  const diffMs = start.getTime() - now.getTime()
  const started = diffMs <= 0
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  function download() {
    const ics = buildIcs({ title, start, end, description, location })
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="eyebrow">{t.title}</p>
      {started ? (
        <p className="mt-4 text-2xl font-black text-coral-text">{t.started}</p>
      ) : (
        <div className="mt-4 flex items-end gap-4 tabular-nums" aria-live="polite">
          {days > 0 ? <CountdownUnit value={days} label={t.days} /> : null}
          <CountdownUnit value={hours} label={t.hours} />
          <CountdownUnit value={minutes} label={t.minutes} />
          <CountdownUnit value={seconds} label={t.seconds} />
        </div>
      )}
      <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-white/45">{t.addToCalendar}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={download} className="btn-secondary text-xs">{t.downloadIcs}</button>
        <a
          href={googleCalendarUrl({ title, start, end, description, location })}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs"
        >
          {t.googleCalendar}
        </a>
      </div>
    </div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-black leading-none text-white">{String(value).padStart(2, '0')}</span>
      <span className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/45">{label}</span>
    </div>
  )
}

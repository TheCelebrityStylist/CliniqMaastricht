'use client'
import { FormEvent, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getLanguageFromPath, ui } from '@/lib/i18n'
import BookingScheduleField from './BookingScheduleField'

type Field = {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  options?: string[]
  helper?: string
  // Only used when type === 'booking-schedule': `name`/`label`/`required` above describe date
  // option 1, and these describe the optional second date and the shared time field that both
  // dates are validated against together (see BookingScheduleField for why they're coupled).
  date2Name?: string
  date2Label?: string
  timeName?: string
  timeLabel?: string
  timePlaceholder?: string
  timeHelper?: string
}

export default function InquiryForm({ type, fields, sourcePage, lang: langProp, legend }: { type: 'contact' | 'workshop' | 'event-space' | 'job'; fields: Field[]; sourcePage?: string; lang?: 'nl' | 'en'; legend?: string }) {
  const pathname = usePathname()
  const lang = langProp || getLanguageFromPath(pathname || '')
  const t = ui[lang].form
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage(null)
    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())
    if (!payload.sourcePage && typeof window !== 'undefined') payload.sourcePage = window.location.pathname
    const res = await fetch(`/api/forms/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setStatus('success')
      event.currentTarget.reset()
    } else {
      // A route can return a specific reason (e.g. the blocked-weekday message on event-space) -
      // show that instead of the generic fallback when present, without changing behavior for
      // routes that don't send one.
      const data = await res.json().catch(() => null)
      setErrorMessage(typeof data?.message === 'string' ? data.message : null)
      setStatus('error')
    }
  }
  return <form onSubmit={onSubmit} className="card rounded-[2rem] p-5 sm:p-8">
    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
    <input type="hidden" name="sourcePage" value={sourcePage || ''} />
    {legend ? <p className="mb-5 text-xs text-white/50">{legend}</p> : null}
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => <div key={field.name} className={field.name === 'message' || field.type === 'booking-schedule' ? 'sm:col-span-2' : ''}>
        {field.type === 'booking-schedule' ? (
          <BookingScheduleField
            lang={lang}
            date1={{ name: field.name, label: field.label, required: field.required }}
            date2={field.date2Name ? { name: field.date2Name, label: field.date2Label || field.date2Name } : undefined}
            time={{ name: field.timeName || 'time', label: field.timeLabel || 'Time', placeholder: field.timePlaceholder, helper: field.timeHelper }}
          />
        ) : (
          <>
            <label htmlFor={field.name} className="label">{field.label}{field.required ? <span className="text-coral-text" aria-hidden="true"> *</span> : null}</label>
            {field.options ? <select id={field.name} name={field.name} required={field.required} aria-required={field.required || undefined} className="input"><option value="">{t.select}</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.name === 'message' ? <textarea id={field.name} name={field.name} rows={5} required={field.required} aria-required={field.required || undefined} placeholder={field.placeholder} className="input" /> : <input id={field.name} name={field.name} type={field.type || 'text'} required={field.required} aria-required={field.required || undefined} placeholder={field.placeholder} className="input" />}
            {field.helper ? <p className="mt-1.5 text-xs text-white/50">{field.helper}</p> : null}
          </>
        )}
      </div>)}
    </div>
    <button disabled={status === 'loading'} className="btn-primary mt-6 w-full sm:w-auto">{status === 'loading' ? t.sending : t.submit}</button>
    {status === 'success' ? <p className="mt-4 text-coral-text" role="status">{t.success}</p> : null}
    {status === 'error' ? <p className="mt-4 text-magenta" role="alert">{errorMessage || t.error}</p> : null}
  </form>
}


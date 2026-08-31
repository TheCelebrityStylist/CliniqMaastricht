'use client'
import { FormEvent, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getLanguageFromPath, ui } from '@/lib/i18n'
import BookingDateField from './BookingDateField'

type Field = { name: string; label: string; type?: string; placeholder?: string; required?: boolean; options?: string[]; helper?: string }

export default function InquiryForm({ type, fields, sourcePage, lang: langProp }: { type: 'contact' | 'workshop' | 'event-space' | 'job'; fields: Field[]; sourcePage?: string; lang?: 'nl' | 'en' }) {
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
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => <div key={field.name} className={field.name === 'message' ? 'sm:col-span-2' : ''}>
        {field.type === 'booking-date' ? (
          <BookingDateField name={field.name} label={field.label} required={field.required} lang={lang} />
        ) : (
          <>
            <label htmlFor={field.name} className="label">{field.label}</label>
            {field.options ? <select id={field.name} name={field.name} required={field.required} className="input"><option value="">{t.select}</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.name === 'message' ? <textarea id={field.name} name={field.name} rows={5} required={field.required} placeholder={field.placeholder} className="input" /> : <input id={field.name} name={field.name} type={field.type || 'text'} required={field.required} placeholder={field.placeholder} className="input" />}
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


'use client'
import { FormEvent, useState } from 'react'

type Field = { name: string; label: string; type?: string; placeholder?: string; required?: boolean; options?: string[] }

export default function InquiryForm({ type, fields, sourcePage }: { type: 'contact' | 'workshop' | 'event-space' | 'job'; fields: Field[]; sourcePage?: string }) {
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())
    if (!payload.sourcePage && typeof window !== 'undefined') payload.sourcePage = window.location.pathname
    const res = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, ...payload }) })
    setStatus(res.ok ? 'success' : 'error')
    if (res.ok) event.currentTarget.reset()
  }
  return <form onSubmit={onSubmit} className="card rounded-[2rem] p-5 sm:p-8">
    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
    <input type="hidden" name="sourcePage" value={sourcePage || ''} />
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => <div key={field.name} className={field.name === 'message' ? 'sm:col-span-2' : ''}>
        <label htmlFor={field.name} className="label">{field.label}</label>
        {field.options ? <select id={field.name} name={field.name} required={field.required} className="input"><option value="">Selecteer...</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.name === 'message' ? <textarea id={field.name} name={field.name} rows={5} required={field.required} placeholder={field.placeholder} className="input" /> : <input id={field.name} name={field.name} type={field.type || 'text'} required={field.required} placeholder={field.placeholder} className="input" />}
      </div>)}
    </div>
    <button disabled={status === 'loading'} className="btn-primary mt-6 w-full sm:w-auto">{status === 'loading' ? 'Versturen...' : 'Verstuur aanvraag'}</button>
    {status === 'success' ? <p className="mt-4 text-gold" role="status">Bedankt. We nemen zo snel mogelijk contact op.</p> : null}
    {status === 'error' ? <p className="mt-4 text-magenta" role="alert">Er ging iets mis. Mail ons direct via contact@cafecliniq.com.</p> : null}
  </form>
}

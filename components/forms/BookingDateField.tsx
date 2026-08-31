'use client'
import { ChangeEvent, useRef, useState } from 'react'
import { BOOKING_BLOCKED_MESSAGE, BOOKING_HELPER_TEXT, isBlockedBookingDay } from '@/lib/booking'

// A native <input type="date"> can't grey out specific weekdays in its own OS/browser picker -
// that's a real platform limitation, not something CSS or a prop can fix without replacing the
// picker with a fully custom-rendered calendar. Instead this validates the moment a date is
// chosen or typed (covers both the picker AND a pasted/typed value, per the brief's own fallback
// option), shows an immediate inline message, and uses the browser's native constraint-validation
// (setCustomValidity) so the blocked value can never actually be submitted even if this
// component's own React state were somehow bypassed - the <form> itself refuses to submit.
export default function BookingDateField({
  name,
  label,
  required,
  lang,
}: {
  name: string
  label: string
  required?: boolean
  lang: 'nl' | 'en'
}) {
  const [value, setValue] = useState('')
  const [blocked, setBlocked] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    setValue(next)
    const isBlocked = Boolean(next) && isBlockedBookingDay(next)
    setBlocked(isBlocked)
    event.target.setCustomValidity(isBlocked ? BOOKING_BLOCKED_MESSAGE[lang] : '')
  }

  const errorId = `${name}-error`
  const helperId = `${name}-helper`

  return (
    <div>
      <label htmlFor={name} className="label">{label}{required ? <span className="text-coral-text" aria-hidden="true"> *</span> : null}</label>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="date"
        required={required}
        aria-required={required || undefined}
        value={value}
        onChange={handleChange}
        aria-invalid={blocked}
        aria-describedby={blocked ? `${errorId} ${helperId}` : helperId}
        className={`input ${blocked ? 'border-magenta' : ''}`}
      />
      <p id={helperId} className="mt-1.5 text-xs text-white/50">{BOOKING_HELPER_TEXT[lang]}</p>
      {blocked ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-bold text-magenta">{BOOKING_BLOCKED_MESSAGE[lang]}</p>
      ) : null}
    </div>
  )
}

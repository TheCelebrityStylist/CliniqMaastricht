'use client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  BOOKING_BLOCKED_MESSAGE,
  BOOKING_DAYTIME_NOTE,
  BOOKING_HELPER_TEXT,
  isBlockedBookingSlot,
  isDaytimeException,
} from '@/lib/booking'

type DateSpec = { name: string; label: string; required?: boolean }
type TimeSpec = { name: string; label: string; placeholder?: string; helper?: string }

// Date and time are validated TOGETHER, not independently: Thu/Fri/Sat is only blocked in the
// evening (club-night) window, so this single component owns date1 + date2 (both optional
// booking-date options) and the shared time field, and re-evaluates both dates every time either
// input changes. A native <input type="date"> can't grey out specific weekdays in its own picker
// (a real platform limitation), and the block/allow status here depends on a second field anyway
// - so this validates the moment a date or time is chosen or typed (covers the picker AND a
// pasted/typed value), shows an immediate inline message, and uses native constraint-validation
// (setCustomValidity) so a genuinely blocked slot can never be submitted even if this component's
// own React state were bypassed - the <form> itself refuses to submit. A Thu/Fri/Sat + daytime
// combination is NOT blocked - it's let through flagged as "subject to confirmation," never given
// setCustomValidity, and reflected in a hidden availabilityNote field on the payload.
export default function BookingScheduleField({
  lang,
  date1,
  date2,
  time,
}: {
  lang: 'nl' | 'en'
  date1: DateSpec
  date2?: DateSpec
  time: TimeSpec
}) {
  const [date1Value, setDate1Value] = useState('')
  const [date2Value, setDate2Value] = useState('')
  const [timeValue, setTimeValue] = useState('')

  const date1Ref = useRef<HTMLInputElement>(null)
  const date2Ref = useRef<HTMLInputElement>(null)

  function status(dateValue: string, timeVal: string) {
    if (!dateValue) return 'empty' as const
    if (isBlockedBookingSlot(dateValue, timeVal)) return 'blocked' as const
    if (isDaytimeException(dateValue, timeVal)) return 'daytime' as const
    return 'ok' as const
  }

  function handleDate1Change(event: ChangeEvent<HTMLInputElement>) {
    setDate1Value(event.target.value)
  }

  function handleDate2Change(event: ChangeEvent<HTMLInputElement>) {
    setDate2Value(event.target.value)
  }

  function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    setTimeValue(event.target.value)
  }

  const status1 = status(date1Value, timeValue)
  const status2 = date2 ? status(date2Value, timeValue) : 'empty'

  // Native constraint-validation (setCustomValidity) is applied here, after render, reading the
  // status values computed above - never inside an onChange handler. React state updates are
  // async/batched, so setCustomValidity(status(...)) called synchronously inside a handler would
  // read the PREVIOUS render's timeValue (a real bug caught in testing: the displayed message was
  // correct but checkValidity() lagged one keystroke behind). Deriving from the already-fresh
  // status1/status2 in an effect removes that class of bug entirely.
  useEffect(() => {
    date1Ref.current?.setCustomValidity(status1 === 'blocked' ? BOOKING_BLOCKED_MESSAGE[lang] : '')
  }, [status1, lang])
  useEffect(() => {
    date2Ref.current?.setCustomValidity(status2 === 'blocked' ? BOOKING_BLOCKED_MESSAGE[lang] : '')
  }, [status2, lang])

  const notes: string[] = []
  if (status1 === 'daytime') notes.push(`${date1.label} (${date1Value}): ${lang === 'nl' ? 'overdag, onder voorbehoud' : 'daytime, subject to confirmation'}`)
  if (date2 && status2 === 'daytime') notes.push(`${date2.label} (${date2Value}): ${lang === 'nl' ? 'overdag, onder voorbehoud' : 'daytime, subject to confirmation'}`)

  function renderDateField(spec: DateSpec, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, ref: React.RefObject<HTMLInputElement>, fieldStatus: 'empty' | 'blocked' | 'daytime' | 'ok') {
    const errorId = `${spec.name}-error`
    const helperId = `${spec.name}-helper`
    return (
      <div>
        <label htmlFor={spec.name} className="label">{spec.label}{spec.required ? <span className="text-coral-text" aria-hidden="true"> *</span> : null}</label>
        <input
          ref={ref}
          id={spec.name}
          name={spec.name}
          type="date"
          required={spec.required}
          aria-required={spec.required || undefined}
          value={value}
          onChange={onChange}
          aria-invalid={fieldStatus === 'blocked'}
          aria-describedby={fieldStatus !== 'empty' ? `${errorId} ${helperId}` : helperId}
          className={`input ${fieldStatus === 'blocked' ? 'border-magenta' : ''}`}
        />
        <p id={helperId} className="mt-1.5 text-xs text-white/50">{BOOKING_HELPER_TEXT[lang]}</p>
        {fieldStatus === 'blocked' ? (
          <p id={errorId} role="alert" className="mt-1.5 text-xs font-bold text-magenta">{BOOKING_BLOCKED_MESSAGE[lang]}</p>
        ) : null}
        {fieldStatus === 'daytime' ? (
          <p id={errorId} className="mt-1.5 text-xs font-bold text-coral-text">{BOOKING_DAYTIME_NOTE[lang]}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {renderDateField(date1, date1Value, handleDate1Change, date1Ref, status1)}
      {date2 ? renderDateField(date2, date2Value, handleDate2Change, date2Ref, status2) : null}
      <div>
        <label htmlFor={time.name} className="label">{time.label}</label>
        <input id={time.name} name={time.name} type="time" value={timeValue} onChange={handleTimeChange} placeholder={time.placeholder} className="input" />
        {time.helper ? <p className="mt-1.5 text-xs text-white/50">{time.helper}</p> : null}
      </div>
      <input type="hidden" name="availabilityNote" value={notes.join(' | ')} />
    </div>
  )
}

'use client'

import { ChangeEvent, DragEvent, useRef, useState } from 'react'

type Preview = { name: string; url: string }

type MediaUploadFieldProps = {
  name?: string
  multiple?: boolean
  label?: string
  disabled?: boolean
}

export default function MediaUploadField({ name = 'files', multiple = true, label, disabled = false }: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<Preview[]>([])

  function updatePreviews(files: FileList | null) {
    if (!files) return
    setPreviews(Array.from(files).slice(0, 8).map((file) => ({ name: file.name, url: URL.createObjectURL(file) })))
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    if (disabled) return
    if (inputRef.current) inputRef.current.files = event.dataTransfer.files
    updatePreviews(event.dataTransfer.files)
  }

  return <div className="grid gap-3">
    <label onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className={`grid gap-2 rounded-3xl border-2 border-dashed px-4 py-10 text-center text-sm font-bold transition ${disabled ? 'cursor-not-allowed border-amber-300 bg-amber-50 text-amber-900' : 'cursor-pointer border-black/20 bg-[#f7f1e7] hover:border-[#f02688] hover:bg-[#fff7ea]'}`}>
      {disabled ? 'Uploads are not active yet. Existing images can still be selected and edited.' : label || (multiple ? 'Drag & drop images here, or click to select multiple photos' : 'Drag & drop an image here, or click to select one photo')}
      <input ref={inputRef} name={name} type="file" accept="image/*" multiple={multiple} disabled={disabled} className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => updatePreviews(event.currentTarget.files)} />
    </label>
    {previews.length ? <div className="grid grid-cols-4 gap-2">{previews.map((preview) => <div key={preview.url} className="overflow-hidden rounded-xl bg-black/10"><img src={preview.url} alt={preview.name} className="aspect-square w-full object-cover" /><p className="truncate p-1 text-[10px] text-black/55">{preview.name}</p></div>)}</div> : null}
  </div>
}

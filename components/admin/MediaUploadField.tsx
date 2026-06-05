'use client'

import { ChangeEvent, DragEvent, useRef, useState } from 'react'

type Preview = { name: string; url: string }

export default function MediaUploadField() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<Preview[]>([])

  function updatePreviews(files: FileList | null) {
    if (!files) return
    setPreviews(Array.from(files).slice(0, 8).map((file) => ({ name: file.name, url: URL.createObjectURL(file) })))
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    if (inputRef.current) inputRef.current.files = event.dataTransfer.files
    updatePreviews(event.dataTransfer.files)
  }

  return <div className="grid gap-3">
    <label onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="grid cursor-pointer gap-2 rounded-3xl border-2 border-dashed border-black/20 bg-[#f7f1e7] px-4 py-10 text-center text-sm font-bold transition hover:border-[#f02688] hover:bg-[#fff7ea]">
      Drag & drop images here, or click to select multiple photos
      <input ref={inputRef} name="files" type="file" accept="image/*" multiple className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => updatePreviews(event.currentTarget.files)} />
    </label>
    {previews.length ? <div className="grid grid-cols-4 gap-2">{previews.map((preview) => <div key={preview.url} className="overflow-hidden rounded-xl bg-black/10"><img src={preview.url} alt={preview.name} className="aspect-square w-full object-cover" /><p className="truncate p-1 text-[10px] text-black/55">{preview.name}</p></div>)}</div> : null}
  </div>
}

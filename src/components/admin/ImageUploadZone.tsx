"use client"

import { useRef, useState } from "react"
import { Upload, Loader2 } from "lucide-react"

type ImageUploadZoneProps = {
  onUploaded: (url: string, source?: string) => void
  onError?: (message: string) => void
  disabled?: boolean
  label?: string
  hint?: string
}

export default function ImageUploadZone({
  onUploaded,
  onError,
  disabled,
  label = "Upload photo",
  hint = "JPG, PNG, or WebP · max 10MB · stored on Supabase",
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = async (file: File) => {
    setUploading(true)
    const body = new FormData()
    body.append("file", file)

    try {
      const res = await fetch("/admin/api/upload", { method: "POST", body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      onUploaded(data.url, data.source)
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled || uploading) return
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith("image/")) uploadFile(file)
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          "w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed rounded-card transition-colors",
          dragOver ? "border-vula-green bg-vula-green/5" : "border-vula-border hover:border-vula-green",
          disabled || uploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        {uploading ? (
          <Loader2 size={28} className="text-vula-green animate-spin" />
        ) : (
          <Upload size={28} className="text-vula-green" />
        )}
        <span className="font-sans text-sm text-vula-muted">
          {uploading ? "Uploading to Supabase…" : label}
        </span>
        <span className="font-sans text-xs text-vula-muted/80">{hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  )
}

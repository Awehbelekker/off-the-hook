"use client"

import { useState } from "react"
import Image from "next/image"
import { Copy, Check } from "lucide-react"
import ImageUploadZone from "@/components/admin/ImageUploadZone"

export default function AdminMediaPage() {
  const [url, setUrl] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyUrl = () => {
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-semibold mb-2">Media library</h1>
      <p className="font-sans text-sm text-vula-muted mb-8">
        Upload product photos to Supabase storage — copy the URL into any product.
      </p>

      <div className="card">
        <ImageUploadZone
          label="Click or drag image to upload"
          hint="Stored on Supabase · use in Products → Edit"
          onUploaded={(uploadedUrl, uploadSource) => {
            setError(null)
            setUrl(uploadedUrl)
            setSource(uploadSource ?? null)
          }}
          onError={setError}
        />

        {error && <p className="font-sans text-sm text-red-500 mt-4">{error}</p>}

        {url && (
          <div className="mt-6">
            {source && (
              <p className="font-sans text-xs text-vula-green mb-2 capitalize">
                Uploaded via {source}
              </p>
            )}
            <div className="relative w-full aspect-video rounded-card overflow-hidden bg-vula-dark-3 mb-3">
              <Image src={url} alt="Uploaded" fill className="object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={url}
                className="flex-1 bg-vula-cream border border-vula-border rounded-input px-3 py-2 font-sans text-xs"
              />
              <button onClick={copyUrl} className="btn-ghost text-sm px-3" type="button">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <p className="font-sans text-xs text-vula-muted mt-2">
              Paste this URL into a product&apos;s image field in Products
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

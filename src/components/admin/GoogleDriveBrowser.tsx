"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ChevronRight,
  Folder,
  ImageIcon,
  Loader2,
  Upload,
  CheckSquare,
  Square,
} from "lucide-react"
import Image from "next/image"

type DriveFile = {
  id: string
  name: string
  mimeType: string
  size?: number
  thumbnailUrl?: string
  isFolder: boolean
}

type Crumb = { id: string; name: string }

type TransferResult = {
  fileId: string
  name: string
  url?: string
  error?: string
}

export default function GoogleDriveBrowser() {
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: "root", name: "My Drive" }])
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [transferring, setTransferring] = useState(false)
  const [results, setResults] = useState<TransferResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadFolder = useCallback((id: string) => {
    setLoading(true)
    setError(null)
    setResults(null)
    fetch(`/admin/api/google/files?folder=${encodeURIComponent(id)}`)
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || "Failed to load folder")
        setFiles(data.files)
        setSelected(new Set())
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadFolder("root")
  }, [loadFolder])

  const openFolder = (file: DriveFile) => {
    setCrumbs((prev) => [...prev, { id: file.id, name: file.name }])
    loadFolder(file.id)
  }

  const goToCrumb = (index: number) => {
    const crumb = crumbs[index]
    setCrumbs(crumbs.slice(0, index + 1))
    loadFolder(crumb.id)
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const imageFiles = files.filter((f) => !f.isFolder && f.mimeType.startsWith("image/"))
  const selectAllImages = () => {
    setSelected(new Set(imageFiles.map((f) => f.id)))
  }

  const transfer = async () => {
    if (!selected.size) return
    setTransferring(true)
    setResults(null)
    setError(null)
    try {
      const res = await fetch("/admin/api/google/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds: Array.from(selected) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Transfer failed")
      setResults(data.results)
      setSelected(new Set())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transfer failed")
    } finally {
      setTransferring(false)
    }
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-1 font-sans text-sm text-vula-muted mb-4">
        {crumbs.map((c, i) => (
          <span key={c.id} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} />}
            <button
              type="button"
              onClick={() => goToCrumb(i)}
              className="hover:text-vula-dark transition-colors"
            >
              {c.name}
            </button>
          </span>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-vula-muted">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <>
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" onClick={selectAllImages} className="btn-ghost text-xs">
                Select all images ({imageFiles.length})
              </button>
              {selected.size > 0 && (
                <button
                  type="button"
                  onClick={transfer}
                  disabled={transferring}
                  className="btn-primary text-xs flex items-center gap-2"
                >
                  {transferring ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  Transfer {selected.size} to Supabase
                </button>
              )}
            </div>
          )}

          <ul className="divide-y divide-vula-border">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                {file.isFolder ? (
                  <button
                    type="button"
                    onClick={() => openFolder(file)}
                    className="flex items-center gap-3 flex-1 text-left hover:text-vula-green transition-colors"
                  >
                    <Folder size={20} className="text-vula-muted shrink-0" />
                    <span className="font-sans text-sm">{file.name}</span>
                  </button>
                ) : file.mimeType.startsWith("image/") ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggle(file.id)}
                      className="text-vula-muted hover:text-vula-dark shrink-0"
                      aria-label={selected.has(file.id) ? "Deselect" : "Select"}
                    >
                      {selected.has(file.id) ? (
                        <CheckSquare size={18} className="text-vula-green" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-vula-dark-3 shrink-0">
                      {file.thumbnailUrl ? (
                        <Image
                          src={file.thumbnailUrl}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={18} className="text-vula-muted" />
                        </div>
                      )}
                    </div>
                    <span className="font-sans text-sm flex-1 truncate">{file.name}</span>
                    {file.size && (
                      <span className="font-sans text-xs text-vula-muted shrink-0">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </>
                ) : (
                  <span className="font-sans text-sm text-vula-muted pl-8">{file.name}</span>
                )}
              </li>
            ))}
            {files.length === 0 && (
              <li className="py-8 text-center font-sans text-sm text-vula-muted">
                This folder is empty
              </li>
            )}
          </ul>
        </>
      )}

      {error && <p className="font-sans text-sm text-red-500 mt-4">{error}</p>}

      {results && results.length > 0 && (
        <div className="mt-6 border-t border-vula-border pt-4">
          <p className="font-sans text-sm font-medium mb-3">
            Transferred {results.filter((r) => r.url).length} of {results.length}
          </p>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {results.map((r) => (
              <li key={r.fileId} className="font-sans text-xs">
                {r.url ? (
                  <span className="text-vula-green">{r.name} — copied URL ready</span>
                ) : (
                  <span className="text-red-500">{r.name}: {r.error}</span>
                )}
              </li>
            ))}
          </ul>
          {results.some((r) => r.url) && (
            <div className="mt-3">
              <p className="font-sans text-xs text-vula-muted mb-2">Uploaded URLs:</p>
              <textarea
                readOnly
                className="w-full h-24 bg-vula-cream border border-vula-border rounded-input px-3 py-2 font-sans text-xs"
                value={results.filter((r) => r.url).map((r) => r.url).join("\n")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

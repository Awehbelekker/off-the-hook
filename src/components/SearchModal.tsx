"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

type SearchModalProps = {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    onClose()
    router.push(`/shop?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-vula-dark/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg card shadow-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Search size={20} className="text-vula-green shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fish, chicken, seafood…"
            className="flex-1 bg-transparent font-sans text-sm text-vula-dark placeholder:text-vula-muted focus:outline-none"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-vula-muted hover:text-vula-dark transition-colors"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </form>
        <p className="font-sans text-xs text-vula-muted mt-3">
          Press Enter to search · Esc to close
        </p>
      </div>
    </div>
  )
}

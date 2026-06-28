"use client"

import { useEffect, useState } from "react"
import { Cloud, Link2, Unlink, Loader2 } from "lucide-react"

type Status = {
  configured: boolean
  connected: boolean
  connectedAt: string | null
}

export default function GoogleDriveConnection() {
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)

  const refresh = () => {
    setLoading(true)
    fetch("/admin/api/google/status")
      .then((r) => r.json())
      .then(setStatus)
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  const disconnect = async () => {
    setDisconnecting(true)
    await fetch("/admin/api/google/disconnect", { method: "POST" })
    refresh()
    setDisconnecting(false)
  }

  if (loading) {
    return (
      <div className="card flex items-center gap-3 text-vula-muted">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-sans text-sm">Checking Google Drive…</span>
      </div>
    )
  }

  if (!status?.configured) {
    return (
      <div className="card">
        <div className="flex items-start gap-3">
          <Cloud size={22} className="text-vula-muted shrink-0 mt-0.5" />
          <div>
            <p className="font-sans font-medium text-vula-dark">Google Drive not configured</p>
            <p className="font-sans text-sm text-vula-muted mt-1">
              Add <code className="text-xs">GOOGLE_CLIENT_ID</code> and{" "}
              <code className="text-xs">GOOGLE_CLIENT_SECRET</code> in Vercel, then create OAuth
              credentials in Google Cloud Console with redirect URI{" "}
              <code className="text-xs break-all">/admin/api/google/callback</code>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status.connected) {
    return (
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-vula-green/10 flex items-center justify-center">
            <Cloud size={20} className="text-vula-green" />
          </div>
          <div>
            <p className="font-sans font-medium text-vula-dark">Google Drive connected</p>
            {status.connectedAt && (
              <p className="font-sans text-xs text-vula-muted">
                Since {new Date(status.connectedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={disconnect}
          disabled={disconnecting}
          className="btn-ghost text-sm flex items-center gap-2"
        >
          {disconnecting ? <Loader2 size={16} className="animate-spin" /> : <Unlink size={16} />}
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="card flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Cloud size={22} className="text-vula-muted" />
        <div>
          <p className="font-sans font-medium text-vula-dark">Connect Google Drive</p>
          <p className="font-sans text-sm text-vula-muted">
            Browse folders and import product images into Supabase.
          </p>
        </div>
      </div>
      <a href="/admin/api/google/authorize" className="btn-primary text-sm flex items-center gap-2">
        <Link2 size={16} />
        Connect account
      </a>
    </div>
  )
}

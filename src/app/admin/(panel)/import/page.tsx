"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import GoogleDriveConnection from "@/components/admin/GoogleDriveConnection"
import GoogleDriveBrowser from "@/components/admin/GoogleDriveBrowser"

function ImportAlerts() {
  const params = useSearchParams()
  const connected = params.get("connected")
  const error = params.get("error")

  if (!connected && !error) return null

  if (connected) {
    return (
      <p className="font-sans text-sm text-vula-green bg-vula-green/10 rounded-input px-4 py-3 mb-6">
        Google Drive connected successfully. Browse folders below to import images.
      </p>
    )
  }

  return (
    <p className="font-sans text-sm text-red-600 bg-red-50 rounded-input px-4 py-3 mb-6">
      Connection failed: {decodeURIComponent(error!)}
    </p>
  )
}

function ImportContent() {
  const [connected, setConnected] = useState<boolean | null>(null)

  useEffect(() => {
    fetch("/admin/api/google/status")
      .then((r) => r.json())
      .then((s) => setConnected(s.connected))
  }, [])

  return (
    <>
      <ImportAlerts />
      <GoogleDriveConnection />
      {connected && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold mb-4">Browse Drive</h2>
          <GoogleDriveBrowser />
        </div>
      )}
    </>
  )
}

export default function AdminImportPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold mb-2">Import from Google Drive</h1>
      <p className="font-sans text-sm text-vula-muted mb-8">
        Connect your Google account, browse product photo folders, and transfer images to Supabase
        — same workflow as Awake, without leaving Off the Hook.
      </p>

      <Suspense fallback={null}>
        <ImportContent />
      </Suspense>
    </div>
  )
}

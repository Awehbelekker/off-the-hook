"use client"

import { LogOut } from "lucide-react"

export default function AdminSignOut() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/admin/api/auth", { method: "DELETE" })
        window.location.href = "/admin/login"
      }}
      className="flex items-center gap-2 font-sans text-sm text-vula-cream/70 hover:text-white"
    >
      <LogOut size={16} />
      Sign out
    </button>
  )
}

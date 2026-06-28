"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock } from "lucide-react"

export default function AdminLoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [devDefault, setDevDefault] = useState(false)
  const [configured, setConfigured] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("error") === "not-configured") {
      setError("Admin is not configured on this server yet.")
    }
    fetch("/admin/api/auth")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured ?? false)
        setDevDefault(data.devDefault ?? false)
      })
      .catch(() => setConfigured(false))
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/admin/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/admin")
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || "Login failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-vula-cream flex items-center justify-center px-6">
      <div className="card w-full max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={20} className="text-vula-green" />
          <h1 className="font-display text-2xl font-semibold">Store admin</h1>
        </div>
        <p className="font-sans text-sm text-vula-muted mb-6">
          Off the Hook staff login
        </p>

        {!configured && (
          <div className="bg-vula-peach border border-vula-amber/40 rounded-input px-4 py-3 mb-4 font-sans text-xs text-vula-dark leading-relaxed">
            Set <strong>ADMIN_PASSWORD</strong> in your Vercel environment variables, then redeploy.
          </div>
        )}

        {devDefault && (
          <div className="bg-vula-green/10 border border-vula-green/30 rounded-input px-4 py-3 mb-4 font-sans text-xs text-vula-dark">
            Local dev: password is <strong>offthehook</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="font-sans text-sm text-vula-muted mb-1.5 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-sm focus:outline-none focus:border-vula-green"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="font-sans text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !configured}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className="block text-center font-sans text-xs text-vula-muted hover:text-vula-green mt-6"
        >
          ← Back to store
        </Link>
      </div>
    </div>
  )
}

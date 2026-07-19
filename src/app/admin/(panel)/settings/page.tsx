"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Save, Plus, Trash2, ExternalLink } from "lucide-react"
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/lib/settings"
import type { Product } from "@/lib/api"
import FeaturedProductPicker from "@/components/admin/FeaturedProductPicker"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS)
  const [products, setProducts] = useState<Product[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ ...DEFAULT_STORE_SETTINGS, ...data }))
      .catch(() => {})
    fetch("/admin/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage(null)
    const res = await fetch("/admin/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    if (res.ok) {
      const data = await res.json()
      setMessage(`Saved (${data._source || "ok"})`)
    } else {
      setMessage("Save failed")
    }
    setSaving(false)
  }

  const updateAnnouncement = (index: number, value: string) => {
    const announcements = [...settings.announcements]
    announcements[index] = value
    setSettings({ ...settings, announcements })
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Store settings</h1>
          <p className="font-sans text-sm text-vula-muted">
            Announcement bar, delivery rules, and hero copy
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-sm flex items-center gap-2"
        >
          <ExternalLink size={14} />
          Preview storefront
        </a>
      </div>

      <div className="flex flex-col gap-6">
        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Announcement bar</h2>
          {settings.announcements.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={msg}
                onChange={(e) => updateAnnouncement(i, e.target.value)}
                className="flex-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    announcements: settings.announcements.filter((_, j) => j !== i),
                  })
                }
                className="text-vula-muted hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setSettings({ ...settings, announcements: [...settings.announcements, ""] })
            }
            className="btn-ghost text-sm w-fit"
          >
            <Plus size={14} />
            Add message
          </button>
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Delivery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-xs text-vula-muted">Delivery fee (Rands)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={(settings.delivery_fee_cents / 100).toFixed(2)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    delivery_fee_cents: Math.round((parseFloat(e.target.value) || 0) * 100),
                  })
                }
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <p className="font-sans text-xs text-vula-muted mt-1">
                R{(settings.delivery_fee_cents / 100).toFixed(2)} per order
              </p>
            </div>
            <div>
              <label className="font-sans text-xs text-vula-muted">Free delivery over (Rands)</label>
              <input
                type="number"
                step="1"
                min="0"
                value={(settings.free_delivery_threshold_cents / 100).toFixed(0)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    free_delivery_threshold_cents: Math.round((parseFloat(e.target.value) || 0) * 100),
                  })
                }
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <p className="font-sans text-xs text-vula-muted mt-1">
                Free delivery when subtotal ≥ R{(settings.free_delivery_threshold_cents / 100).toFixed(0)}
              </p>
            </div>
            <div>
              <label className="font-sans text-xs text-vula-muted">Express delivery extra (Rands)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={(settings.express_delivery_extra_cents / 100).toFixed(2)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    express_delivery_extra_cents: Math.round((parseFloat(e.target.value) || 0) * 100),
                  })
                }
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <p className="font-sans text-xs text-vula-muted mt-1">
                +R{(settings.express_delivery_extra_cents / 100).toFixed(2)} for express slot
              </p>
            </div>
            <div>
              <label className="font-sans text-xs text-vula-muted">Order cutoff time</label>
              <input
                type="text"
                value={settings.cutoff_time}
                onChange={(e) => setSettings({ ...settings, cutoff_time: e.target.value })}
                placeholder="10:00"
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <p className="font-sans text-xs text-vula-muted mt-1">Same-day orders before this time</p>
            </div>
          </div>
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Hero</h2>
          <div>
            <label className="font-sans text-xs text-vula-muted">Hero tagline</label>
            <input
              value={settings.hero_tagline}
              onChange={(e) => setSettings({ ...settings, hero_tagline: e.target.value })}
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-vula-muted">Hero subtitle</label>
            <input
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-vula-muted mb-2 block">Featured products</label>
            <FeaturedProductPicker
              products={products}
              selectedIds={settings.featured_product_ids}
              onChange={(featured_product_ids) => setSettings({ ...settings, featured_product_ids })}
            />
          </div>
          <p className="font-sans text-xs text-vula-muted">
            More homepage sections in{" "}
            <Link href="/admin/homepage" className="text-vula-green hover:underline">
              Homepage
            </Link>
            .
          </p>
        </section>

        <button onClick={save} disabled={saving} className="btn-primary w-fit">
          <Save size={16} />
          {saving ? "Saving…" : "Save settings"}
        </button>

        {message && <p className="font-sans text-sm text-vula-green">{message}</p>}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Save, Plus, Trash2 } from "lucide-react"
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/lib/settings"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ ...DEFAULT_STORE_SETTINGS, ...data }))
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
      <h1 className="font-display text-3xl font-semibold mb-2">Store settings</h1>
      <p className="font-sans text-sm text-vula-muted mb-8">
        Announcement bar, delivery rules, and homepage copy
      </p>

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-xs text-vula-muted">Delivery fee (cents)</label>
              <input
                type="number"
                value={settings.delivery_fee_cents}
                onChange={(e) =>
                  setSettings({ ...settings, delivery_fee_cents: Number(e.target.value) })
                }
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="font-sans text-xs text-vula-muted">Free delivery threshold (cents)</label>
              <input
                type="number"
                value={settings.free_delivery_threshold_cents}
                onChange={(e) =>
                  setSettings({ ...settings, free_delivery_threshold_cents: Number(e.target.value) })
                }
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="font-sans text-xs text-vula-muted">Express extra (cents)</label>
              <input
                type="number"
                value={settings.express_delivery_extra_cents}
                onChange={(e) =>
                  setSettings({ ...settings, express_delivery_extra_cents: Number(e.target.value) })
                }
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
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
            </div>
          </div>
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Homepage</h2>
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
            <label className="font-sans text-xs text-vula-muted">Featured product IDs (comma-separated)</label>
            <input
              value={settings.featured_product_ids.join(", ")}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  featured_product_ids: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
          </div>
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

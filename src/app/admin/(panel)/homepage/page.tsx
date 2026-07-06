"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Save, Plus, Trash2, ExternalLink } from "lucide-react"
import { DEFAULT_HOME_SECTIONS, type HomeSections } from "@/lib/home-sections"

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<HomeSections>(DEFAULT_HOME_SECTIONS)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/api/home-sections")
      .then((r) => r.json())
      .then((data) => setSections({ ...DEFAULT_HOME_SECTIONS, ...data }))
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage(null)
    const res = await fetch("/admin/api/home-sections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sections),
    })
    setMessage(res.ok ? "Homepage saved" : "Save failed")
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Homepage</h1>
          <p className="font-sans text-sm text-vula-muted">
            Edit homepage copy — layout stays fixed; you control the words.
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
          <h2 className="font-display text-xl font-semibold">Brand promise band</h2>
          {sections.brand_badges.map((badge, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input
                value={badge.label}
                onChange={(e) => {
                  const brand_badges = [...sections.brand_badges]
                  brand_badges[i] = { ...badge, label: e.target.value }
                  setSections({ ...sections, brand_badges })
                }}
                placeholder="Label"
                className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <input
                value={badge.sub}
                onChange={(e) => {
                  const brand_badges = [...sections.brand_badges]
                  brand_badges[i] = { ...badge, sub: e.target.value }
                  setSections({ ...sections, brand_badges })
                }}
                placeholder="Subtitle"
                className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
            </div>
          ))}
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">How it works</h2>
          <input
            value={sections.how_it_works_heading}
            onChange={(e) => setSections({ ...sections, how_it_works_heading: e.target.value })}
            placeholder="Section heading"
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
          {sections.how_it_works_steps.map((step, i) => (
            <div key={step.step} className="border border-vula-border rounded-input p-3 flex flex-col gap-2">
              <p className="font-sans text-xs text-vula-muted">Step {step.step}</p>
              <input
                value={step.title}
                onChange={(e) => {
                  const how_it_works_steps = [...sections.how_it_works_steps]
                  how_it_works_steps[i] = { ...step, title: e.target.value }
                  setSections({ ...sections, how_it_works_steps })
                }}
                placeholder="Title"
                className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <textarea
                value={step.body}
                onChange={(e) => {
                  const how_it_works_steps = [...sections.how_it_works_steps]
                  how_it_works_steps[i] = { ...step, body: e.target.value }
                  setSections({ ...sections, how_it_works_steps })
                }}
                rows={2}
                placeholder="Body"
                className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm resize-y"
              />
            </div>
          ))}
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Categories</h2>
          <input
            value={sections.categories_heading}
            onChange={(e) => setSections({ ...sections, categories_heading: e.target.value })}
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
          {sections.categories.map((cat, i) => (
            <div key={cat.slug} className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 font-sans text-sm shrink-0">
                <input
                  type="checkbox"
                  checked={cat.enabled}
                  onChange={(e) => {
                    const categories = [...sections.categories]
                    categories[i] = { ...cat, enabled: e.target.checked }
                    setSections({ ...sections, categories })
                  }}
                />
                Show
              </label>
              <input
                value={cat.emoji}
                onChange={(e) => {
                  const categories = [...sections.categories]
                  categories[i] = { ...cat, emoji: e.target.value }
                  setSections({ ...sections, categories })
                }}
                className="w-12 bg-white border border-vula-border rounded-input px-2 py-2 font-sans text-sm text-center"
              />
              <input
                value={cat.label}
                onChange={(e) => {
                  const categories = [...sections.categories]
                  categories[i] = { ...cat, label: e.target.value }
                  setSections({ ...sections, categories })
                }}
                className="flex-1 min-w-[8rem] bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
            </div>
          ))}
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">WhatsApp CTA band</h2>
          <input
            value={sections.whatsapp_cta.badge}
            onChange={(e) =>
              setSections({
                ...sections,
                whatsapp_cta: { ...sections.whatsapp_cta, badge: e.target.value },
              })
            }
            placeholder="Badge"
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
          <input
            value={sections.whatsapp_cta.heading}
            onChange={(e) =>
              setSections({
                ...sections,
                whatsapp_cta: { ...sections.whatsapp_cta, heading: e.target.value },
              })
            }
            placeholder="Heading"
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
          <textarea
            value={sections.whatsapp_cta.body}
            onChange={(e) =>
              setSections({
                ...sections,
                whatsapp_cta: { ...sections.whatsapp_cta, body: e.target.value },
              })
            }
            rows={3}
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm resize-y"
          />
          <input
            value={sections.whatsapp_cta.button_label}
            onChange={(e) =>
              setSections({
                ...sections,
                whatsapp_cta: { ...sections.whatsapp_cta, button_label: e.target.value },
              })
            }
            placeholder="Button label"
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold">Quality promise</h2>
          <input
            value={sections.quality_promise.badge}
            onChange={(e) =>
              setSections({
                ...sections,
                quality_promise: { ...sections.quality_promise, badge: e.target.value },
              })
            }
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
          <input
            value={sections.quality_promise.heading}
            onChange={(e) =>
              setSections({
                ...sections,
                quality_promise: { ...sections.quality_promise, heading: e.target.value },
              })
            }
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
          <textarea
            value={sections.quality_promise.body}
            onChange={(e) =>
              setSections({
                ...sections,
                quality_promise: { ...sections.quality_promise, body: e.target.value },
              })
            }
            rows={4}
            className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm resize-y"
          />
          <p className="font-sans text-xs text-vula-muted">Bullet points</p>
          {sections.quality_promise.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={bullet}
                onChange={(e) => {
                  const bullets = [...sections.quality_promise.bullets]
                  bullets[i] = e.target.value
                  setSections({
                    ...sections,
                    quality_promise: { ...sections.quality_promise, bullets },
                  })
                }}
                className="flex-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    quality_promise: {
                      ...sections.quality_promise,
                      bullets: sections.quality_promise.bullets.filter((_, j) => j !== i),
                    },
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
              setSections({
                ...sections,
                quality_promise: {
                  ...sections.quality_promise,
                  bullets: [...sections.quality_promise.bullets, ""],
                },
              })
            }
            className="btn-ghost text-sm w-fit"
          >
            <Plus size={14} />
            Add bullet
          </button>
        </section>

        <button onClick={save} disabled={saving} className="btn-primary w-fit">
          <Save size={16} />
          {saving ? "Saving…" : "Save homepage"}
        </button>

        {message && (
          <p className={`font-sans text-sm ${message.includes("failed") ? "text-red-500" : "text-vula-green"}`}>
            {message}
          </p>
        )}

        <p className="font-sans text-xs text-vula-muted">
          Hero tagline, featured products, and announcements are in{" "}
          <Link href="/admin/settings" className="text-vula-green hover:underline">
            Settings
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

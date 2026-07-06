"use client"

import { useState } from "react"
import Image from "next/image"
import { Save, X, Loader2 } from "lucide-react"
import type { Product, PricingMode } from "@/lib/api"
import ImageUploadZone from "@/components/admin/ImageUploadZone"

function isLocalUpload(url: string) {
  return url.startsWith("/uploads")
}

const CATEGORIES = [
  { value: "fresh_fish", label: "Fresh fish" },
  { value: "fresh_chicken", label: "Fresh chicken" },
  { value: "frozen_chicken", label: "Frozen chicken" },
  { value: "frozen_seafood", label: "Frozen seafood" },
  { value: "extras", label: "Extras" },
  { value: "linefish", label: "Linefish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "frozen", label: "Frozen" },
]

type ProductEditorProps = {
  product: Product
  form: Partial<Product>
  setForm: (form: Partial<Product>) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-vula-border pt-4 first:border-0 first:pt-0">
      <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-vula-muted mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function ProductEditor({
  product,
  form,
  setForm,
  onSave,
  onCancel,
  saving,
}: ProductEditorProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)
  const previewUrl = form.image_url || product.image_url
  const pricingMode: PricingMode = form.pricing_mode ?? product.pricing_mode ?? "fixed"
  const isByWeight = pricingMode === "by_weight"

  const fixedRands = ((form.price_cents ?? product.price_cents) / 100).toFixed(2)
  const perKgRands = ((form.price_per_kg_cents ?? form.price_cents ?? product.price_per_kg_cents ?? product.price_cents) / 100).toFixed(0)

  const minKg = form.min_weight_g != null ? form.min_weight_g / 1000 : ""
  const maxKg = form.max_weight_g != null ? form.max_weight_g / 1000 : ""
  const refKg = (form.reference_weight_g ?? form.weight_grams) != null
    ? (form.reference_weight_g ?? form.weight_grams)! / 1000
    : ""

  return (
    <div className="flex-1 flex flex-col gap-5">
      <Section title="Media">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-32 h-32 rounded-card overflow-hidden bg-vula-dark-3 shrink-0">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={form.name || product.name}
                fill
                className="object-cover"
                unoptimized={isLocalUpload(previewUrl)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🐟</div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <ImageUploadZone
              label="Drop product photo here"
              hint="Stored on Supabase · JPG, PNG, WebP · max 10MB"
              onUploaded={(url) => {
                setUploadError(null)
                setForm({ ...form, image_url: url })
              }}
              onError={setUploadError}
            />
            <input
              value={form.image_url || ""}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="Or paste image URL"
              className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
            {uploadError && <p className="font-sans text-xs text-red-500">{uploadError}</p>}
          </div>
        </div>
      </Section>

      <Section title="Basics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="font-sans text-xs text-vula-muted">Name</label>
            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
          </div>

          <div>
            <label className="font-sans text-xs text-vula-muted">Slug</label>
            <input
              readOnly
              value={product.slug}
              className="w-full mt-1 bg-vula-cream border border-vula-border rounded-input px-3 py-2 font-sans text-sm text-vula-muted"
            />
          </div>

          <div>
            <label className="font-sans text-xs text-vula-muted">Category</label>
            <select
              value={form.category || product.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="font-sans text-xs text-vula-muted">Description</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm resize-y"
            />
          </div>
        </div>
      </Section>

      <Section title="Pricing">
        <div className="flex flex-wrap gap-2 mb-4">
          {(["fixed", "by_weight"] as PricingMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setForm({ ...form, pricing_mode: mode })}
              className={[
                "px-4 py-2 rounded-input font-sans text-sm border transition-colors",
                pricingMode === mode
                  ? "bg-vula-green text-white border-vula-green"
                  : "bg-white border-vula-border text-vula-muted hover:border-vula-green",
              ].join(" ")}
            >
              {mode === "fixed" ? "Fixed price" : "Sold by weight"}
            </button>
          ))}
        </div>

        {isByWeight ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-sans text-xs text-vula-muted">Price per kg (Rands)</label>
              <input
                type="number"
                step="1"
                min="0"
                value={perKgRands}
                onChange={(e) => {
                  const rands = parseFloat(e.target.value) || 0
                  const cents = Math.round(rands * 100)
                  setForm({ ...form, price_per_kg_cents: cents, price_cents: cents })
                }}
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <p className="font-sans text-xs text-vula-muted mt-1">R{perKgRands}/kg on storefront</p>
            </div>

            <div>
              <label className="font-sans text-xs text-vula-muted">Reference portion (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={refKg}
                onChange={(e) => {
                  const kg = parseFloat(e.target.value)
                  setForm({
                    ...form,
                    reference_weight_g: e.target.value ? Math.round(kg * 1000) : undefined,
                    weight_grams: e.target.value ? Math.round(kg * 1000) : undefined,
                  })
                }}
                placeholder="e.g. 1"
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
              <p className="font-sans text-xs text-vula-muted mt-1">Typical portion hint for customers</p>
            </div>

            <div>
              <label className="font-sans text-xs text-vula-muted">Min order (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={minKg}
                onChange={(e) =>
                  setForm({
                    ...form,
                    min_weight_g: e.target.value ? Math.round(parseFloat(e.target.value) * 1000) : undefined,
                  })
                }
                placeholder="0.5"
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
            </div>

            <div>
              <label className="font-sans text-xs text-vula-muted">Max order (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={maxKg}
                onChange={(e) =>
                  setForm({
                    ...form,
                    max_weight_g: e.target.value ? Math.round(parseFloat(e.target.value) * 1000) : undefined,
                  })
                }
                placeholder="5"
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
            </div>

            <p className="md:col-span-2 font-sans text-xs text-vula-muted">
              Weight orders are confirmed on WhatsApp — customer enters requested kg and special requests at checkout.
            </p>
          </div>
        ) : (
          <div className="max-w-xs">
            <label className="font-sans text-xs text-vula-muted">Price (Rands)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={fixedRands}
              onChange={(e) => {
                const rands = parseFloat(e.target.value) || 0
                setForm({ ...form, price_cents: Math.round(rands * 100) })
              }}
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
            <p className="font-sans text-xs text-vula-muted mt-1">R{fixedRands} fixed unit price</p>
          </div>
        )}
      </Section>

      <Section title="Provenance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-sans text-xs text-vula-muted">Serves</label>
            <input
              value={form.serves || ""}
              onChange={(e) => setForm({ ...form, serves: e.target.value })}
              placeholder="e.g. 2–3 people"
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
          </div>

          {!isByWeight && (
            <div>
              <label className="font-sans text-xs text-vula-muted">Pack weight (grams)</label>
              <input
                type="number"
                value={form.weight_grams ?? ""}
                onChange={(e) =>
                  setForm({ ...form, weight_grams: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
              />
            </div>
          )}

          <div>
            <label className="font-sans text-xs text-vula-muted">Catch source</label>
            <input
              value={form.catch_source || ""}
              onChange={(e) => setForm({ ...form, catch_source: e.target.value })}
              placeholder="e.g. Hout Bay"
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
          </div>

          <div>
            <label className="font-sans text-xs text-vula-muted">Fisherman</label>
            <input
              value={form.fisherman_name || ""}
              onChange={(e) => setForm({ ...form, fisherman_name: e.target.value })}
              className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
            />
          </div>
        </div>
      </Section>

      <Section title="Availability">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 font-sans text-sm">
            <input
              type="checkbox"
              checked={form.in_stock ?? true}
              onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
            />
            In stock
          </label>

          <label className="flex items-center gap-2 font-sans text-sm">
            <input
              type="checkbox"
              checked={form.is_daily_catch ?? false}
              onChange={(e) => setForm({ ...form, is_daily_catch: e.target.checked })}
            />
            Daily catch
          </label>
        </div>
      </Section>

      <div className="flex gap-2 pt-2">
        <button onClick={onSave} disabled={saving} className="btn-primary text-sm">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving…" : "Save product"}
        </button>
        <button onClick={onCancel} className="btn-ghost text-sm">
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  )
}

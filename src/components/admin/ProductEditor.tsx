"use client"

import { useState } from "react"
import Image from "next/image"
import { Save, X, Loader2 } from "lucide-react"
import type { Product } from "@/lib/api"
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

  return (
    <div className="flex-1 flex flex-col gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="font-sans text-xs text-vula-muted">Name</label>
          <input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
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

        <div>
          <label className="font-sans text-xs text-vula-muted">Price (cents)</label>
          <input
            type="number"
            value={form.price_cents ?? 0}
            onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })}
            className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
          <p className="font-sans text-xs text-vula-muted mt-1">
            R{((form.price_cents ?? 0) / 100).toFixed(2)}
          </p>
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

        <div>
          <label className="font-sans text-xs text-vula-muted">Weight (grams)</label>
          <input
            type="number"
            value={form.weight_grams ?? ""}
            onChange={(e) => setForm({ ...form, weight_grams: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
        </div>

        <div>
          <label className="font-sans text-xs text-vula-muted">Serves</label>
          <input
            value={form.serves || ""}
            onChange={(e) => setForm({ ...form, serves: e.target.value })}
            placeholder="e.g. 2–3 people"
            className="w-full mt-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm"
          />
        </div>

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

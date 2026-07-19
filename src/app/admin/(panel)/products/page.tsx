"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/api"
import { formatProductPrice, isByWeight } from "@/lib/pricing"
import ProductEditor from "@/components/admin/ProductEditor"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Product>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/admin/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const startEdit = (product: Product) => {
    setEditing(product.id)
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price_cents: product.price_cents,
      pricing_mode: product.pricing_mode ?? "fixed",
      price_per_kg_cents: product.price_per_kg_cents,
      min_weight_g: product.min_weight_g,
      max_weight_g: product.max_weight_g,
      reference_weight_g: product.reference_weight_g ?? product.weight_grams,
      weight_grams: product.weight_grams,
      serves: product.serves,
      catch_source: product.catch_source,
      fisherman_name: product.fisherman_name,
      image_url: product.image_url,
      in_stock: product.in_stock,
      is_daily_catch: product.is_daily_catch,
    })
    setMessage(null)
  }

  const saveProduct = async (id: string) => {
    setSaving(true)
    setMessage(null)
    const res = await fetch(`/admin/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const updated = await res.json()
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)))
      setEditing(null)
      setMessage(`Saved (${updated._source === "local" ? "stored locally" : "synced to Vula"})`)
    } else {
      const data = await res.json().catch(() => ({}))
      setMessage(data.error || "Update failed")
    }
    setSaving(false)
  }

  if (loading) {
    return <p className="font-sans text-vula-muted">Loading products…</p>
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Products</h1>
      <p className="font-sans text-sm text-vula-muted mb-2">
        Edit names, photos, prices, and details — changes appear on the storefront.
      </p>
      <p className="font-sans text-xs text-vula-muted mb-8">
        {products.length} products · upload a photo or paste an image URL
      </p>

      {message && (
        <p className={`font-sans text-sm mb-4 ${message.includes("failed") || message.includes("Failed") ? "text-red-500" : "text-vula-green"}`}>
          {message}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <div key={product.id} className="card">
            {editing === product.id ? (
              <ProductEditor
                product={product}
                form={form}
                setForm={setForm}
                onSave={() => saveProduct(product.id)}
                onCancel={() => setEditing(null)}
                saving={saving}
              />
            ) : (
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-input overflow-hidden bg-vula-dark-3 shrink-0">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized={product.image_url.startsWith("/uploads")} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🐟</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold">{product.name}</p>
                  <p className="font-sans text-sm text-vula-muted line-clamp-2 mt-1">{product.description}</p>
                  <p className="font-sans text-sm text-vula-muted mt-2">
                    {formatProductPrice(product)}
                    {isByWeight(product) && " · by weight"}
                    {" · "}{product.category}
                    {!product.in_stock && " · Out of stock"}
                    {product.is_daily_catch && " · Daily catch"}
                  </p>
                </div>
                <button onClick={() => startEdit(product)} className="btn-ghost text-sm shrink-0">
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}

        {products.length === 0 && (
          <p className="font-sans text-vula-muted">No products loaded. Check Vula API connection.</p>
        )}
      </div>
    </div>
  )
}

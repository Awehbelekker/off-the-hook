"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, MessageCircle, MapPin, User, ArrowLeft, Zap } from "lucide-react"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import { type Product } from "@/lib/api"
import { whatsappLink } from "@/lib/whatsapp"
import { useCartStore } from "@/store/cart"
import {
  calculateWeightLineTotalCents,
  formatProductPrice,
  formatWeightKg,
  isByWeight,
} from "@/lib/pricing"

function defaultWeightKg(product: Product): number {
  const ref = product.reference_weight_g ?? product.weight_grams
  if (ref) return ref / 1000
  if (product.min_weight_g) return product.min_weight_g / 1000
  return 1
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [weightKg, setWeightKg] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [weightError, setWeightError] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/store/products/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p: Product) => {
        setProduct(p)
        setWeightKg(defaultWeightKg(p))
      })
      .catch(() => router.push("/shop"))
      .finally(() => setLoading(false))
  }, [slug, router])

  const byWeight = product ? isByWeight(product) : false
  const perKgCents = product
    ? product.price_per_kg_cents ?? product.price_cents
    : 0
  const weightG = Math.round(weightKg * 1000)

  const optionNames = product?.options ?? []
  const activeVariants = (product?.variants ?? []).filter((v) => !v.archived)
  const hasVariants = optionNames.length > 0 && activeVariants.length > 0
  const selectedVariant = hasVariants
    ? activeVariants.find((v) =>
        optionNames.every((name) => v.option_values?.[name] === selectedOptions[name])
      )
    : undefined
  const variantSelectionComplete = !hasVariants || Boolean(selectedVariant)
  const effectivePriceCents = selectedVariant?.price_cents ?? product?.price_cents ?? 0
  const effectiveInStock = selectedVariant ? selectedVariant.in_stock : (product?.in_stock ?? false)
  const variantLabel = hasVariants
    ? optionNames.map((name) => `${name}: ${selectedOptions[name]}`).filter(Boolean).join(", ")
    : undefined

  const estimatedCents = byWeight
    ? calculateWeightLineTotalCents(perKgCents, weightG)
    : product
      ? effectivePriceCents * qty
      : 0

  const validateWeight = (): boolean => {
    if (!product || !byWeight) return true
    const min = product.min_weight_g
    const max = product.max_weight_g
    if (min && weightG < min) {
      setWeightError(`Minimum order is ${formatWeightKg(min)}`)
      return false
    }
    if (max && weightG > max) {
      setWeightError(`Maximum order is ${formatWeightKg(max)}`)
      return false
    }
    if (weightG <= 0) {
      setWeightError("Enter a valid weight")
      return false
    }
    setWeightError(null)
    return true
  }

  const handleAddToCart = () => {
    if (!product || !validateWeight() || !variantSelectionComplete) return

    if (byWeight) {
      addItem({
        id: product.id,
        name: product.name,
        price_cents: product.price_cents,
        price_per_kg_cents: perKgCents,
        image_url: product.image_url,
        pricing_mode: "by_weight",
        requested_weight_g: weightG,
        special_requests: specialRequests,
        variant_id: selectedVariant?.id,
        variant_label: variantLabel,
      })
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price_cents: effectivePriceCents,
        image_url: product.image_url,
        pricing_mode: "fixed",
        quantity: qty,
        variant_id: selectedVariant?.id,
        variant_label: variantLabel,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-vula-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const priceLabel = hasVariants
    ? (selectedVariant ? `R${(effectivePriceCents / 100).toFixed(2)}` : (product.variant_price_range
        ? `From R${(product.variant_price_range.min / 100).toFixed(2)}`
        : formatProductPrice(product)))
    : formatProductPrice(product)
  const waMessage = byWeight
    ? [
        `Hi, I'd like to order ${product.name}`,
        `Requested: ${formatWeightKg(weightG)} @ ${priceLabel}`,
        specialRequests ? `Special requests: ${specialRequests}` : null,
        `Estimated total: R${(estimatedCents / 100).toFixed(2)}`,
      ]
        .filter(Boolean)
        .join("\n")
    : `Hi, I'd like to order ${qty}x ${product.name}${variantLabel ? ` (${variantLabel})` : ""} (R${(effectivePriceCents / 100).toFixed(2)} each)`

  const displayWeight = product.reference_weight_g ?? product.weight_grams

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10 pb-28 md:pb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-vula-muted hover:text-vula-green font-sans text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative aspect-square rounded-card overflow-hidden bg-vula-dark-3">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl text-vula-dark/20">🐟</div>
            )}
            {product.is_daily_catch && (
              <span className="absolute top-4 left-4 badge badge-amber flex items-center gap-1">
                <Zap size={11} /> Daily catch
              </span>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {(product.catch_source || product.fisherman_name) && (
              <div className="flex flex-col gap-1">
                {product.catch_source && (
                  <p className="flex items-center gap-1.5 font-sans text-xs text-vula-muted uppercase tracking-widest">
                    <MapPin size={11} /> {product.catch_source}
                  </p>
                )}
                {product.fisherman_name && (
                  <p className="flex items-center gap-1.5 font-sans text-xs text-vula-muted uppercase tracking-widest">
                    <User size={11} /> {product.fisherman_name}
                  </p>
                )}
              </div>
            )}

            <div>
              <h1 className="font-display text-4xl font-semibold mb-3">{product.name}</h1>
              <p className="font-sans text-vula-muted leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-4">
              {displayWeight && (
                <div className="card py-3 px-4 text-center flex-1">
                  <p className="font-display text-xl font-semibold">{formatWeightKg(displayWeight)}</p>
                  <p className="font-sans text-xs text-vula-muted mt-1">
                    {byWeight ? "Typical portion" : "Weight"}
                  </p>
                </div>
              )}
              {product.serves && (
                <div className="card py-3 px-4 text-center flex-1">
                  <p className="font-display text-xl font-semibold">{product.serves}</p>
                  <p className="font-sans text-xs text-vula-muted mt-1">Serves</p>
                </div>
              )}
            </div>

            {hasVariants && (
              <div className="flex flex-col gap-4">
                {optionNames.map((name) => {
                  const values = Array.from(
                    new Set(activeVariants.map((v) => v.option_values?.[name]).filter(Boolean))
                  ) as string[]
                  return (
                    <div key={name}>
                      <label className="font-sans text-sm font-medium text-vula-dark">{name}</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {values.map((val) => {
                          const isSelected = selectedOptions[name] === val
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setSelectedOptions((prev) => ({ ...prev, [name]: val }))}
                              className={[
                                "px-4 py-2 rounded-input border font-sans text-sm transition-colors",
                                isSelected
                                  ? "bg-vula-green text-white border-vula-green"
                                  : "bg-white border-vula-border text-vula-dark hover:border-vula-green",
                              ].join(" ")}
                            >
                              {val}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {!variantSelectionComplete && (
                  <p className="font-sans text-xs text-vula-muted">Choose {optionNames.join(" and ")} to see the price and add to cart.</p>
                )}
                {selectedVariant && !selectedVariant.in_stock && (
                  <p className="font-sans text-xs text-red-500">That combination is currently out of stock.</p>
                )}
              </div>
            )}

            {byWeight ? (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-display text-4xl font-bold text-vula-dark">{priceLabel}</p>
                  <p className="font-sans text-sm text-vula-muted mt-1">Sold by weight — final amount confirmed on weigh-in</p>
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-vula-dark">Requested weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={product.min_weight_g ? product.min_weight_g / 1000 : 0.1}
                    max={product.max_weight_g ? product.max_weight_g / 1000 : undefined}
                    value={weightKg}
                    onChange={(e) => {
                      setWeightKg(parseFloat(e.target.value) || 0)
                      setWeightError(null)
                    }}
                    className="w-full mt-2 bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-lg"
                  />
                  {(product.min_weight_g || product.max_weight_g) && (
                    <p className="font-sans text-xs text-vula-muted mt-1">
                      {product.min_weight_g && `Min ${formatWeightKg(product.min_weight_g)}`}
                      {product.min_weight_g && product.max_weight_g && " · "}
                      {product.max_weight_g && `Max ${formatWeightKg(product.max_weight_g)}`}
                    </p>
                  )}
                  {weightError && <p className="font-sans text-xs text-red-500 mt-1">{weightError}</p>}
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-vula-dark">Special requests</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Steak cut, skin off, portion for 2…"
                    rows={3}
                    className="w-full mt-2 bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-sm resize-y"
                  />
                </div>

                <div className="card py-4 px-5">
                  <p className="font-sans text-sm text-vula-muted">Estimated total</p>
                  <p className="font-display text-3xl font-bold text-vula-dark">
                    R{(estimatedCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <p className="font-display text-4xl font-bold text-vula-dark">{priceLabel}</p>
                <div className="flex items-center gap-3 border border-vula-border rounded-input px-3 py-2 bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="text-vula-muted hover:text-vula-green w-6 text-lg font-sans"
                  >−</button>
                  <span className="font-sans font-semibold text-vula-dark w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="text-vula-muted hover:text-vula-green w-6 text-lg font-sans"
                  >+</button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                disabled={!effectiveInStock || !variantSelectionComplete}
                onClick={handleAddToCart}
                className={[
                  "btn-primary w-full justify-center text-base py-4",
                  (!effectiveInStock || !variantSelectionComplete) ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <ShoppingCart size={18} />
                {added ? "Added to cart ✓" : !variantSelectionComplete ? "Choose options" : effectiveInStock ? "Add to cart" : "Out of stock"}
              </button>

              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-center text-base py-4"
              >
                <MessageCircle size={18} className="text-vula-green" />
                Order on WhatsApp
              </a>
            </div>

            {byWeight && (
              <p className="font-sans text-xs text-vula-muted border-t border-vula-border pt-4">
                Fresh fish orders are confirmed on WhatsApp. We&apos;ll weigh and pack to your request — what you order is what you pay for.
              </p>
            )}

            {!byWeight && (
              <p className="font-sans text-xs text-vula-muted border-t border-vula-border pt-4">
                🚚 Free delivery on orders over R500 · Cape Town only · Order by 10am for same-day morning delivery
              </p>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  )
}

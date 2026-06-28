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

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/store/products/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProduct)
      .catch(() => router.push("/shop"))
      .finally(() => setLoading(false))
  }, [slug, router])

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price_cents: product.price_cents, image_url: product.image_url })
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

  const priceRands = (product.price_cents / 100).toFixed(2)
  const waMessage = `Hi, I'd like to order ${qty}x ${product.name} (R${priceRands} each)`

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
          {/* Image */}
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

          {/* Details */}
          <div className="flex flex-col gap-6">
            {/* Provenance */}
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

            {/* Meta */}
            <div className="flex gap-4">
              {product.weight_grams && (
                <div className="card py-3 px-4 text-center flex-1">
                  <p className="font-display text-xl font-semibold">{product.weight_grams}g</p>
                  <p className="font-sans text-xs text-vula-muted mt-1">Weight</p>
                </div>
              )}
              {product.serves && (
                <div className="card py-3 px-4 text-center flex-1">
                  <p className="font-display text-xl font-semibold">{product.serves}</p>
                  <p className="font-sans text-xs text-vula-muted mt-1">Serves</p>
                </div>
              )}
            </div>

            {/* Price + quantity */}
            <div className="flex items-center gap-6">
              <p className="font-display text-4xl font-bold text-vula-dark">R{priceRands}</p>
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

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <button
                disabled={!product.in_stock}
                onClick={handleAddToCart}
                className={[
                  "btn-primary w-full justify-center text-base py-4",
                  !product.in_stock ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <ShoppingCart size={18} />
                {added ? "Added to cart ✓" : product.in_stock ? "Add to cart" : "Out of stock"}
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

            {/* Delivery note */}
            <p className="font-sans text-xs text-vula-muted border-t border-vula-border pt-4">
              🚚 Free delivery on orders over R500 · Cape Town only · Order by 10am for same-day morning delivery
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  )
}

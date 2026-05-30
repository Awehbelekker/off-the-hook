"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Zap } from "lucide-react"
import { clsx } from "clsx"
import { useCartStore } from "@/store/cart"

type Product = {
  id: string
  slug: string
  name: string
  description: string
  category: string
  price_cents: number
  weight_grams?: number
  serves?: string
  image_url?: string
  catch_source?: string
  fisherman_name?: string
  is_daily_catch: boolean
  in_stock: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const priceRands = (product.price_cents / 100).toFixed(2)

  return (
    <div className="card group flex flex-col gap-4 hover:border-vula-green/40 transition-colors">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="relative aspect-square overflow-hidden rounded-card bg-vula-dark-3 block">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🐟</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_daily_catch && (
            <span className="badge badge-amber text-[10px] flex items-center gap-1">
              <Zap size={10} /> Daily catch
            </span>
          )}
          {!product.in_stock && (
            <span className="badge bg-vula-dark/80 text-vula-muted text-[10px]">Out of stock</span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col gap-2 flex-1">
        {product.catch_source && (
          <p className="font-sans text-[11px] text-vula-muted uppercase tracking-widest">
            {product.catch_source}
            {product.fisherman_name && ` · ${product.fisherman_name}`}
          </p>
        )}

        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-display text-lg font-semibold leading-tight hover:text-vula-green transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.serves && (
          <p className="font-sans text-xs text-vula-muted">{product.serves}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-vula-border">
          <p className="font-sans font-semibold text-vula-cream">
            R{priceRands}
          </p>

          <button
            disabled={!product.in_stock}
            onClick={() => addItem({ id: product.id, name: product.name, price_cents: product.price_cents, image_url: product.image_url })}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-input text-xs font-sans font-medium transition-colors",
              product.in_stock
                ? "bg-vula-green text-vula-cream hover:bg-vula-green-light"
                : "bg-vula-border text-vula-muted cursor-not-allowed"
            )}
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

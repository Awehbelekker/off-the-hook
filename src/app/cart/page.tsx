"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingBag, ChevronRight, MessageCircle } from "lucide-react"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import { useCartStore } from "@/store/cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotalCents, deliveryCents, totalCents } = useCartStore()

  const subtotal = subtotalCents()
  const delivery = subtotal >= 50000 ? 0 : deliveryCents  // Free delivery over R500
  const total = subtotal + delivery

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 pb-28 md:pb-20 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="font-display text-4xl font-semibold mb-3">Your cart is empty</h1>
          <p className="font-sans text-vula-muted mb-10">Add some fresh catch to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary">
              <ShoppingBag size={18} />
              Browse the catch
            </Link>
            <a
              href="https://wa.me/27737815979?text=Hi%2C+I%27d+like+to+order+fresh+fish"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MessageCircle size={18} className="text-vula-green" />
              Order on WhatsApp
            </a>
          </div>
        </main>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10 pb-28 md:pb-10">
        <h1 className="font-display text-4xl font-semibold mb-8">Your cart</h1>

        {/* Items */}
        <div className="flex flex-col gap-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center gap-4">
              {/* Image */}
              <div className="relative w-16 h-16 rounded-input overflow-hidden bg-vula-dark-3 shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🐟</div>
                )}
              </div>

              {/* Name + price */}
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-vula-cream truncate">{item.name}</p>
                <p className="font-sans text-sm text-vula-muted">
                  R{(item.price_cents / 100).toFixed(2)} each
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 border border-vula-border rounded-input px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="text-vula-muted hover:text-vula-cream w-5 text-base font-sans"
                >−</button>
                <span className="font-sans text-sm font-medium w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-vula-muted hover:text-vula-cream w-5 text-base font-sans"
                >+</button>
              </div>

              {/* Line total */}
              <p className="font-sans font-semibold text-vula-cream w-20 text-right">
                R{((item.price_cents * item.quantity) / 100).toFixed(2)}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-vula-muted hover:text-red-400 transition-colors ml-2"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="card mb-6">
          <div className="flex justify-between font-sans text-sm text-vula-muted mb-3">
            <span>Subtotal</span>
            <span>R{(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-sans text-sm text-vula-muted mb-4 pb-4 border-b border-vula-border">
            <span>Delivery</span>
            <span>{delivery === 0 ? <span className="text-vula-green">Free</span> : `R${(delivery / 100).toFixed(2)}`}</span>
          </div>
          {subtotal < 50000 && (
            <p className="font-sans text-xs text-vula-muted mb-4">
              Add R{((50000 - subtotal) / 100).toFixed(2)} more for free delivery
            </p>
          )}
          <div className="flex justify-between font-sans font-semibold text-vula-cream text-lg">
            <span>Total</span>
            <span>R{(total / 100).toFixed(2)}</span>
          </div>
        </div>

        {/* CTA */}
        <Link href="/checkout" className="btn-primary w-full justify-center text-base py-4">
          Proceed to checkout
          <ChevronRight size={18} />
        </Link>

        <p className="font-sans text-xs text-vula-muted text-center mt-4">
          Secure payment via Yoco · POPIA compliant · Cape Town delivery only
        </p>
      </main>
      <BottomNav />
    </>
  )
}

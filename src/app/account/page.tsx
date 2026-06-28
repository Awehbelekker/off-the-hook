"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Package, MessageCircle, Search, Loader2 } from "lucide-react"
import { WHATSAPP_DISPLAY_LOCAL, whatsappLink } from "@/lib/whatsapp"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import type { Order } from "@/lib/api"

export default function AccountPage() {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!phone.trim()) return
    setLoading(true)
    setError(null)
    setOrders(null)

    try {
      const res = await fetch(`/admin/api/orders?phone=${encodeURIComponent(phone.trim())}`)
      if (!res.ok) throw new Error("Could not load orders")
      const data = await res.json()
      setOrders(data.orders ?? [])
    } catch {
      setError("Unable to load order history. Message us on WhatsApp and we'll help.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-12 pb-28 md:pb-12">
        <h1 className="font-display text-4xl font-semibold mb-2">My orders</h1>
        <p className="font-sans text-vula-muted text-sm mb-10">
          Look up your orders with the WhatsApp number you ordered with.
        </p>

        <div className="card mb-8">
          <label htmlFor="phone" className="flex items-center gap-2 font-sans text-sm text-vula-dark font-medium mb-3">
            <Phone size={15} className="text-vula-green" />
            Your WhatsApp number
          </label>
          <div className="flex gap-2">
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={WHATSAPP_DISPLAY_LOCAL}
              className="flex-1 bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-sm text-vula-dark placeholder:text-vula-muted focus:outline-none focus:border-vula-green focus:ring-2 focus:ring-vula-green/20 transition-all"
            />
            <button
              onClick={handleSearch}
              disabled={!phone.trim() || loading}
              className="btn-primary px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Find
            </button>
          </div>
        </div>

        {error && (
          <p className="font-sans text-sm text-red-500 bg-red-50 border border-red-200 rounded-input px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {orders !== null && orders.length === 0 && (
          <div className="card text-center py-12">
            <Package size={40} className="text-vula-muted mx-auto mb-4" strokeWidth={1.5} />
            <p className="font-display text-xl mb-2 text-vula-dark">No orders found</p>
            <p className="font-sans text-sm text-vula-muted mb-6">
              No orders matched that number. Try the number you used at checkout.
            </p>
            <a
              href={whatsappLink(`Hi, I'd like to check my order history. My number is ${phone}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mx-auto w-fit"
            >
              <MessageCircle size={18} />
              Check on WhatsApp
            </a>
          </div>
        )}

        {orders !== null && orders.length > 0 && (
          <div className="flex flex-col gap-4 mb-8">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-sans font-semibold text-vula-dark">Order #{order.display_id}</p>
                    <p className="font-sans text-xs text-vula-muted">
                      {new Date(order.created_at).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="badge badge-green capitalize">{order.status.replace(/_/g, " ")}</span>
                </div>
                <p className="font-sans text-sm text-vula-muted mb-2">{order.delivery_address}</p>
                <p className="font-sans font-bold text-vula-dark">
                  R{((order.total_cents || 0) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {orders === null && !error && (
          <div className="card bg-vula-peach border-vula-amber/40">
            <p className="font-sans text-sm text-vula-dark leading-relaxed">
              💡 <strong>Tip:</strong> All Off the Hook orders are managed via WhatsApp.
              Message <strong>{WHATSAPP_DISPLAY_LOCAL}</strong> anytime to reorder, track a delivery, or update your details.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-8">
          <Link href="/shop" className="card text-center py-6 hover:border-vula-green transition-colors">
            <Package size={22} className="text-vula-green mx-auto mb-2" />
            <span className="font-sans text-sm font-medium text-vula-dark">Shop the catch</span>
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="card text-center py-6 hover:border-vula-green transition-colors"
          >
            <MessageCircle size={22} className="text-vula-green mx-auto mb-2" />
            <span className="font-sans text-sm font-medium text-vula-dark">Message us</span>
          </a>
        </div>
      </main>
      <BottomNav />
    </>
  )
}

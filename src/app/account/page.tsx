"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Package, MessageCircle, Search } from "lucide-react"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"

export default function AccountPage() {
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-12 pb-28 md:pb-12">
        <h1 className="font-display text-4xl font-semibold mb-2">My orders</h1>
        <p className="font-sans text-vula-muted text-sm mb-10">
          Look up your orders with the WhatsApp number you ordered with.
        </p>

        {/* Phone lookup */}
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
              placeholder="073 781 5979"
              className="flex-1 bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-sm text-vula-dark placeholder:text-vula-muted focus:outline-none focus:border-vula-green focus:ring-2 focus:ring-vula-green/20 transition-all"
            />
            <button
              onClick={() => setSubmitted(true)}
              disabled={!phone.trim()}
              className="btn-primary px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={16} />
              Find
            </button>
          </div>
        </div>

        {/* Result / empty state */}
        {submitted ? (
          <div className="card text-center py-12">
            <Package size={40} className="text-vula-muted mx-auto mb-4" strokeWidth={1.5} />
            <p className="font-display text-xl mb-2 text-vula-dark">Order history coming soon</p>
            <p className="font-sans text-sm text-vula-muted mb-6 max-w-sm mx-auto">
              For now, message us on WhatsApp and we&apos;ll pull up your full order history and delivery status instantly.
            </p>
            <a
              href={`https://wa.me/27737815979?text=${encodeURIComponent(`Hi, I'd like to check my order history. My number is ${phone}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mx-auto w-fit"
            >
              <MessageCircle size={18} />
              Check on WhatsApp
            </a>
          </div>
        ) : (
          <div className="card bg-vula-peach border-vula-amber/40">
            <p className="font-sans text-sm text-vula-dark leading-relaxed">
              💡 <strong>Tip:</strong> All Off the Hook orders are managed via WhatsApp.
              Message <strong>073 781 5979</strong> anytime to reorder, track a delivery, or update your details.
            </p>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <Link href="/shop" className="card text-center py-6 hover:border-vula-green transition-colors">
            <Package size={22} className="text-vula-green mx-auto mb-2" />
            <span className="font-sans text-sm font-medium text-vula-dark">Shop the catch</span>
          </Link>
          <a
            href="https://wa.me/27737815979"
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

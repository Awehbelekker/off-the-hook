"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, Truck, Clock } from "lucide-react"
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import { useCartStore } from "@/store/cart"
import { createCheckout, validateDiscountCode, type DiscountPreview } from "@/lib/api"
import { useStoreSettings } from "@/components/StoreSettingsProvider"

type DeliverySlot = "morning" | "afternoon" | "express"

type FormState = {
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryAddress: string
  deliverySlot: DeliverySlot
  deliveryNotes: string
  agreePrivacy: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, sessionId, subtotalCents, deliveryCents, clearCart, syncToServer } = useCartStore()
  const settings = useStoreSettings()
  const cartHasWeightItems = items.some((i) => i.pricing_mode === "by_weight")

  const [form, setForm] = useState<FormState>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    deliverySlot: "morning",
    deliveryNotes: "",
    agreePrivacy: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [discountInput, setDiscountInput] = useState("")
  const [discount, setDiscount] = useState<DiscountPreview | null>(null)
  const [discountError, setDiscountError] = useState<string | null>(null)
  const [checkingDiscount, setCheckingDiscount] = useState(false)

  // Redirect to cart if empty — in an effect, never during render (SSR-safe)
  useEffect(() => {
    if (items.length === 0 && !submitting) {
      router.push("/cart")
      return
    }
    if (cartHasWeightItems) {
      router.push("/cart")
    }
  }, [items.length, submitting, router, cartHasWeightItems])

  const subtotal = subtotalCents()
  const baseDelivery = deliveryCents()
  const expressExtra = settings.express_delivery_extra_cents
  const delivery = discount?.free_shipping ? 0 : baseDelivery
  const discountCents = Math.min(discount?.discount_cents ?? 0, subtotal)
  const total =
    Math.max(0, subtotal - discountCents) +
    (form.deliverySlot === "express" ? delivery + expressExtra : delivery)

  const applyDiscount = async () => {
    if (!discountInput.trim()) return
    setCheckingDiscount(true)
    setDiscountError(null)
    try {
      const preview = await validateDiscountCode(discountInput.trim(), subtotal)
      setDiscount(preview)
    } catch (err) {
      setDiscount(null)
      setDiscountError(err instanceof Error ? err.message.replace(/^Vula API \d+: /, "") : "Couldn't apply that code.")
    }
    setCheckingDiscount(false)
  }

  const removeDiscount = () => {
    setDiscount(null)
    setDiscountInput("")
    setDiscountError(null)
  }

  const SLOTS = [
    { value: "morning", label: "Morning", detail: "08:00–12:00", icon: Clock, extra: "" },
    { value: "afternoon", label: "Afternoon", detail: "12:00–17:00", icon: Clock, extra: "" },
    { value: "express", label: "Express", detail: "2-hour window", icon: Truck, extra: `+R${(settings.express_delivery_extra_cents / 100).toFixed(0)}` },
  ]

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.agreePrivacy) { setError("Please agree to the privacy policy."); return }
    if (items.length === 0) { router.push("/cart"); return }

    setSubmitting(true)
    setError(null)

    try {
      // Final reconcile: the server cart is what gets charged — make it match exactly
      // what the customer sees before creating the order (P0 desync fix).
      await syncToServer()
      const { redirect_url } = await createCheckout({
        sessionId,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        deliveryAddress: form.deliveryAddress,
        deliverySlot: form.deliverySlot,
        deliveryNotes: form.deliveryNotes || undefined,
        channel: "web",
        discountCode: discount?.code,
      })

      clearCart()
      // Yoco redirect_url is external — use replace to avoid back-button loop
      window.location.replace(redirect_url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.")
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return null  // effect above handles the redirect
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10 pb-28 md:pb-10">
        <h1 className="font-display text-4xl font-semibold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left — form */}
          <div className="flex flex-col gap-6">
            {/* Contact */}
            <div className="card flex flex-col gap-4">
              <h2 className="font-display text-xl font-semibold">Contact details</h2>

              {[
                { id: "customerName", label: "Full name", type: "text", required: true, placeholder: "Your name" },
                { id: "customerPhone", label: "WhatsApp number", type: "tel", required: true, placeholder: WHATSAPP_DISPLAY },
                { id: "customerEmail", label: "Email (optional)", type: "email", required: false, placeholder: "you@example.com" },
              ].map(({ id, label, type, required, placeholder }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label htmlFor={id} className="font-sans text-sm text-vula-muted">{label}</label>
                  <input
                    id={id}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={(form as unknown as Record<string, string>)[id]}
                    onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                    className="bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-sm text-vula-dark placeholder:text-vula-muted focus:outline-none focus:border-vula-green focus:ring-2 focus:ring-vula-green/20 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Delivery */}
            <div className="card flex flex-col gap-4">
              <h2 className="font-display text-xl font-semibold">Delivery</h2>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="deliveryAddress" className="font-sans text-sm text-vula-muted">Delivery address</label>
                <textarea
                  id="deliveryAddress"
                  required
                  rows={3}
                  placeholder="Street address, suburb, Cape Town"
                  value={form.deliveryAddress}
                  onChange={(e) => setForm((f) => ({ ...f, deliveryAddress: e.target.value }))}
                  className="bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-sm text-vula-dark placeholder:text-vula-muted focus:outline-none focus:border-vula-green focus:ring-2 focus:ring-vula-green/20 transition-all resize-none"
                />
              </div>

              {/* Delivery slot */}
              <div>
                <p className="font-sans text-sm text-vula-muted mb-2">Delivery slot</p>
                <div className="grid grid-cols-3 gap-2">
                  {SLOTS.map(({ value, label, detail, extra }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, deliverySlot: value as DeliverySlot }))}
                      className={[
                        "flex flex-col items-center gap-1 p-3 rounded-card border text-center transition-colors",
                        form.deliverySlot === value
                          ? "border-vula-green bg-vula-green/10"
                          : "border-vula-border hover:border-vula-green/50",
                      ].join(" ")}
                    >
                      <span className="font-sans text-sm font-semibold text-vula-dark">{label}</span>
                      <span className="font-sans text-xs text-vula-muted">{detail}</span>
                      {extra && <span className="font-sans text-xs font-semibold text-vula-green-dark">{extra}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="deliveryNotes" className="font-sans text-sm text-vula-muted">Delivery notes (optional)</label>
                <input
                  id="deliveryNotes"
                  type="text"
                  placeholder="Gate code, landmark, etc."
                  value={form.deliveryNotes}
                  onChange={(e) => setForm((f) => ({ ...f, deliveryNotes: e.target.value }))}
                  className="bg-white border border-vula-border rounded-input px-4 py-3 font-sans text-sm text-vula-dark placeholder:text-vula-muted focus:outline-none focus:border-vula-green focus:ring-2 focus:ring-vula-green/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right — order summary + pay */}
          <div className="flex flex-col gap-6">
            <div className="card">
              <h2 className="font-display text-xl font-semibold mb-4">Order summary</h2>
              <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-vula-border">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between font-sans text-sm">
                    <span className="text-vula-muted">{item.quantity}× {item.name}</span>
                    <span className="text-vula-dark font-medium">R{((item.price_cents * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-sm font-sans">
                <div className="flex justify-between text-vula-muted">
                  <span>Subtotal</span>
                  <span>R{(subtotal / 100).toFixed(2)}</span>
                </div>
                {discountCents > 0 && (
                  <div className="flex justify-between text-vula-green">
                    <span>Discount ({discount?.code})</span>
                    <span>−R{(discountCents / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-vula-muted mb-2">
                  <span>Delivery ({form.deliverySlot})</span>
                  <span>{form.deliverySlot === "express" ? `R${((delivery + expressExtra) / 100).toFixed(2)}` : delivery === 0 ? <span className="text-vula-green">Free</span> : `R${(delivery / 100).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-vula-dark text-base pt-2 border-t border-vula-border">
                  <span>Total</span>
                  <span>R{(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-vula-border">
                {discount ? (
                  <div className="flex items-center justify-between font-sans text-sm">
                    <span className="text-vula-green font-medium">
                      ✓ {discount.code} applied{discount.free_shipping ? " — free shipping" : ""}
                    </span>
                    <button type="button" onClick={removeDiscount} className="text-vula-muted underline text-xs">Remove</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Discount code"
                        value={discountInput}
                        onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(null) }}
                        className="flex-1 bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm uppercase placeholder:normal-case placeholder:text-vula-muted"
                      />
                      <button
                        type="button"
                        onClick={applyDiscount}
                        disabled={checkingDiscount || !discountInput.trim()}
                        className="btn-ghost px-4 text-sm disabled:opacity-50"
                      >
                        {checkingDiscount ? "Checking…" : "Apply"}
                      </button>
                    </div>
                    {discountError && <p className="font-sans text-xs text-red-400">{discountError}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Privacy */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreePrivacy}
                onChange={(e) => setForm((f) => ({ ...f, agreePrivacy: e.target.checked }))}
                className="mt-0.5 accent-vula-green"
              />
              <span className="font-sans text-xs text-vula-muted leading-relaxed">
                I agree to the{" "}
                <a href="/privacy" className="text-vula-green underline">privacy policy</a>
                {" "}and consent to my data being used for order fulfilment. POPIA compliant.
              </span>
            </label>

            {error && (
              <p className="font-sans text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-input px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Lock size={16} />
              {submitting ? "Processing…" : `Pay R${(total / 100).toFixed(2)} with Yoco`}
            </button>

            <p className="font-sans text-xs text-vula-muted text-center">
              You'll be redirected to Yoco's secure payment page.
            </p>
          </div>
        </form>
      </main>
      <BottomNav />
    </>
  )
}

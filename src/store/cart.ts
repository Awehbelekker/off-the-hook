import { create } from "zustand"
import { persist } from "zustand/middleware"
import { addToCartAPI } from "@/lib/api"
import { DEFAULT_STORE_SETTINGS } from "@/lib/settings"
import type { PricingMode } from "@/lib/api"
import { calculateWeightLineTotalCents } from "@/lib/pricing"
import { cartHasByWeightItems, type OrderLineItem } from "@/lib/order-message"

export type { OrderLineItem }

export type AddCartItemInput = {
  id: string
  name: string
  price_cents: number
  image_url?: string
  pricing_mode?: PricingMode
  requested_weight_g?: number
  special_requests?: string
  price_per_kg_cents?: number
  quantity?: number
}

type CartStore = {
  items: OrderLineItem[]
  sessionId: string
  deliveryFeeCents: number
  freeDeliveryThresholdCents: number
  setDeliverySettings: (fee: number, threshold: number) => void
  addItem: (product: AddCartItemInput) => void
  removeItem: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
  hasByWeightItems: () => boolean
  subtotalCents: () => number
  deliveryCents: () => number
  totalCents: () => number
}

function newLineId(): string {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

function buildLine(product: AddCartItemInput): OrderLineItem {
  const pricing_mode = product.pricing_mode ?? "fixed"
  const quantity = product.quantity ?? 1

  if (pricing_mode === "by_weight") {
    const weightG = product.requested_weight_g ?? 1000
    const perKg = product.price_per_kg_cents ?? product.price_cents
    return {
      lineId: newLineId(),
      id: product.id,
      name: product.name,
      price_cents: perKg,
      quantity: 1,
      image_url: product.image_url,
      pricing_mode: "by_weight",
      requested_weight_g: weightG,
      special_requests: product.special_requests?.trim() || undefined,
      line_total_cents: calculateWeightLineTotalCents(perKg, weightG),
    }
  }

  return {
    lineId: newLineId(),
    id: product.id,
    name: product.name,
    price_cents: product.price_cents,
    quantity,
    image_url: product.image_url,
    pricing_mode: "fixed",
    line_total_cents: product.price_cents * quantity,
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      deliveryFeeCents: DEFAULT_STORE_SETTINGS.delivery_fee_cents,
      freeDeliveryThresholdCents: DEFAULT_STORE_SETTINGS.free_delivery_threshold_cents,

      setDeliverySettings: (fee, threshold) =>
        set({ deliveryFeeCents: fee, freeDeliveryThresholdCents: threshold }),

      addItem: (product) => {
        const line = buildLine(product)
        const { sessionId, items } = get()

        if (line.pricing_mode === "fixed") {
          const existing = items.find((i) => i.id === product.id && i.pricing_mode === "fixed")
          if (existing) {
            const newQty = existing.quantity + line.quantity
            set({
              items: items.map((i) =>
                i.lineId === existing.lineId
                  ? {
                      ...i,
                      quantity: newQty,
                      line_total_cents: i.price_cents * newQty,
                    }
                  : i
              ),
            })
            addToCartAPI(sessionId, product.id, newQty).catch(() => {})
            return
          }
        }

        set({ items: [...items, line] })

        if (line.pricing_mode === "fixed") {
          addToCartAPI(sessionId, product.id, line.quantity).catch(() => {})
        }
      },

      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.lineId !== lineId)
              : state.items.map((i) =>
                  i.lineId === lineId && i.pricing_mode === "fixed"
                    ? { ...i, quantity, line_total_cents: i.price_cents * quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      hasByWeightItems: () => cartHasByWeightItems(get().items),

      subtotalCents: () => get().items.reduce((sum, i) => sum + i.line_total_cents, 0),

      deliveryCents: () => {
        const sub = get().subtotalCents()
        return sub >= get().freeDeliveryThresholdCents ? 0 : get().deliveryFeeCents
      },

      totalCents: () => get().subtotalCents() + get().deliveryCents(),
    }),
    { name: "oth-cart" }
  )
)

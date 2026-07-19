import { create } from "zustand"
import { persist } from "zustand/middleware"
import { syncCartAPI } from "@/lib/api"
import { DEFAULT_STORE_SETTINGS } from "@/lib/settings"

type CartItem = {
  id: string
  name: string
  price_cents: number
  quantity: number
  image_url?: string
}

type CartStore = {
  items: CartItem[]
  sessionId: string
  deliveryFeeCents: number
  freeDeliveryThresholdCents: number
  setDeliverySettings: (fee: number, threshold: number) => void
  addItem: (product: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  syncToServer: () => Promise<void>
  subtotalCents: () => number
  deliveryCents: () => number
  totalCents: () => number
}

// P0 fix (2026-07-17): checkout charges from the SERVER cart, but this store previously only
// mirrored ADDS (and with the wrong semantics — it sent the new total to an endpoint that
// adds). Removals/quantity edits never reached the server, so a customer could be charged for
// items they'd removed. Every mutation now mirrors the FULL cart state via /cart/{id}/sync,
// and checkout calls syncToServer() once more as a final reconcile before paying.
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
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        })
        get().syncToServer().catch(() => {})
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
        get().syncToServer().catch(() => {})
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
        get().syncToServer().catch(() => {})
      },

      clearCart: () => {
        set({ items: [] })
        get().syncToServer().catch(() => {})
      },

      syncToServer: async () => {
        const { sessionId, items } = get()
        await syncCartAPI(
          sessionId,
          items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        )
      },

      subtotalCents: () =>
        get().items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0),

      deliveryCents: () => {
        const sub = get().subtotalCents()
        return sub >= get().freeDeliveryThresholdCents ? 0 : get().deliveryFeeCents
      },

      totalCents: () => get().subtotalCents() + get().deliveryCents(),
    }),
    { name: "oth-cart" }
  )
)

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { addToCartAPI } from "@/lib/api"
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
  subtotalCents: () => number
  deliveryCents: () => number
  totalCents: () => number
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
        const { sessionId, items } = get()
        const existing = items.find((i) => i.id === product.id)
        const newQty = existing ? existing.quantity + 1 : 1

        set((state) => {
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        })

        addToCartAPI(sessionId, product.id, newQty).catch(() => {})
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),

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

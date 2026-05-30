import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  addItem: (product: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotalCents: () => number
  totalCents: () => number
  deliveryCents: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      deliveryCents: 8000, // R80

      addItem: (product) =>
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
        }),

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

      totalCents: () => get().subtotalCents() + get().deliveryCents,
    }),
    { name: "oth-cart" }
  )
)

// Tenant-portable: set NEXT_PUBLIC_VULA_TENANT_ID to reuse this exact client for any
// store (the shared connector pattern). Defaults to off-the-hook.
const VULA_API = process.env.NEXT_PUBLIC_VULA_API_URL || "https://vula-group-production.up.railway.app"
const TENANT_ID = process.env.NEXT_PUBLIC_VULA_TENANT_ID || "off-the-hook"

async function vula<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${VULA_API}/v1/commerce/${TENANT_ID}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.VULA_API_KEY || "",
      ...(options?.headers || {}),
    },
    next: options?.method === "POST" || options?.method === "PATCH" ? { revalidate: 0 } : { revalidate: 60 },
  })

  if (!res.ok) {
    const error = await res.text().catch(() => "Unknown error")
    throw new Error(`Vula API ${res.status}: ${error}`)
  }

  return res.json()
}

// ── Products ─────────────────────────────────────────────────────────────────

export type ProductCategory =
  | "fresh_fish"
  | "fresh_chicken"
  | "frozen_chicken"
  | "frozen_seafood"
  | "extras"
  | "linefish"
  | "shellfish"
  | "crayfish"
  | "box_deal"
  | "smoked"
  | "frozen"

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  category: ProductCategory
  price_cents: number
  weight_grams?: number
  serves?: string
  image_url?: string
  catch_source?: string
  fisherman_name?: string
  is_daily_catch: boolean
  in_stock: boolean
  is_featured?: boolean
}

export async function getProducts(params?: {
  category?: string
  q?: string
  limit?: number
  inStockOnly?: boolean
}) {
  const qs = new URLSearchParams()
  if (params?.category) qs.set("category", params.category)
  if (params?.q) qs.set("q", params.q)
  if (params?.inStockOnly === false) qs.set("in_stock_only", "false")

  const data = await vula<{ products: Product[]; count: number }>(
    `/products${qs.toString() ? `?${qs}` : ""}`
  )

  let products = data.products

  // Client-side search fallback when API ignores q param
  if (params?.q) {
    const needle = params.q.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
    )
  }

  return params?.limit ? products.slice(0, params.limit) : products
}

export async function getFeaturedProducts(featuredIds: string[], limit = 8): Promise<Product[]> {
  if (featuredIds.length === 0) {
    return getProducts({ limit }).catch(() => [])
  }

  const all = await getProducts().catch(() => [])
  const featured = featuredIds
    .map((id) => all.find((p) => p.id === id || p.slug === id))
    .filter((p): p is Product => Boolean(p))

  if (featured.length >= limit) return featured.slice(0, limit)
  const rest = all.filter((p) => !featuredIds.includes(p.id) && !featuredIds.includes(p.slug))
  return [...featured, ...rest].slice(0, limit)
}

export async function getProduct(slug: string): Promise<Product> {
  return vula<Product>(`/products/${slug}`)
}

export async function updateProduct(
  id: string,
  data: Partial<
    Pick<
      Product,
      | "name"
      | "price_cents"
      | "in_stock"
      | "is_daily_catch"
      | "description"
      | "image_url"
      | "category"
      | "weight_grams"
      | "serves"
      | "catch_source"
      | "fisherman_name"
    >
  >
): Promise<Product> {
  return vula<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export async function addToCartAPI(sessionId: string, productId: string, quantity: number, phone?: string) {
  return vula(`/cart/${sessionId}/add`, {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity, customer_phone: phone }),
  })
}

// ── Checkout ─────────────────────────────────────────────────────────────────

export async function createCheckout(data: {
  sessionId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress: string
  deliverySlot: "morning" | "afternoon" | "express"
  deliveryNotes?: string
  channel?: "web" | "whatsapp"
}): Promise<{ order_id: string; display_id: string; redirect_url: string; total_rands: string }> {
  return vula("/checkout", {
    method: "POST",
    body: JSON.stringify({
      session_id: data.sessionId,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail,
      delivery_address: data.deliveryAddress,
      delivery_slot: data.deliverySlot,
      delivery_notes: data.deliveryNotes,
      channel: data.channel || "web",
    }),
  })
}

// ── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "paid" | "packed" | "out_for_delivery" | "delivered" | "cancelled"

export type Order = {
  id: string
  display_id: string
  customer_name: string
  customer_phone: string
  delivery_address: string
  delivery_slot: string
  status: OrderStatus
  total_cents: number
  created_at: string
  items?: { name: string; quantity: number; price_cents: number }[]
}

export async function getOrders(params?: { status?: string; limit?: number }): Promise<Order[]> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set("status", params.status)
  if (params?.limit) qs.set("limit", String(params.limit))

  const data = await vula<{ orders: Order[] }>(`/orders${qs.toString() ? `?${qs}` : ""}`)
  return data.orders ?? []
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const normalized = phone.replace(/\D/g, "")
  const data = await vula<{ orders: Order[] }>(`/orders?phone=${encodeURIComponent(normalized)}`)
  return data.orders ?? []
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return vula<Order>(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

// ── Settings (server-only — import from @/lib/settings-store directly) ────────

export type { StoreSettings } from "./settings"
export { DEFAULT_STORE_SETTINGS } from "./settings"

// ── Stats ────────────────────────────────────────────────────────────────────

export type DashboardStats = {
  orders_today: number
  revenue_today_cents: number
  pending_orders: number
  low_stock_count: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await vula<DashboardStats>("/stats")
  } catch {
    const [orders, products] = await Promise.all([
      getOrders().catch(() => [] as Order[]),
      getProducts({ inStockOnly: false }).catch(() => [] as Product[]),
    ])

    const today = new Date().toISOString().slice(0, 10)
    const todayOrders = orders.filter((o) => o.created_at?.startsWith(today))
    return {
      orders_today: todayOrders.length,
      revenue_today_cents: todayOrders.reduce((s, o) => s + (o.total_cents || 0), 0),
      pending_orders: orders.filter((o) => o.status === "pending" || o.status === "paid").length,
      low_stock_count: products.filter((p) => !p.in_stock).length,
    }
  }
}

// ── Media upload ─────────────────────────────────────────────────────────────

export async function uploadProductImage(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${VULA_API}/v1/commerce/${TENANT_ID}/media/upload`, {
    method: "POST",
    headers: { "X-API-Key": process.env.VULA_API_KEY || "" },
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`)
  }
  return res.json()
}

// ── Tenant config (control plane): theme + enabled modules ────────────────────
// Drives brand flow-through (accent/logo/fonts) and which features a store exposes.
// Used by the storefront shell + the Puck page builder (P3).

export type TenantConfig = {
  tenant_id: string
  display_name?: string
  business_type?: string
  theme: Record<string, string>
  store_url?: string
  modules: string[]
  default_payment_provider?: string
  status?: string
}

export async function getTenantConfig(): Promise<TenantConfig> {
  const res = await fetch(`${VULA_API}/v1/tenants/${TENANT_ID}`, {
    headers: { "X-API-Key": process.env.VULA_API_KEY || "" },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Tenant config ${res.status}`)
  return res.json()
}

export async function getTenantTheme(): Promise<Record<string, string>> {
  return getTenantConfig().then((t) => t.theme || {}).catch(() => ({}))
}

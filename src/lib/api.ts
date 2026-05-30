const VULA_API = process.env.NEXT_PUBLIC_VULA_API_URL || "https://api.vula.co.za"
const TENANT_ID = "off-the-hook"

async function vula<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${VULA_API}/v1/commerce/${TENANT_ID}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.VULA_API_KEY || "",
      ...(options?.headers || {}),
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    const error = await res.text().catch(() => "Unknown error")
    throw new Error(`Vula API ${res.status}: ${error}`)
  }

  return res.json()
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  category?: string
  limit?: number
  inStockOnly?: boolean
}) {
  const qs = new URLSearchParams()
  if (params?.category) qs.set("category", params.category)
  if (params?.inStockOnly === false) qs.set("in_stock_only", "false")

  const data = await vula<{ products: Product[]; count: number }>(
    `/products${qs.toString() ? `?${qs}` : ""}`
  )

  const products = data.products
  return params?.limit ? products.slice(0, params.limit) : products
}

export async function getProduct(slug: string): Promise<Product> {
  return vula<Product>(`/products/${slug}`)
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
    next: { revalidate: 0 },
  })
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  category: "linefish" | "shellfish" | "crayfish" | "box_deal" | "smoked" | "frozen"
  price_cents: number
  weight_grams?: number
  serves?: string
  image_url?: string
  catch_source?: string
  fisherman_name?: string
  is_daily_catch: boolean
  in_stock: boolean
}

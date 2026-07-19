import type { PricingMode } from "@/lib/api"
import { formatWeightKg } from "@/lib/pricing"

export type OrderLineItem = {
  lineId: string
  id: string
  name: string
  price_cents: number
  quantity: number
  image_url?: string
  pricing_mode: PricingMode
  requested_weight_g?: number
  special_requests?: string
  line_total_cents: number
  variant_id?: string
  variant_label?: string  // e.g. "Size: L" — shown alongside the product name
}

export function cartHasByWeightItems(items: OrderLineItem[]): boolean {
  return items.some((i) => i.pricing_mode === "by_weight")
}

export function buildWhatsAppOrderMessage(items: OrderLineItem[]): string {
  const lines = items.map((item) => {
    const name = item.variant_label ? `${item.name} (${item.variant_label})` : item.name
    if (item.pricing_mode === "by_weight") {
      const weight = item.requested_weight_g ? formatWeightKg(item.requested_weight_g) : "?"
      const notes = item.special_requests ? `\n   Notes: ${item.special_requests}` : ""
      return `• ${name} — ${weight} (est. R${(item.line_total_cents / 100).toFixed(2)})${notes}`
    }
    const unit = item.quantity > 1 ? ` × ${item.quantity}` : ""
    return `• ${name}${unit} — R${(item.line_total_cents / 100).toFixed(2)}`
  })

  const subtotal = items.reduce((s, i) => s + i.line_total_cents, 0)

  return [
    "Hi, I'd like to place an order:",
    "",
    ...lines,
    "",
    `Estimated subtotal: R${(subtotal / 100).toFixed(2)}`,
    "",
    "Please confirm availability and final weight. Thanks!",
  ].join("\n")
}

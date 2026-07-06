import type { Product } from "./api"

export type PricingMode = "fixed" | "by_weight"

export function getPricingMode(product: Pick<Product, "pricing_mode">): PricingMode {
  return product.pricing_mode === "by_weight" ? "by_weight" : "fixed"
}

export function isByWeight(product: Pick<Product, "pricing_mode">): boolean {
  return getPricingMode(product) === "by_weight"
}

export function calculateWeightLineTotalCents(
  pricePerKgCents: number,
  requestedWeightG: number
): number {
  return Math.round(pricePerKgCents * (requestedWeightG / 1000))
}

export function formatProductPrice(product: Product): string {
  if (isByWeight(product)) {
    const perKg = product.price_per_kg_cents ?? product.price_cents
    return `R${(perKg / 100).toFixed(0)}/kg`
  }
  return `R${(product.price_cents / 100).toFixed(2)}`
}

export function formatWeightKg(grams: number): string {
  const kg = grams / 1000
  return kg % 1 === 0 ? `${kg}kg` : `${kg.toFixed(2).replace(/\.?0+$/, "")}kg`
}

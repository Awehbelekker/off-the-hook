export type StoreSettings = {
  announcements: string[]
  delivery_fee_cents: number
  free_delivery_threshold_cents: number
  express_delivery_extra_cents: number
  cutoff_time: string
  hero_tagline: string
  hero_subtitle: string
  featured_product_ids: string[]
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  announcements: [
    "🐟  Fresh fish this week: Yellowfin Tuna R290/kg · Hake R160/kg · Kingklip R240/kg",
    "🐓  Pasture-raised chicken — GMO-free · No hormones · No brine",
    "🦐  Frozen seafood packs — Calamari, Prawns, Mussels & more",
    "📦  Order by 10am for same-day delivery — Cape Town",
    "🟢  WhatsApp ordering: +27 79 178 3933 — reply in minutes",
    "✅  All items sold by weight — what you order is what you pay for",
  ],
  delivery_fee_cents: 8000,
  free_delivery_threshold_cents: 50000,
  express_delivery_extra_cents: 5000,
  cutoff_time: "10:00",
  hero_tagline: "Fresh fish this week. Pasture-raised chicken. Frozen seafood.",
  hero_subtitle: "Cape Town delivery — order in 60 seconds on WhatsApp.",
  featured_product_ids: [],
}

export function mergeStoreSettings(partial: Partial<StoreSettings>): StoreSettings {
  return { ...DEFAULT_STORE_SETTINGS, ...partial }
}

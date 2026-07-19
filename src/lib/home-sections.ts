export type BrandBadge = {
  label: string
  sub: string
}

export type HowItWorksStep = {
  step: string
  title: string
  body: string
  icon: "message" | "package" | "truck"
}

export type CategoryTile = {
  slug: string
  label: string
  emoji: string
  enabled: boolean
}

export type QualityTile = {
  emoji: string
  label: string
  sub: string
}

export type HomeSections = {
  brand_badges: BrandBadge[]
  how_it_works_heading: string
  how_it_works_steps: HowItWorksStep[]
  categories_heading: string
  categories: CategoryTile[]
  whatsapp_cta: {
    badge: string
    heading: string
    body: string
    button_label: string
  }
  quality_promise: {
    badge: string
    heading: string
    body: string
    bullets: string[]
    tiles: QualityTile[]
  }
}

export const DEFAULT_HOME_SECTIONS: HomeSections = {
  brand_badges: [
    { label: "GMO Free", sub: "Pasture-raised" },
    { label: "No Hormones", sub: "Naturally grown" },
    { label: "No Antibiotics", sub: "Routine-free" },
    { label: "No Brine", sub: "Real meat, real weight" },
  ],
  how_it_works_heading: "Boat to door, simply.",
  how_it_works_steps: [
    {
      step: "01",
      icon: "message",
      title: "Order on WhatsApp",
      body: "Message us your catch. We confirm availability and price in minutes.",
    },
    {
      step: "02",
      icon: "package",
      title: "Packed fresh",
      body: "Your fish is cleaned, portioned, and packed in insulated cold-chain boxes.",
    },
    {
      step: "03",
      icon: "truck",
      title: "Delivered same day",
      body: "Morning or afternoon slot. Cape Town delivery, tracked and confirmed.",
    },
  ],
  categories_heading: "Shop by category",
  categories: [
    { slug: "fresh_fish", label: "Fresh Fish", emoji: "🐟", enabled: true },
    { slug: "fresh_chicken", label: "Fresh Chicken", emoji: "🐓", enabled: true },
    { slug: "frozen_seafood", label: "Frozen Seafood", emoji: "🦐", enabled: true },
    { slug: "frozen_chicken", label: "Frozen Chicken", emoji: "❄️", enabled: true },
  ],
  whatsapp_cta: {
    badge: "WhatsApp ordering",
    heading: "Order in 60 seconds.",
    body: "Message us, tell us what you want, and we handle the rest. Ask about this week's fresh fish, or order chicken and frozen seafood anytime.",
    button_label: "Start ordering on WhatsApp",
  },
  quality_promise: {
    badge: "Our promise",
    heading: "Quality food, delivered.",
    body: "Fresh fish sourced weekly from Cape Town waters — yellowfin tuna, hake, kingklip, and more. Our pasture-raised chicken is GMO-free, with no growth hormones, no routine antibiotics, and no brine.",
    bullets: [
      "GMO-free pasture-raised chicken",
      "No growth hormones · No brine",
      "Weekly fresh fish rotation",
      "All items sold by weight — what you order is what you pay for",
    ],
    tiles: [
      { emoji: "🐟", label: "Fresh fish", sub: "Weekly rotation" },
      { emoji: "🐓", label: "Pasture chicken", sub: "No hormones · No brine" },
      { emoji: "🦐", label: "Frozen seafood", sub: "Fixed pack prices" },
      { emoji: "❄️", label: "Frozen chicken", sub: "Convenient & quality" },
    ],
  },
}

export function mergeHomeSections(partial: Partial<HomeSections>): HomeSections {
  const base = DEFAULT_HOME_SECTIONS
  return {
    ...base,
    ...partial,
    brand_badges: partial.brand_badges ?? base.brand_badges,
    how_it_works_steps: partial.how_it_works_steps ?? base.how_it_works_steps,
    categories: partial.categories ?? base.categories,
    whatsapp_cta: { ...base.whatsapp_cta, ...partial.whatsapp_cta },
    quality_promise: {
      ...base.quality_promise,
      ...partial.quality_promise,
      bullets: partial.quality_promise?.bullets ?? base.quality_promise.bullets,
      tiles: partial.quality_promise?.tiles ?? base.quality_promise.tiles,
    },
  }
}

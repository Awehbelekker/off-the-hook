import "server-only"
import { readFile } from "fs/promises"
import path from "path"
import { getProducts, getProduct, type Product, type ProductCategory } from "./api"

const OVERRIDES_FILE = path.join(process.cwd(), "data/product-overrides.json")

export type ProductOverride = Partial<
  Pick<
    Product,
    | "name"
    | "slug"
    | "description"
    | "category"
    | "price_cents"
    | "weight_grams"
    | "reference_weight_g"
    | "pricing_mode"
    | "price_per_kg_cents"
    | "min_weight_g"
    | "max_weight_g"
    | "serves"
    | "image_url"
    | "catch_source"
    | "fisherman_name"
    | "is_daily_catch"
    | "in_stock"
  >
>

type OverrideMap = Record<string, ProductOverride>

async function readOverrides(): Promise<OverrideMap> {
  try {
    const raw = await readFile(OVERRIDES_FILE, "utf-8")
    return JSON.parse(raw) as OverrideMap
  } catch {
    return {}
  }
}

export function mergeProduct(product: Product, override?: ProductOverride): Product {
  if (!override) return { ...product, pricing_mode: product.pricing_mode ?? "fixed" }
  const merged = { ...product, ...override, id: product.id }
  return { ...merged, pricing_mode: merged.pricing_mode ?? "fixed" }
}

export async function getProductsForStore(params?: Parameters<typeof getProducts>[0]): Promise<Product[]> {
  const [products, overrides] = await Promise.all([getProducts(params).catch(() => []), readOverrides()])
  return products.map((p) => mergeProduct(p, overrides[p.id]))
}

export async function getProductForStore(slug: string): Promise<Product> {
  const product = await getProduct(slug)
  const overrides = await readOverrides()
  return mergeProduct(product, overrides[product.id])
}

export async function getFeaturedProductsForStore(featuredIds: string[], limit = 8): Promise<Product[]> {
  const all = await getProductsForStore({ inStockOnly: false })
  if (featuredIds.length === 0) return all.slice(0, limit)

  const featured = featuredIds
    .map((id) => all.find((p) => p.id === id || p.slug === id))
    .filter((p): p is Product => Boolean(p))

  if (featured.length >= limit) return featured.slice(0, limit)
  const rest = all.filter((p) => !featuredIds.includes(p.id) && !featuredIds.includes(p.slug))
  return [...featured, ...rest].slice(0, limit)
}

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "fresh_fish", label: "Fresh fish" },
  { value: "fresh_chicken", label: "Fresh chicken" },
  { value: "frozen_chicken", label: "Frozen chicken" },
  { value: "frozen_seafood", label: "Frozen seafood" },
  { value: "extras", label: "Extras" },
  { value: "linefish", label: "Linefish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "frozen", label: "Frozen" },
]

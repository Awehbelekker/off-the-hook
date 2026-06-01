import { Suspense } from "react"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import AnnouncementBar from "@/components/AnnouncementBar"
import ProductCard from "@/components/ProductCard"
import { getProducts } from "@/lib/api"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description: "Fresh linefish, shellfish, crayfish and box deals — Cape Town daily catch.",
}

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "fresh_fish", label: "Fresh Fish", emoji: "🐟" },
  { slug: "fresh_chicken", label: "Fresh Chicken", emoji: "🐓" },
  { slug: "frozen_chicken", label: "Frozen Chicken", emoji: "❄️" },
  { slug: "frozen_seafood", label: "Frozen Seafood", emoji: "🦐" },
  { slug: "extras", label: "Extras", emoji: "🍲" },
]

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category && category !== "all" ? category : undefined
  const products = await getProducts({ category: activeCategory, inStockOnly: false }).catch(() => [])

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12 pb-28 md:pb-12">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="font-display text-5xl font-semibold mb-2">
            {activeCategory
              ? CATEGORIES.find((c) => c.slug === activeCategory)?.label ?? "Shop"
              : "Today's catch"}
          </h1>
          <p className="font-sans text-vula-muted text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map(({ slug, label, emoji }) => {
            const active = (slug === "all" && !activeCategory) || slug === activeCategory
            return (
              <a
                key={slug}
                href={slug === "all" ? "/shop" : `/shop?category=${slug}`}
                className={[
                  "flex items-center gap-1.5 px-4 py-2 rounded-badge font-sans text-sm font-medium transition-colors",
                  active
                    ? "bg-vula-green text-white shadow-sm"
                    : "bg-white border border-vula-border text-vula-dark/70 hover:text-vula-green hover:border-vula-green",
                ].join(" ")}
              >
                {emoji && <span>{emoji}</span>}
                {label}
              </a>
            )
          })}
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <Suspense key={p.id} fallback={<div className="card aspect-square animate-pulse bg-vula-dark-3/40" />}>
                <ProductCard product={p} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="card text-center py-20">
            <p className="font-display text-2xl mb-2">Nothing in today's catch</p>
            <p className="font-sans text-vula-muted text-sm">Check back tomorrow or order on WhatsApp.</p>
            <a
              href="https://wa.me/27737815979"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 mx-auto w-fit"
            >
              Message us on WhatsApp
            </a>
          </div>
        )}
      </main>

      <BottomNav />
    </>
  )
}

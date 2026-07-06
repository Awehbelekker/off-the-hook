import Link from "next/link"
import { WHATSAPP_DISPLAY, WHATSAPP_DISPLAY_LOCAL, whatsappLink } from "@/lib/whatsapp"
import { MessageCircle, Package, Truck, Star, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import AnnouncementBarWrapper from "@/components/AnnouncementBarWrapper"
import ProductCard from "@/components/ProductCard"
import Logo from "@/components/Logo"
import { getFeaturedProductsForStore } from "@/lib/product-overrides-store"
import { getStoreSettings } from "@/lib/settings-store"
import { getHomeSections } from "@/lib/home-sections-store"
import { DEFAULT_STORE_SETTINGS } from "@/lib/settings"
import type { HowItWorksStep } from "@/lib/home-sections"

export const revalidate = 60

const STEP_ICONS: Record<HowItWorksStep["icon"], LucideIcon> = {
  message: MessageCircle,
  package: Package,
  truck: Truck,
}

export default async function HomePage() {
  const [settings, sections] = await Promise.all([
    getStoreSettings().catch(() => DEFAULT_STORE_SETTINGS),
    getHomeSections(),
  ])
  const products = await getFeaturedProductsForStore(settings.featured_product_ids, 8).catch(() => [])
  const visibleCategories = sections.categories.filter((c) => c.enabled)

  return (
    <>
      <AnnouncementBarWrapper />
      <Header />

      <main className="pb-24 md:pb-0">
        <section className="relative bg-vula-cream overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 right-0 w-full text-vula-green/15"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0,40 Q360,100 720,40 T1440,40 L1440,120 L0,120 Z"
              fill="currentColor"
            />
            <path
              d="M0,70 Q360,20 720,70 T1440,70 L1440,120 L0,120 Z"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
            <div className="flex justify-center mb-6">
              <Logo size={180} showText={true} />
            </div>

            <p className="font-sans text-lg md:text-xl text-vula-dark/70 max-w-xl mx-auto mb-10 leading-relaxed">
              {settings.hero_tagline}<br />
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="btn-primary text-base px-8 py-4">
                Shop the catch
                <ChevronRight size={18} />
              </Link>
              <a
                href={whatsappLink("Hi, I'd like to order fresh fish")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy text-base px-8 py-4"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-12 text-vula-dark/60 text-sm font-sans">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-vula-amber fill-vula-amber" />
                <span>4.9 · 200+ reviews</span>
              </div>
              <span className="hidden sm:inline">·</span>
              <span>Free delivery over R{(settings.free_delivery_threshold_cents / 100).toFixed(0)}</span>
              <span className="hidden sm:inline">·</span>
              <span>Cape Town only</span>
            </div>
          </div>
        </section>

        <section className="band-navy">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {sections.brand_badges.map(({ label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="font-display text-lg md:text-xl font-semibold text-vula-cream">
                  {label}
                </span>
                <span className="font-sans text-xs text-vula-cream/60 tracking-wide uppercase">
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display text-4xl font-semibold text-center mb-12">
            {sections.how_it_works_heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.how_it_works_steps.map(({ icon, step, title, body }) => {
              const Icon = STEP_ICONS[icon] ?? MessageCircle
              return (
                <div key={step} className="card flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-vula-green text-2xl font-semibold">{step}</span>
                    <div className="h-px flex-1 bg-vula-border" />
                    <Icon size={20} className="text-vula-green" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                  <p className="font-sans text-sm text-vula-muted leading-relaxed">{body}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="font-display text-4xl font-semibold mb-8">{sections.categories_heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {visibleCategories.map(({ slug, label, emoji }) => (
              <Link
                key={slug}
                href={`/shop?category=${slug}`}
                className="card flex flex-col items-center gap-3 py-8 hover:border-vula-green transition-colors"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="font-sans text-sm font-medium text-vula-cream">{label}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop" className="btn-ghost">
              View all products
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        <section className="band-teal py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge badge-navy mb-6">{sections.whatsapp_cta.badge}</span>
            <h2 className="font-display text-5xl font-semibold mb-4 text-white">
              {sections.whatsapp_cta.heading}
            </h2>
            <p className="font-sans text-white/90 mb-10 text-lg leading-relaxed">
              {sections.whatsapp_cta.body.replace("Message us", `Message ${WHATSAPP_DISPLAY}`)}
            </p>
            <a
              href={whatsappLink("Hi, I'd like to order fresh fish")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-navy text-base px-10 py-4 shadow-lg"
            >
              <MessageCircle size={20} />
              {sections.whatsapp_cta.button_label}
            </a>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-amber mb-6">{sections.quality_promise.badge}</span>
              <h2 className="font-display text-5xl font-semibold mb-6 leading-tight">
                {sections.quality_promise.heading}
              </h2>
              <p className="font-sans text-vula-muted leading-relaxed mb-6">
                {sections.quality_promise.body}
              </p>
              <div className="flex flex-col gap-2">
                {sections.quality_promise.bullets.map((point) => (
                  <p key={point} className="flex items-start gap-2 font-sans text-sm text-vula-muted">
                    <span className="text-vula-green mt-0.5">✓</span>
                    {point}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sections.quality_promise.tiles.map(({ emoji, label, sub }) => (
                <div key={label} className="card flex flex-col items-center text-center gap-2 py-6">
                  <span className="text-3xl">{emoji}</span>
                  <p className="font-sans text-sm font-semibold text-vula-dark">{label}</p>
                  <p className="font-sans text-xs text-vula-muted">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-vula-border mt-10 py-12 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <Logo size={80} showText={true} />
              <p className="font-sans text-xs text-vula-muted">Quality food delivered to your door</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 font-sans text-sm text-vula-muted">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-vula-green transition-colors">
                WhatsApp: {WHATSAPP_DISPLAY_LOCAL}
              </a>
              <a href="mailto:info@offthehook.capetown" className="hover:text-vula-green transition-colors">
                info@offthehook.capetown
              </a>
              <p className="text-xs text-vula-muted/50 mt-2">© 2026 Off the Hook. Cape Town.</p>
            </div>
          </div>
        </footer>
      </main>

      <BottomNav />
    </>
  )
}

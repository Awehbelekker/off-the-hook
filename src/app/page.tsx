import Link from "next/link"
import { MessageCircle, Package, Truck, Star, ChevronRight } from "lucide-react"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import AnnouncementBar from "@/components/AnnouncementBar"
import ProductCard from "@/components/ProductCard"
import { getProducts } from "@/lib/api"

export const revalidate = 60

export default async function HomePage() {
  const products = await getProducts({ limit: 8 }).catch(() => [])

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="pb-24 md:pb-0">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Video background */}
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/ocean-hero.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <span className="badge badge-green mb-6">Daily catch — Cape Town</span>
            <h1 className="font-display text-6xl md:text-8xl font-semibold text-vula-cream leading-none mb-6">
              Off the Hook.
            </h1>
            <p className="font-sans text-lg md:text-xl text-vula-cream/70 max-w-xl mx-auto mb-10">
              Cape Town's freshest catch, door to door.
              From Hout Bay to your kitchen — ordered in 60 seconds on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="btn-primary text-base px-8 py-4">
                Shop the catch
                <ChevronRight size={18} />
              </Link>
              <a
                href="https://wa.me/27737815979?text=Hi%2C+I%27d+like+to+order+fresh+fish"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-base px-8 py-4"
              >
                <MessageCircle size={18} className="text-vula-green" />
                Order on WhatsApp
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 mt-12 text-vula-cream/50 text-sm font-sans">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-vula-amber fill-vula-amber" />
                <span>4.9 · 200+ reviews</span>
              </div>
              <span>·</span>
              <span>Free delivery over R500</span>
              <span>·</span>
              <span>Cape Town only</span>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display text-4xl font-semibold text-center mb-12">
            Boat to door, simply.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MessageCircle, step: "01", title: "Order on WhatsApp", body: "Message us your catch. We confirm availability and price in minutes." },
              { icon: Package, step: "02", title: "Packed fresh", body: "Your fish is cleaned, portioned, and packed in insulated cold-chain boxes." },
              { icon: Truck, step: "03", title: "Delivered same day", body: "Morning or afternoon slot. Cape Town delivery, tracked and confirmed." },
            ].map(({ icon: Icon, step, title, body }) => (
              <div key={step} className="card flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-display text-vula-green text-2xl font-semibold">{step}</span>
                  <div className="h-px flex-1 bg-vula-border" />
                  <Icon size={20} className="text-vula-green" />
                </div>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="font-sans text-sm text-vula-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Category grid ────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="font-display text-4xl font-semibold mb-8">Today's catch</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { slug: "linefish", label: "Linefish", emoji: "🐟" },
              { slug: "shellfish", label: "Shellfish", emoji: "🦐" },
              { slug: "crayfish", label: "Crayfish", emoji: "🦞" },
              { slug: "box_deal", label: "Box Deals", emoji: "📦" },
            ].map(({ slug, label, emoji }) => (
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

          {/* Featured products */}
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

        {/* ── WhatsApp CTA ─────────────────────────────────── */}
        <section className="bg-vula-green/10 border-y border-vula-green/20 py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge badge-green mb-6">WhatsApp ordering</span>
            <h2 className="font-display text-5xl font-semibold mb-4">
              Order in 60 seconds.
            </h2>
            <p className="font-sans text-vula-muted mb-10 text-lg">
              Message +27 73 781 5979, tell us what you want, and we handle the rest.
              No app, no account — just WhatsApp.
            </p>
            <a
              href="https://wa.me/27737815979?text=Hi%2C+I%27d+like+to+order+fresh+fish"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-amber text-base px-10 py-4"
            >
              <MessageCircle size={20} />
              Start ordering on WhatsApp
            </a>
          </div>
        </section>

        {/* ── Provenance ───────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-amber mb-6">Our fishermen</span>
              <h2 className="font-display text-5xl font-semibold mb-6 leading-tight">
                Hout Bay to your kitchen.
              </h2>
              <p className="font-sans text-vula-muted leading-relaxed mb-6">
                We work directly with licensed linefish skippers out of Hout Bay and Kalk Bay.
                No cold store. No middlemen. What's caught in the morning is at your door by afternoon.
              </p>
              <p className="font-sans text-vula-muted leading-relaxed">
                Every order tells you exactly who caught your fish and where.
              </p>
            </div>
            <div className="card aspect-square flex items-center justify-center">
              {/* Replace with actual fisherman image */}
              <div className="text-center text-vula-muted">
                <span className="text-6xl block mb-4">🎣</span>
                <p className="font-sans text-sm">Fisherman photography coming soon</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  )
}

"use client"

import Link from "next/link"
import { ShoppingCart, Search, User } from "lucide-react"
import { useCartStore } from "@/store/cart"

export default function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  return (
    <header className="sticky top-0 z-50 bg-vula-dark/90 backdrop-blur-md border-b border-vula-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-semibold text-vula-cream tracking-tight">
          Off the Hook
          <span className="text-vula-green">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/shop?category=linefish", label: "Linefish" },
            { href: "/shop?category=shellfish", label: "Shellfish" },
            { href: "/shop?category=box_deal", label: "Box Deals" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-sans text-sm text-vula-muted hover:text-vula-cream transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="text-vula-muted hover:text-vula-cream transition-colors"
          >
            <Search size={20} />
          </button>

          <Link
            href="/account"
            aria-label="Account"
            className="hidden md:block text-vula-muted hover:text-vula-cream transition-colors"
          >
            <User size={20} />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart (${itemCount} items)`}
            className="relative text-vula-muted hover:text-vula-cream transition-colors"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-vula-green text-vula-cream text-xs font-sans font-medium w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

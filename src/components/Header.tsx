"use client"

import Link from "next/link"
import { ShoppingCart, Search, User } from "lucide-react"
import { useCartStore } from "@/store/cart"
import Logo from "@/components/Logo"

export default function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-vula-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Off the Hook — home">
          <Logo size={40} showText={false} />
          <span className="font-display text-xl font-semibold text-vula-dark tracking-tight hidden sm:block">
            Off the Hook
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/shop", label: "Shop all" },
            { href: "/shop?category=fresh_fish", label: "Fresh fish" },
            { href: "/shop?category=fresh_chicken", label: "Chicken" },
            { href: "/shop?category=frozen_seafood", label: "Frozen seafood" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-sans text-sm text-vula-dark/70 hover:text-vula-green transition-colors font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="text-vula-dark/60 hover:text-vula-green transition-colors"
          >
            <Search size={20} />
          </button>

          <Link
            href="/account"
            aria-label="Account"
            className="hidden md:block text-vula-dark/60 hover:text-vula-green transition-colors"
          >
            <User size={20} />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart (${itemCount} items)`}
            className="relative text-vula-dark/60 hover:text-vula-green transition-colors"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-vula-green text-white text-xs font-sans font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

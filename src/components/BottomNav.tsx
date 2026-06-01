"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, MessageCircle, ShoppingCart, User } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { clsx } from "clsx"

const WA_LINK = "https://wa.me/27737815979?text=Hi%2C+I%27d+like+to+order+fresh+fish"

export default function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/shop", icon: ShoppingBag, label: "Shop" },
    { href: WA_LINK, icon: MessageCircle, label: "Order", isWhatsApp: true, external: true },
    { href: "/cart", icon: ShoppingCart, label: "Cart", badge: itemCount },
    { href: "/account", icon: User, label: "Account" },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-vula-border pb-safe shadow-[0_-4px_12px_rgba(14,45,77,0.06)]">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, label, isWhatsApp, external, badge }) => {
          const active = !external && pathname === href

          if (isWhatsApp) {
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 -mt-6"
              >
                {/* Centre hero tab — elevated WhatsApp green circle */}
                <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40">
                  <Icon size={24} className="text-white" />
                  {/* Live indicator dot */}
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-vula-green animate-pulse-dot ring-2 ring-white" />
                </span>
                <span className="font-sans text-[10px] text-[#25D366] font-semibold">{label}</span>
              </a>
            )
          }

          return (
            <Link
              key={label}
              href={href}
              className={clsx(
                "relative flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                active ? "text-vula-green" : "text-vula-dark/55 hover:text-vula-dark"
              )}
            >
              <Icon size={22} />
              {badge !== undefined && badge > 0 && (
                <span className="absolute top-1 right-2 bg-vula-green text-white text-[10px] font-sans font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
              <span className="font-sans text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

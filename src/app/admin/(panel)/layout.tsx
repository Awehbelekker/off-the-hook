import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, Settings, Image, FolderInput, LayoutTemplate } from "lucide-react"
import AdminSignOut from "@/components/AdminSignOut"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/pages", label: "Pages", icon: LayoutTemplate },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/import", label: "Import", icon: FolderInput },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-vula-cream flex">
      <aside className="w-56 shrink-0 bg-vula-dark text-vula-cream flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-display text-xl font-semibold">
            Off the Hook
          </Link>
          <p className="font-sans text-xs text-vula-cream/50 mt-1">Admin</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-input font-sans text-sm text-vula-cream/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 font-sans text-xs text-vula-cream/50 hover:text-vula-cream mb-3">
            ← View storefront
          </Link>
          <AdminSignOut />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}

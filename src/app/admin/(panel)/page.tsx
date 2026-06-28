"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react"
import type { DashboardStats } from "@/lib/api"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetch("/admin/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  const cards = [
    {
      label: "Orders today",
      value: stats?.orders_today ?? "—",
      icon: ShoppingBag,
      color: "text-vula-green",
    },
    {
      label: "Revenue today",
      value: stats ? `R${((stats.revenue_today_cents || 0) / 100).toFixed(0)}` : "—",
      icon: TrendingUp,
      color: "text-vula-green",
    },
    {
      label: "Pending orders",
      value: stats?.pending_orders ?? "—",
      icon: Package,
      color: "text-vula-amber",
    },
    {
      label: "Out of stock",
      value: stats?.low_stock_count ?? "—",
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Dashboard</h1>
      <p className="font-sans text-sm text-vula-muted mb-8">Off the Hook store overview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-sm text-vula-muted">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <p className="font-display text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-display text-xl font-semibold mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/settings" className="btn-primary text-sm">Edit announcements</a>
          <a href="/admin/products" className="btn-ghost text-sm">Manage products</a>
          <a href="/admin/orders" className="btn-ghost text-sm">View orders</a>
        </div>
      </div>
    </div>
  )
}

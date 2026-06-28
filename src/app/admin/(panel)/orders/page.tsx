"use client"

import { useEffect, useState } from "react"
import type { Order, OrderStatus } from "@/lib/api"

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/admin/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const res = await fetch(`/admin/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      const updated = await res.json()
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o)))
    }
  }

  if (loading) {
    return <p className="font-sans text-vula-muted">Loading orders…</p>
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Orders</h1>
      <p className="font-sans text-sm text-vula-muted mb-8">{orders.length} orders</p>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-sans font-semibold text-vula-dark">
                  #{order.display_id} · {order.customer_name}
                </p>
                <p className="font-sans text-sm text-vula-muted">{order.customer_phone}</p>
                <p className="font-sans text-xs text-vula-muted mt-1">{order.delivery_address}</p>
                <p className="font-sans text-sm font-bold mt-2">
                  R{((order.total_cents || 0) / 100).toFixed(2)} · {order.delivery_slot}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                className="bg-white border border-vula-border rounded-input px-3 py-2 font-sans text-sm capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="font-sans text-vula-muted">
            No orders yet. Orders appear here when placed via the storefront or Vula API.
          </p>
        )}
      </div>
    </div>
  )
}

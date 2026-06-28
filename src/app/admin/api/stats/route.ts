import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getDashboardStats } from "@/lib/api"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({
      orders_today: 0,
      revenue_today_cents: 0,
      pending_orders: 0,
      low_stock_count: 0,
    })
  }
}

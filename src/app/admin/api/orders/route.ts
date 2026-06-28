import { NextResponse } from "next/server"
import { getOrders, getOrdersByPhone } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get("phone")

  try {
    if (phone) {
      const orders = await getOrdersByPhone(phone)
      return NextResponse.json({ orders })
    }
    const orders = await getOrders({ limit: 100 })
    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ orders: [] })
  }
}

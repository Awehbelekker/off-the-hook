import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getProductsForStore } from "@/lib/product-overrides-store"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const products = await getProductsForStore({ inStockOnly: false })
    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}

import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getProductsForStore, saveProductUpdate, type ProductOverride } from "@/lib/product-overrides-store"

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as ProductOverride

  try {
    const { product, source } = await saveProductUpdate(id, body)
    return NextResponse.json({ ...product, _source: source })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    )
  }
}

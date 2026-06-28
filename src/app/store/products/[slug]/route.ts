import { NextResponse } from "next/server"
import { getProductForStore } from "@/lib/product-overrides-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    const product = await getProductForStore(slug)
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

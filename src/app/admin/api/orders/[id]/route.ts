import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { updateOrderStatus, type OrderStatus } from "@/lib/api"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  try {
    const order = await updateOrderStatus(id, status as OrderStatus)
    return NextResponse.json(order)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    )
  }
}

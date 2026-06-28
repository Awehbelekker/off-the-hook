import { NextResponse } from "next/server"
import {
  adminConfigured,
  adminUsesDevDefault,
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth"

export async function GET() {
  return NextResponse.json({
    configured: adminConfigured(),
    devDefault: adminUsesDevDefault(),
  })
}

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin password not set. Add ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.",
      },
      { status: 503 }
    )
  }

  const { password } = await request.json()
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const ok = await createAdminSession()
  if (!ok) {
    return NextResponse.json({ error: "Could not create session" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const { clearAdminSession } = await import("@/lib/admin-auth")
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}

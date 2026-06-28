import { NextResponse } from "next/server"
import { clearGoogleCredentials } from "@/lib/google-drive"

export async function POST() {
  await clearGoogleCredentials()
  return NextResponse.json({ ok: true })
}

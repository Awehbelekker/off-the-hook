import { NextResponse } from "next/server"
import { googleDriveConfigured, loadGoogleCredentials } from "@/lib/google-drive"

export async function GET() {
  const creds = await loadGoogleCredentials()
  return NextResponse.json({
    configured: googleDriveConfigured(),
    connected: Boolean(creds?.refresh_token),
    connectedAt: creds?.connected_at ?? null,
  })
}

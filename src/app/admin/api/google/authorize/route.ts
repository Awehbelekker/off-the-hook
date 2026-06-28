import { NextResponse } from "next/server"
import { getGoogleAuthUrl, googleDriveConfigured } from "@/lib/google-drive"

export async function GET(request: Request) {
  if (!googleDriveConfigured()) {
    return NextResponse.json(
      { error: "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables" },
      { status: 503 }
    )
  }

  const origin = new URL(request.url).origin
  return NextResponse.redirect(getGoogleAuthUrl(origin))
}

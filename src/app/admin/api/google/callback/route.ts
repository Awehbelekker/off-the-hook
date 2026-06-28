import { NextResponse } from "next/server"
import { exchangeGoogleCode, saveGoogleCredentials } from "@/lib/google-drive"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/import?error=${encodeURIComponent(error)}`, origin)
    )
  }

  if (!code) {
    return NextResponse.redirect(new URL("/admin/import?error=no_code", origin))
  }

  try {
    const refreshToken = await exchangeGoogleCode(code, origin)
    await saveGoogleCredentials({
      refresh_token: refreshToken,
      connected_at: new Date().toISOString(),
    })
    return NextResponse.redirect(new URL("/admin/import?connected=1", origin))
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth failed"
    return NextResponse.redirect(
      new URL(`/admin/import?error=${encodeURIComponent(message)}`, origin)
    )
  }
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "oth-admin-session"
const DEV_DEFAULT_PASSWORD = "offthehook"

function sessionToken(): string | null {
  return (
    process.env.ADMIN_SESSION_TOKEN ||
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "development" ? DEV_DEFAULT_PASSWORD : null)
  )
}

function isAuthenticated(request: NextRequest): boolean {
  const token = sessionToken()
  if (!token) return false
  return request.cookies.get(COOKIE_NAME)?.value === token
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/api/settings" && request.method === "GET") {
    return NextResponse.next()
  }
  if (pathname === "/admin/api/orders" && request.method === "GET") {
    return NextResponse.next()
  }
  if (pathname.startsWith("/admin/api/auth")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (isAuthenticated(request)) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      return NextResponse.next()
    }

    if (!sessionToken()) {
      return NextResponse.redirect(new URL("/admin/login?error=not-configured", request.url))
    }

    if (!isAuthenticated(request)) {
      if (pathname.startsWith("/admin/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}

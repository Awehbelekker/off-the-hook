import { cookies } from "next/headers"

const COOKIE_NAME = "oth-admin-session"
const SESSION_MAX_AGE = 60 * 60 * 24
const DEV_DEFAULT_PASSWORD = "offthehook"

function sessionToken(): string | null {
  return (
    process.env.ADMIN_SESSION_TOKEN ||
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "development" ? DEV_DEFAULT_PASSWORD : null)
  )
}

export function getEffectiveAdminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD
  if (process.env.NODE_ENV === "development") return DEV_DEFAULT_PASSWORD
  return null
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getEffectiveAdminPassword()
  if (!expected) return false
  return password === expected
}

export async function createAdminSession(): Promise<boolean> {
  const token = sessionToken()
  if (!token) return false

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
  return true
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = sessionToken()
  if (!token) return false

  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value === token
}

export function adminConfigured(): boolean {
  return Boolean(getEffectiveAdminPassword())
}

export function adminUsesDevDefault(): boolean {
  return !process.env.ADMIN_PASSWORD && process.env.NODE_ENV === "development"
}

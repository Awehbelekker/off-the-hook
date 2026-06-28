import "server-only"
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"

const CREDENTIALS_FILE = path.join(process.cwd(), "data/google-drive.json")

export type GoogleDriveCredentials = {
  refresh_token: string
  connected_at: string
  email?: string
}

export function googleDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
  )
}

export function getGoogleRedirectUri(origin?: string): string {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI
  const base = origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${base.replace(/\/$/, "")}/admin/api/google/callback`
}

export async function loadGoogleCredentials(): Promise<GoogleDriveCredentials | null> {
  try {
    const raw = await readFile(CREDENTIALS_FILE, "utf-8")
    return JSON.parse(raw) as GoogleDriveCredentials
  } catch {
    return null
  }
}

export async function saveGoogleCredentials(creds: GoogleDriveCredentials): Promise<void> {
  await mkdir(path.dirname(CREDENTIALS_FILE), { recursive: true })
  await writeFile(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), "utf-8")
}

export async function clearGoogleCredentials(): Promise<void> {
  try {
    await writeFile(CREDENTIALS_FILE, "{}", "utf-8")
  } catch {
    // ignore
  }
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Token refresh failed")
  }
  return data.access_token as string
}

export type DriveEntry = {
  id: string
  name: string
  mimeType: string
  size?: number
  thumbnailUrl?: string
  isFolder: boolean
}

export async function listDriveFolder(folderId = "root"): Promise<DriveEntry[]> {
  const creds = await loadGoogleCredentials()
  if (!creds?.refresh_token) throw new Error("Google Drive not connected")

  const token = await getAccessToken(creds.refresh_token)
  const query = `'${folderId}' in parents and trashed = false`
  const url = new URL("https://www.googleapis.com/drive/v3/files")
  url.searchParams.set("q", query)
  url.searchParams.set(
    "fields",
    "files(id,name,mimeType,size,thumbnailLink,iconLink)"
  )
  url.searchParams.set("pageSize", "100")
  url.searchParams.set("orderBy", "folder,name")

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || "Failed to list Drive folder")

  return (data.files || []).map((f: {
    id: string
    name: string
    mimeType: string
    size?: string
    thumbnailLink?: string
  }) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: f.size ? parseInt(f.size, 10) : undefined,
    thumbnailUrl: f.thumbnailLink,
    isFolder: f.mimeType === "application/vnd.google-apps.folder",
  }))
}

export async function downloadDriveFile(fileId: string): Promise<{ bytes: Buffer; mimeType: string; name: string }> {
  const creds = await loadGoogleCredentials()
  if (!creds?.refresh_token) throw new Error("Google Drive not connected")

  const token = await getAccessToken(creds.refresh_token)

  const metaRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const meta = await metaRes.json()
  if (!metaRes.ok) throw new Error(meta.error?.message || "File not found")

  if (!meta.mimeType?.startsWith("image/")) {
    throw new Error(`${meta.name} is not an image`)
  }

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error(`Download failed for ${meta.name}`)

  const bytes = Buffer.from(await res.arrayBuffer())
  return { bytes, mimeType: meta.mimeType, name: meta.name }
}

export function getGoogleAuthUrl(origin: string): string {
  const redirectUri = getGoogleRedirectUri(origin)
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/drive.readonly",
    access_type: "offline",
    prompt: "consent",
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function exchangeGoogleCode(code: string, origin: string): Promise<string> {
  const redirectUri = getGoogleRedirectUri(origin)
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })

  const data = await res.json()
  if (!res.ok || !data.refresh_token) {
    throw new Error(data.error_description || "OAuth exchange failed — try reconnecting with consent")
  }
  return data.refresh_token as string
}

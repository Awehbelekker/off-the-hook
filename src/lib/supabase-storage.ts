import "server-only"
import { getSupabaseAdmin } from "./supabase-server"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "media"
const TENANT_PREFIX = process.env.NEXT_PUBLIC_VULA_TENANT_ID || "off-the-hook"

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase()
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName
  }
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }
  return map[file.type] || "jpg"
}

function extFromMime(mimeType: string, fileName?: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }
  if (map[mimeType]) return map[mimeType]
  const fromName = fileName?.split(".").pop()?.toLowerCase()
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName
  }
  return "jpg"
}

export async function uploadBytesToSupabase(
  bytes: Buffer,
  mimeType: string,
  fileName?: string
): Promise<{ url: string; path: string }> {
  const supabase = getSupabaseAdmin()
  if (!supabase) throw new Error("Supabase is not configured")

  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error("Use JPG, PNG, WebP, or GIF")
  }
  if (bytes.length > 10 * 1024 * 1024) {
    throw new Error("Image must be under 10MB")
  }

  const ext = extFromMime(mimeType, fileName)
  const objectPath = `${TENANT_PREFIX}/products/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, bytes, {
    contentType: mimeType,
    cacheControl: "3600",
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
  return { url: data.publicUrl, path: objectPath }
}

export async function uploadToSupabase(file: File): Promise<{ url: string; path: string }> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    throw new Error("Supabase is not configured")
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use JPG, PNG, WebP, or GIF")
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be under 10MB")
  }

  const ext = extensionFor(file)
  const objectPath = `${TENANT_PREFIX}/products/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, bytes, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
  return { url: data.publicUrl, path: objectPath }
}

import "server-only"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { uploadProductImage } from "./api"
import { uploadToSupabase } from "./supabase-storage"
import { supabaseConfigured } from "./supabase-server"

export type UploadResult = {
  url: string
  source: "vula" | "supabase" | "local"
}

export async function uploadImage(file: File): Promise<UploadResult> {
  // 1. Supabase (preferred for production — persistent, CDN-backed)
  if (supabaseConfigured()) {
    try {
      const { url } = await uploadToSupabase(file)
      return { url, source: "supabase" }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Supabase upload failed"
      throw new Error(message)
    }
  }

  // 2. Vula media API (if configured)
  try {
    const result = await uploadProductImage(file)
    return { url: result.url, source: "vula" }
  } catch {
    // fall through to local dev storage
  }

  // 3. Local public/uploads (dev only)
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    throw new Error("Unsupported image type")
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
  const dir = path.join(process.cwd(), "public/uploads")
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))
  return { url: `/uploads/${name}`, source: "local" }
}

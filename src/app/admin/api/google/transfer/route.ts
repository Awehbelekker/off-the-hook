import { NextResponse } from "next/server"
import { downloadDriveFile } from "@/lib/google-drive"
import { uploadBytesToSupabase } from "@/lib/supabase-storage"
import { supabaseConfigured } from "@/lib/supabase-server"

export async function POST(request: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase must be configured to transfer images from Drive" },
      { status: 503 }
    )
  }

  const { fileIds } = (await request.json()) as { fileIds: string[] }
  if (!fileIds?.length) {
    return NextResponse.json({ error: "No files selected" }, { status: 400 })
  }

  const results: { fileId: string; name: string; url?: string; error?: string }[] = []

  for (const fileId of fileIds) {
    try {
      const { bytes, mimeType, name } = await downloadDriveFile(fileId)
      const { url } = await uploadBytesToSupabase(bytes, mimeType, name)
      results.push({ fileId, name, url })
    } catch (err) {
      results.push({
        fileId,
        name: fileId,
        error: err instanceof Error ? err.message : "Transfer failed",
      })
    }
  }

  const ok = results.filter((r) => r.url).length
  return NextResponse.json({ results, transferred: ok, total: fileIds.length })
}

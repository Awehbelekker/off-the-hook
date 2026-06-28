import { NextResponse } from "next/server"
import { listDriveFolder } from "@/lib/google-drive"

export async function GET(request: Request) {
  const folder = new URL(request.url).searchParams.get("folder") || "root"
  try {
    const files = await listDriveFolder(folder)
    return NextResponse.json({ files, folder })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list folder" },
      { status: 500 }
    )
  }
}

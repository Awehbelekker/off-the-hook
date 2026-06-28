import { NextResponse } from "next/server"
import { getStoreSettings, saveStoreSettings } from "@/lib/settings-store"
import { mergeStoreSettings, type StoreSettings } from "@/lib/settings"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  const settings = await getStoreSettings()
  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as Partial<StoreSettings>
  const current = await getStoreSettings()
  const updated = mergeStoreSettings({ ...current, ...body })
  const result = await saveStoreSettings(updated)

  if (!result.ok) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }

  return NextResponse.json({ ...updated, _source: result.source })
}

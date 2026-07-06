import { NextResponse } from "next/server"
import { getHomeSections, saveHomeSections } from "@/lib/home-sections-store"
import { mergeHomeSections, type HomeSections } from "@/lib/home-sections"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  const sections = await getHomeSections()
  return NextResponse.json(sections)
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as Partial<HomeSections>
  const current = await getHomeSections()
  const updated = mergeHomeSections({ ...current, ...body })

  try {
    await saveHomeSections(updated)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

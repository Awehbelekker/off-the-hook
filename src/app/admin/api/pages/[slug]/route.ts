import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminPage, savePage } from "@/lib/vula-pages";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAdminPage(params.slug));
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const page = await savePage(params.slug, await req.json());
    return NextResponse.json({ page });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}

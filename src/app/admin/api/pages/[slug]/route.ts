import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminPage, savePage } from "@/lib/vula-pages";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  return NextResponse.json(await getAdminPage(slug));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  try {
    const page = await savePage(slug, await req.json());
    return NextResponse.json({ page });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}

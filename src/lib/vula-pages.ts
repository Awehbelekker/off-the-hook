/**
 * Vula page service client (server-side only — holds the API key).
 * Pages live in Vula (vula_pages), so this drops into any Vula tenant: set
 * NEXT_PUBLIC_VULA_TENANT_ID (defaults to off-the-hook). Powers the Puck editor + render.
 */
import "server-only";

const VULA_API = process.env.NEXT_PUBLIC_VULA_API_URL || "https://vula-group-production.up.railway.app";
const TENANT = process.env.NEXT_PUBLIC_VULA_TENANT_ID || "off-the-hook";
const KEY = process.env.VULA_API_KEY || "";

export type PuckData = { content: unknown[]; root: Record<string, unknown>; zones?: Record<string, unknown> };
export type VulaPage = {
  id?: string; tenant_id?: string; slug: string; title?: string;
  puck_data: PuckData; seo?: Record<string, string>; status?: "draft" | "published"; updated_at?: string;
};

const base = `${VULA_API}/v1/commerce/${TENANT}`;
const headers = { "Content-Type": "application/json", "X-API-Key": KEY };

export async function getPublishedPage(slug: string): Promise<VulaPage | null> {
  const res = await fetch(`${base}/pages/${slug}`, { headers, next: { revalidate: 30 } });
  if (!res.ok) return null;
  return res.json();
}

export async function listAdminPages(): Promise<VulaPage[]> {
  const res = await fetch(`${base}/admin/pages`, { headers, cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()).pages || [];
}

export async function getAdminPage(slug: string): Promise<VulaPage> {
  const res = await fetch(`${base}/admin/pages/${slug}`, { headers, cache: "no-store" });
  if (!res.ok) return { slug, puck_data: { content: [], root: {} }, status: "draft" };
  return res.json();
}

export async function savePage(slug: string, body: Partial<VulaPage>): Promise<VulaPage> {
  const res = await fetch(`${base}/admin/pages/${slug}`, {
    method: "PUT", headers,
    body: JSON.stringify({
      title: body.title, puck_data: body.puck_data || { content: [], root: {} },
      seo: body.seo || {}, status: body.status || "draft",
    }),
  });
  if (!res.ok) throw new Error(`Save failed ${res.status}`);
  return (await res.json()).page;
}

/** Tenant theme for brand-token flow-through (accent/ink/logo). */
export async function getTenantTheme(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${VULA_API}/v1/tenants/${TENANT}`, { headers, next: { revalidate: 300 } });
    if (!res.ok) return {};
    return (await res.json()).theme || {};
  } catch {
    return {};
  }
}

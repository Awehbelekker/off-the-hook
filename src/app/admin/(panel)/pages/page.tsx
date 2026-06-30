import Link from "next/link";
import { listAdminPages } from "@/lib/vula-pages";
import NewPageButton from "@/components/NewPageButton";

export const dynamic = "force-dynamic";

export default async function PagesAdmin() {
  const pages = await listAdminPages();
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-vula-dark">Pages</h1>
          <p className="font-sans text-sm text-vula-dark/60">Build and edit website pages — no developer needed.</p>
        </div>
        <NewPageButton />
      </div>

      <div className="rounded-card border border-vula-dark/10 divide-y divide-vula-dark/10 bg-white">
        {pages.length === 0 && (
          <div className="p-6 font-sans text-sm text-vula-dark/60">No pages yet — click “New page” to build one.</div>
        )}
        {pages.map((p) => (
          <div key={p.slug} className="flex items-center justify-between p-4">
            <div>
              <div className="font-sans font-medium text-vula-dark">{p.title || p.slug}</div>
              <div className="font-sans text-xs text-vula-dark/50">
                /p/{p.slug} ·{" "}
                <span className={p.status === "published" ? "text-green-600" : "text-amber-600"}>{p.status}</span>
              </div>
            </div>
            <div className="flex gap-3 font-sans text-sm">
              {p.status === "published" && (
                <Link href={`/p/${p.slug}`} className="text-vula-dark/60 hover:underline" target="_blank">View</Link>
              )}
              <Link href={`/admin/pages/${p.slug}`} className="text-vula-green font-medium hover:underline">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

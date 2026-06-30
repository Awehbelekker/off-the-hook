"use client";

import { useRouter } from "next/navigation";

export default function NewPageButton() {
  const router = useRouter();
  const create = () => {
    const raw = window.prompt("New page URL slug (e.g. about, specials):");
    if (!raw) return;
    const slug = raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    if (slug) router.push(`/admin/pages/${slug}`);
  };
  return (
    <button onClick={create} className="rounded-input bg-vula-dark text-vula-cream px-4 py-2 text-sm font-sans font-medium">
      + New page
    </button>
  );
}

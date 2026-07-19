"use client";

import { useEffect } from "react";
import { Render, type Data } from "@measured/puck";
import config from "@/puck.config";

const TENANT_ID = process.env.NEXT_PUBLIC_VULA_TENANT_ID || "off-the-hook";
const VULA_API = process.env.NEXT_PUBLIC_VULA_API_URL || "https://vula-group-production.up.railway.app";

/** Renders a published Vula page, injecting the tenant's brand as CSS variables so blocks
 *  render in this store's colours (brand flow-through). Also sets the globals the live
 *  product blocks read (window.__VULA_PAGE_TENANT/__VULA_API). */
export default function PuckRender({ data, theme }: { data: Data; theme?: Record<string, string> }) {
  useEffect(() => {
    const w = window as unknown as Record<string, string>;
    w.__VULA_PAGE_TENANT = TENANT_ID;
    w.__VULA_API = VULA_API;
  }, []);
  const vars: Record<string, string> = {};
  if (theme?.accent) vars["--brand-accent"] = theme.accent;
  if (theme?.ink) vars["--brand-ink"] = theme.ink;
  if (theme?.accent_fg) vars["--brand-accent-fg"] = theme.accent_fg;
  return (
    <div style={vars as React.CSSProperties}>
      <Render config={config} data={data} />
    </div>
  );
}

"use client";

import { Render, type Data } from "@measured/puck";
import config from "@/puck.config";

/** Renders a published Vula page, injecting the tenant's brand as CSS variables so blocks
 *  render in this store's colours (brand flow-through). */
export default function PuckRender({ data, theme }: { data: Data; theme?: Record<string, string> }) {
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

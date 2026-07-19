# Using this codebase as a storefront template

This is Off the Hook's storefront, but it's written to be tenant-agnostic — every tenant-specific
value is read from `NEXT_PUBLIC_VULA_TENANT_ID` (with `"off-the-hook"` as the only fallback, so a
new deployment must set it or it'll silently serve OTH's own data). Puck page content, products,
orders, and brand kit (logo/accent/ink/font — see Settings → 🎨 Brand kit in the dashboard) all
come from the Vula backend for whatever tenant ID you configure — no other code changes needed
for a standard storefront.

## Spinning up a new tenant storefront

1. **Copy this folder** to a new project directory (or `git clone` + point the remote at a new repo).
2. **Provision the tenant in Vula** — Master → Tenants → "+ New tenant" (business type drives the
   default module set), or POST `/v1/tenants`. This creates the `vula_tenant_config` row.
3. **Set env vars** (copy `.env.example` → `.env.local` for dev, or set directly in Vercel):
   - `NEXT_PUBLIC_VULA_TENANT_ID` — the new tenant's slug. This is the only truly required change.
   - `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` — the new store's own domain + WhatsApp line.
   - `ADMIN_PASSWORD` — a fresh password for this store's `/admin`.
   - Supabase / Yoco / Google keys if this tenant uses image storage, card payments, or Drive import.
4. **Deploy to a new Vercel project**, pointed at the new repo/directory. Attach the tenant's domain.
5. **Brand it** — in the Vula dashboard, Settings → 🎨 Brand kit (logo, accent, text colour, heading
   font). This flows through automatically to both the dashboard and this storefront's Puck pages
   via the public `GET /v1/commerce/{tenant}/brand` endpoint — no code change or redeploy needed
   when a tenant updates their own branding.
6. **Build pages** in the Vula dashboard's Pages tab (Puck editor) — `/p/[slug]` renders them here.

## One dashboard for every storefront — no local product/settings admin

A storefront never gets its own product or settings admin. Every tenant's catalogue and store
settings (hero copy, announcements, delivery fees, cutoff time, featured products) are edited in
the Vula dashboard and read here via the public `GET /v1/commerce/{tenant}/products`,
`/products/{slug}`, and `/settings` endpoints — never through a local write path. This repo used
to have its own `/admin/products` and `/admin/settings` pages that called backend routes which
didn't exist, silently falling through to writing `data/product-overrides.json` /
`data/store-settings.json` on the storefront's own disk — invisible to the real dashboard and at
risk of being lost on redeploy. Those pages are retired (now a short "moved to the dashboard"
message); don't rebuild them for this or any future storefront. If a new tenant genuinely needs a
setting this schema doesn't cover yet, add the field to the Vula backend (`commerce_products` /
`commerce_order_settings`) and dashboard, not a local JSON file here.

## Known drift risk

The Puck block library (`src/puck.config.tsx`) is a **hand-synced copy** of
`vula_dashboard/src/puck/config.jsx` (and `kelp/kelp-board-bags/puck.config.tsx`) — adding a block
type means updating all three by hand. Not automated; a shared npm package is the eventual fix if
more storefronts are added, but three copies has been manageable so far.

## What's genuinely reusable vs. OTH-specific

Reusable (tenant-driven, no edits needed): product grid/checkout/cart, Puck page rendering + all
block types, brand kit flow-through, order creation, admin login gate, image upload to Supabase.

OTH-specific (expected to change per deployment, not a bug): copy on the homepage hero/about
sections (`src/app/page.tsx`), contact email addresses, the dev-only default admin password.

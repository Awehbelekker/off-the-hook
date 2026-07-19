/**
 * Puck block library — portable across every Vula store.
 *
 * Brand flows through CSS variables (--brand-accent / --brand-ink / --brand-accent-fg) set by
 * <PuckRender> from the tenant's theme. Blocks reference those vars (with sensible fallbacks),
 * and use only neutral Tailwind utilities for layout — so this exact config renders on any store
 * in that store's brand, with no per-store edits.
 */
import { createElement } from "react";
import type { Config } from "@measured/puck";
import Link from "next/link";

const ACCENT = "var(--brand-accent, #0E7C7B)";
const ACCENT_FG = "var(--brand-accent-fg, #ffffff)";
const INK = "var(--brand-ink, #1a1a1a)";

type Props = {
  Hero: { title: string; subtitle: string; image: string; ctaText: string; ctaHref: string };
  Heading: { text: string; level: "h1" | "h2" | "h3"; align: "left" | "center" };
  Text: { text: string; align: "left" | "center" };
  ImageBlock: { src: string; alt: string; rounded: boolean };
  CTA: { text: string; href: string; variant: "solid" | "outline" };
  Features: { title: string; items: { heading: string; body: string }[] };
  Spacer: { size: "sm" | "md" | "lg" };
  ProductGrid: { title: string; category: string; count: number; linkBase: string };
  FeaturedProducts: { title: string; count: number; linkBase: string };
  CategoryNav: { title: string; linkBase: string };
  TwoColumns: { leftImage: string; leftHeading: string; leftBody: string; rightImage: string; rightHeading: string; rightBody: string };
  Gallery: { title: string; images: { src: string; alt: string }[] };
  Testimonials: { title: string; items: { quote: string; author: string; role: string }[] };
  VideoEmbed: { url: string; caption: string };
  WhatsAppCTA: { phone: string; message: string; buttonText: string };
  ContactCard: { title: string; phone: string; email: string; address: string; hours: string };
  AnnouncementBar: { text: string; linkText: string; href: string };
  Divider: { style: "solid" | "dashed" };
};

const wrap = "max-w-6xl mx-auto px-4";

export const config: Config<Props> = {
  components: {
    Hero: {
      label: "Hero",
      fields: {
        title: { type: "text" }, subtitle: { type: "textarea" },
        image: { type: "text", label: "Background image URL" },
        ctaText: { type: "text", label: "Button text" }, ctaHref: { type: "text", label: "Button link" },
      },
      defaultProps: { title: "Your headline", subtitle: "A short supporting line.", image: "", ctaText: "Shop now", ctaHref: "/shop" },
      render: ({ title, subtitle, image, ctaText, ctaHref }) => (
        <section className="relative flex items-center justify-center text-center text-white"
          style={{ minHeight: 420, backgroundColor: ACCENT, backgroundImage: image ? `url(${image})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} />
          <div className="relative z-10 max-w-3xl px-4 py-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            {subtitle ? <p className="text-lg opacity-90 mb-6">{subtitle}</p> : null}
            {ctaText ? (
              <Link href={ctaHref || "#"} className="inline-block rounded-full px-7 py-3 font-semibold"
                style={{ backgroundColor: ACCENT_FG, color: INK }}>{ctaText}</Link>
            ) : null}
          </div>
        </section>
      ),
    },
    Heading: {
      label: "Heading",
      fields: {
        text: { type: "text" },
        level: { type: "select", options: [{ label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" }] },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }] },
      },
      defaultProps: { text: "Section heading", level: "h2", align: "left" },
      render: ({ text, level, align }) => {
        const size = level === "h1" ? "text-4xl" : level === "h2" ? "text-3xl" : "text-2xl";
        return (
          <div className={`${wrap} py-6`}>
            {createElement(level, { className: `${size} font-bold ${align === "center" ? "text-center" : ""}`, style: { color: INK } }, text)}
          </div>
        );
      },
    },
    Text: {
      label: "Text",
      fields: {
        text: { type: "textarea" },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }] },
      },
      defaultProps: { text: "Write your content here.", align: "left" },
      render: ({ text, align }) => (
        <div className={`${wrap} py-3`}>
          <p className={`leading-relaxed whitespace-pre-line max-w-3xl text-gray-600 ${align === "center" ? "mx-auto text-center" : ""}`}>{text}</p>
        </div>
      ),
    },
    ImageBlock: {
      label: "Image",
      fields: {
        src: { type: "text", label: "Image URL" }, alt: { type: "text" },
        rounded: { type: "radio", options: [{ label: "Rounded", value: true }, { label: "Square", value: false }] },
      },
      defaultProps: { src: "", alt: "", rounded: true },
      render: ({ src, alt, rounded }) => (
        <div className={`${wrap} py-6`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {src ? <img src={src} alt={alt} className={`w-full object-cover ${rounded ? "rounded-2xl" : ""}`} /> : <div className={`h-48 bg-gray-100 ${rounded ? "rounded-2xl" : ""}`} />}
        </div>
      ),
    },
    CTA: {
      label: "Button",
      fields: {
        text: { type: "text" }, href: { type: "text" },
        variant: { type: "select", options: [{ label: "Solid", value: "solid" }, { label: "Outline", value: "outline" }] },
      },
      defaultProps: { text: "Get in touch", href: "/contact", variant: "solid" },
      render: ({ text, href, variant }) => (
        <div className={`${wrap} py-5 text-center`}>
          <Link href={href || "#"} className="inline-block rounded-full px-7 py-3 font-semibold border"
            style={variant === "solid"
              ? { backgroundColor: ACCENT, color: ACCENT_FG, borderColor: ACCENT }
              : { color: ACCENT, borderColor: ACCENT }}>
            {text}
          </Link>
        </div>
      ),
    },
    Features: {
      label: "Feature row (3)",
      fields: {
        title: { type: "text" },
        items: {
          type: "array", arrayFields: { heading: { type: "text" }, body: { type: "textarea" } },
          defaultItemProps: { heading: "Feature", body: "Describe it." },
        },
      },
      defaultProps: {
        title: "Why us",
        items: [
          { heading: "Fresh", body: "Caught daily." },
          { heading: "Local", body: "Cape Town sourced." },
          { heading: "Delivered", body: "To your door." },
        ],
      },
      render: ({ title, items }) => (
        <section className={`${wrap} py-12`}>
          {title ? <h2 className="text-3xl font-bold text-center mb-8" style={{ color: INK }}>{title}</h2> : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(items || []).map((it, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2" style={{ color: INK }}>{it.heading}</h3>
                <p className="text-gray-600 text-sm">{it.body}</p>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    Spacer: {
      label: "Spacer",
      fields: { size: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] } },
      defaultProps: { size: "md" },
      render: ({ size }) => <div className={size === "sm" ? "h-6" : size === "lg" ? "h-24" : "h-12"} />,
    },
    ProductGrid: {
      label: "Product grid (live)",
      fields: {
        title: { type: "text" },
        category: { type: "text", label: "Category key (blank = all)" },
        count: { type: "number", label: "Max products" },
        linkBase: { type: "text", label: "Product link base" },
      },
      defaultProps: { title: "Shop the range", category: "", count: 8, linkBase: "/shop" },
      render: (props) => <LiveProducts {...props} mode="all" />,
    },
    FeaturedProducts: {
      label: "Featured products (live)",
      fields: {
        title: { type: "text" },
        count: { type: "number", label: "Max products" },
        linkBase: { type: "text", label: "Product link base" },
      },
      defaultProps: { title: "Today's catch", count: 4, linkBase: "/shop" },
      render: (props) => <LiveProducts {...props} mode="featured" />,
    },
    CategoryNav: {
      label: "Category tiles (live)",
      fields: { title: { type: "text" }, linkBase: { type: "text", label: "Shop link base" } },
      defaultProps: { title: "Browse by category", linkBase: "/shop" },
      render: (props) => <LiveCategories {...props} />,
    },
    TwoColumns: {
      label: "Two columns",
      fields: {
        leftImage: { type: "text", label: "Left image URL (blank = text only)" },
        leftHeading: { type: "text", label: "Left heading" },
        leftBody: { type: "textarea", label: "Left body" },
        rightImage: { type: "text", label: "Right image URL (blank = text only)" },
        rightHeading: { type: "text", label: "Right heading" },
        rightBody: { type: "textarea", label: "Right body" },
      },
      defaultProps: {
        leftImage: "", leftHeading: "Our story", leftBody: "Tell it here.",
        rightImage: "", rightHeading: "What makes us different", rightBody: "Tell it here.",
      },
      render: ({ leftImage, leftHeading, leftBody, rightImage, rightHeading, rightBody }) => (
        <section className={`${wrap} py-10 grid gap-8`} style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {[{ img: leftImage, h: leftHeading, b: leftBody }, { img: rightImage, h: rightHeading, b: rightBody }].map((col, i) => (
            <div key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {col.img ? <img src={col.img} alt="" className="w-full rounded-xl mb-4 object-cover" style={{ maxHeight: 240 }} /> : null}
              {col.h ? <h3 className="text-xl font-extrabold mb-2" style={{ color: INK }}>{col.h}</h3> : null}
              {col.b ? <p className="text-gray-600 leading-relaxed whitespace-pre-line">{col.b}</p> : null}
            </div>
          ))}
        </section>
      ),
    },
    Gallery: {
      label: "Gallery",
      fields: {
        title: { type: "text" },
        images: {
          type: "array",
          arrayFields: { src: { type: "text", label: "Image URL" }, alt: { type: "text" } },
          defaultItemProps: { src: "", alt: "" },
        },
      },
      defaultProps: { title: "Gallery", images: [] },
      render: ({ title, images }) => (
        <section className={`${wrap} py-10`}>
          {title ? <h2 className="text-3xl font-extrabold text-center mb-7" style={{ color: INK }}>{title}</h2> : null}
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))" }}>
            {(images || []).filter((im) => im.src).map((im, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={im.src} alt={im.alt || ""} className="w-full rounded-xl object-cover" style={{ height: 160 }} />
            ))}
          </div>
          {(!images || images.every((im) => !im.src)) && <p className="text-center text-gray-400">Add images in the editor →</p>}
        </section>
      ),
    },
    Testimonials: {
      label: "Testimonials",
      fields: {
        title: { type: "text" },
        items: {
          type: "array",
          arrayFields: { quote: { type: "textarea" }, author: { type: "text" }, role: { type: "text", label: "Role / location" } },
          defaultItemProps: { quote: "They made it so easy.", author: "A happy customer", role: "" },
        },
      },
      defaultProps: { title: "What customers say", items: [{ quote: "They made it so easy.", author: "A happy customer", role: "" }] },
      render: ({ title, items }) => (
        <section className={`${wrap} py-10`}>
          {title ? <h2 className="text-3xl font-extrabold text-center mb-7" style={{ color: INK }}>{title}</h2> : null}
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
            {(items || []).map((it, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 p-6" style={{ background: "#fafafa" }}>
                <p className="italic text-gray-700 leading-relaxed mb-3">&ldquo;{it.quote}&rdquo;</p>
                <div className="font-bold text-sm" style={{ color: INK }}>{it.author}</div>
                {it.role ? <div className="text-gray-400 text-xs">{it.role}</div> : null}
              </div>
            ))}
          </div>
        </section>
      ),
    },
    VideoEmbed: {
      label: "Video",
      fields: { url: { type: "text", label: "YouTube / Vimeo / direct video URL" }, caption: { type: "text" } },
      defaultProps: { url: "", caption: "" },
      render: ({ url, caption }) => {
        const yt = (url || "").match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]+)/);
        const vimeo = (url || "").match(/vimeo\.com\/(\d+)/);
        const embedSrc = yt ? `https://www.youtube.com/embed/${yt[1]}` : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null;
        return (
          <section className={`${wrap} py-10`}>
            <div className="relative rounded-2xl overflow-hidden" style={{ paddingTop: "56.25%", background: "#000" }}>
              {embedSrc ? (
                <iframe src={embedSrc} title={caption || "Video"} allowFullScreen className="absolute inset-0 w-full h-full border-0" />
              ) : url ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={url} controls className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Add a video URL →</div>
              )}
            </div>
            {caption ? <p className="text-center text-gray-400 text-sm mt-2.5">{caption}</p> : null}
          </section>
        );
      },
    },
    WhatsAppCTA: {
      label: "WhatsApp button",
      fields: {
        phone: { type: "text", label: "Phone (27…, no +)" },
        message: { type: "text", label: "Pre-filled message" },
        buttonText: { type: "text" },
      },
      defaultProps: { phone: "", message: "Hi! I'd like to order.", buttonText: "💬 Chat on WhatsApp" },
      render: ({ phone, message, buttonText }) => {
        const n = (phone || "").replace(/\D/g, "");
        const href = n ? `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ""}` : "#";
        return (
          <div className={`${wrap} py-6 text-center`}>
            <a href={href} target="_blank" rel="noreferrer" className="inline-block rounded-full px-8 py-3.5 font-bold text-white text-base no-underline"
              style={{ background: "#25D366" }}>{buttonText}</a>
          </div>
        );
      },
    },
    ContactCard: {
      label: "Contact card",
      fields: {
        title: { type: "text" },
        phone: { type: "text" }, email: { type: "text" },
        address: { type: "textarea" }, hours: { type: "textarea" },
      },
      defaultProps: { title: "Get in touch", phone: "", email: "", address: "", hours: "" },
      render: ({ title, phone, email, address, hours }) => (
        <section className={`${wrap} py-10`}>
          <div className="rounded-2xl border border-gray-200 p-7 mx-auto" style={{ maxWidth: 420 }}>
            {title ? <h3 className="text-xl font-extrabold mb-3.5" style={{ color: INK }}>{title}</h3> : null}
            {phone ? <p className="my-1.5 text-gray-700">📞 <a href={`tel:${phone}`} className="text-gray-700">{phone}</a></p> : null}
            {email ? <p className="my-1.5 text-gray-700">✉️ <a href={`mailto:${email}`} className="text-gray-700">{email}</a></p> : null}
            {address ? <p className="my-1.5 text-gray-700 whitespace-pre-line">📍 {address}</p> : null}
            {hours ? <p className="my-1.5 text-gray-700 whitespace-pre-line">🕐 {hours}</p> : null}
          </div>
        </section>
      ),
    },
    AnnouncementBar: {
      label: "Announcement bar",
      fields: { text: { type: "text" }, linkText: { type: "text", label: "Link text (optional)" }, href: { type: "text" } },
      defaultProps: { text: "🎉 Free delivery on orders over R500", linkText: "", href: "" },
      render: ({ text, linkText, href }) => (
        <div className="text-center text-sm font-semibold py-2.5 px-4" style={{ background: ACCENT, color: ACCENT_FG }}>
          {text} {linkText ? <a href={href || "#"} className="underline ml-1.5" style={{ color: ACCENT_FG }}>{linkText}</a> : null}
        </div>
      ),
    },
    Divider: {
      label: "Divider",
      fields: { style: { type: "select", options: [{ label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }] } },
      defaultProps: { style: "solid" },
      render: ({ style }) => (
        <div className={`${wrap} py-2`}>
          <hr style={{ border: "none", borderTop: `1px ${style || "solid"} #e5e5e5` }} />
        </div>
      ),
    },
  },
};

/* ── Live product blocks (synced from vula_dashboard/src/puck/config.jsx 2026-07-17 — keep block
   names/props IN SYNC across dashboard + off_the_hook + kelp copies). Tenant + API come from
   window.__VULA_PAGE_TENANT/__VULA_API set by PuckRender; sale-aware pricing (migration 073). */
// eslint-disable-next-line
import { useEffect, useState } from "react";

function pageTenant() {
  return (typeof window !== "undefined" && (window as unknown as Record<string, string>).__VULA_PAGE_TENANT) || "off-the-hook";
}
function apiBase() {
  return (typeof window !== "undefined" && (window as unknown as Record<string, string>).__VULA_API) || "https://vula-group-production.up.railway.app";
}
type LiveProduct = {
  id?: string; slug: string; name: string; category?: string; sold_by?: string;
  price_cents?: number; sale_price_cents?: number | null; sale_ends_at?: string | null;
  image_url?: string | null; images?: string[] | null; is_daily_catch?: boolean;
  variant_price_range?: { min: number; max: number } | null;
};

function priceParts(p: LiveProduct) {
  const base = p.price_cents || 0;
  const sale = p.sale_price_cents;
  const active = sale && (!p.sale_ends_at || new Date(p.sale_ends_at) > new Date());
  return { now: active ? sale : base, was: active ? base : null };
}
const R = (c: number) => `R${(c / 100).toFixed(2)}`;

function LiveProducts({ title, category, count, linkBase, mode }: { title?: string; category?: string; count?: number; linkBase?: string; mode: "all" | "featured" }) {
  const [products, setProducts] = useState<LiveProduct[] | null>(null);
  useEffect(() => {
    fetch(`${apiBase()}/v1/commerce/${pageTenant()}/products`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || d || []))
      .catch(() => setProducts([]));
  }, []);
  let rows = products || [];
  if (mode === "featured") rows = rows.filter((p) => p.is_daily_catch);
  if (category) rows = rows.filter((p) => p.category === category);
  rows = rows.slice(0, count || 8);
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {title ? <h2 className="text-3xl font-extrabold text-center mb-7" style={{ color: INK }}>{title}</h2> : null}
      {products === null ? (
        <p className="text-center text-gray-400">Loading products…</p>
      ) : rows.length === 0 ? (
        <p className="text-center text-gray-400">No products to show yet.</p>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}>
          {rows.map((p) => {
            const pr = priceParts(p);
            const img = (p.images && p.images[0]) || p.image_url;
            return (
              <a key={p.id || p.slug} href={`${linkBase || "/shop"}/${p.slug}`}
                 className="block rounded-2xl border border-gray-200 overflow-hidden bg-white no-underline" style={{ color: INK }}>
                <div className="h-36 bg-gray-100" style={{ backgroundImage: img ? `url(${img})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div className="px-3 py-2.5">
                  <div className="font-semibold text-sm mb-1">{p.name}</div>
                  <div className="text-sm">
                    {p.variant_price_range ? (
                      <span className="font-bold" style={{ color: "var(--brand-accent, #0E7C7B)" }}>
                        {p.variant_price_range.min === p.variant_price_range.max ? R(p.variant_price_range.min) : `From ${R(p.variant_price_range.min)}`}
                      </span>
                    ) : (<>
                      <span className="font-bold" style={{ color: "var(--brand-accent, #0E7C7B)" }}>{R(pr.now)}</span>
                      {pr.was ? <span className="ml-1.5 text-gray-400 line-through text-xs">{R(pr.was)}</span> : null}
                      <span className="text-gray-400 text-xs">{p.sold_by === "kg" ? " /kg" : ""}</span>
                    </>)}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

function LiveCategories({ title, linkBase }: { title?: string; linkBase?: string }) {
  const [cats, setCats] = useState<{ key: string; n: number }[] | null>(null);
  useEffect(() => {
    fetch(`${apiBase()}/v1/commerce/${pageTenant()}/products`)
      .then((r) => r.json())
      .then((d) => {
        const rows = d.products || d || [];
        const seen: Record<string, number> = {};
        rows.forEach((p: LiveProduct) => { if (p.category) seen[p.category] = (seen[p.category] || 0) + 1; });
        setCats(Object.entries(seen).map(([key, n]) => ({ key, n: n as number })));
      })
      .catch(() => setCats([]));
  }, []);
  const label = (k: string) => k.replace(/_/g, " ").replace(/\w/g, (c) => c.toUpperCase());
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {title ? <h2 className="text-3xl font-extrabold text-center mb-7" style={{ color: INK }}>{title}</h2> : null}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
        {(cats || []).map((c) => (
          <a key={c.key} href={`${linkBase || "/shop"}?category=${c.key}`}
             className="no-underline text-center py-6 px-3 rounded-2xl border border-gray-200 bg-white" style={{ color: INK }}>
            <div className="font-bold text-[15px]">{label(c.key)}</div>
            <div className="text-gray-400 text-xs mt-1">{c.n} item{c.n === 1 ? "" : "s"}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default config;

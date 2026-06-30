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
  ImageBlock: { src: string; alt: string };
  CTA: { text: string; href: string; variant: "solid" | "outline" };
  Features: { title: string; items: { heading: string; body: string }[] };
  Spacer: { size: "sm" | "md" | "lg" };
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
      fields: { src: { type: "text", label: "Image URL" }, alt: { type: "text" } },
      defaultProps: { src: "", alt: "" },
      render: ({ src, alt }) => (
        <div className={`${wrap} py-6`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {src ? <img src={src} alt={alt} className="w-full object-cover rounded-2xl" /> : <div className="h-48 bg-gray-100 rounded-2xl" />}
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
  },
};

export default config;

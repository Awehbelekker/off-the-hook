/**
 * Off the Hook logo component.
 *
 * Priority order:
 *   1. PNG from /images/logo.png (drop the file into public/images/ to activate)
 *   2. Inline SVG fallback (built from the brand colours — always looks clean)
 *
 * To use the real PNG:
 *   Copy the Off the Hook logo PNG to:
 *   C:\Users\Ian\Vula-Group\off_the_hook\public\images\logo.png
 *   Then change USE_PNG to true below.
 */

import Image from "next/image"

const USE_PNG = true    // ← logo.png saved to public/images/ — using real logo

type LogoProps = {
  /** pixel width — height scales proportionally (logo is ~1:1 square) */
  size?: number
  className?: string
  /** Show text beneath the fish (matches the real logo) */
  showText?: boolean
}

export default function Logo({ size = 48, className = "", showText = true }: LogoProps) {
  if (USE_PNG) {
    return (
      <Image
        src="/images/logo.png"
        alt="Off the Hook"
        width={size}
        height={size}
        className={className}
        priority
      />
    )
  }

  // ── SVG approximation — matches the real logo colours and shapes ─────────────
  // Navy fish (#1B3A6B), teal hook + waves (#0099C8), script text
  return (
    <svg
      width={size}
      height={showText ? Math.round(size * 1.55) : size}
      viewBox={showText ? "0 0 200 310" : "0 0 200 200"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Off the Hook logo"
    >
      {/* ── Fish body ── */}
      <ellipse cx="100" cy="88" rx="66" ry="46" fill="#1B3A6B" />

      {/* ── Tail fin ── */}
      <path d="M34 88 L10 62 L10 114 Z" fill="#1B3A6B" />

      {/* ── Eye (white circle with navy centre) ── */}
      <circle cx="138" cy="78" r="9" fill="white" />
      <circle cx="139" cy="77" r="4" fill="#1B3A6B" />

      {/* ── Hook (teal) — circle eye of hook at top, J-curve down and left ── */}
      {/* Eye of hook — small circle top-right */}
      <circle cx="162" cy="62" r="9" stroke="#0099C8" strokeWidth="6" fill="none" />
      {/* Shaft going down */}
      <line x1="162" y1="71" x2="162" y2="148" stroke="#0099C8" strokeWidth="6" strokeLinecap="round" />
      {/* Bend — J curve at bottom curving left */}
      <path
        d="M162 148 Q162 168 144 168 Q126 168 126 152"
        stroke="#0099C8"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Barb tip */}
      <path d="M126 152 L118 145" stroke="#0099C8" strokeWidth="5" strokeLinecap="round" />

      {/* ── Waves ── */}
      <path
        d="M20 178 Q38 166 56 178 Q74 190 92 178 Q110 166 128 178 Q146 190 164 178 Q176 170 184 174"
        stroke="#0099C8"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12 196 Q30 184 48 196 Q66 208 84 196 Q102 184 120 196 Q138 208 156 196 Q170 188 180 192"
        stroke="#0099C8"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* ── Text: "Off the Hook" in script style ── */}
      {showText && (
        <>
          <text
            x="100"
            y="246"
            textAnchor="middle"
            fill="#1a6b8a"
            fontSize="28"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            letterSpacing="1"
          >
            Off the
          </text>
          <text
            x="100"
            y="284"
            textAnchor="middle"
            fill="#1a6b8a"
            fontSize="44"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontWeight="700"
            letterSpacing="1"
          >
            Hook
          </text>
        </>
      )}
    </svg>
  )
}

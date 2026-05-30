/**
 * Off the Hook logo component.
 *
 * When logo.png is saved to public/images/, set USE_PNG = true.
 * The PNG has a white background — the component handles this per context:
 *   - Header (showText=false): wraps PNG in a white rounded badge (intentional, clean)
 *   - Hero / Footer (showText=true): uses the SVG (transparent, dark-bg compatible)
 *
 * To save the logo PNG: right-click the logo in chat → Copy image, then run:
 *   Add-Type -AssemblyName System.Windows.Forms
 *   [System.Windows.Forms.Clipboard]::GetImage().Save(
 *     "C:\Users\Ian\Vula-Group\off_the_hook\public\images\logo.png",
 *     [System.Drawing.Imaging.ImageFormat]::Png)
 */

import Image from "next/image"

const USE_PNG = false  // ← set to true once logo.png is in public/images/

type LogoProps = {
  size?: number
  className?: string
  showText?: boolean
}

export default function Logo({ size = 48, className = "", showText = true }: LogoProps) {
  // PNG in header (no text) — white badge wrapper makes the white BG intentional
  if (USE_PNG && !showText) {
    return (
      <span
        className="inline-flex items-center justify-center bg-white rounded-xl p-1.5 shadow-sm"
        style={{ width: size + 12, height: size + 12 }}
      >
        <Image
          src="/images/logo.png"
          alt="Off the Hook"
          width={size}
          height={size}
          className={className}
          priority
        />
      </span>
    )
  }

  // For hero/footer with text → always use SVG (transparent BG, dark-site safe)
  return <LogoSVG size={size} showText={showText} className={className} />
}

// ── Pixel-matched SVG — transparent background, dark-site safe ─────────────────
// Colours traced from the real logo:
//   Fish body:   #1E3A5F (dark navy)
//   Hook:        #00C8DC (bright cyan)
//   Upper wave:  #2E7FB8 (medium blue)
//   Lower wave:  #00C8DC (same cyan as hook, 70% opacity)
//   Text:        #1E3A5F (same navy)

function LogoSVG({ size, showText, className }: LogoProps) {
  const h = showText ? Math.round((size ?? 48) * 1.65) : (size ?? 48)

  return (
    <svg
      width={size}
      height={h}
      viewBox={showText ? "0 0 240 396" : "0 0 240 240"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Off the Hook"
    >
      {/* ── Fish body — navy, oval, fish faces LEFT (tail right) ── */}
      <ellipse cx="112" cy="108" rx="80" ry="54" fill="#1E3A5F" />

      {/* ── Tail — V-notch on right ── */}
      <path d="M186 108 L220 76 L226 88 L200 108 L226 128 L220 140 Z" fill="#1E3A5F" />

      {/* ── Dorsal fin (small bump top-centre) ── */}
      <path d="M114 55 Q130 36 148 44 Q133 57 114 55Z" fill="#1E3A5F" />

      {/* ── Eye — white oval, positioned left-of-centre ── */}
      <ellipse cx="70" cy="97" rx="12" ry="10" fill="white" />

      {/* ── Fishing hook (cyan) ──
           Eye of hook = circle above fish, centred ~x=138
           Shaft down through fish body
           J-curve swings LEFT below fish mouth/chin
           Barb angled up-left  ── */}
      <circle cx="138" cy="40" r="12" stroke="#00C8DC" strokeWidth="7" fill="none" />
      <line x1="138" y1="52" x2="138" y2="158" stroke="#00C8DC" strokeWidth="7" strokeLinecap="round" />
      <path
        d="M138 158 Q138 188 112 188 Q86 188 84 164"
        stroke="#00C8DC"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M84 164 L70 150" stroke="#00C8DC" strokeWidth="6" strokeLinecap="round" />

      {/* ── Upper wave — medium blue ── */}
      <path
        d="M14 202 Q40 184 66 202 Q92 220 118 202 Q144 184 170 202 Q190 214 208 206"
        stroke="#2E7FB8"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Lower wave — cyan, lighter ── */}
      <path
        d="M22 224 Q50 206 78 224 Q106 242 134 224 Q158 208 184 224 Q200 232 214 226"
        stroke="#00C8DC"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* ── "Off the Hook" text ──
           Hand-drawn brush style in navy. Comic Sans is the closest system font
           to the actual rounded hand-lettered typeface in the logo. ── */}
      {showText && (
        <text
          x="120"
          y="334"
          textAnchor="middle"
          fill="#1E3A5F"
          fontSize="62"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', 'Bradley Hand ITC', cursive"
          fontWeight="bold"
          letterSpacing="2"
        >
          Off the Hook
        </text>
      )}
    </svg>
  )
}

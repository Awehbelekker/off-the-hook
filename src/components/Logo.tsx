/**
 * Off the Hook logo — official brand mark.
 *
 * Uses the real logo (public/images/logo.png), which has a cream/white
 * background that blends with the cream site background.
 *
 *   showText = true   → full logo (fish + waves + "Off the Hook" wordmark)
 *   showText = false  → same logo, sized compact for the header
 *
 * `size` controls the rendered height; width scales with the logo's aspect.
 */

import Image from "next/image"

type LogoProps = {
  size?: number
  className?: string
  showText?: boolean
}

// Official logo aspect ratio (width : height) ≈ 1.2
const ASPECT = 1.2

export default function Logo({ size = 48, className = "", showText = true }: LogoProps) {
  // Header use (no wordmark needed) — render the mark at the given size.
  // Hero/footer — render larger to show the full wordmark.
  const height = showText ? size : Math.round(size * 0.9)
  const width = Math.round(height * ASPECT)

  return (
    <Image
      src="/images/logo.png"
      alt="Off the Hook — quality food delivered to your door"
      width={width}
      height={height}
      className={className}
      priority
      style={{ height: "auto", width: width }}
    />
  )
}

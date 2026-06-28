"use client"

import { useState } from "react"
import Image from "next/image"

type LogoProps = {
  size?: number
  className?: string
  showText?: boolean
}

const ASPECT = 1.2

export default function Logo({ size = 48, className = "", showText = true }: LogoProps) {
  const [useFallback, setUseFallback] = useState(false)
  const height = showText ? size : Math.round(size * 0.9)
  const width = Math.round(height * ASPECT)

  if (useFallback) {
    return (
      <Image
        src="/images/logo.svg"
        alt="Off the Hook — quality food delivered to your door"
        width={width}
        height={height}
        className={className}
        priority
        style={{ height: "auto", width }}
      />
    )
  }

  return (
    <Image
      src="/images/logo.png"
      alt="Off the Hook — quality food delivered to your door"
      width={width}
      height={height}
      className={className}
      priority
      onError={() => setUseFallback(true)}
      style={{ height: "auto", width }}
    />
  )
}

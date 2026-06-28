"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/lib/settings"

const StoreSettingsContext = createContext<StoreSettings>(DEFAULT_STORE_SETTINGS)

export function StoreSettingsProvider({
  settings,
  children,
}: {
  settings: StoreSettings
  children: ReactNode
}) {
  const [value, setValue] = useState(settings)

  useEffect(() => {
    fetch("/admin/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setValue({ ...DEFAULT_STORE_SETTINGS, ...data })
      })
      .catch(() => {})
  }, [])

  return (
    <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>
  )
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext)
}

export function calcDeliveryCents(subtotalCents: number, settings: StoreSettings): number {
  if (subtotalCents >= settings.free_delivery_threshold_cents) return 0
  return settings.delivery_fee_cents
}

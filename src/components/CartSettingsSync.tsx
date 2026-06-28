"use client"

import { useEffect } from "react"
import { useCartStore } from "@/store/cart"
import { useStoreSettings } from "@/components/StoreSettingsProvider"

export default function CartSettingsSync() {
  const settings = useStoreSettings()
  const setDeliverySettings = useCartStore((s) => s.setDeliverySettings)

  useEffect(() => {
    setDeliverySettings(settings.delivery_fee_cents, settings.free_delivery_threshold_cents)
  }, [settings.delivery_fee_cents, settings.free_delivery_threshold_cents, setDeliverySettings])

  return null
}

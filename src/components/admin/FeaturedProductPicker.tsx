"use client"

import type { Product } from "@/lib/api"
import { formatProductPrice } from "@/lib/pricing"

type FeaturedProductPickerProps = {
  products: Product[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  max?: number
}

export default function FeaturedProductPicker({
  products,
  selectedIds,
  onChange,
  max = 8,
}: FeaturedProductPickerProps) {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
      return
    }
    if (selectedIds.length >= max) return
    onChange([...selectedIds, id])
  }

  if (products.length === 0) {
    return <p className="font-sans text-sm text-vula-muted">No products loaded.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-sans text-xs text-vula-muted">
        Pick up to {max} products for the homepage grid ({selectedIds.length}/{max} selected)
      </p>
      <ul className="max-h-64 overflow-auto border border-vula-border rounded-input divide-y divide-vula-border bg-white">
        {products.map((p) => {
          const checked = selectedIds.includes(p.id)
          const disabled = !checked && selectedIds.length >= max
          return (
            <li key={p.id}>
              <label
                className={[
                  "flex items-center gap-3 px-3 py-2.5 cursor-pointer font-sans text-sm",
                  disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-vula-cream",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(p.id)}
                  className="shrink-0"
                />
                <span className="flex-1 truncate">{p.name}</span>
                <span className="text-xs text-vula-muted shrink-0">{formatProductPrice(p)}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

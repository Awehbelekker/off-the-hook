export const WHATSAPP_E164 = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27791783933"
export const WHATSAPP_DISPLAY = "+27 79 178 3933"
export const WHATSAPP_DISPLAY_LOCAL = "079 178 3933"

export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

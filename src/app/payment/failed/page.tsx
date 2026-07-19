import Link from "next/link"
import { AlertTriangle, ShoppingCart, MessageCircle } from "lucide-react"
import { whatsappLink } from "@/lib/whatsapp"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Payment failed" }

// The payment gateway redirects here on a FAILED payment (backend failureUrl) — this route
// was missing, so failed payers landed on a 404. Mirrors /payment/cancel with failure copy.
export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <AlertTriangle size={64} className="text-vula-muted mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="font-display text-5xl font-semibold mb-3">Payment didn&apos;t go through</h1>
        <p className="font-sans text-vula-muted mb-8">
          Your card wasn&apos;t charged. Your cart is still saved — you can try again, or message us
          on WhatsApp and we&apos;ll sort it out together.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/checkout" className="btn-primary w-full justify-center">
            <ShoppingCart size={18} />
            Try again
          </Link>
          <a
            href={whatsappLink("Hi, my payment failed and I need help completing my order")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost w-full justify-center"
          >
            <MessageCircle size={18} className="text-vula-green" />
            Get help on WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}

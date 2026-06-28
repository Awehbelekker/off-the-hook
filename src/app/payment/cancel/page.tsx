import Link from "next/link"
import { XCircle, ShoppingCart, MessageCircle } from "lucide-react"
import { whatsappLink } from "@/lib/whatsapp"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Payment cancelled" }

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <XCircle size={64} className="text-vula-muted mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="font-display text-5xl font-semibold mb-3">Payment cancelled</h1>
        <p className="font-sans text-vula-muted mb-8">
          Your order wasn't completed. Your cart is still saved — you can try again or message us on WhatsApp.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/checkout" className="btn-primary w-full justify-center">
            <ShoppingCart size={18} />
            Try again
          </Link>
          <a
            href={whatsappLink("Hi, I had trouble completing my payment")}
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

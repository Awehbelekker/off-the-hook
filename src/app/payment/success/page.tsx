import Link from "next/link"
import { CheckCircle, MessageCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Order confirmed" }

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <CheckCircle size={64} className="text-vula-green mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="font-display text-5xl font-semibold mb-3">Order confirmed!</h1>
        <p className="font-sans text-vula-muted mb-2">
          Payment received. We've sent your confirmation to your WhatsApp.
        </p>
        {order && (
          <p className="font-sans text-xs text-vula-muted mb-8">
            Reference: <span className="text-vula-dark font-semibold">{order.slice(-8).toUpperCase()}</span>
          </p>
        )}

        <div className="card text-left mb-8">
          <h2 className="font-display text-xl font-semibold mb-3">What happens next</h2>
          <ol className="flex flex-col gap-3">
            {[
              "We'll WhatsApp you a confirmation with your order details",
              "Your catch is packed fresh in cold-chain boxes",
              "Driver dispatches at your chosen delivery slot",
              "You'll get a WhatsApp with your driver's ETA",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 font-sans text-sm text-vula-muted">
                <span className="font-display text-vula-green font-semibold text-base shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/27737815979"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center"
          >
            <MessageCircle size={18} />
            Message us on WhatsApp
          </a>
          <Link href="/shop" className="btn-ghost w-full justify-center">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}

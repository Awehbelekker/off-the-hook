import Link from "next/link"
import { WHATSAPP_DISPLAY_LOCAL } from "@/lib/whatsapp"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Off the Hook collects, uses, and protects your personal information under POPIA.",
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12 pb-28 md:pb-12">
        <h1 className="font-display text-4xl font-semibold mb-2">Privacy Policy</h1>
        <p className="font-sans text-sm text-vula-muted mb-10">Last updated: June 2026 · POPIA compliant</p>

        <div className="prose-vula flex flex-col gap-8 font-sans text-sm text-vula-dark leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">Who we are</h2>
            <p>
              Off the Hook (&quot;we&quot;, &quot;us&quot;) delivers fresh fish, chicken, and frozen seafood in Cape Town.
              Contact:{" "}
              <a href="mailto:info@offthehook.capetown" className="text-vula-green underline">
                info@offthehook.capetown
              </a>{" "}
              · WhatsApp {WHATSAPP_DISPLAY_LOCAL}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">Information we collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-vula-muted">
              <li>Name, phone number, and delivery address when you place an order</li>
              <li>Email address if you provide it at checkout</li>
              <li>Order history linked to your WhatsApp number</li>
              <li>Payment is processed by Yoco — we do not store card details</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">How we use your data</h2>
            <ul className="list-disc pl-5 space-y-2 text-vula-muted">
              <li>Fulfilling and delivering your orders</li>
              <li>Contacting you about delivery times or order issues</li>
              <li>Improving our products and service</li>
            </ul>
            <p className="mt-3 text-vula-muted">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">Your rights (POPIA)</h2>
            <p className="text-vula-muted">
              You may request access to, correction of, or deletion of your personal data.
              Message us on WhatsApp or email to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-3">Cookies &amp; local storage</h2>
            <p className="text-vula-muted">
              We use browser local storage to remember your shopping cart between visits.
              No advertising or tracking cookies are used.
            </p>
          </section>
        </div>

        <Link href="/shop" className="btn-ghost mt-12 inline-flex">
          Back to shop
        </Link>
      </main>
      <BottomNav />
    </>
  )
}

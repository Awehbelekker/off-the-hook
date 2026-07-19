import { ExternalLink } from "lucide-react"

const VULA_DASHBOARD_URL = "https://vuladashboard.vercel.app"

export default function AdminSettingsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-vula-dark mb-3">Settings moved</h1>
      <p className="font-sans text-sm text-vula-dark/70 mb-6 leading-relaxed">
        Store settings (hero copy, announcements, delivery fees, cutoff time, featured products)
        now live in the Vula dashboard, not here — one place to manage every storefront instead
        of two admins that could silently drift apart.
      </p>
      <a
        href={`${VULA_DASHBOARD_URL}/`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-input bg-vula-dark text-vula-cream font-sans text-sm hover:bg-vula-dark/90 transition-colors"
      >
        Open the Vula dashboard
        <ExternalLink size={16} />
      </a>
    </div>
  )
}

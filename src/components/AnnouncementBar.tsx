"use client"

const messages = [
  "🐟  Fresh fish this week: Yellowfin Tuna R290/kg · Hake R160/kg · Kingklip R240/kg",
  "🐓  Pasture-raised chicken — GMO-free · No hormones · No brine",
  "🦐  Frozen seafood packs — Calamari, Prawns, Mussels & more",
  "📦  Order by 10am for same-day delivery — Cape Town",
  "🟢  WhatsApp ordering: +27 73 781 5979 — reply in minutes",
  "✅  All items sold by weight — what you order is what you pay for",
]

export default function AnnouncementBar() {
  const doubled = [...messages, ...messages]

  return (
    <div className="bg-vula-dark overflow-hidden py-2.5">
      <div className="flex scroll-x whitespace-nowrap">
        {doubled.map((msg, i) => (
          <span key={i} className="font-sans text-xs font-medium text-vula-cream/90 px-8 shrink-0 tracking-wide">
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}

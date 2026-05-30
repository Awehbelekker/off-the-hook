"use client"

const messages = [
  "🐟  Free delivery on orders over R500 — Cape Town",
  "🦞  Daily catch from Hout Bay & Kalk Bay fishermen",
  "📦  Order by 10am for same-day morning delivery",
  "⭐  HelloPeter 4.9 · Google 4.8 — Cape Town's top rated",
  "🟢  WhatsApp ordering: +27 73 781 5979 — reply in minutes",
]

export default function AnnouncementBar() {
  const doubled = [...messages, ...messages]

  return (
    <div className="bg-vula-green overflow-hidden py-2">
      <div className="flex scroll-x whitespace-nowrap">
        {doubled.map((msg, i) => (
          <span key={i} className="font-sans text-xs text-vula-cream/90 px-8 shrink-0">
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}

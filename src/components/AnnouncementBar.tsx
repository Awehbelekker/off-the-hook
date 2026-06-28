"use client"

type AnnouncementBarProps = {
  messages: string[]
}

export default function AnnouncementBar({ messages }: AnnouncementBarProps) {
  const items = messages.length > 0 ? messages : ["Welcome to Off the Hook — Cape Town fresh delivery"]
  const doubled = [...items, ...items]

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

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const messages = [
  'Free shipping on orders over ₹999',
  'New season — heavyweight essentials, restocked',
  'Buy 2 or more — automatic 15% off applied at cart',
  'Crafted for every day. Built to last.',
]

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  // Duplicate the message list so the marquee loop is seamless
  const loop = [...messages, ...messages]

  return (
    <div className="relative bg-foreground text-background">
      <div className="container-custom flex items-center justify-center py-2.5 text-[11px] uppercase tracking-[0.18em]">
        <div className="overflow-hidden flex-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {loop.map((msg, i) => (
              <span key={i} className="inline-flex items-center gap-12">
                {msg}
                <span aria-hidden className="opacity-40">◆</span>
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 sm:right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'

interface SaleBannerProps {
  /** Hours until sale ends. Default: 36 */
  endsInHours?: number
  label?: string
}

/**
 * Slim urgency banner shown at the top of the product page when a variant
 * is on sale. Renders a live-updating countdown (HH:MM:SS) anchored to a
 * stable end-of-sale timestamp stored in sessionStorage so it doesn't
 * reset on every navigation.
 */
export default function SaleBanner({ endsInHours = 36, label = 'Limited drop' }: SaleBannerProps) {
  const [now, setNow] = useState<number | null>(null)
  const [endAt, setEndAt] = useState<number | null>(null)

  useEffect(() => {
    const STORAGE_KEY = 'sale_ends_at'
    const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem(STORAGE_KEY) : null
    let target: number
    if (stored) {
      target = parseInt(stored, 10)
      if (Number.isNaN(target) || target < Date.now()) {
        target = Date.now() + endsInHours * 60 * 60 * 1000
        window.sessionStorage.setItem(STORAGE_KEY, String(target))
      }
    } else {
      target = Date.now() + endsInHours * 60 * 60 * 1000
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEY, String(target))
      }
    }
    setEndAt(target)
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [endsInHours])

  if (now == null || endAt == null) {
    return (
      <div className="bg-foreground text-background">
        <div className="container-custom py-2.5 text-center text-[11px] uppercase tracking-[0.22em] font-semibold">
          {label} — Sale ending soon
        </div>
      </div>
    )
  }

  const remaining = Math.max(0, endAt - now)
  const hours = Math.floor(remaining / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="bg-foreground text-background">
      <div className="container-custom flex items-center justify-center gap-3 py-2.5 text-[11px] uppercase tracking-[0.22em] font-semibold flex-wrap">
        <Flame className="h-3.5 w-3.5" strokeWidth={2} />
        <span>{label} — sale ends in</span>
        <span className="tabular">
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      </div>
    </div>
  )
}

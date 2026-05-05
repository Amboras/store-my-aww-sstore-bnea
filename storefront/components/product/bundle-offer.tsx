'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'

export type BundleTier = 'single' | 'double' | 'triple'

interface BundleOfferProps {
  unitPriceCents: number
  currency: string
  selected: BundleTier
  onChange: (tier: BundleTier) => void
}

interface Tier {
  id: BundleTier
  qty: number
  discount: number // 0–1
  label: string
  badge?: string
}

const TIERS: Tier[] = [
  { id: 'single', qty: 1, discount: 0, label: 'One piece' },
  { id: 'double', qty: 2, discount: 0.15, label: 'Buy 2', badge: 'Most popular — Save 15%' },
  { id: 'triple', qty: 3, discount: 0.20, label: 'Buy 3', badge: 'Best value — Save 20%' },
]

export default function BundleOffer({ unitPriceCents, currency, selected, onChange }: BundleOfferProps) {
  const [hovered, setHovered] = useState<BundleTier | null>(null)

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[11px] uppercase tracking-[0.22em] font-semibold">
          Build Your Bundle
        </h3>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Auto-applied at cart
        </span>
      </div>
      <div className="space-y-2">
        {TIERS.map((tier) => {
          const isActive = selected === tier.id
          const isHover = hovered === tier.id
          const totalCents = unitPriceCents * tier.qty
          const discountedCents = Math.round(totalCents * (1 - tier.discount))
          const savedCents = totalCents - discountedCents

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onChange(tier.id)}
              onMouseEnter={() => setHovered(tier.id)}
              onMouseLeave={() => setHovered(null)}
              className={`w-full text-left border transition-all duration-200 p-4 flex items-center gap-4 relative ${
                isActive
                  ? 'border-foreground bg-foreground/[0.03]'
                  : isHover
                    ? 'border-foreground/40'
                    : 'border-border'
              }`}
            >
              {/* Radio indicator */}
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border transition-colors ${
                  isActive ? 'border-foreground bg-foreground' : 'border-border'
                }`}
                aria-hidden
              >
                {isActive && <Check className="h-3 w-3 text-background" strokeWidth={3} />}
              </span>

              {/* Label & badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{tier.label}</span>
                  {tier.badge && (
                    <span className={`inline-block text-[10px] font-semibold uppercase tracking-[0.16em] px-1.5 py-0.5 ${
                      tier.id === 'double'
                        ? 'bg-foreground text-background'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
                    }`}>
                      {tier.badge}
                    </span>
                  )}
                </div>
                {tier.qty > 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {tier.qty} pieces · save {formatPrice(savedCents, currency)}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-semibold tabular">
                  {formatPrice(discountedCents, currency)}
                </p>
                {tier.discount > 0 && (
                  <p className="text-xs text-muted-foreground line-through tabular">
                    {formatPrice(totalCents, currency)}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

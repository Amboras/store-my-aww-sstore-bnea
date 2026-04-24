'use client'

import { Star } from 'lucide-react'

interface Props {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  onRate?: (rating: number) => void
  interactive?: boolean
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
}

export default function StarRating({
  rating,
  size = 'md',
  onRate,
  interactive = false,
}: Props) {
  const sizeClass = sizeClasses[size]

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating)
        const partial = !filled && star - rating < 1 && star - rating > 0

        const content = (
          <span className="relative inline-block">
            <Star
              className={`${sizeClass} ${
                filled ? 'fill-current text-amber-400' : 'text-muted-foreground/30'
              }`}
              strokeWidth={1.5}
            />
            {partial && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating - (star - 1)) * 100}%` }}
              >
                <Star
                  className={`${sizeClass} fill-current text-amber-400`}
                  strokeWidth={1.5}
                />
              </span>
            )}
          </span>
        )

        if (interactive && onRate) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onRate(star)}
              className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              {content}
            </button>
          )
        }

        return <span key={star}>{content}</span>
      })}
    </div>
  )
}

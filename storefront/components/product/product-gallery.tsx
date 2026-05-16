'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: { url: string }[]
  alt: string
  /** Optional eyebrow text floated over the top-left of the main image. */
  eyebrow?: string | null
}

const ACCENT_DOT = 'hsl(var(--accent))'

export default function ProductGallery({
  images,
  alt,
  eyebrow,
}: ProductGalleryProps) {
  const safeImages = images.length > 0 ? images : [{ url: '' }]
  const [activeIdx, setActiveIdx] = useState(0)

  // Bound the index if the images prop ever shrinks.
  useEffect(() => {
    if (activeIdx >= safeImages.length) setActiveIdx(0)
  }, [safeImages.length, activeIdx])

  // Left/right arrow keys when the gallery has focus.
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (safeImages.length <= 1) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setActiveIdx((i) => (i + 1) % safeImages.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setActiveIdx((i) => (i - 1 + safeImages.length) % safeImages.length)
      }
    },
    [safeImages.length],
  )

  return (
    <div
      className="space-y-3 sm:space-y-4"
      onKeyDown={onKey}
      role="group"
      aria-roledescription="image gallery"
      aria-label={`${alt} — image gallery`}
    >
      {/* Main image — Double-Bezel with cross-fade */}
      <div className="hev-shell rounded-[2rem] p-[6px]">
        <div className="hev-core relative aspect-[3/4] rounded-[calc(2rem-6px)] overflow-hidden">
          {safeImages.map((img, i) => (
            <Image
              key={img.url + i}
              src={img.url}
              alt={i === 0 ? alt : `${alt} — view ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{
                opacity: i === activeIdx ? 1 : 0,
                transform:
                  i === activeIdx ? 'scale(1)' : 'scale(1.02)',
                transition:
                  'opacity 500ms cubic-bezier(0.32, 0.72, 0, 1), transform 700ms cubic-bezier(0.32, 0.72, 0, 1)',
                pointerEvents: i === activeIdx ? 'auto' : 'none',
              }}
            />
          ))}

          {eyebrow && (
            <div className="absolute left-4 top-4 z-10">
              <span className="hev-eyebrow bg-background/75 backdrop-blur">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: ACCENT_DOT }}
                />
                {eyebrow}
              </span>
            </div>
          )}

          {/* Index counter — bottom-right, only with multiple images */}
          {safeImages.length > 1 && (
            <div className="absolute right-4 bottom-4 z-10">
              <span className="hev-eyebrow bg-background/75 backdrop-blur tabular-nums">
                {String(activeIdx + 1).padStart(2, '0')} / {String(safeImages.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {safeImages.length > 1 && (
        <div
          className="grid grid-cols-4 gap-3 sm:gap-4"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {safeImages.slice(0, 4).map((img, i) => {
            const isActive = i === activeIdx
            return (
              <button
                key={img.url + i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`View image ${i + 1} of ${safeImages.length}`}
                onClick={() => setActiveIdx(i)}
                className={`group block w-full hev-spring-fast ${
                  isActive
                    ? ''
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`hev-shell rounded-[1rem] p-[4px] hev-spring-fast ${
                    isActive ? '' : 'group-hover:-translate-y-[2px]'
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow:
                            'inset 0 0 0 1.5px hsl(var(--foreground) / 0.65), 0 1px 0 hsl(var(--background) / 0.6)',
                        }
                      : undefined
                  }
                >
                  <div className="hev-core relative aspect-[3/4] rounded-[calc(1rem-4px)] overflow-hidden">
                    <Image
                      src={img.url}
                      alt={`${alt} thumbnail ${i + 1}`}
                      fill
                      sizes="12vw"
                      className={`object-cover hev-spring-fast ${
                        isActive ? '' : 'group-hover:scale-[1.04]'
                      }`}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

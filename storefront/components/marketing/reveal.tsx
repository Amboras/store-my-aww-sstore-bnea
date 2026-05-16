'use client'

import { useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  /** Distance to translate from. Defaults to 32px. */
  y?: number
  /** Disable blur clear (cheaper on low-end devices). */
  noBlur?: boolean
}

/**
 * Heavy fade-rise + blur-clear entry tied to viewport intersection.
 * Mounts once, then disconnects — no scroll listener, no re-runs.
 * Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 32,
  noBlur = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    if (mq.matches) {
      setSeen(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translate3d(0,0,0)' : `translate3d(0, ${y}px, 0)`,
        filter: noBlur ? undefined : seen ? 'blur(0)' : 'blur(6px)',
        transition:
          'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1), filter 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        willChange: seen ? undefined : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

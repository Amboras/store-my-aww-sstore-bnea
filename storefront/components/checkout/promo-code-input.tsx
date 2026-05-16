'use client'

import { useState } from 'react'
import { X, Loader2, Tag, ChevronDown, ArrowUpRight } from 'lucide-react'

interface PromoCodeInputProps {
  appliedPromoCodes: string[]
  discountTotal: number
  currencyCode: string
  isApplyingPromo: boolean
  isRemovingPromo: boolean
  onApply: (code: string) => Promise<void>
  onRemove: (code: string) => Promise<void>
}

const STROKE = 1.25

export function PromoCodeInput({
  appliedPromoCodes,
  isApplyingPromo,
  isRemovingPromo,
  onApply,
  onRemove,
}: PromoCodeInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [removingCode, setRemovingCode] = useState<string | null>(null)

  const handleApply = async () => {
    const code = inputValue.trim().toUpperCase()
    if (!code) return

    if (appliedPromoCodes.includes(code)) {
      setError('This code is already applied.')
      return
    }

    setError(null)
    try {
      await onApply(code)
      setInputValue('')
    } catch (err: any) {
      const msg: string = err?.message || ''
      if (
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('invalid')
      ) {
        setError('This promo code is not valid.')
      } else if (
        msg.toLowerCase().includes('expired') ||
        msg.toLowerCase().includes('ended')
      ) {
        setError('This promo code has expired.')
      } else if (
        msg.toLowerCase().includes('limit') ||
        msg.toLowerCase().includes('budget')
      ) {
        setError('This promo code is no longer available.')
      } else {
        setError('Could not apply this code. Please try again.')
      }
    }
  }

  const handleRemove = async (code: string) => {
    setRemovingCode(code)
    try {
      await onRemove(code)
    } finally {
      setRemovingCode(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  return (
    <div className="space-y-3">
      {/* Toggle pill */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="promo-input-area"
        className="group inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground/80 hover:text-foreground pl-3 pr-3.5 py-1.5 hev-spring-fast"
      >
        <Tag className="h-3.5 w-3.5" strokeWidth={STROKE} />
        <span className="text-[12.5px] font-medium tracking-tight">
          Promo code
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 hev-spring-fast ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={STROKE}
        />
      </button>

      {/* Input area */}
      {isOpen && (
        <div id="promo-input-area" className="space-y-2 hev-rise-soft">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter code"
              disabled={isApplyingPromo}
              autoComplete="off"
              className="flex-1 rounded-full bg-foreground/[0.04] px-4 py-2 text-[13px] text-foreground placeholder:text-foreground/40 uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-foreground/15 hev-spring-fast"
              style={{
                boxShadow: 'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
              }}
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplyingPromo || !inputValue.trim()}
              className="group inline-flex items-center gap-1.5 rounded-full bg-foreground text-background pl-3 pr-1 py-1 hev-spring-fast hev-press disabled:opacity-40"
            >
              <span className="text-[12px] font-medium tracking-tight">
                {isApplyingPromo ? 'Applying' : 'Apply'}
              </span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25">
                {isApplyingPromo ? (
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={STROKE} />
                ) : (
                  <ArrowUpRight className="h-3 w-3" strokeWidth={STROKE} />
                )}
              </span>
            </button>
          </div>

          {error && (
            <p role="alert" className="text-[12px] text-destructive">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Applied codes — eyebrow chips */}
      {appliedPromoCodes.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-1">
          {appliedPromoCodes.map((code) => (
            <li key={code}>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

const STROKE = 1.5

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-foreground/[0.08]">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`faq-${index}`}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left hev-spring-fast"
      >
        <div className="flex items-start gap-5 min-w-0">
          <span className="font-editorial italic text-foreground/40 text-base tabular-nums shrink-0 mt-1">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-editorial text-foreground text-xl sm:text-2xl leading-tight tracking-tight">
            {q}
          </span>
        </div>
        <span
          className={`grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.04] text-foreground/70 hev-spring-fast shrink-0 ${
            open
              ? 'bg-foreground text-background rotate-45'
              : 'group-hover:bg-foreground/[0.07]'
          }`}
          aria-hidden
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={STROKE} />
        </span>
      </button>
      <div
        id={`faq-${index}`}
        className={`grid hev-spring overflow-hidden ${
          open
            ? 'grid-rows-[1fr] opacity-100 pb-6'
            : 'grid-rows-[0fr] opacity-0'
        }`}
        style={{
          transitionProperty: 'grid-template-rows, opacity, padding',
          transitionDuration: '450ms',
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div className="overflow-hidden pl-12 pr-12">
          <p className="text-[14.5px] text-foreground/70 leading-relaxed max-w-2xl">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-foreground/[0.08]">
      {faqs.map((faq, i) => (
        <FaqItem key={i} index={i} {...faq} />
      ))}
    </div>
  )
}

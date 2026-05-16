'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

const STROKE = 1.5

interface ProductAccordionProps {
  description?: string | null
  details?: Record<string, string>
}

function AccordionItem({
  title,
  index,
  children,
  defaultOpen = false,
}: {
  title: string
  index: number
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-foreground/[0.08]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`pdp-acc-${index}`}
        className="group flex w-full items-start justify-between gap-6 py-5 text-left hev-spring-fast"
      >
        <div className="flex items-start gap-4 min-w-0">
          <span className="font-editorial italic text-foreground/40 text-sm tabular-nums shrink-0 mt-1">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-editorial text-foreground text-lg leading-tight tracking-tight">
            {title}
          </span>
        </div>
        <span
          className={`grid place-items-center h-8 w-8 rounded-full bg-foreground/[0.04] text-foreground/70 hev-spring-fast shrink-0 ${
            isOpen
              ? 'bg-foreground text-background rotate-45'
              : 'group-hover:bg-foreground/[0.07]'
          }`}
          aria-hidden
        >
          <Plus className="h-3 w-3" strokeWidth={STROKE} />
        </span>
      </button>
      <div
        id={`pdp-acc-${index}`}
        className={`grid overflow-hidden ${
          isOpen
            ? 'grid-rows-[1fr] opacity-100 pb-5'
            : 'grid-rows-[0fr] opacity-0'
        }`}
        style={{
          transitionProperty: 'grid-template-rows, opacity, padding',
          transitionDuration: '450ms',
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div className="overflow-hidden pl-9 pr-2">
          <div className="text-[13.5px] text-foreground/70 leading-relaxed max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({
  description,
  details: _details,
}: ProductAccordionProps) {
  const items: Array<{ title: string; body: React.ReactNode; defaultOpen?: boolean }> =
    []

  if (description) {
    items.push({
      title: 'Description',
      defaultOpen: true,
      body: <div dangerouslySetInnerHTML={{ __html: description }} />,
    })
  }

  items.push({
    title: 'Shipping & returns',
    body: (
      <ul className="space-y-1.5">
        <li>Free standard shipping on orders over $75</li>
        <li>Express shipping available at checkout</li>
        <li>Free returns within thirty days of delivery</li>
        <li>Items must be unworn, with original tags attached</li>
      </ul>
    ),
  })

  items.push({
    title: 'Care instructions',
    body: (
      <ul className="space-y-1.5">
        <li>Refer to the care label sewn into the piece</li>
        <li>Store cool, dry, out of direct sunlight</li>
        <li>Handle with care between wears to maintain finish</li>
      </ul>
    ),
  })

  return (
    <div className="border-t border-foreground/[0.08]">
      {items.map((it, i) => (
        <AccordionItem
          key={it.title}
          title={it.title}
          index={i}
          defaultOpen={it.defaultOpen}
        >
          {it.body}
        </AccordionItem>
      ))}
    </div>
  )
}

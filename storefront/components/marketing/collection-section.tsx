'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import ProductGrid from '@/components/product/product-grid'
import { Reveal } from '@/components/marketing/reveal'

interface CollectionSectionProps {
  collection: any
  alternate?: boolean
}

export default function CollectionSection({ collection, alternate }: CollectionSectionProps) {
  const description = collection.metadata?.description
  const hasDescription = typeof description === 'string' && description

  // Split the title so we can italicise the trailing word for editorial rhythm.
  const titleWords = String(collection.title ?? '').trim().split(/\s+/)
  const titleLead = titleWords.slice(0, -1).join(' ')
  const titleTail = titleWords.length > 1 ? titleWords[titleWords.length - 1] : ''
  const singleWord = !titleTail

  return (
    <section className="relative overflow-hidden py-24 sm:py-28 lg:py-32">
      {/* Ambient backdrop — soft and only on alternate rows */}
      {alternate && (
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-24 right-[-10%] h-[460px] w-[460px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.12), transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[-20%] left-[-12%] h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.16), transparent 70%)',
            }}
          />
        </div>
      )}

      <div className="container-custom">
        {/* Editorial Split header — title left, anchor link right */}
        <Reveal>
          <div
            className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 lg:mb-16 ${
              alternate ? 'lg:flex-row-reverse lg:text-right' : ''
            }`}
          >
            <div className={alternate ? 'lg:ml-auto' : ''}>
              {/* Eyebrow */}
              <span className="hev-eyebrow">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: 'hsl(var(--accent))' }}
                />
                Collection · {String(collection.handle ?? '').replace(/-/g, ' ')}
              </span>

              {/* Massive editorial serif title */}
              <h2 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.5rem,5vw,4.25rem)]">
                {singleWord ? (
                  <span className="italic font-normal">{collection.title}</span>
                ) : (
                  <>
                    {titleLead}{' '}
                    <span className="italic font-normal text-foreground/80">
                      {titleTail}
                    </span>
                  </>
                )}
              </h2>

              {hasDescription && (
                <p
                  className={`mt-5 text-[15px] leading-relaxed text-foreground/65 max-w-lg ${
                    alternate ? 'lg:ml-auto' : ''
                  }`}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Button-in-Button view all */}
            <Link
              href={`/collections/${collection.handle}`}
              prefetch={true}
              className="group relative inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] text-foreground pl-5 pr-1 py-1 hev-spring-fast hover:bg-foreground/[0.07] self-start lg:self-end"
            >
              <span className="text-[12.5px] font-medium tracking-tight">View the collection</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Product grid wrapped for stagger reveal */}
        <Reveal delay={120}>
          <ProductGrid collectionId={collection.id} limit={4} />
        </Reveal>
      </div>
    </section>
  )
}

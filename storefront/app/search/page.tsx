'use client'

import { useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import ProductGrid from '@/components/product/product-grid'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

const HINTS = ['lambswool', 'cashmere', 'edition 26', 'mira coat', 'studio picks']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const trimmed = query.trim()

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      {/* Header — large pill search */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-10 lg:pb-12">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/3 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.18), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="mx-auto max-w-3xl">

            <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2rem,4vw,3rem)]">
              {trimmed ? (
                <>
                  Results for{' '}
                  <span className="italic font-normal text-foreground/85">
                    &ldquo;{trimmed}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  What are you{' '}
                  <span className="italic font-normal text-foreground/85">
                    looking for
                  </span>
                  ?
                </>
              )}
            </h1>

            {/* Large pill search */}
            <div className="mt-8">
              <label htmlFor="search-input" className="sr-only">
                Search products
              </label>
              <div
                className="relative rounded-full bg-background/70 hev-spring-fast focus-within:bg-background"
                style={{
                  boxShadow:
                    'inset 0 0 0 1px hsl(var(--foreground) / 0.1), 0 14px 40px -20px hsl(var(--foreground) / 0.15)',
                }}
              >
                <span
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/55"
                  aria-hidden
                >
                  <SearchIcon className="h-4 w-4" strokeWidth={STROKE} />
                </span>
                <input
                  id="search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “lambswool”, “mira coat”…"
                  autoFocus
                  className="w-full bg-transparent rounded-full pl-12 pr-12 py-4 text-[15px] sm:text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
                />
                {trimmed && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-grid place-items-center h-8 w-8 rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.1] text-foreground/70 hev-spring-fast"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                )}
              </div>

              {/* Hint chips */}
              {!trimmed && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/45 self-center mr-1">
                    Try
                  </span>
                  {HINTS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setQuery(h)}
                      className="rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground/75 hover:text-foreground px-3 py-1 text-[12px] tracking-tight hev-spring-fast"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          {trimmed ? (
            <>
              {/* Search ads, filter enhancements */}
              <ClientPluginSlot
                name="searchAboveResults"
                context={{ query: trimmed }}
              />
              <ProductGrid limit={20} query={trimmed} />
            </>
          ) : (
            <div className="mx-auto max-w-md hev-shell rounded-[1.5rem] p-[5px]">
              <div className="hev-core rounded-[calc(1.5rem-5px)] p-10 text-center">
                <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
                  <SearchIcon
                    className="h-4 w-4 text-foreground/70"
                    strokeWidth={STROKE}
                  />
                </span>
                <p className="font-editorial italic text-foreground text-xl mt-5 leading-tight">
                  Start typing.
                </p>
                <p className="mt-2 text-[13px] text-foreground/60 max-w-xs mx-auto">
                  Search across the whole catalogue — pieces, materials,
                  season tags.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import ProductGrid from '@/components/product/product-grid'
import { useQuery } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/marketing/reveal'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price · Low to High' },
  { value: 'price-high', label: 'Price · High to Low' },
  { value: 'name', label: 'Name · A to Z' },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getMedusaClient().store.category.list({ limit: 100 })
      return response.product_categories
    },
  })

  const allCategories = categories || []
  const activeCategory = allCategories.find((c: any) => c.id === selectedCategory)

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay (Editorial Luxury) */}
      <div aria-hidden className="hev-grain" />

      {/* ─────────────────────────── PAGE HEADER ─────────────────────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-12 lg:pb-16">
        {/* Ambient backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -right-24 h-[460px] w-[460px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/2 -left-20 h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.16), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
              <div className="lg:col-span-8">

                <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.5rem,5.2vw,4.5rem)]">
                  Every piece,{' '}
                  <span className="italic font-normal text-foreground/85">
                    in one place
                  </span>
                  .
                </h1>

                <p className="mt-5 text-[15px] leading-relaxed text-foreground/65 max-w-lg">
                  Forty-seven pieces, refined over nine months. Filter by category,
                  reorder by what matters — the rest stays out of the way.
                </p>
              </div>

              {/* Inline metrics — right column */}
              <div className="lg:col-span-4 lg:justify-self-end">
                <dl className="grid grid-cols-2 gap-x-6 max-w-xs">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Showing
                    </dt>
                    <dd className="font-editorial text-2xl tabular-nums text-foreground mt-1.5">
                      {activeCategory ? activeCategory.name : 'All'}
                    </dd>
                  </div>
                  <div className="border-l border-foreground/10 pl-6">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Ordered
                    </dt>
                    <dd className="font-editorial text-2xl tabular-nums text-foreground mt-1.5">
                      {SORT_OPTIONS.find((s) => s.value === sortBy)?.label
                        ?.split(' ')[0] ?? 'Newest'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── BODY ─────────────────────────── */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          {/* Toolbar */}
          <Reveal delay={80}>
            <div className="flex items-center justify-between gap-3 mb-10">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground pl-4 pr-1 py-1 hev-spring-fast lg:hidden"
                aria-expanded={showFilters}
                aria-controls="products-filters"
              >
                <span className="text-[12.5px] font-medium tracking-tight">
                  {showFilters ? 'Hide' : 'Filters'}
                </span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast">
                  <SlidersHorizontal className="h-3 w-3" strokeWidth={1.25} />
                </span>
              </button>

              {/* Custom-styled sort select (kept native for a11y) */}
              <div className="ml-auto flex items-center gap-2">
                <label
                  htmlFor="sort-by"
                  className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
                >
                  Order
                </label>
                <div className="relative">
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-full bg-foreground/[0.04] text-foreground text-[12.5px] font-medium tracking-tight pl-4 pr-9 py-2 hev-spring-fast hover:bg-foreground/[0.07] focus:outline-none focus:ring-2 focus:ring-foreground/15 cursor-pointer"
                    style={{
                      boxShadow:
                        'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
                    }}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/55"
                    strokeWidth={1.25}
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Sidebar + Grid */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-12 lg:gap-16">
            {/* ── SIDEBAR ── */}
            <aside
              id="products-filters"
              className={`${showFilters ? 'block' : 'hidden'} lg:block`}
            >
              <div className="lg:sticky lg:top-28 space-y-10">
                {/* Category list */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                  </div>

                  {loadingCategories ? (
                    <div className="space-y-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-5 w-32 rounded-full bg-foreground/[0.05] hev-rise-soft"
                          style={{ animationDelay: `${i * 60}ms` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <ul className="divide-y divide-foreground/[0.07]">
                      <li>
                        <button
                          onClick={() => setSelectedCategory('')}
                          className={`group flex w-full items-baseline justify-between gap-3 py-2.5 text-left hev-spring-fast ${
                            !selectedCategory
                              ? 'text-foreground'
                              : 'text-foreground/70 hover:text-foreground'
                          }`}
                        >
                          <span
                            className={`text-[13.5px] tracking-tight ${
                              !selectedCategory ? 'font-medium' : ''
                            }`}
                          >
                            All pieces
                          </span>
                          {!selectedCategory && (
                            <span
                              className="font-editorial italic text-foreground/55 text-[13px]"
                              aria-hidden
                            >
                              ·
                            </span>
                          )}
                        </button>
                      </li>
                      {allCategories.map((category: any) => {
                        const isActive = selectedCategory === category.id
                        return (
                          <li key={category.id}>
                            <button
                              onClick={() => setSelectedCategory(category.id)}
                              className={`group flex w-full items-baseline justify-between gap-3 py-2.5 text-left hev-spring-fast ${
                                isActive
                                  ? 'text-foreground'
                                  : 'text-foreground/70 hover:text-foreground'
                              }`}
                              aria-pressed={isActive}
                            >
                              <span
                                className={`text-[13.5px] tracking-tight ${
                                  isActive ? 'font-medium' : ''
                                }`}
                              >
                                {category.name}
                              </span>
                              {isActive && (
                                <span
                                  className="font-editorial italic text-foreground/55 text-[13px]"
                                  aria-hidden
                                >
                                  ·
                                </span>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                {/* Active filter chip */}
                {selectedCategory && (
                  <div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground/85 hover:text-foreground pl-3 pr-1 py-0.5 hev-spring-fast"
                      >
                        <span className="text-[12px] tracking-tight">
                          {activeCategory?.name}
                        </span>
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                          <X className="h-2.5 w-2.5" strokeWidth={1.5} />
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* ── GRID ── */}
            <Reveal delay={140}>
              <ProductGrid
                limit={100}
                categoryId={selectedCategory || undefined}
                sortBy={sortBy}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

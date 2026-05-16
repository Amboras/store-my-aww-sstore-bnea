'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'
import { Reveal } from '@/components/marketing/reveal'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const MINI_IMAGES = [
  '/media/placeholders/product-1.jpg',
  '/media/placeholders/product-2.jpg',
]

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
  }

  // Two featured collection bento chips, fallback to /products
  const featured = (collections?.slice(0, 2) ?? []) as Array<{
    id: string
    handle: string
    title: string
  }>
  const miniCards = [0, 1].map((i) => ({
    label: featured[i]?.title ?? (i === 0 ? 'The Edit' : 'Studio Picks'),
    href: featured[i] ? `/collections/${featured[i].handle}` : '/products',
    image: MINI_IMAGES[i],
  }))

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay (Editorial Luxury vibe) */}
      <div aria-hidden className="hev-grain" />

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-20 lg:pb-28">
        {/* Soft ambient backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-60"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.18), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/3 right-[-10%] h-[460px] w-[460px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.22), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:min-h-[760px] xl:min-h-[820px]">
            {/* ── BIG IMAGE — Double-Bezel, col-span-7 row-span-2 ── */}
            <div
              className="lg:col-span-7 lg:row-span-2 hev-rise lg:h-full"
              style={{ animationDelay: '80ms' }}
            >
              <div className="hev-shell rounded-[2rem] p-[6px] lg:h-full">
                <div className="hev-core relative aspect-[5/6] sm:aspect-[4/4.4] lg:aspect-auto lg:h-full lg:min-h-[640px] rounded-[calc(2rem-6px)] overflow-hidden">
                  <Image
                    src={HERO_PLACEHOLDER}
                    alt="Season campaign — first look"
                    fill
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-cover"
                    priority
                  />
                  {/* Bottom inner vignette for legibility */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, hsl(0 0% 5% / 0.45), transparent)',
                    }}
                  />
                  {/* Bottom caption */}
                  <div className="absolute left-5 sm:left-6 bottom-5 sm:bottom-6 max-w-xs">
                    <p className="text-white/90 text-[11px] uppercase tracking-[0.22em] font-medium">
                      Frame 01
                    </p>
                    <p
                      className={`font-editorial text-white text-2xl sm:text-3xl leading-[1.05] mt-1.5 italic`}
                    >
                      Mira coat, lambswool
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── TOP-RIGHT HEADLINE CARD ── */}
            <div
              className="lg:col-span-5 hev-rise"
              style={{ animationDelay: '180ms' }}
            >
              <div className="hev-shell rounded-[2rem] p-[6px] h-full">
                <div className="hev-core rounded-[calc(2rem-6px)] p-7 sm:p-9 lg:p-10 h-full flex flex-col">
                  {/* Eyebrow */}

                  {/* Editorial serif headline */}
                  <h1
                    className={`font-editorial mt-6 text-foreground leading-[0.92] tracking-tight text-[clamp(2.75rem,5.4vw,4.5rem)]`}
                  >
                    Objects made
                    <br />
                    <span className="italic font-normal text-foreground/85">
                      to outlast
                    </span>
                    <br />
                    the season.
                  </h1>

                  <p className="mt-6 text-[15px] leading-relaxed text-foreground/65 max-w-sm">
                    A small practice in soft tooling and quiet hardware. Forty-seven
                    pieces, refined over nine months, then shipped everywhere.
                  </p>

                  {/* Button-in-Button CTA */}
                  <div className="mt-8 flex items-center gap-3">
                    <Link
                      href="/products"
                      prefetch
                      className="group relative inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
                    >
                      <span className="text-[13px] font-medium tracking-tight pr-1">
                        Browse the season
                      </span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                      </span>
                    </Link>

                    <Link
                      href="/about"
                      prefetch
                      className="text-[13px] text-foreground/70 hover:text-foreground hev-spring-fast pb-0.5 link-underline"
                    >
                      Read the studio notes
                    </Link>
                  </div>

                  {/* Subtle inline credibility — no card */}
                  <dl className="mt-auto pt-8 grid grid-cols-3 gap-4">
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                        Atelier
                      </dt>
                      <dd
                        className={`font-editorial mt-1.5 text-xl tabular-nums text-foreground`}
                      >
                        Lisbon
                      </dd>
                    </div>
                    <div className="border-l border-foreground/10 pl-4">
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                        Pieces
                      </dt>
                      <dd
                        className={`font-editorial mt-1.5 text-xl tabular-nums text-foreground`}
                      >
                        47
                      </dd>
                    </div>
                    <div className="border-l border-foreground/10 pl-4">
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                        Ships
                      </dt>
                      <dd
                        className={`font-editorial mt-1.5 text-xl tabular-nums text-foreground`}
                      >
                        47 ctry.
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* ── BOTTOM-RIGHT BENTO CHIPS — 2 mini cards ── */}
            <div
              className="lg:col-span-5 hev-rise"
              style={{ animationDelay: '280ms' }}
            >
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {miniCards.map((card, i) => (
                  <Link
                    key={card.href + i}
                    href={card.href}
                    prefetch
                    className="group block hev-spring"
                  >
                    <div className="hev-shell rounded-[1.5rem] p-[5px]">
                      <div className="hev-core relative aspect-[5/4] rounded-[calc(1.5rem-5px)] overflow-hidden">
                        <Image
                          src={card.image}
                          alt={card.label}
                          fill
                          sizes="(max-width: 1024px) 50vw, 22vw"
                          className="object-cover hev-spring group-hover:scale-[1.04]"
                        />
                        {/* Bottom gradient for caption legibility */}
                        <div
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(to top, hsl(0 0% 5% / 0.55), transparent)',
                          }}
                        />
                        {/* Caption + nested arrow chip */}
                        <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between">
                          <div>
                            <p className="text-white/70 text-[10px] uppercase tracking-[0.22em]">
                              Shop
                            </p>
                            <p
                              className={`font-editorial text-white text-xl leading-tight mt-0.5`}
                            >
                              {card.label}
                            </p>
                          </div>
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 hev-spring-fast group-hover:bg-white/25 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]">
                            <ArrowUpRight
                              className="h-3 w-3 text-white"
                              strokeWidth={1.25}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* homeHero slot — social proof, countdown timers */}
      <ClientPluginSlot name="homeHero" />

      {/* ───────────────────────── COLLECTIONS ───────────────────────── */}
      {isLoading ? (
        <section className="py-24 sm:py-28 lg:py-32">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
              <div className="space-y-4 max-w-md">
                <div className="h-5 w-32 rounded-full bg-foreground/[0.06]" />
                <div className="h-12 w-72 rounded-md bg-foreground/[0.06]" />
                <div className="h-4 w-80 rounded-md bg-foreground/[0.04]" />
              </div>
              <div className="h-10 w-44 rounded-full bg-foreground/[0.05]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="hev-shell rounded-[1.5rem] p-[5px] hev-rise-soft"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="hev-core relative aspect-[3/4] rounded-[calc(1.5rem-5px)] overflow-hidden">
                    <div className="absolute inset-0 bg-foreground/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map(
            (
              collection: {
                id: string
                handle: string
                title: string
                metadata?: Record<string, unknown>
              },
              index: number
            ) => (
              <CollectionSection
                key={collection.id}
                collection={collection}
                alternate={index % 2 === 1}
              />
            )
          )}
        </>
      ) : null}

      {/* homeBelowFeatured slot — recently viewed, newsletter plugins */}
      <ClientPluginSlot name="homeBelowFeatured" />

      {/* ──────────────────────── EDITORIAL / STORY ──────────────────────── */}
      <section className="relative overflow-hidden py-28 lg:py-36">
        {/* Soft ambient */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-1/4 -left-32 h-[480px] w-[480px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.14), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Z-Axis Cascade: tilted double-bezel image + offset secondary chip */}
            <Reveal className="lg:col-span-7 relative">
              {/* Primary image */}
              <div className="relative lg:-ml-2">
                <div
                  className="hev-shell rounded-[2rem] p-[6px] hev-spring lg:transition-transform"
                >
                  <div className="hev-core relative aspect-[5/4] sm:aspect-[4/3] lg:aspect-[5/4] rounded-[calc(2rem-6px)] overflow-hidden">
                    <Image
                      src={LIFESTYLE_PLACEHOLDER}
                      alt="Inside the studio — frame 04"
                      fill
                      sizes="(max-width: 1024px) 100vw, 56vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, hsl(0 0% 5% / 0.35), transparent)',
                      }}
                    />
                    <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Copy column */}
            <Reveal delay={120} className="lg:col-span-5">

              <h2 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.25rem,4.4vw,3.75rem)]">
                Crafted slowly,
                <br />
                <span className="italic font-normal text-foreground/85">
                  for the long
                </span>{' '}
                hold.
              </h2>

              <p className="mt-6 text-[15px] leading-relaxed text-foreground/65 max-w-md">
                Each season opens with a single material study. We refine the hardware
                until the prototype outlasts the brief, then build the season around it.
                Nothing ships until it survives ninety days in the studio.
              </p>

              {/* Pillar list — divider-only, no boxes */}
              <ul className="mt-9 divide-y divide-foreground/10 border-y border-foreground/10">
                {[
                  { k: '01', t: 'Cut from a single material study per season' },
                  { k: '02', t: 'Repaired in-house for the life of the piece' },
                  { k: '03', t: 'Shipped from a low-grid atelier in Lisbon' },
                ].map((row) => (
                  <li key={row.k} className="flex items-start gap-4 py-3.5">
                    <span className="font-editorial italic text-foreground/45 text-base tabular-nums w-8 shrink-0">
                      {row.k}
                    </span>
                    <span className="text-[14px] text-foreground/80 leading-relaxed">
                      {row.t}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button-in-Button */}
              <Link
                href="/about"
                prefetch
                className="group relative inline-flex items-center gap-2 mt-8 rounded-full bg-foreground/[0.04] text-foreground pl-5 pr-1 py-1 hev-spring-fast hover:bg-foreground/[0.07]"
              >
                <span className="text-[12.5px] font-medium tracking-tight">
                  Read the studio journal
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── NEWSLETTER ─────────────────────────── */}
      <section className="relative overflow-hidden py-28 lg:py-36">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute bottom-[-25%] left-1/2 -translate-x-1/2 h-[680px] w-[820px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <Reveal>
            <div className="mx-auto max-w-3xl hev-shell rounded-[2rem] p-[6px]">
              <div className="hev-core rounded-[calc(2rem-6px)] p-8 sm:p-12 lg:p-14">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10">
                  <div className="max-w-lg">

                    <h2 className="font-editorial mt-5 leading-[0.95] tracking-tight text-[clamp(2rem,3.6vw,3rem)] text-foreground">
                      First look,
                      <br />
                      <span className="italic font-normal text-foreground/80">
                        before the rest
                      </span>{' '}
                      of the internet.
                    </h2>
                  </div>

                  <div className="text-left lg:text-right shrink-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Joined this week
                    </p>
                    <p className="font-editorial text-3xl tabular-nums text-foreground mt-1.5">
                      +1,847
                    </p>
                  </div>
                </div>

                {/* Form — pill input + Button-in-Button submit */}
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="mt-9 flex flex-col sm:flex-row gap-3"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative flex-1">
                    <input
                      id="newsletter-email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="hello@yourdomain.com"
                      className="w-full rounded-full bg-foreground/[0.04] px-5 py-3.5 text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/15 hev-spring-fast"
                      style={{
                        boxShadow:
                          'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
                  >
                    <span className="text-[13px] font-medium tracking-tight pr-1">
                      Subscribe
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                    </span>
                  </button>
                </form>

                <p className="mt-5 text-[12px] text-foreground/55">
                  One short note. No tracking pixels. Unsubscribe in a single tap.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

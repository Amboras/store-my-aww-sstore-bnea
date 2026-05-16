import { medusaServerClient } from '@/lib/medusa-client'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { ArrowUpRight, Package } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import { Reveal } from '@/components/marketing/reveal'

export const metadata: Metadata = { title: 'Collections' }

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const COLLECTION_PLACEHOLDERS = [
  '/media/placeholders/hero.jpg',
  '/media/placeholders/lifestyle.jpg',
  '/media/placeholders/product-1.jpg',
  '/media/placeholders/product-2.jpg',
  '/media/placeholders/product-3.jpg',
  '/media/placeholders/product-4.jpg',
]

function imageFor(id: string, fallback?: string | null) {
  if (typeof fallback === 'string' && fallback) return fallback
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return COLLECTION_PLACEHOLDERS[Math.abs(hash) % COLLECTION_PLACEHOLDERS.length]
}

async function getCollections() {
  try {
    const response = await medusaServerClient.store.collection.list({ limit: 50 })
    return response.collections || []
  } catch {
    return []
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay (Editorial Luxury) */}
      <div aria-hidden className="hev-grain" />

      {/* ─────────────────────────── PAGE HEADER ─────────────────────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-12 lg:pb-16">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/3 -left-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.18), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
              <div className="lg:col-span-8">
                <span className="hev-eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: 'hsl(var(--accent))' }}
                  />
                  Browse · collections
                </span>

                <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.5rem,5.2vw,4.5rem)]">
                  Edits,{' '}
                  <span className="italic font-normal text-foreground/85">
                    grouped by intent
                  </span>
                  .
                </h1>

                <p className="mt-5 text-[15px] leading-relaxed text-foreground/65 max-w-lg">
                  Each collection is a small thesis — a material, a posture, a
                  season. Open one to see the pieces that made the cut.
                </p>
              </div>

              {/* Right-side count metric */}
              <div className="lg:col-span-4 lg:justify-self-end">
                <dl className="grid grid-cols-2 gap-x-6 max-w-xs">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Collections
                    </dt>
                    <dd className="font-editorial text-2xl tabular-nums text-foreground mt-1.5">
                      {String(collections.length).padStart(2, '0')}
                    </dd>
                  </div>
                  <div className="border-l border-foreground/10 pl-6">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Edition
                    </dt>
                    <dd className="font-editorial text-2xl tabular-nums text-foreground mt-1.5">
                      26
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── GRID ─────────────────────────── */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          {collections.length === 0 ? (
            <Reveal>
              <div className="mx-auto max-w-md hev-shell rounded-[1.5rem] p-[5px]">
                <div className="hev-core rounded-[calc(1.5rem-5px)] p-10 text-center">
                  <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
                    <Package
                      className="h-4 w-4 text-foreground/70"
                      strokeWidth={1.25}
                    />
                  </span>
                  <p className="font-editorial italic text-foreground text-xl mt-5 leading-tight">
                    No collections, yet.
                  </p>
                  <p className="mt-2 text-[13px] text-foreground/60 max-w-xs mx-auto">
                    The first edit lands when Season 26 opens — check back soon.
                  </p>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {collections.map((collection: any, i: number) => {
                const description =
                  typeof collection.metadata?.description === 'string'
                    ? collection.metadata.description
                    : null
                const metaImage =
                  typeof collection.metadata?.image === 'string'
                    ? collection.metadata.image
                    : null
                const img = imageFor(collection.id, metaImage)
                const titleWords = String(collection.title ?? '').trim().split(/\s+/)
                const titleLead = titleWords.slice(0, -1).join(' ')
                const titleTail =
                  titleWords.length > 1 ? titleWords[titleWords.length - 1] : ''
                const singleWord = !titleTail

                return (
                  <Reveal key={collection.id} delay={i * 90}>
                    <Link
                      href={`/collections/${collection.handle}`}
                      prefetch
                      className="group block hev-spring"
                    >
                      {/* Double-Bezel image */}
                      <div className="hev-shell rounded-[1.75rem] p-[5px] hev-spring group-hover:-translate-y-1">
                        <div className="hev-core relative aspect-[4/5] rounded-[calc(1.75rem-5px)] overflow-hidden">
                          <Image
                            src={img}
                            alt={collection.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05]"
                          />
                          {/* Bottom legibility gradient */}
                          <div
                            aria-hidden
                            className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
                            style={{
                              background:
                                'linear-gradient(to top, hsl(0 0% 5% / 0.6), transparent 65%)',
                            }}
                          />
                          {/* Top eyebrow */}
                          <div className="absolute left-4 top-4">
                            <span className="hev-eyebrow bg-background/75 backdrop-blur">
                              <span
                                className="inline-block h-1.5 w-1.5 rounded-full"
                                style={{ background: 'hsl(var(--accent))' }}
                              />
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          </div>
                          {/* Caption + nested chip */}
                          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-white/70 text-[10px] uppercase tracking-[0.22em]">
                                Shop the edit
                              </p>
                              <h2 className="font-editorial text-white leading-[1.05] tracking-tight text-[clamp(1.5rem,2.4vw,2.1rem)] mt-1">
                                {singleWord ? (
                                  <span className="italic font-normal">
                                    {collection.title}
                                  </span>
                                ) : (
                                  <>
                                    {titleLead}{' '}
                                    <span className="italic font-normal text-white/85">
                                      {titleTail}
                                    </span>
                                  </>
                                )}
                              </h2>
                            </div>
                            <span
                              aria-hidden
                              className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 hev-spring-fast group-hover:bg-white/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                            >
                              <ArrowUpRight
                                className="h-3.5 w-3.5 text-white"
                                strokeWidth={1.25}
                              />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description outside the card, gallery-style */}
                      {description && (
                        <p className="mt-4 px-1 text-[13px] text-foreground/65 leading-relaxed line-clamp-2 max-w-sm">
                          {description}
                        </p>
                      )}
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

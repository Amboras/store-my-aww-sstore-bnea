'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Truck, Shield, RotateCcw, Award } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { useProducts } from '@/hooks/use-products'
import { trackMetaEvent } from '@/lib/meta-pixel'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'
import ProductCard from '@/components/product/product-card'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

export default function HomePage() {
  const { data: collections, isLoading: collectionsLoading } = useCollections()
  const { data: products } = useProducts({ limit: 8 })
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* Hero — full-bleed editorial */}
      <section className="relative w-full">
        <div className="relative h-[88vh] min-h-[560px] max-h-[920px] w-full overflow-hidden">
          <Image
            src={HERO_PLACEHOLDER}
            alt="Heavyweight essentials, photographed in soft daylight"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Soft gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

          <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-24">
            <div className="container-custom">
              <div className="max-w-2xl text-background">
                <p className="text-[11px] uppercase tracking-[0.32em] mb-5 opacity-90">
                  Volume 01 — The Essentials
                </p>
                <h1 className="font-heading text-display font-bold text-balance leading-[0.95]">
                  Built <em className="not-italic font-light italic opacity-80">for women.</em>
                </h1>
                <p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-background/90">
                  Heavyweight fabric, considered fits, quiet colour. The wardrobe edited to its essentials.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-background text-foreground px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                    prefetch={true}
                  >
                    Shop the Collection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/products?sort=newest"
                    className="inline-flex items-center gap-2 border border-background/50 text-background px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-background hover:text-foreground transition-colors"
                    prefetch={true}
                  >
                    New Arrivals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial micro-strip */}
      <section className="border-y bg-background">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>380 GSM Heavyweight Cotton</span>
            <span aria-hidden className="hidden sm:inline">—</span>
            <span>Free shipping over ₹999</span>
            <span aria-hidden className="hidden sm:inline">—</span>
            <span>Buy 2 — automatic 15% off</span>
          </div>
        </div>
      </section>

      {/* Featured products — large editorial grid */}
      <section className="py-section">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow mb-3">Shop the Edit</p>
              <h2 className="text-h2 font-heading font-semibold text-balance max-w-xl">
                The pieces in heavy rotation.
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] link-underline pb-0.5 self-start sm:self-end"
              prefetch={true}
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
              {products.slice(0, 4).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-muted animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted animate-pulse" />
                  <div className="h-3 w-1/3 bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Editorial split — Philosophy */}
      <section className="bg-foreground text-background">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[640px]">
            <Image
              src={LIFESTYLE_PLACEHOLDER}
              alt="Folded essentials on warm linen"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-6 sm:px-12 py-section">
            <div className="max-w-md space-y-6">
              <p className="text-[11px] uppercase tracking-[0.32em] opacity-70">Our Philosophy</p>
              <h2 className="font-heading text-h1 font-semibold text-balance leading-[1.05]">
                Fewer pieces.<br />Made better.
              </h2>
              <p className="text-base leading-relaxed opacity-80">
                Every piece earns its place. Heavyweight cotton, considered cuts,
                colour palettes that won&apos;t age out. Built to be reached for
                first thing in the morning, year after year.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <p className="font-heading text-h3 font-semibold tabular">380</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">GSM Cotton</p>
                </div>
                <div>
                  <p className="font-heading text-h3 font-semibold tabular">100%</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">Combed Cotton</p>
                </div>
                <div>
                  <p className="font-heading text-h3 font-semibold tabular">30d</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">Returns</p>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] border-b border-background/40 hover:border-background pb-0.5 transition-colors"
                prefetch={true}
              >
                Read Our Story
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ClientPluginSlot name="homeHero" />

      {/* Collections */}
      {collectionsLoading ? null : collections && collections.length > 0 ? (
        <>
          {collections.slice(0, 2).map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      <ClientPluginSlot name="homeBelowFeatured" />

      {/* Trust / Features Bar */}
      <section className="border-y">
        <div className="container-custom py-section-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            <div className="flex flex-col items-center text-center gap-2.5">
              <Truck className="h-5 w-5" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Free Shipping</p>
                <p className="text-xs text-muted-foreground mt-0.5">On orders over ₹999</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2.5">
              <RotateCcw className="h-5 w-5" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">30-Day Returns</p>
                <p className="text-xs text-muted-foreground mt-0.5">No-fuss exchanges</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2.5">
              <Award className="h-5 w-5" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Heavyweight Cotton</p>
                <p className="text-xs text-muted-foreground mt-0.5">380 GSM, made to last</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2.5">
              <Shield className="h-5 w-5" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Secure Checkout</p>
                <p className="text-xs text-muted-foreground mt-0.5">256-bit encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter — editorial wide */}
      <section className="py-section bg-muted/40">
        <div className="container-custom max-w-2xl text-center">
          <p className="eyebrow mb-4">Stay in Touch</p>
          <h2 className="text-h2 font-heading font-semibold text-balance">
            First access to new drops.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Subscribe for early access, restock alerts and the occasional note from the studio.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-foreground text-background px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-[11px] text-muted-foreground/70 uppercase tracking-[0.16em]">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}

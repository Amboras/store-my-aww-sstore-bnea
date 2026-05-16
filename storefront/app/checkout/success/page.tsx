'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Package, ArrowUpRight, Mail } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import { trackPurchase } from '@/lib/analytics'
import { getMedusaClient } from '@/lib/medusa-client'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'
import type { Order, OrderItem } from '@/types'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

type PurchaseTrackingDetails = {
  value?: number
  currency?: string
  contentIds: string[]
  contents?: Array<{
    id: string
    quantity?: number
    item_price?: number
  }>
  numItems?: number
}

function toCurrencyValue(amount: number | null | undefined): number | undefined {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return undefined
  return Math.round(amount * 100) / 100
}

function buildPurchaseTrackingDetails(order: Order): PurchaseTrackingDetails {
  const items: OrderItem[] = Array.isArray(order?.items) ? order.items : []

  const contentIds = items
    .map((item: OrderItem) => item.variant_id || item.variant?.id || item.product_id)
    .filter(Boolean)

  const contents = items
    .map((item: OrderItem) => {
      const id = item.variant_id || item.variant?.id || item.product_id
      if (!id) return null
      return {
        id,
        quantity: item.quantity,
        item_price: toCurrencyValue(item.unit_price ?? item.total),
      }
    })
    .filter(Boolean) as Array<{
    id: string
    quantity?: number
    item_price?: number
  }>

  return {
    value: toCurrencyValue(order?.total),
    currency: order?.currency_code,
    contentIds,
    contents: contents.length > 0 ? contents : undefined,
    numItems: items.reduce(
      (sum: number, item: OrderItem) => sum + (item.quantity || 0),
      0,
    ),
  }
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  const analyticsTracked = useRef(false)
  const [purchaseDetails, setPurchaseDetails] =
    useState<PurchaseTrackingDetails | null>(null)
  const [purchaseDetailsLoaded, setPurchaseDetailsLoaded] = useState(false)

  useEffect(() => {
    if (!orderId || !purchaseDetailsLoaded || analyticsTracked.current) return
    analyticsTracked.current = true
    trackPurchase(orderId, {
      value: purchaseDetails?.value,
      currency: purchaseDetails?.currency,
      itemCount: purchaseDetails?.numItems,
      contentIds: purchaseDetails?.contentIds,
      contents: purchaseDetails?.contents,
    })
  }, [orderId, purchaseDetails, purchaseDetailsLoaded])

  useEffect(() => {
    if (!orderId) {
      setPurchaseDetails(null)
      setPurchaseDetailsLoaded(false)
      return
    }

    let cancelled = false

    const loadOrder = async () => {
      try {
        const { order } = await getMedusaClient().store.order.retrieve(orderId)
        if (!cancelled) {
          setPurchaseDetails(buildPurchaseTrackingDetails(order))
        }
      } catch {
        if (!cancelled) {
          setPurchaseDetails({ contentIds: [orderId] })
        }
      } finally {
        if (!cancelled) {
          setPurchaseDetailsLoaded(true)
        }
      }
    }

    loadOrder()

    return () => {
      cancelled = true
    }
  }, [orderId])

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-28 lg:pb-36">
        {/* Ambient backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.18), transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[-15%] right-[-10%] h-[460px] w-[460px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.2), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            {/* Editorial header */}
            <header className="text-center">
              <span
                className="inline-grid place-items-center h-14 w-14 rounded-full"
                style={{ background: 'hsl(var(--accent) / 0.12)' }}
              >
                <CheckCircle2
                  className="h-6 w-6"
                  strokeWidth={STROKE}
                  style={{ color: 'hsl(var(--accent))' }}
                />
              </span>


              <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.5rem,5.2vw,4rem)]">
                Thank you,{' '}
                <span className="italic font-normal text-foreground/85">
                  truly
                </span>
                .
              </h1>

              <p className="mt-5 text-[14.5px] leading-relaxed text-foreground/65 max-w-md mx-auto">
                Your order is in. We&rsquo;ll send a confirmation note now, and a
                tracking link the moment the parcel leaves the atelier.
              </p>
            </header>

            {/* Order ID card */}
            {orderId && (
              <div className="mt-10 hev-shell rounded-[1.5rem] p-[5px]">
                <div className="hev-core rounded-[calc(1.5rem-5px)] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Order ID
                    </p>
                    <p className="font-mono text-[13px] text-foreground mt-1.5 break-all">
                      {orderId}
                    </p>
                  </div>
                  <Link
                    href={`/account/orders/${orderId}`}
                    prefetch
                    className="group inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground pl-3 pr-1 py-1 hev-spring-fast"
                  >
                    <span className="text-[12px] font-medium tracking-tight">
                      View details
                    </span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                      <ArrowUpRight className="h-3 w-3" strokeWidth={STROKE} />
                    </span>
                  </Link>
                </div>
              </div>
            )}

            {/* What happens next card */}
            <div className="mt-4 hev-shell rounded-[1.75rem] p-[5px]">
              <div className="hev-core rounded-[calc(1.75rem-5px)] p-6 sm:p-8">

                <ul className="mt-5 divide-y divide-foreground/[0.07]">
                  <li className="flex items-start gap-4 py-4 first:pt-0">
                    <span className="grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.05] shrink-0">
                      <Mail
                        className="h-4 w-4 text-foreground/70"
                        strokeWidth={STROKE}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="font-editorial text-foreground text-lg leading-tight">
                        Confirmation, in your inbox
                      </p>
                      <p className="mt-1.5 text-[13px] text-foreground/60 leading-relaxed">
                        A receipt with the line items, totals, and shipping
                        method. Usually arrives in under a minute.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 py-4">
                    <span className="grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.05] shrink-0">
                      <Package
                        className="h-4 w-4 text-foreground/70"
                        strokeWidth={STROKE}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="font-editorial text-foreground text-lg leading-tight">
                        Tracking, when the parcel ships
                      </p>
                      <p className="mt-1.5 text-[13px] text-foreground/60 leading-relaxed">
                        We pack from the atelier within two to four business
                        days. You&rsquo;ll get a fresh link the moment it
                        leaves.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* checkoutComplete slot — purchase trackers, loyalty earn confirmation */}
            <ClientPluginSlot
              name="checkoutComplete"
              context={{
                orderId: orderId ?? undefined,
                total: purchaseDetails?.value,
                currency: purchaseDetails?.currency,
                itemCount: purchaseDetails?.numItems,
              }}
            />

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                prefetch
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
              >
                <span className="text-[13px] font-medium tracking-tight pr-1">
                  Keep browsing
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                </span>
              </Link>
              <Link
                href="/account/orders"
                prefetch
                className="group inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground pl-5 pr-1 py-1 hev-spring-fast"
              >
                <span className="text-[12.5px] font-medium tracking-tight">
                  My orders
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom pt-32 pb-28 text-center">
          <p className="font-editorial italic text-foreground/55 text-base">
            Loading your confirmation…
          </p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}

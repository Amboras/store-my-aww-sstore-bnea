'use client'

import React from 'react'
import { useOrder } from '@/hooks/use-order'
import AccountLayout from '@/components/account/account-layout'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  MapPin,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import TrackingInfo from '@/components/order/tracking-info'
import type { Order, OrderItem } from '@/types'

const STROKE = 1.25

// ── Quiet status chip — editorial eyebrow with accent dot ───────────────
function StatusBadge({
  status,
  type,
}: {
  status: string
  type: 'order' | 'payment' | 'fulfillment'
}) {
  const getConfig = () => {
    if (type === 'payment') {
      switch (status) {
        case 'captured':
        case 'paid':
          return { tone: 'positive', icon: CheckCircle2, label: 'Paid' }
        case 'awaiting':
        case 'not_paid':
          return {
            tone: 'pending',
            icon: Clock,
            label: status === 'not_paid' ? 'Not Paid' : 'Awaiting Payment',
          }
        case 'refunded':
        case 'partially_refunded':
          return {
            tone: 'info',
            icon: CheckCircle2,
            label:
              status === 'refunded' ? 'Refunded' : 'Partially Refunded',
          }
        case 'canceled':
          return { tone: 'neutral', icon: XCircle, label: 'Canceled' }
        default:
          return { tone: 'neutral', icon: Clock, label: status }
      }
    }

    if (type === 'fulfillment') {
      switch (status) {
        case 'fulfilled':
        case 'shipped':
          return { tone: 'positive', icon: CheckCircle2, label: 'Fulfilled' }
        case 'partially_fulfilled':
        case 'partially_shipped':
          return {
            tone: 'info',
            icon: Truck,
            label: 'Partially Fulfilled',
          }
        case 'not_fulfilled':
          return { tone: 'neutral', icon: Package, label: 'Not Fulfilled' }
        default:
          return { tone: 'neutral', icon: Package, label: status }
      }
    }

    switch (status) {
      case 'completed':
        return { tone: 'positive', icon: CheckCircle2, label: 'Completed' }
      case 'pending':
        return { tone: 'pending', icon: Clock, label: 'Pending' }
      case 'canceled':
        return { tone: 'negative', icon: XCircle, label: 'Canceled' }
      default:
        return { tone: 'neutral', icon: Clock, label: status }
    }
  }

  const config = getConfig()
  const Icon = config.icon
  const dotColor: Record<string, string> = {
    positive: 'hsl(var(--accent))',
    info: 'hsl(205 55% 58%)',
    pending: 'hsl(35 65% 60%)',
    negative: 'hsl(var(--destructive))',
    neutral: 'hsl(var(--foreground) / 0.45)',
  }

  return (
    <span className="hev-eyebrow capitalize">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: dotColor[config.tone] }}
      />
      <Icon className="h-3 w-3 text-foreground/55" strokeWidth={STROKE} />
      {String(config.label).replace(/_/g, ' ')}
    </span>
  )
}

// ── Hairline timeline — no thick circles, no high-contrast fills ───────────
function OrderTimeline({ order }: { order: Order }) {
  const fulfillmentStatus = order.fulfillment_status as string
  const hasShipped =
    fulfillmentStatus === 'shipped' ||
    fulfillmentStatus === 'partially_shipped' ||
    fulfillmentStatus === 'delivered'
  const hasDelivered = fulfillmentStatus === 'delivered'

  const steps = [
    { label: 'Placed', completed: true },
    {
      label: 'Paid',
      completed:
        order.payment_status === 'captured' ||
        (order.payment_status as string) === 'paid',
    },
    { label: 'Shipped', completed: hasShipped },
    { label: 'Delivered', completed: hasDelivered },
  ]

  return (
    <ol className="flex items-start gap-3">
      {steps.map((step, idx) => {
        const next = steps[idx + 1]
        return (
          <li key={step.label} className="flex-1 flex items-center gap-3">
            <div className="flex flex-col items-center text-center">
              <span
                className={`grid place-items-center h-7 w-7 rounded-full hev-spring ${
                  step.completed
                    ? 'bg-foreground text-background'
                    : 'bg-foreground/[0.04] text-foreground/40'
                }`}
                style={
                  !step.completed
                    ? {
                        boxShadow:
                          'inset 0 0 0 1px hsl(var(--foreground) / 0.08)',
                      }
                    : undefined
                }
                aria-hidden
              >
                {step.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={STROKE} />
                ) : (
                  <span className="text-[10px] font-medium tabular-nums">
                    {idx + 1}
                  </span>
                )}
              </span>
              <span
                className={`mt-2 text-[11px] tracking-tight ${
                  step.completed ? 'text-foreground/85 font-medium' : 'text-foreground/55'
                }`}
              >
                {step.label}
              </span>
            </div>
            {next && (
              <div
                className="flex-1 h-px relative -mt-6"
                aria-hidden
              >
                <span className="absolute inset-0 bg-foreground/[0.08]" />
                <span
                  className={`absolute inset-0 origin-left ${
                    step.completed && next.completed ? 'scale-x-100' : 'scale-x-0'
                  } hev-spring`}
                  style={{ background: 'hsl(var(--foreground))' }}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ── Order item row — Double-Bezel mini, serif title ───────────────────────
function OrderItemRow({
  item,
  currencyCode,
}: {
  item: OrderItem
  currencyCode: string
}) {
  const thumbnail = item.thumbnail || getProductPlaceholder(item.product_id)
  const unitPrice = formatPrice(item.unit_price, currencyCode)
  const total = formatPrice(item.total, currencyCode)

  const getFulfillmentStatus = () => {
    if (!item.detail) return 'Pending'
    const { quantity, fulfilled_quantity, shipped_quantity, delivered_quantity } =
      item.detail

    if (delivered_quantity > 0) {
      return delivered_quantity >= quantity
        ? 'Delivered'
        : `Partially delivered (${delivered_quantity}/${quantity})`
    }
    if (shipped_quantity > 0) {
      return shipped_quantity >= quantity
        ? 'Shipped'
        : `Partially shipped (${shipped_quantity}/${quantity})`
    }
    if (fulfilled_quantity > 0) {
      return fulfilled_quantity >= quantity
        ? 'Fulfilled'
        : `Partially fulfilled (${fulfilled_quantity}/${quantity})`
    }
    return 'Not shipped'
  }

  return (
    <li className="flex gap-4 py-5 first:pt-0 last:pb-0 border-b border-foreground/[0.07] last:border-0">
      <Link
        href={`/products/${item.product_handle}`}
        prefetch
        className="shrink-0 hev-spring group/img"
      >
        <div className="hev-shell rounded-2xl p-[4px]">
          <div className="hev-core relative h-20 w-20 rounded-[calc(1rem-4px)] overflow-hidden">
            <Image
              src={thumbnail}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover hev-spring group-hover/img:scale-[1.04]"
            />
          </div>
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product_handle}`} prefetch>
          <h4 className="font-editorial text-foreground text-base leading-tight hover:text-foreground/80 hev-spring-fast">
            {item.product_title}
          </h4>
        </Link>
        {item.variant_title && item.variant_title !== 'Default' && (
          <p className="text-[12px] text-foreground/55 mt-0.5">
            {item.variant_title}
          </p>
        )}
        <p className="text-[12px] text-foreground/60 mt-2">
          Qty {item.quantity} · {unitPrice}
        </p>
        <p className="text-[11px] text-foreground/50 mt-0.5">
          {getFulfillmentStatus()}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-editorial text-foreground text-base tabular-nums">
          {total}
        </p>
      </div>
    </li>
  )
}

// ── Address mini-card — Double-Bezel ─────────────────────────────────────
function AddressCard({
  title,
  address,
  icon: Icon,
}: {
  title: string
  address: Order['shipping_address']
  icon: any
}) {
  if (!address) return null

  return (
    <div className="hev-shell rounded-[1.25rem] p-[5px]">
      <div className="hev-core rounded-[calc(1.25rem-5px)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="grid place-items-center h-7 w-7 rounded-full bg-foreground/[0.05]">
            <Icon className="h-3.5 w-3.5 text-foreground/70" strokeWidth={STROKE} />
          </span>
          <span className="hev-eyebrow">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'hsl(var(--accent))' }}
            />
            {title}
          </span>
        </div>
        <p className="font-editorial text-foreground text-lg leading-tight">
          {address.first_name}{' '}
          <span className="italic text-foreground/85">{address.last_name}</span>
        </p>
        <div className="mt-2 text-[13px] text-foreground/65 leading-relaxed space-y-0.5">
          {address.company && <p>{address.company}</p>}
          <p>{address.address_1}</p>
          {address.address_2 && <p>{address.address_2}</p>}
          <p>
            {address.city}
            {address.province && `, ${address.province}`}{' '}
            {address.postal_code}
          </p>
          {address.phone && (
            <p className="text-foreground/55 pt-1">{address.phone}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = React.use(params)
  const { data: order, isLoading, error } = useOrder(resolvedParams.id)

  return (
    <AccountLayout>
      {/* Back chip */}
      <Link
        href="/account/orders"
        prefetch
        className="group inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground/80 pl-2 pr-4 py-1 hev-spring-fast mb-8"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:-translate-x-[2px]">
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={STROKE} />
        </span>
        <span className="text-[12.5px] font-medium tracking-tight">
          Back to orders
        </span>
      </Link>

      {isLoading ? (
        <div className="hev-shell rounded-[1.5rem] p-[5px]">
          <div className="hev-core rounded-[calc(1.5rem-5px)] h-64 grid place-items-center">
            <Loader2
              className="h-5 w-5 animate-spin text-foreground/40"
              strokeWidth={STROKE}
            />
          </div>
        </div>
      ) : error || !order ? (
        <div className="mx-auto max-w-md hev-shell rounded-[1.5rem] p-[5px]">
          <div className="hev-core rounded-[calc(1.5rem-5px)] p-10 text-center">
            <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
              <Package className="h-4 w-4 text-foreground/70" strokeWidth={STROKE} />
            </span>
            <p className="font-editorial italic text-foreground text-xl mt-5 leading-tight">
              Order not found.
            </p>
            <p className="mt-2 text-[13px] text-foreground/60 max-w-xs mx-auto">
              It may have been moved or never existed under your account.
            </p>
            <Link
              href="/account/orders"
              prefetch
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.08] text-foreground pl-4 pr-1 py-1 hev-spring-fast"
            >
              <span className="text-[12.5px] font-medium tracking-tight">
                View all orders
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                <ArrowUpRight className="h-3 w-3" strokeWidth={STROKE} />
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header card */}
          <div className="hev-shell rounded-[1.75rem] p-[5px]">
            <div className="hev-core rounded-[calc(1.75rem-5px)] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <span className="hev-eyebrow">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: 'hsl(var(--accent))' }}
                    />
                    Order · {String(order.status).replace(/_/g, ' ')}
                  </span>
                  <h1 className="font-editorial text-foreground mt-3 leading-tight tracking-tight text-[clamp(1.75rem,3.4vw,2.5rem)]">
                    #{order.display_id}
                  </h1>
                  <p className="text-[12px] text-foreground/55 mt-2">
                    Placed on{' '}
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <StatusBadge status={order.status} type="order" />
                  <StatusBadge status={order.payment_status} type="payment" />
                  <StatusBadge
                    status={order.fulfillment_status}
                    type="fulfillment"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-foreground/[0.07]">
                <OrderTimeline order={order} />
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT — items / addresses / shipping */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <div className="hev-shell rounded-[1.5rem] p-[5px]">
                <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-5">
                    <span className="hev-eyebrow">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: 'hsl(var(--accent))' }}
                      />
                      Items · {order.items.length}
                    </span>
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <OrderItemRow
                        key={item.id}
                        item={item}
                        currencyCode={order.currency_code}
                      />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid sm:grid-cols-2 gap-4">
                <AddressCard
                  title="Shipping"
                  address={order.shipping_address}
                  icon={MapPin}
                />
                <AddressCard
                  title="Billing"
                  address={order.billing_address}
                  icon={CreditCard}
                />
              </div>

              {/* Shipping & tracking */}
              <div className="hev-shell rounded-[1.5rem] p-[5px]">
                <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-7">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="grid place-items-center h-7 w-7 rounded-full bg-foreground/[0.05]">
                      <Truck
                        className="h-3.5 w-3.5 text-foreground/70"
                        strokeWidth={STROKE}
                      />
                    </span>
                    <span className="hev-eyebrow">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: 'hsl(var(--accent))' }}
                      />
                      Shipping &amp; tracking
                    </span>
                  </div>

                  {order.shipping_methods && order.shipping_methods.length > 0 && (
                    <ul className="divide-y divide-foreground/[0.07] mb-2">
                      {order.shipping_methods.map((method) => (
                        <li
                          key={method.id}
                          className="flex items-center justify-between gap-4 py-3 first:pt-0"
                        >
                          <div className="min-w-0">
                            <p className="font-editorial text-foreground text-base leading-tight">
                              {method.name}
                            </p>
                            {method.description && (
                              <p className="text-[12px] text-foreground/55 mt-0.5">
                                {method.description}
                              </p>
                            )}
                          </div>
                          <p className="font-editorial text-foreground text-base tabular-nums shrink-0">
                            {method.amount === 0
                              ? 'Free'
                              : formatPrice(method.amount, order.currency_code)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {order.fulfillments && order.fulfillments.length > 0 ? (
                    <div className="space-y-5 mt-4">
                      {order.fulfillments.map((fulfillment, idx) => (
                        <div key={fulfillment.id}>
                          {idx > 0 && (
                            <div className="border-t border-foreground/[0.07] my-5" />
                          )}
                          <TrackingInfo fulfillment={fulfillment} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-foreground/55 italic pt-4 border-t border-foreground/[0.07]">
                      Tracking lands here once the parcel leaves the atelier.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT — summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-4">
                <div className="hev-shell rounded-[1.5rem] p-[5px]">
                  <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-7">
                    <span className="hev-eyebrow">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: 'hsl(var(--accent))' }}
                      />
                      Receipt
                    </span>

                    <dl className="mt-5 divide-y divide-foreground/[0.07] text-[13.5px]">
                      <div className="flex justify-between py-2.5 first:pt-0">
                        <dt className="text-foreground/60">Subtotal</dt>
                        <dd className="tabular-nums text-foreground">
                          {formatPrice(order.subtotal, order.currency_code)}
                        </dd>
                      </div>
                      <div className="flex justify-between py-2.5">
                        <dt className="text-foreground/60">Shipping</dt>
                        <dd className="tabular-nums text-foreground">
                          {order.shipping_total === 0
                            ? 'Free'
                            : formatPrice(
                                order.shipping_total,
                                order.currency_code,
                              )}
                        </dd>
                      </div>
                      {order.tax_total > 0 && (
                        <div className="flex justify-between py-2.5">
                          <dt className="text-foreground/60">Tax</dt>
                          <dd className="tabular-nums text-foreground">
                            {formatPrice(order.tax_total, order.currency_code)}
                          </dd>
                        </div>
                      )}
                      {order.discount_total > 0 && (
                        <div
                          className="flex justify-between py-2.5"
                          style={{ color: 'hsl(var(--accent))' }}
                        >
                          <dt>Discount</dt>
                          <dd className="tabular-nums">
                            −{formatPrice(order.discount_total, order.currency_code)}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-2 pt-4 border-t border-foreground/[0.08] flex items-baseline justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                        Total
                      </span>
                      <span className="font-editorial text-foreground text-2xl tabular-nums">
                        {formatPrice(order.total, order.currency_code)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                {order.payment_collections &&
                  order.payment_collections.length > 0 && (
                    <div className="hev-shell rounded-[1.5rem] p-[5px]">
                      <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-7">
                        <span className="hev-eyebrow">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ background: 'hsl(var(--accent))' }}
                          />
                          Payment
                        </span>
                        {order.payment_collections.map((payment) => (
                          <dl
                            key={payment.id}
                            className="mt-4 text-[12.5px] text-foreground/65 divide-y divide-foreground/[0.07]"
                          >
                            <div className="flex justify-between py-2 first:pt-0">
                              <dt>Amount</dt>
                              <dd className="tabular-nums text-foreground">
                                {formatPrice(
                                  payment.amount,
                                  payment.currency_code,
                                )}
                              </dd>
                            </div>
                            {payment.captured_amount !== null &&
                              payment.captured_amount !== undefined && (
                                <div className="flex justify-between py-2">
                                  <dt>Captured</dt>
                                  <dd className="tabular-nums text-foreground">
                                    {formatPrice(
                                      payment.captured_amount,
                                      payment.currency_code,
                                    )}
                                  </dd>
                                </div>
                              )}
                            {payment.refunded_amount &&
                              payment.refunded_amount > 0 && (
                                <div
                                  className="flex justify-between py-2"
                                  style={{ color: 'hsl(205 55% 50%)' }}
                                >
                                  <dt>Refunded</dt>
                                  <dd className="tabular-nums">
                                    {formatPrice(
                                      payment.refunded_amount,
                                      payment.currency_code,
                                    )}
                                  </dd>
                                </div>
                              )}
                          </dl>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  )
}

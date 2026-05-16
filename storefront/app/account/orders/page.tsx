'use client'

import { useQuery } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import AccountLayout from '@/components/account/account-layout'
import Link from 'next/link'
import { Package, Loader2, ArrowUpRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'

const STROKE = 1.25

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await getMedusaClient().store.order.list()
      return response.orders
    },
    retry: false,
  })

  const orders = data || []

  return (
    <AccountLayout>
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-editorial text-foreground mt-4 leading-[0.95] tracking-tight text-[clamp(2rem,4.2vw,3rem)]">
            Your{' '}
            <span className="italic font-normal text-foreground/85">
              orders
            </span>
            .
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
            Placed
          </p>
          <p className="font-editorial text-2xl tabular-nums text-foreground mt-1.5">
            {String(orders.length).padStart(2, '0')}
          </p>
        </div>
      </header>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="hev-shell rounded-[1.25rem] p-[5px] hev-rise-soft"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="hev-core rounded-[calc(1.25rem-5px)] h-24 grid place-items-center">
                <Loader2
                  className="h-4 w-4 animate-spin text-foreground/40"
                  strokeWidth={STROKE}
                />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mx-auto max-w-md hev-shell rounded-[1.5rem] p-[5px]">
          <div className="hev-core rounded-[calc(1.5rem-5px)] p-10 text-center">
            <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
              <Package
                className="h-4 w-4 text-foreground/70"
                strokeWidth={STROKE}
              />
            </span>
            <p className="font-editorial italic text-foreground text-xl mt-5 leading-tight">
              No orders, yet.
            </p>
            <p className="mt-2 text-[13px] text-foreground/60 max-w-xs mx-auto">
              When you place your first piece, the trail begins here.
            </p>
            <Link
              href="/products"
              prefetch
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.08] text-foreground pl-4 pr-1 py-1 hev-spring-fast"
            >
              <span className="text-[12.5px] font-medium tracking-tight">
                Browse the season
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                <ArrowUpRight className="h-3 w-3" strokeWidth={STROKE} />
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3 sm:space-y-4">
          {orders.map((order: any) => {
            const date = new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            const total = order.total
              ? formatPrice(order.total, order.currency_code || 'usd')
              : '—'
            const status =
              order.fulfillment_status || order.status || 'processing'

            return (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  prefetch
                  className="group block hev-spring"
                >
                  <div className="hev-shell rounded-[1.25rem] p-[5px] hev-spring group-hover:-translate-y-[2px]">
                    <div className="hev-core rounded-[calc(1.25rem-5px)] p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                            Order
                          </p>
                          <p className="font-editorial text-foreground text-xl mt-1 leading-tight">
                            #{order.display_id || order.id.slice(-8)}
                          </p>
                          <p className="text-[12px] text-foreground/55 mt-1.5">
                            {date}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-editorial text-foreground text-xl tabular-nums">
                            {total}
                          </span>
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.04] hev-spring-fast group-hover:bg-foreground group-hover:text-background group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                          </span>
                        </div>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <p className="mt-4 pt-4 border-t border-foreground/[0.07] text-[12.5px] text-foreground/60 line-clamp-1">
                          {order.items.length} item
                          {order.items.length > 1 ? 's' : ''} ·{' '}
                          {order.items.map((i: any) => i.title).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </AccountLayout>
  )
}

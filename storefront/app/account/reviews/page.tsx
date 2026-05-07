'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import AccountLayout from '@/components/account/account-layout'
import Link from 'next/link'
import Image from 'next/image'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { Package, Loader2, ChevronRight } from 'lucide-react'

const REVIEWABLE_STATUSES = new Set(['fulfilled', 'shipped', 'delivered'])

interface ReviewableItem {
  productId: string
  productTitle: string
  variantTitle: string | null
  thumbnail: string | null
  orderId: string
  orderDisplayId: number | string
  orderedAt: string
}

export default function AccountReviewsPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await getMedusaClient().store.order.list()
      return response.orders ?? []
    },
    retry: false,
  })

  const reviewableItems: ReviewableItem[] = (orders ?? [])
    .filter((o: any) => REVIEWABLE_STATUSES.has(o.fulfillment_status))
    .flatMap((o: any) =>
      (o.items ?? [])
        .filter((item: any) => item.product_id)
        .map((item: any) => ({
          productId: item.product_id,
          productTitle: item.product_title ?? item.title ?? 'Product',
          variantTitle: item.variant_title && item.variant_title !== 'Default' ? item.variant_title : null,
          thumbnail: item.thumbnail ?? null,
          orderId: o.id,
          orderDisplayId: o.display_id ?? o.id.slice(-8),
          orderedAt: o.created_at,
        }))
    )

  return (
    <AccountLayout>
      <div>
        <h1 className="text-h2 font-heading font-semibold mb-2">Review your purchases</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Share your experience with products you&apos;ve received.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : reviewableItems.length === 0 ? (
          <div className="border border-dashed rounded-sm p-12 text-center">
            <Package className="h-8 w-8 mx-auto text-muted-foreground/40" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-muted-foreground">
              No delivered orders to review yet
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-sm font-semibold underline underline-offset-4"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reviewableItems.map((item) => {
              const href = `/review?product_id=${item.productId}&order_id=${item.orderId}`
              const thumbnail = item.thumbnail ?? getProductPlaceholder(item.productId)
              const date = new Date(item.orderedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })

              return (
                <Link
                  key={`${item.orderId}-${item.productId}`}
                  href={href}
                  className="flex items-center gap-4 border rounded-sm p-4 hover:border-accent transition-colors group"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
                    <Image
                      src={thumbnail}
                      alt={item.productTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productTitle}</p>
                    {item.variantTitle && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variantTitle}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Order #{item.orderDisplayId} · {date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-accent flex-shrink-0">
                    Write a review
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}

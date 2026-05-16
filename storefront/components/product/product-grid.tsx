'use client'

import { useProducts } from '@/hooks/use-products'
import { useQuery } from '@tanstack/react-query'
import ProductCard from './product-card'
import { AlertCircle, ArrowUpRight, Package } from 'lucide-react'

interface ProductGridProps {
  limit?: number
  collectionId?: string
  categoryId?: string
  sortBy?: string
  query?: string
}

function ProductSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="hev-rise-soft"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="hev-shell rounded-[1.5rem] p-[5px]">
        <div className="hev-core relative aspect-[3/4] rounded-[calc(1.5rem-5px)] overflow-hidden">
          <div className="absolute inset-0 bg-foreground/[0.04]" />
          {/* Skeletal shimmer band */}
          <div
            className="absolute inset-0 -translate-x-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.04), transparent)',
              animation: 'hev-shimmer 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      <div className="mt-4 px-1 space-y-2">
        <div className="h-4 w-3/4 rounded-md bg-foreground/[0.05]" />
        <div className="h-3 w-1/3 rounded-md bg-foreground/[0.04]" />
      </div>
    </div>
  )
}

export default function ProductGrid({
  limit = 8,
  collectionId,
  categoryId,
  sortBy = 'newest',
  query,
}: ProductGridProps) {
  const { data: rawProducts, isLoading, error } = useProducts({
    limit,
    collection_id: collectionId,
    category_id: categoryId,
    q: query,
  })

  const productIds = rawProducts?.map((p: any) => p.id) || []
  const { data: variantExtensions } = useQuery({
    queryKey: ['variant-extensions', productIds],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const storeId = process.env.NEXT_PUBLIC_STORE_ID
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (storeId) headers['X-Store-Environment-ID'] = storeId
      if (publishableKey) headers['x-publishable-api-key'] = publishableKey

      try {
        const res = await fetch(
          `${baseUrl}/store/product-extensions/variants/batch`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ product_ids: productIds }),
          },
        )
        if (!res.ok) return {}
        const data = await res.json()
        const results: Record<string, { compare_at_price: number | null; allow_backorder: boolean; inventory_quantity: number | null }> = {}
        for (const v of data.variants || []) {
          results[v.id] = {
            compare_at_price: v.compare_at_price,
            allow_backorder: v.allow_backorder ?? false,
            inventory_quantity: v.inventory_quantity,
          }
        }
        return results
      } catch {
        return {}
      }
    },
    enabled: productIds.length > 0,
    staleTime: 1000 * 60 * 5,
  })

  const products = rawProducts
    ? [...rawProducts].sort((a, b) => {
        switch (sortBy) {
          case 'price-low': {
            const pa = a.variants?.[0]?.calculated_price?.calculated_amount || 0
            const pb = b.variants?.[0]?.calculated_price?.calculated_amount || 0
            return pa - pb
          }
          case 'price-high': {
            const pa = a.variants?.[0]?.calculated_price?.calculated_amount || 0
            const pb = b.variants?.[0]?.calculated_price?.calculated_amount || 0
            return pb - pa
          }
          case 'name':
            return (a.title || '').localeCompare(b.title || '')
          default:
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        }
      })
    : rawProducts

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: limit }).map((_, i) => (
          <ProductSkeleton key={i} index={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md hev-shell rounded-[1.5rem] p-[5px]">
        <div className="hev-core rounded-[calc(1.5rem-5px)] p-10 text-center">
          <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
            <AlertCircle
              className="h-4 w-4 text-foreground/70"
              strokeWidth={1.25}
            />
          </span>
          <p className="font-editorial italic text-foreground text-xl mt-5 leading-tight">
            Couldn&rsquo;t load this collection.
          </p>
          <p className="mt-2 text-[13px] text-foreground/60 max-w-xs mx-auto">
            {error instanceof Error
              ? error.message
              : 'Something interrupted the request — try once more.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.08] text-foreground pl-4 pr-1 py-1 hev-spring-fast"
          >
            <span className="text-[12.5px] font-medium tracking-tight">
              Try again
            </span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.25} />
            </span>
          </button>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="mx-auto max-w-md hev-shell rounded-[1.5rem] p-[5px]">
        <div className="hev-core rounded-[calc(1.5rem-5px)] p-10 text-center">
          <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
            <Package
              className="h-4 w-4 text-foreground/70"
              strokeWidth={1.25}
            />
          </span>
          <p className="font-editorial italic text-foreground text-xl mt-5 leading-tight">
            Nothing here yet.
          </p>
          <p className="mt-2 text-[13px] text-foreground/60 max-w-xs mx-auto">
            New pieces land every other Thursday — check back soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          product={product}
          variantExtensions={variantExtensions}
        />
      ))}
    </div>
  )
}

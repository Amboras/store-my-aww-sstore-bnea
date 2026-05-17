import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // ISR: revalidate every hour
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import { Truck, RotateCcw, Shield, ChevronRight } from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import ReviewsWidget from '@/components/plugins/reviews/ReviewsWidget'
import SaleBanner from '@/components/product/sale-banner'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'
import { PluginSlot } from '@/components/PluginSlot'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'
// AMBORAS:REVIEWS:IMPORT:reviewlist-pdpafterdescription
import ReviewList from '@/components/plugins/reviews/ReviewList'
// AMBORAS:REVIEWS:IMPORT:reviewlist-pdpafterdescription:END

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const variantExtensions = await getVariantExtensions(product.id)

  // Decide whether to show the urgency banner — only when the first variant
  // has a compare_at_price that is greater than its current price.
  const firstVariantId = product.variants?.[0]?.id
  const firstExt = firstVariantId ? variantExtensions[firstVariantId] : null
  const firstCalc = product.variants?.[0]?.calculated_price
  const firstCurrent = typeof firstCalc === 'number' ? firstCalc : firstCalc?.calculated_amount
  const onSale = !!(firstExt?.compare_at_price && firstCurrent && firstExt.compare_at_price > firstCurrent)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: any) => img.url !== product.thumbnail),
  ]

  // Use placeholder if no images
  const displayImages = allImages.length > 0
    ? allImages
    : [{ url: getProductPlaceholder(product.id) }]

  return (
    <>
      <ClientPluginSlot name="pdpAnalytics" context={{ productId: product.id, productName: product.title }} />
      {/* Urgency Sale Banner */}
      {onSale && <SaleBanner endsInHours={36} label="Drop ending soon" />}

      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px] sm:max-w-none normal-case tracking-normal">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 2}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Title & Subtitle */}
            <div>
              <p className="eyebrow mb-3">
                {product.subtitle || 'The Essentials'}
              </p>
              <h1 className="text-h1 font-heading font-semibold leading-[1.05]">{product.title}</h1>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={product.variants?.[0]?.id || null}
              currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
              value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
            />

            {/* Variant Selector + Price + Add to Cart (client component) */}
            <ProductActions product={product} variantExtensions={variantExtensions} />
            <ClientPluginSlot name="pdpBelowAddToCart" context={{ productId: product.id }} />

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t">
              <div className="text-center">
                <Truck className="h-5 w-5 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Free Shipping ₹999+</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">30-Day Returns</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Secure Checkout</p>
              </div>
            </div>

            {/* Accordion Sections */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
            {/* @ts-expect-error Async Server Component */}
            <PluginSlot name="pdpAfterDescription" context={{ productId: product.id }} />
            {/* AMBORAS:REVIEWS:START id=reviewlist-pdpafterdescription slot=pdpAfterDescription */}
            <ReviewList productId={product.id} />
            {/* AMBORAS:REVIEWS:END */}
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <ReviewsWidget productId={product.id} />
    </>
  )
}

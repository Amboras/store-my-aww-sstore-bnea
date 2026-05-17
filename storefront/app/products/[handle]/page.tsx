import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // ISR: revalidate every hour
import { medusaServerClient } from '@/lib/medusa-client'
import Link from 'next/link'
import { Truck, RotateCcw, Shield, ChevronRight } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import ProductGallery from '@/components/product/product-gallery'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'
import { PluginSlot } from '@/components/PluginSlot'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

const TRUST_SIGNALS = [
  { icon: Truck, label: 'Free shipping', meta: 'Over $75 · worldwide' },
  { icon: RotateCcw, label: 'Free returns', meta: 'Within 30 days' },
  { icon: Shield, label: 'Secure checkout', meta: 'Encrypted end-to-end' },
]

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

async function getVariantExtensions(
  productId: string,
): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
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

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter(
      (img: any) => img.url !== product.thumbnail,
    ),
  ]

  const displayImages =
    allImages.length > 0
      ? allImages
      : [{ url: getProductPlaceholder(product.id) }]

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      {/* ─────────── Breadcrumb strip ─────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-6">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[440px] w-[440px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.14), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/3 right-[-10%] h-[400px] w-[400px] rounded-full blur-3xl opacity-40"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.14), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[12px] text-foreground/55"
          >
            <Link
              href="/"
              prefetch
              className="hover:text-foreground hev-spring-fast"
            >
              Home
            </Link>
            <ChevronRight
              className="h-3 w-3 text-foreground/35"
              strokeWidth={STROKE}
            />
            <Link
              href="/products"
              prefetch
              className="hover:text-foreground hev-spring-fast"
            >
              Catalogue
            </Link>
            <ChevronRight
              className="h-3 w-3 text-foreground/35"
              strokeWidth={STROKE}
            />
            <span className="text-foreground/85 truncate max-w-[40ch]">
              {product.title}
            </span>
          </nav>
        </div>
      </section>

      {/* ─────────── PDP body ─────────── */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ===== LEFT — Images ===== */}
            <ProductGallery
              images={displayImages}
              alt={product.title}
              eyebrow={product.subtitle}
            />

            {/* ===== RIGHT — Info ===== */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-7">
              {/* Invisible analytics — fires viewed-product events, renders null */}
              <PluginSlot
                name="pdpAnalytics"
                context={{
                  productId: product.id,
                  productName: product.title,
                  sku: product.handle,
                  price:
                    product.variants?.[0]?.calculated_price?.calculated_amount,
                  currency:
                    product.variants?.[0]?.calculated_price?.currency_code,
                }}
              />

              {/* Title block */}
              <header>
                <h1 className="font-editorial text-foreground mt-4 leading-[0.98] tracking-tight text-[clamp(2rem,3.6vw,3rem)]">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="mt-3 font-editorial italic text-foreground/70 text-lg leading-tight">
                    {product.subtitle}
                  </p>
                )}
                {/* Review stars, badges */}
                <PluginSlot
                  name="pdpAfterTitle"
                  context={{
                    productId: product.id,
                    productName: product.title,
                  }}
                />
              </header>

              {/* Review stars (alt placement), loyalty earn preview */}
              <PluginSlot
                name="pdpBeforePrice"
                context={{
                  productId: product.id,
                  price:
                    product.variants?.[0]?.calculated_price?.calculated_price,
                }}
              />

              {/* Variant Selector + Price + Add to Cart (client component) */}
              <ProductActions
                product={product}
                variantExtensions={variantExtensions}
              />

              {/* Wishlist, back-in-stock, loyalty points earn */}
              <PluginSlot
                name="pdpBelowAddToCart"
                context={{ productId: product.id }}
              />

              {/* Trust signals — divider-only grid, no boxing */}
              <div className="pt-6 border-t border-foreground/[0.08]">
                <div className="grid grid-cols-3 divide-x divide-foreground/[0.08]">
                  {TRUST_SIGNALS.map(({ icon: Icon, label, meta }, i) => (
                    <div
                      key={label}
                      className={`flex flex-col gap-2 px-2 sm:px-4 ${
                        i === 0
                          ? 'pl-0'
                          : i === TRUST_SIGNALS.length - 1
                            ? 'pr-0'
                            : ''
                      }`}
                    >
                      <span className="grid place-items-center h-8 w-8 rounded-full bg-foreground/[0.05]">
                        <Icon
                          className="h-3.5 w-3.5 text-foreground/70"
                          strokeWidth={STROKE}
                        />
                      </span>
                      <p className="font-editorial text-foreground text-base leading-tight">
                        {label}
                      </p>
                      <p className="text-[11px] text-foreground/55 leading-snug">
                        {meta}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom trust badges, payment icons */}
              <PluginSlot
                name="pdpTrustSignals"
                context={{ productId: product.id }}
              />

              {/* Accordion */}
              <ProductAccordion
                description={product.description}
                details={
                  product.metadata as Record<string, string> | undefined
                }
              />

              {/* Review list, size guide — after accordion */}
              <PluginSlot
                name="pdpAfterDescription"
                context={{ productId: product.id }}
              />

              {/* Extra content tabs (size chart, specs, Q&A) */}
              <PluginSlot
                name="pdpTab"
                context={{ productId: product.id }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

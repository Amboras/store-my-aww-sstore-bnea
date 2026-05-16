import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getProductImage } from '@/lib/utils/placeholder-images'
import ProductPrice, { isProductSoldOut, type VariantExtension } from './product-price'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

interface ProductCardProps {
  product: any
  variantExtensions?: Record<string, VariantExtension>
}

export default function ProductCard({ product, variantExtensions }: ProductCardProps) {
  const variant = product.variants?.[0]
  const calculatedPrice = variant?.calculated_price

  const currency = calculatedPrice?.currency_code || 'usd'
  const currentAmount = calculatedPrice?.calculated_amount
  const ext = variant?.id ? variantExtensions?.[variant.id] : null

  const soldOut = isProductSoldOut(product.variants || [], variantExtensions)

  return (
    <Link
      href={`/products/${product.handle}`}
      prefetch={true}
      className="group block hev-spring"
    >
      {/* Double-Bezel image */}
      <div className="hev-shell rounded-[1.5rem] p-[5px] hev-spring group-hover:-translate-y-1">
        <div className="hev-core relative aspect-[3/4] rounded-[calc(1.5rem-5px)] overflow-hidden">
          <Image
            src={getProductImage(product.thumbnail, product.id)}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] ${
              soldOut ? 'opacity-50' : ''
            }`}
          />

          {/* Inner highlight + subtle bottom vignette */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none opacity-0 group-hover:opacity-100 hev-spring"
            style={{
              background:
                'linear-gradient(to top, hsl(0 0% 5% / 0.35), transparent)',
            }}
          />

          {/* Sold-out eyebrow chip */}
          {soldOut && (
            <div className="absolute left-3 top-3">
              <span className="hev-eyebrow bg-background/75 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/50" />
                Sold out
              </span>
            </div>
          )}

          {/* Hover-only quick-look arrow chip (Bento detail) */}
          {!soldOut && (
            <span
              aria-hidden
              className="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/75 backdrop-blur-md border border-foreground/10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 hev-spring-fast"
            >
              <ArrowUpRight
                className="h-3.5 w-3.5 text-foreground"
                strokeWidth={1.25}
              />
            </span>
          )}
        </div>
      </div>

      {/* Title + price block — outside the card, gallery-style */}
      <div className="mt-4 px-1 space-y-1.5">
        <h3
          className={`font-editorial text-[1.05rem] sm:text-[1.15rem] leading-tight line-clamp-1 text-foreground hev-spring-fast group-hover:text-foreground/80 ${
            soldOut ? 'text-foreground/55' : ''
          }`}
        >
          {product.title}
        </h3>
        <ProductPrice
          amount={currentAmount}
          currency={currency}
          compareAtPrice={ext?.compare_at_price}
          soldOut={soldOut}
          size="card"
        />
        {/* Review stars on card, wishlist heart */}
        <ClientPluginSlot
          name="collectionCard"
          context={{ productId: product.id, productName: product.title }}
        />
      </div>
    </Link>
  )
}

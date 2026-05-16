import { formatPrice } from '@/lib/utils/format-price'

export interface VariantExtension {
  compare_at_price: number | null
  allow_backorder: boolean
  inventory_quantity: number | null
}

interface ProductPriceProps {
  /** Price amount in cents */
  amount: number | null
  /** Currency code (e.g. 'eur', 'usd') */
  currency: string
  /** Compare-at price in cents (for strikethrough) */
  compareAtPrice?: number | null
  /** Whether this product/variant is sold out */
  soldOut?: boolean
  /** 'card' for product listing, 'detail' for product detail page */
  size?: 'card' | 'detail'
}

export default function ProductPrice({
  amount,
  currency,
  compareAtPrice,
  soldOut = false,
  size = 'card',
}: ProductPriceProps) {
  if (amount == null) return null

  const formattedPrice = formatPrice(amount, currency)
  const hasDiscount = compareAtPrice != null && compareAtPrice > amount
  const formattedCompareAt = hasDiscount ? formatPrice(compareAtPrice, currency) : null

  const isCard = size === 'card'

  if (soldOut) {
    return (
      <div className="flex items-baseline gap-2">
        <span
          className={`${
            isCard
              ? 'text-[13px]'
              : 'font-editorial text-[1.75rem] leading-none'
          } text-foreground/40 line-through tabular-nums`}
        >
          {formattedPrice}
        </span>
        <span
          className={`${
            isCard ? 'text-[10px]' : 'text-[11px]'
          } uppercase tracking-[0.2em] text-foreground/55`}
        >
          Sold out
        </span>
      </div>
    )
  }

  if (hasDiscount) {
    return (
      <div className="flex items-baseline gap-2">
        <span
          className={`${
            isCard ? 'text-[12px]' : 'text-[15px]'
          } text-foreground/45 line-through tabular-nums`}
        >
          {formattedCompareAt}
        </span>
        <span
          className={`${
            isCard
              ? 'text-[13.5px] font-medium'
              : 'font-editorial text-[1.75rem] leading-none'
          } tabular-nums`}
          style={{ color: 'hsl(var(--accent))' }}
        >
          {formattedPrice}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-baseline">
      <span
        className={`${
          isCard
            ? 'text-[13.5px] text-foreground/75 tabular-nums'
            : 'font-editorial text-foreground text-[1.75rem] leading-none tabular-nums'
        }`}
      >
        {formattedPrice}
      </span>
    </div>
  )
}

/**
 * Check if ALL variants of a product are sold out based on extension data.
 */
export function isProductSoldOut(
  variants: any[],
  variantExtensions?: Record<string, VariantExtension>,
): boolean {
  if (!variantExtensions || variants.length === 0) return false
  return variants.every((v: any) => {
    const ext = variantExtensions[v.id]
    if (!ext) return false
    if (ext.allow_backorder) return false
    return ext.inventory_quantity != null && ext.inventory_quantity <= 0
  })
}

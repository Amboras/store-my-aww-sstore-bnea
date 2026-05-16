'use client'

import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import type { Product } from '@/types'

const STROKE = 1.25

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?:
    | {
        calculated_amount?: number
        currency_code?: string
      }
    | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(
  variant: ProductVariantWithPrice | undefined,
): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : (cp.calculated_amount ?? null)
}

export default function ProductActions({
  product,
  variantExtensions,
}: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const defaults: Record<string, string> = {}
      const firstVariant = variants[0]
      if (firstVariant?.options) {
        for (const opt of firstVariant.options) {
          const optionId = opt.option_id || opt.option?.id
          if (optionId && opt.value) {
            defaults[optionId] = opt.value
          }
        }
      }
      return defaults
    },
  )

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return (
      variants.find((v: ProductVariantWithPrice) => {
        if (!v.options) return false
        return v.options.every((opt: VariantOption) => {
          const optionId = opt.option_id || opt.option?.id
          if (!optionId) return false
          return selectedOptions[optionId] === opt.value
        })
      }) || variants[0]
    )
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency =
    (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock =
    !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock =
    inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity < 10

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success('Added to bag')
          trackAddToCart(
            product?.id || '',
            selectedVariant.id,
            quantity,
            currentPriceCents ?? undefined,
          )
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      },
    )
  }

  const hasMultipleVariants = variants.length > 1
  const canIncrement =
    !isOutOfStock &&
    (allowBackorder ||
      inventoryQuantity == null ||
      quantity < inventoryQuantity)

  return (
    <div className="space-y-7">
      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Option selectors */}
      {hasMultipleVariants &&
        options.map((option: ProductOptionWithValues) => {
          const values = (option.values || [])
            .map((v: string | ProductOptionValue) =>
              typeof v === 'string' ? v : v.value,
            )
            .filter(Boolean) as string[]

          if (
            values.length <= 1 &&
            (values[0] === 'One Size' || values[0] === 'Default')
          ) {
            return null
          }

          const optionId = option.id
          const selectedValue = selectedOptions[optionId]

          return (
            <div key={optionId}>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                  {option.title}
                </span>
                {selectedValue && (
                  <span className="font-editorial italic text-foreground/85 text-base leading-none">
                    {selectedValue}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const isSelected = selectedValue === value
                  const isAvailable = variants.some(
                    (v: ProductVariantWithPrice) => {
                      const hasValue = v.options?.some(
                        (o: VariantOption) =>
                          (o.option_id === optionId ||
                            o.option?.id === optionId) &&
                          o.value === value,
                      )
                      if (!hasValue) return false
                      const vExt = variantExtensions?.[v.id]
                      if (!vExt) return true
                      if (vExt.allow_backorder) return true
                      return (
                        vExt.inventory_quantity == null ||
                        vExt.inventory_quantity > 0
                      )
                    },
                  )

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionId, value)}
                      disabled={!isAvailable}
                      aria-pressed={isSelected}
                      className={`min-w-[48px] px-4 py-2 rounded-full text-[12.5px] font-medium tracking-tight hev-spring-fast ${
                        isSelected
                          ? 'bg-foreground text-background'
                          : isAvailable
                            ? 'bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]'
                            : 'bg-foreground/[0.02] text-foreground/35 line-through cursor-not-allowed'
                      }`}
                      style={
                        isSelected
                          ? undefined
                          : {
                              boxShadow:
                                'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
                            }
                      }
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

      {/* Low-stock eyebrow */}
      {isLowStock && (
        <p className="hev-eyebrow inline-flex">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'hsl(35 65% 60%)' }}
          />
          Only {inventoryQuantity} left
        </p>
      )}

      {/* Quantity + Add to Bag */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Pill quantity stepper */}
        <div
          className="inline-flex items-center rounded-full bg-foreground/[0.04] p-0.5"
          style={{
            boxShadow: 'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
          }}
        >
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="grid place-items-center h-9 w-9 rounded-full text-foreground/80 hover:bg-foreground/[0.08] hev-spring-fast disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={STROKE} />
          </button>
          <span className="w-9 text-center text-[13px] font-medium tabular-nums text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!canIncrement}
            aria-label="Increase quantity"
            className="grid place-items-center h-9 w-9 rounded-full text-foreground/80 hover:bg-foreground/[0.08] hev-spring-fast disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={STROKE} />
          </button>
        </div>

        {/* Add to bag — Button-in-Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`group flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-full pl-6 pr-1.5 py-1.5 hev-spring hev-press ${
            isOutOfStock
              ? 'bg-foreground/[0.05] text-foreground/45 cursor-not-allowed'
              : justAdded
                ? 'text-background'
                : 'bg-foreground text-background'
          }`}
          style={
            justAdded
              ? { background: 'hsl(var(--accent))' }
              : undefined
          }
        >
          <span className="text-[13px] font-medium tracking-tight pr-1">
            {isAddingItem
              ? 'Adding…'
              : justAdded
                ? 'Added to bag'
                : isOutOfStock
                  ? 'Sold out'
                  : 'Add to bag'}
          </span>
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full hev-spring-fast ${
              isOutOfStock
                ? 'bg-foreground/[0.08]'
                : 'bg-background/15 group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]'
            }`}
          >
            {isAddingItem ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={STROKE} />
            ) : justAdded ? (
              <Check className="h-3.5 w-3.5" strokeWidth={STROKE} />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
            )}
          </span>
        </button>
      </div>
    </div>
  )
}

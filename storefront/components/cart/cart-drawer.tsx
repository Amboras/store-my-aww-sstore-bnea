'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useProducts } from '@/hooks/use-products'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, Minus, Plus, Trash2, Plus as PlusSmall, Check } from 'lucide-react'
import { getProductImage } from '@/lib/utils/placeholder-images'
import { formatPrice } from '@/lib/utils/format-price'
import { PromoCodeInput } from '@/components/checkout/promo-code-input'
import type { CartLineItem } from '@/types'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// Free shipping threshold in minor units (paise for INR). ₹999 = 99,900 paise.
const FREE_SHIPPING_THRESHOLD = 99900

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cart, removeItem, updateItem, addItem, isAddingItem, itemCount, subtotal, isLoading,
    appliedPromoCodes, discountTotal, applyPromoCode, removePromoCode,
    isApplyingPromo, isRemovingPromo,
  } = useCart()

  // Suggested products for the in-cart upsell
  const { data: catalog } = useProducts({ limit: 12 })

  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !drawerRef.current) return
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  if (!isOpen) return null

  const currencyCode = cart?.currency_code || cart?.region?.currency_code || 'inr'
  const formattedSubtotal = formatPrice(subtotal || 0, currencyCode)

  // Free shipping progress
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal || 0))
  const progressPct = Math.min(100, Math.round(((subtotal || 0) / FREE_SHIPPING_THRESHOLD) * 100))
  const freeShipUnlocked = remainingForFreeShip === 0 && (subtotal || 0) > 0

  // Build the upsell list — products NOT already in the cart
  const inCartIds = new Set((cart?.items || []).map((i: CartLineItem) => i.product_id).filter(Boolean))
  const upsellCandidates = (catalog || []).filter((p: any) => !inCartIds.has(p.id)).slice(0, 3)

  const handleQuickAdd = (variantId: string) => {
    addItem({ variantId, quantity: 1 })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        onKeyDown={handleKeyDown}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-heading text-base font-semibold uppercase tracking-[0.16em]">
            Bag <span className="ml-1 text-muted-foreground tabular">({itemCount})</span>
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 -mr-2 hover:opacity-70 transition-opacity"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {(cart?.items?.length || 0) > 0 && (
          <div className="border-b px-6 py-4 bg-muted/30">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] mb-2">
              {freeShipUnlocked ? (
                <span className="font-semibold inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  Free shipping unlocked
                </span>
              ) : (
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{formatPrice(remainingForFreeShip, currencyCode)}</span>
                  <span className="ml-1">to free shipping</span>
                </span>
              )}
              <span className="tabular text-muted-foreground">{progressPct}%</span>
            </div>
            <div className="h-1 w-full bg-border overflow-hidden rounded-full">
              <div
                className="h-full bg-foreground transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-24 w-20 rounded bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-muted" />
                    <div className="h-3 w-1/3 rounded bg-muted" />
                    <div className="h-4 w-1/4 rounded bg-muted mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40" strokeWidth={1.25} />
              <p className="mt-4 text-muted-foreground">Your bag is empty</p>
              <button
                onClick={onClose}
                className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] link-underline pb-0.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item: CartLineItem) => {
                const price = item.unit_price
                const formattedPrice = formatPrice(price, currencyCode)

                return (
                  <div key={item.id} className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-28 w-22 flex-shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={getProductImage(item.thumbnail, item.product_id || item.id)}
                        alt={item.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate">{item.title}</h3>
                          {item.variant?.title && item.variant.title !== 'Default' && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.variant.title}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto pt-2 flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center border">
                          <button
                            onClick={() => updateItem({ lineId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                            className="p-2.5 hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-sm font-medium tabular">{item.quantity}</span>
                          <button
                            onClick={() => updateItem({ lineId: item.id, quantity: item.quantity + 1 })}
                            className="p-2.5 hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-medium tabular">
                          {item.quantity > 1 ? (
                            <span>{formattedPrice} × {item.quantity}</span>
                          ) : (
                            formattedPrice
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* In-cart upsell */}
              {upsellCandidates.length > 0 && (
                <div className="pt-6 border-t mt-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-1">
                    Complete the look
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add a second piece — automatic 15% off applied with code <span className="font-semibold text-foreground">BUNDLE2</span>.
                  </p>
                  <div className="space-y-3">
                    {upsellCandidates.map((p: any) => {
                      const v = p.variants?.[0]
                      const cp = v?.calculated_price
                      const amount = typeof cp === 'number' ? cp : cp?.calculated_amount
                      const cur = (typeof cp !== 'number' ? cp?.currency_code : undefined) || currencyCode
                      return (
                        <div key={p.id} className="flex items-center gap-3 group">
                          <Link href={`/products/${p.handle}`} onClick={onClose} className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-muted">
                            <Image
                              src={getProductImage(p.thumbnail, p.id)}
                              alt={p.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${p.handle}`} onClick={onClose} className="block">
                              <p className="text-sm font-medium truncate group-hover:underline">{p.title}</p>
                              {amount != null && (
                                <p className="text-xs text-muted-foreground tabular mt-0.5">
                                  {formatPrice(amount, cur)}
                                </p>
                              )}
                            </Link>
                          </div>
                          {v?.id && (
                            <button
                              onClick={() => handleQuickAdd(v.id)}
                              disabled={isAddingItem}
                              className="flex-shrink-0 inline-flex items-center justify-center h-9 w-9 border border-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                              aria-label={`Add ${p.title} to bag`}
                            >
                              <PlusSmall className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items && cart.items.length > 0 && (
          <div className="border-t px-6 py-5 space-y-4">
            <PromoCodeInput
              appliedPromoCodes={appliedPromoCodes}
              discountTotal={discountTotal}
              currencyCode={currencyCode}
              isApplyingPromo={isApplyingPromo}
              isRemovingPromo={isRemovingPromo}
              onApply={applyPromoCode}
              onRemove={removePromoCode}
            />
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Subtotal</span>
                <span className="text-lg font-heading font-semibold tabular">{formattedSubtotal}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm text-green-700 dark:text-green-500">
                  <span>Discount</span>
                  <span className="tabular">-{formatPrice(discountTotal, currencyCode)}</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
              Shipping & taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-foreground text-background text-center py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
            >
              Checkout · {formattedSubtotal}
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.18em]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}

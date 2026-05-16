'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import { logger } from '@/lib/logger'
import { useCart } from './use-cart'
import { usePaymentProviders } from './use-payment-providers'

export type CheckoutStep = 'shipping' | 'payment'

export interface ShippingAddress {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  postal_code: string
  country_code: string
  province?: string
  phone?: string
}

const SYSTEM_DEFAULT_PROVIDER_ID = 'pp_system_default'

/**
 * Map of providerId → raw `data` blob from initiated payment session.
 * Each provider adapter destructures its own provider-specific fields.
 */
export type SessionDataMap = Record<string, Record<string, unknown> | null>

export function useCheckout() {
  const { cart } = useCart()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<SessionDataMap>({})
  const initializedFor = useRef<string | null>(null)
  const [isCompletingCheckout, setIsCompletingCheckout] = useState(false)

  // Source of truth for which providers the buyer sees (via Medusa's
  // /store/payment-providers — only providers actually linked to the cart's
  // region by the merchant connecting in admin).
  const cartRegionId = (cart as any)?.region_id as string | undefined
  const { providers: availableProviders, isLoading: loadingProviders } =
    usePaymentProviders(cartRegionId)

  // Fetch shipping options immediately — only needs cart_id (region-based)
  const { data: shippingOptions, isLoading: loadingShipping } = useQuery({
    queryKey: ['shipping-options', cart?.id],
    queryFn: async () => {
      if (!cart?.id) return []
      const { shipping_options } = await getMedusaClient().store.fulfillment.listCartOptions({
        cart_id: cart.id,
      })
      return shipping_options || []
    },
    enabled: !!cart?.id,
  })

  // Save address + set shipping method, then move to payment
  const submitShippingStep = async (email: string, address: ShippingAddress, shippingOptionId: string) => {
    if (!cart?.id) return
    setIsUpdating(true)
    setError(null)

    try {
      // Save address first (required before adding shipping method)
      await getMedusaClient().store.cart.update(cart.id, {
        email,
        shipping_address: address,
        billing_address: address,
      })

      // Set shipping method — only update cart cache once, after final call
      const { cart: finalCart } = await getMedusaClient().store.cart.addShippingMethod(cart.id, {
        option_id: shippingOptionId,
      })
      queryClient.setQueryData(['cart'], finalCart)

      setStep('payment')
    } catch (err: any) {
      setError(err?.message || 'Failed to save shipping details')
    }
    finally {
      setIsUpdating(false)
    }
  }

  /**
   * Initialize a payment session for ONE provider and return its session.data.
   * Used by the parallel-init effect below — separated so each call's failure
   * doesn't block the others (one provider failing shouldn't hide the rest).
   */
  const initializeOne = async (providerId: string): Promise<Record<string, unknown> | null> => {
    if (!cart?.id) return null
    try {
      const response = await getMedusaClient().store.payment.initiatePaymentSession(cart, {
        provider_id: providerId,
      })
      const allSessions = ((response as any)?.payment_collection?.payment_sessions ?? []) as Array<{
        provider_id: string
        status: string
        data?: Record<string, unknown>
      }>
      // Per official Medusa docs: find the PENDING session (initiating a new
      // session marks the previous one canceled — pending is the active one).
      // For multi-provider eager init, we fan out a separate call per provider
      // so each ends up with its own pending session. Medusa supports multiple
      // provider sessions on a single payment_collection — only one is
      // captured at cart.complete (whichever the buyer's flow activates).
      const session =
        allSessions.find((s) => s.provider_id === providerId && s.status === 'pending') ||
        allSessions.find((s) => s.provider_id === providerId)
      return session?.data ?? null
    } catch (err) {
      logger.debug(`initiatePaymentSession failed for ${providerId}`, err)
      return null
    }
  }

  // Eager parallel init: when entering payment step, initialize a session
  // for EVERY available provider in parallel. This is the Shopify-style
  // "show everything at once" requirement — adapters render simultaneously,
  // each using its own session data. Costs N parallel API calls instead of
  // 1 — both Stripe + PayPal happily allow this and neither charges for it.
  useEffect(() => {
    if (step !== 'payment' || !cart?.id || loadingProviders) return
    // Re-init if cart changes; don't re-init if same cart already initialized
    if (initializedFor.current === cart.id) return
    if (availableProviders.length === 0) return

    initializedFor.current = cart.id
    setIsUpdating(true)

    Promise.all(
      availableProviders.map(async (p) => {
        const data = await initializeOne(p.id)
        return [p.id, data] as const
      }),
    )
      .then((entries) => {
        const next: SessionDataMap = {}
        for (const [id, data] of entries) next[id] = data
        setSessions(next)
      })
      .finally(() => setIsUpdating(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, cart?.id, loadingProviders, availableProviders.length])

  const completeCheckout = async () => {
    if (!cart?.id) return null

    // Prevent duplicate requests
    if (isCompletingCheckout) {
      logger.debug('Checkout already in progress, skipping duplicate request')
      return null
    }

    setIsCompletingCheckout(true)
    setIsUpdating(true)
    setError(null)

    try {
      // Demo fallback path — initialize the system_default session if no
      // real provider is configured for this region. Real providers (Stripe,
      // PayPal) already initialized their session via the eager effect.
      if (availableProviders.length === 0) {
        await getMedusaClient().store.payment.initiatePaymentSession(cart, {
          provider_id: SYSTEM_DEFAULT_PROVIDER_ID,
        })
      }

      const result = await getMedusaClient().store.cart.complete(cart.id)

      if (result?.type === 'order') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('medusa_cart_id')
        }
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        return result.order
      } else {
        setError('Payment is still pending. Please try again.')
        return null
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to place order'

      // Handle idempotency conflict OR already completed cart - order was already created
      if (errorMessage.includes('conflicted with another request') ||
          errorMessage.includes('Idempotency') ||
          errorMessage.includes('already completed')) {
        logger.debug('Cart already completed detected - order was created previously')

        // Try to fetch the completed cart/order
        try {
          const cartData = await getMedusaClient().store.cart.retrieve(cart.id)
          if (cartData?.cart?.completed_at) {
            // Cart was completed, clear it and treat as success
            if (typeof window !== 'undefined') {
              localStorage.removeItem('medusa_cart_id')
            }
            queryClient.invalidateQueries({ queryKey: ['cart'] })

            // Return a minimal order object with the cart ID so redirect happens
            return { id: cart.id } as any
          }
        } catch (retrieveErr) {
          console.error('Failed to retrieve cart:', retrieveErr)
          // If we can't retrieve it, just clear localStorage and show error
          if (typeof window !== 'undefined') {
            localStorage.removeItem('medusa_cart_id')
          }
          queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
      }

      setError(errorMessage)
      return null
    } finally {
      setIsUpdating(false)
      setIsCompletingCheckout(false)
    }
  }

  return {
    step,
    setStep,
    cart,
    shippingOptions: shippingOptions || [],
    loadingShipping,
    submitShippingStep,
    completeCheckout,
    isUpdating,
    error,
    clearError: () => setError(null),
    sessions,
    availableProviders,
    loadingProviders,
  }
}

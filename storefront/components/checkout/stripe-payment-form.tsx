'use client'

import { useState, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Loader2, ArrowUpRight } from 'lucide-react'

const STROKE = 1.25

interface StripePaymentFormProps {
  clientSecret: string
  stripeAccountId: string
  publishableKey: string
  onPaymentSuccess: () => void
  onError: (message: string) => void
  isCompletingOrder?: boolean
}

function CheckoutForm({
  onPaymentSuccess,
  onError,
  isCompletingOrder,
}: Pick<
  StripePaymentFormProps,
  'onPaymentSuccess' | 'onError' | 'isCompletingOrder'
>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed. Please try again.')
      } else {
        onPaymentSuccess()
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsProcessing(false)
    }
  }

  const busy = isProcessing || isCompletingOrder

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <button
        type="submit"
        disabled={!stripe || !elements || busy}
        className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press disabled:opacity-50"
      >
        <span className="text-[13px] font-medium tracking-tight pr-1">
          {isCompletingOrder
            ? 'Completing order…'
            : isProcessing
              ? 'Processing…'
              : 'Place order'}
        </span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={STROKE} />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
          )}
        </span>
      </button>
    </form>
  )
}

export function StripePaymentForm({
  clientSecret,
  stripeAccountId,
  publishableKey,
  onPaymentSuccess,
  onError,
  isCompletingOrder,
}: StripePaymentFormProps) {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey, { stripeAccount: stripeAccountId }),
    [publishableKey, stripeAccountId],
  )

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            // Editorial Luxury palette — match the Double-Bezel form chrome.
            borderRadius: '14px',
            fontFamily: 'inherit',
            fontSizeBase: '13.5px',
            colorPrimary: 'hsl(35, 40%, 50%)',
            colorText: 'hsl(0, 0%, 10%)',
            colorTextSecondary: 'hsl(0, 0%, 45%)',
            colorTextPlaceholder: 'hsl(0, 0%, 60%)',
            colorBackground: '#ffffff',
            colorIcon: 'hsl(0, 0%, 35%)',
            spacingUnit: '4px',
          },
          rules: {
            '.Tab': {
              border: '1px solid hsl(0, 0%, 88%)',
              borderRadius: '14px',
              boxShadow: 'none',
            },
            '.Tab--selected': {
              borderColor: 'hsl(0, 0%, 10%)',
              backgroundColor: 'hsl(0, 0%, 96%)',
            },
            '.Input': {
              border: '1px solid hsl(0, 0%, 88%)',
              borderRadius: '9999px',
              padding: '12px 18px',
              backgroundColor: 'hsl(0, 0%, 97%)',
              boxShadow: 'none',
            },
            '.Input:focus': {
              borderColor: 'hsl(0, 0%, 25%)',
              boxShadow: '0 0 0 2px hsl(0, 0%, 88%)',
            },
            '.Label': {
              fontSize: '10px',
              fontWeight: '500',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'hsl(0, 0%, 45%)',
            },
          },
        },
      }}
    >
      <CheckoutForm
        onPaymentSuccess={onPaymentSuccess}
        onError={onError}
        isCompletingOrder={isCompletingOrder}
      />
    </Elements>
  )
}

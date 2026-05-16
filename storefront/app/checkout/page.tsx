'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  useCheckout,
  CheckoutStep,
  ShippingAddress,
} from '@/hooks/use-checkout'
import { useCheckoutSettings } from '@/hooks/use-checkout-settings'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import {
  ShoppingBag,
  ChevronRight,
  Loader2,
  Check,
  ArrowLeft,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import { toast } from 'sonner'
import { PromoCodeInput } from '@/components/checkout/promo-code-input'
import { getProductImage } from '@/lib/utils/placeholder-images'
import { trackBeginCheckout } from '@/lib/analytics'
import { formatPrice } from '@/lib/utils/format-price'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'
import type { ShippingOption, CartLineItem, LineItem } from '@/types'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

const INPUT_BASE =
  'w-full rounded-full px-5 py-3 text-[13.5px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 hev-spring-fast'
const inputCls = (hasError: boolean) =>
  hasError
    ? `${INPUT_BASE} bg-destructive/[0.04] focus:ring-destructive/20`
    : `${INPUT_BASE} bg-foreground/[0.04] focus:ring-foreground/15`
const inputStyle = (hasError: boolean): React.CSSProperties => ({
  boxShadow: `inset 0 0 0 1px ${
    hasError
      ? 'hsl(var(--destructive) / 0.4)'
      : 'hsl(var(--foreground) / 0.06)'
  }`,
})
const labelCls =
  'text-[10px] uppercase tracking-[0.2em] text-foreground/55'

function toCurrencyValue(amount: number | null | undefined): number | undefined {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return undefined
  return Math.round(amount * 100) / 100
}

const steps: { key: CheckoutStep; label: string }[] = [
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
]

type InfoFormValues = {
  email: string
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  postal_code: string
  phone: string
  country_code: string
  province: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const {
    step,
    setStep,
    cart,
    shippingOptions,
    loadingShipping,
    submitShippingStep,
    completeCheckout,
    isUpdating,
    error,
    clearError,
    sessions,
    availableProviders,
    loadingProviders,
  } = useCheckout()

  const { data: checkoutSettings } = useCheckoutSettings()
  const { customer, isLoggedIn, isLoading: authLoading } = useAuth()
  const {
    appliedPromoCodes,
    discountTotal,
    applyPromoCode,
    removePromoCode,
    isApplyingPromo,
    isRemovingPromo,
  } = useCart()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InfoFormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      postal_code: '',
      phone: '',
      country_code: '',
      province: '',
    },
  })

  const watchedEmail = watch('email')
  const watchedAddress = watch()

  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState('')

  const hasItems = cart?.items && cart.items.length > 0
  const currency = cart?.currency_code || 'usd'

  const trackedCheckout = useRef(false)
  useEffect(() => {
    if (cart?.id && hasItems && !trackedCheckout.current) {
      trackedCheckout.current = true
      const itemCount = (cart.items || []).reduce(
        (sum: number, item: LineItem) => sum + item.quantity,
        0,
      )
      const contentIds = (cart.items || [])
        .map((item: LineItem) => item.variant_id)
        .filter(Boolean)
      const contents = (cart.items || []).map((item: LineItem) => ({
        id: item.variant_id,
        quantity: item.quantity,
        item_price: toCurrencyValue(item.unit_price),
      }))

      trackBeginCheckout(cart.id, toCurrencyValue(cart.total), currency, {
        itemCount,
        contentIds,
        contents,
      })
    }
  }, [cart?.id, hasItems, cart?.total, currency, cart?.items])

  useEffect(() => {
    if (!authLoading && checkoutSettings?.require_account && !isLoggedIn) {
      toast.error('Please sign in to continue to checkout')
      router.push('/auth/login?redirect=/checkout')
    }
  }, [authLoading, checkoutSettings?.require_account, isLoggedIn, router])

  useEffect(() => {
    if (customer?.email) {
      setValue('email', customer.email, { shouldValidate: false })
    }
  }, [customer?.email, setValue])

  const countryCodeSet = useRef(false)
  useEffect(() => {
    if (countryCodeSet.current) return
    const countryCode =
      cart?.shipping_address?.country_code ||
      cart?.region?.countries?.[0]?.iso_2
    if (countryCode) {
      countryCodeSet.current = true
      setValue('country_code', countryCode, { shouldValidate: false })
    }
  }, [
    cart?.shipping_address?.country_code,
    cart?.region?.countries,
    setValue,
  ])

  useEffect(() => {
    if (
      checkoutSettings?.marketing_opt_in?.enabled &&
      checkoutSettings.marketing_opt_in.pre_checked
    ) {
      setMarketingOptIn(true)
    }
  }, [checkoutSettings?.marketing_opt_in])

  const handleShippingSubmit = handleSubmit(async (data) => {
    if (!selectedShipping) {
      toast.error('Please select a shipping method')
      return
    }
    clearError()
    const shippingAddress: ShippingAddress = {
      first_name: data.first_name || '',
      last_name: data.last_name,
      address_1: data.address_1,
      address_2: data.address_2 || '',
      company: data.company || '',
      city: data.city,
      postal_code: data.postal_code,
      country_code: data.country_code || '',
      province: data.province || '',
      phone: data.phone || '',
    }
    await submitShippingStep(data.email, shippingAddress, selectedShipping)
  })

  const buildSuccessUrl = (order: { id: string }) =>
    `/checkout/success?order=${encodeURIComponent(order.id)}`

  const handlePlaceOrder = async () => {
    if (isUpdating) return
    clearError()
    const order = await completeCheckout()
    if (order) {
      toast.success('Order placed successfully!')
      router.push(buildSuccessUrl(order))
    }
  }

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      {/* checkoutStart slot — invisible, fires InitiateCheckout trackers */}
      <ClientPluginSlot
        name="checkoutStart"
        context={{
          cartId: cart?.id,
          itemCount: cart?.items?.length,
          total: cart?.total,
        }}
      />

      {/* ─────────────────────────── HEADER ─────────────────────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-6 lg:pb-8">
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
                'radial-gradient(circle, hsl(35 50% 70% / 0.16), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[12px] text-foreground/55 mb-6"
          >
            <Link
              href="/"
              prefetch
              className="hover:text-foreground hev-spring-fast"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-foreground/35" strokeWidth={STROKE} />
            <span className="text-foreground/85">Checkout</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-editorial text-foreground mt-4 leading-[0.95] tracking-tight text-[clamp(2rem,4.2vw,3rem)]">
                {step === 'payment' ? (
                  <>
                    One last{' '}
                    <span className="italic font-normal text-foreground/85">
                      step
                    </span>
                    .
                  </>
                ) : (
                  <>
                    Let&rsquo;s ship this{' '}
                    <span className="italic font-normal text-foreground/85">
                      out
                    </span>
                    .
                  </>
                )}
              </h1>
            </div>

            {/* Step indicator pills */}
            <div className="lg:col-span-4 lg:justify-self-end">
              <ol className="flex items-center gap-2 sm:gap-3">
                {steps.map((s, i) => {
                  const isActive = s.key === step
                  const isCompleted = step === 'payment' && s.key === 'shipping'
                  const stepBtn = (
                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted) setStep('shipping')
                      }}
                      disabled={!isCompleted}
                      className={`inline-flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1 hev-spring-fast ${
                        isActive
                          ? 'bg-foreground text-background'
                          : isCompleted
                            ? 'bg-foreground/[0.05] hover:bg-foreground/[0.09] text-foreground cursor-pointer'
                            : 'bg-foreground/[0.04] text-foreground/45 cursor-default'
                      }`}
                    >
                      <span
                        className={`grid place-items-center h-6 w-6 rounded-full ${
                          isActive
                            ? 'bg-background/15 text-background'
                            : isCompleted
                              ? 'bg-foreground text-background'
                              : 'bg-foreground/[0.08] text-foreground/55'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-3 w-3" strokeWidth={STROKE} />
                        ) : (
                          <span className="text-[10px] font-medium tabular-nums">
                            {i + 1}
                          </span>
                        )}
                      </span>
                      <span className="text-[12px] font-medium tracking-tight">
                        {s.label}
                      </span>
                    </button>
                  )
                  return (
                    <li key={s.key} className="inline-flex items-center gap-2">
                      {i > 0 && (
                        <span
                          className="h-px w-5 bg-foreground/15"
                          aria-hidden
                        />
                      )}
                      {stepBtn}
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── BODY ─────────────────────────── */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12">
            {/* ============ LEFT COLUMN ============ */}
            <div>
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 mb-6 rounded-[1.25rem] p-4"
                  style={{
                    background: 'hsl(var(--destructive) / 0.06)',
                    boxShadow:
                      'inset 0 0 0 1px hsl(var(--destructive) / 0.25)',
                  }}
                >
                  <AlertCircle
                    className="h-4 w-4 shrink-0 mt-0.5"
                    strokeWidth={STROKE}
                    style={{ color: 'hsl(var(--destructive))' }}
                  />
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: 'hsl(var(--destructive))' }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* ── STEP 1: Shipping ── */}
              {step === 'shipping' && (
                <form
                  onSubmit={handleShippingSubmit}
                  className="space-y-6"
                  noValidate
                >
                  {/* Contact */}
                  <section className="hev-shell rounded-[1.5rem] p-[5px]">
                    <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-8 space-y-5">

                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className={labelCls}>
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Please enter a valid email address',
                            },
                          })}
                          placeholder="you@yourdomain.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email ? 'email-error' : undefined
                          }
                          className={inputCls(!!errors.email)}
                          style={inputStyle(!!errors.email)}
                        />
                        {errors.email && (
                          <p
                            id="email-error"
                            role="alert"
                            className="text-[11px] text-destructive"
                          >
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {checkoutSettings?.marketing_opt_in?.enabled &&
                        checkoutSettings.marketing_opt_in.where !== 'signin' && (
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={marketingOptIn}
                              onChange={(e) =>
                                setMarketingOptIn(e.target.checked)
                              }
                              className="w-4 h-4 mt-0.5 accent-foreground rounded"
                            />
                            <span className="text-[12.5px] text-foreground/70">
                              Send me restock notes and a short dispatch.
                              Unsubscribe in one tap.
                            </span>
                          </label>
                        )}
                    </div>
                  </section>

                  {/* Shipping address */}
                  <section className="hev-shell rounded-[1.5rem] p-[5px]">
                    <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-8 space-y-5">

                      <div className="grid grid-cols-2 gap-3">
                        {checkoutSettings?.full_name === 'full' && (
                          <div className="flex flex-col gap-2">
                            <label htmlFor="first_name" className={labelCls}>
                              First name
                            </label>
                            <input
                              id="first_name"
                              type="text"
                              {...register('first_name', {
                                validate: (val) =>
                                  checkoutSettings?.full_name === 'full' &&
                                  !val?.trim()
                                    ? 'First name is required'
                                    : true,
                              })}
                              placeholder="Mira"
                              autoComplete="given-name"
                              aria-invalid={!!errors.first_name}
                              className={inputCls(!!errors.first_name)}
                              style={inputStyle(!!errors.first_name)}
                            />
                            {errors.first_name && (
                              <p
                                role="alert"
                                className="text-[11px] text-destructive"
                              >
                                {errors.first_name.message}
                              </p>
                            )}
                          </div>
                        )}

                        <div
                          className={`flex flex-col gap-2 ${
                            checkoutSettings?.full_name === 'last_only'
                              ? 'col-span-2'
                              : ''
                          }`}
                        >
                          <label htmlFor="last_name" className={labelCls}>
                            Last name
                          </label>
                          <input
                            id="last_name"
                            type="text"
                            {...register('last_name', {
                              required: 'Last name is required',
                            })}
                            placeholder="Halterman"
                            autoComplete="family-name"
                            aria-invalid={!!errors.last_name}
                            className={inputCls(!!errors.last_name)}
                            style={inputStyle(!!errors.last_name)}
                          />
                          {errors.last_name && (
                            <p
                              role="alert"
                              className="text-[11px] text-destructive"
                            >
                              {errors.last_name.message}
                            </p>
                          )}
                        </div>

                        {checkoutSettings?.company_name === 'optional' && (
                          <div className="col-span-2 flex flex-col gap-2">
                            <label htmlFor="company" className={labelCls}>
                              Company (optional)
                            </label>
                            <input
                              id="company"
                              type="text"
                              {...register('company')}
                              placeholder="Studio name"
                              autoComplete="organization"
                              className={inputCls(false)}
                              style={inputStyle(false)}
                            />
                          </div>
                        )}

                        <div className="col-span-2 flex flex-col gap-2">
                          <label htmlFor="address_1" className={labelCls}>
                            Street address
                          </label>
                          <input
                            id="address_1"
                            type="text"
                            {...register('address_1', {
                              required: 'Address is required',
                            })}
                            placeholder="Rua de Sao Bento 42"
                            autoComplete="address-line1"
                            aria-invalid={!!errors.address_1}
                            className={inputCls(!!errors.address_1)}
                            style={inputStyle(!!errors.address_1)}
                          />
                          {errors.address_1 && (
                            <p
                              role="alert"
                              className="text-[11px] text-destructive"
                            >
                              {errors.address_1.message}
                            </p>
                          )}
                        </div>

                        {checkoutSettings?.address_line_2 !== 'hidden' && (
                          <div className="col-span-2 flex flex-col gap-2">
                            <label htmlFor="address_2" className={labelCls}>
                              {checkoutSettings?.address_line_2 === 'required'
                                ? 'Apartment / suite'
                                : 'Apartment / suite (optional)'}
                            </label>
                            <input
                              id="address_2"
                              type="text"
                              {...register('address_2', {
                                validate: (val) =>
                                  checkoutSettings?.address_line_2 === 'required' &&
                                  !val?.trim()
                                    ? 'Apartment/suite is required'
                                    : true,
                              })}
                              placeholder="Apt 3F"
                              autoComplete="address-line2"
                              aria-invalid={!!errors.address_2}
                              className={inputCls(!!errors.address_2)}
                              style={inputStyle(!!errors.address_2)}
                            />
                            {errors.address_2 && (
                              <p
                                role="alert"
                                className="text-[11px] text-destructive"
                              >
                                {errors.address_2.message}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          <label htmlFor="city" className={labelCls}>
                            City
                          </label>
                          <input
                            id="city"
                            type="text"
                            {...register('city', {
                              required: 'City is required',
                            })}
                            placeholder="Lisbon"
                            autoComplete="address-level2"
                            aria-invalid={!!errors.city}
                            className={inputCls(!!errors.city)}
                            style={inputStyle(!!errors.city)}
                          />
                          {errors.city && (
                            <p
                              role="alert"
                              className="text-[11px] text-destructive"
                            >
                              {errors.city.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="postal_code" className={labelCls}>
                            Postal code
                          </label>
                          <input
                            id="postal_code"
                            type="text"
                            {...register('postal_code', {
                              required: 'Postal code is required',
                              pattern: {
                                value: /^[A-Za-z0-9\s-]{2,10}$/,
                                message: 'Please enter a valid postal code',
                              },
                            })}
                            placeholder="1200-109"
                            autoComplete="postal-code"
                            aria-invalid={!!errors.postal_code}
                            className={inputCls(!!errors.postal_code)}
                            style={inputStyle(!!errors.postal_code)}
                          />
                          {errors.postal_code && (
                            <p
                              role="alert"
                              className="text-[11px] text-destructive"
                            >
                              {errors.postal_code.message}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2 flex flex-col gap-2">
                          <label htmlFor="province" className={labelCls}>
                            State / Province
                          </label>
                          <input
                            id="province"
                            type="text"
                            {...register('province')}
                            placeholder="e.g. CA — required for US/CA"
                            autoComplete="address-level1"
                            className={inputCls(false)}
                            style={inputStyle(false)}
                          />
                        </div>

                        <div className="col-span-2 flex flex-col gap-2">
                          <label htmlFor="phone" className={labelCls}>
                            {checkoutSettings?.phone === 'required'
                              ? 'Phone'
                              : 'Phone (optional)'}
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            {...register('phone', {
                              validate: (val) => {
                                if (
                                  checkoutSettings?.phone === 'required' &&
                                  !val?.trim()
                                ) {
                                  return 'Phone is required'
                                }
                                if (
                                  val?.trim() &&
                                  !/^[\d\s+\-()]{6,20}$/.test(val)
                                ) {
                                  return 'Please enter a valid phone number'
                                }
                                return true
                              },
                            })}
                            placeholder="+351 21 000 0000"
                            autoComplete="tel"
                            aria-invalid={!!errors.phone}
                            className={inputCls(!!errors.phone)}
                            style={inputStyle(!!errors.phone)}
                          />
                          {errors.phone && (
                            <p
                              role="alert"
                              className="text-[11px] text-destructive"
                            >
                              {errors.phone.message}
                            </p>
                          )}
                        </div>

                        <input
                          type="hidden"
                          {...register('country_code')}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Shipping method */}
                  <section className="hev-shell rounded-[1.5rem] p-[5px]">
                    <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-8 space-y-5">

                      {loadingShipping ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2
                            className="h-5 w-5 animate-spin text-foreground/40"
                            strokeWidth={STROKE}
                          />
                        </div>
                      ) : shippingOptions.length === 0 ? (
                        <p className="text-[13px] text-foreground/60 italic">
                          No shipping options yet — complete the address fields
                          above.
                        </p>
                      ) : (
                        <ul className="space-y-2.5" role="radiogroup">
                          {shippingOptions.map((option: ShippingOption) => {
                            const price =
                              option.amount != null
                                ? option.amount
                                : option.prices?.[0]?.amount
                            const priceLabel =
                              price === 0
                                ? 'Free'
                                : price != null
                                  ? formatPrice(price, currency)
                                  : '—'
                            const isActive = selectedShipping === option.id
                            return (
                              <li key={option.id}>
                                <label
                                  className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 cursor-pointer hev-spring-fast ${
                                    isActive
                                      ? 'bg-foreground/[0.06]'
                                      : 'bg-foreground/[0.025] hover:bg-foreground/[0.05]'
                                  }`}
                                  style={{
                                    boxShadow: `inset 0 0 0 1px ${
                                      isActive
                                        ? 'hsl(var(--foreground) / 0.18)'
                                        : 'hsl(var(--foreground) / 0.06)'
                                    }`,
                                  }}
                                >
                                  <span className="flex items-center gap-3">
                                    <span
                                      className={`relative grid place-items-center h-5 w-5 rounded-full hev-spring-fast ${
                                        isActive
                                          ? 'bg-foreground'
                                          : 'bg-foreground/[0.06]'
                                      }`}
                                      style={
                                        !isActive
                                          ? {
                                              boxShadow:
                                                'inset 0 0 0 1px hsl(var(--foreground) / 0.15)',
                                            }
                                          : undefined
                                      }
                                      aria-hidden
                                    >
                                      {isActive && (
                                        <span className="h-2 w-2 rounded-full bg-background" />
                                      )}
                                    </span>
                                    <input
                                      type="radio"
                                      name="shipping"
                                      value={option.id}
                                      checked={isActive}
                                      onChange={() =>
                                        setSelectedShipping(option.id)
                                      }
                                      className="sr-only"
                                    />
                                    <span className="min-w-0">
                                      <span className="block font-editorial text-foreground text-base leading-tight">
                                        {option.name}
                                      </span>
                                      {option.type?.description && (
                                        <span className="block text-[12px] text-foreground/55 mt-0.5">
                                          {option.type.description}
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                  <span className="font-editorial text-foreground text-base tabular-nums shrink-0">
                                    {priceLabel}
                                  </span>
                                </label>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </section>

                  {/* Continue button */}
                  <button
                    type="submit"
                    disabled={
                      isUpdating ||
                      !hasItems ||
                      Object.keys(errors).length > 0
                    }
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press disabled:opacity-50"
                  >
                    <span className="text-[13px] font-medium tracking-tight pr-1">
                      {isUpdating ? 'Continuing…' : 'Continue to payment'}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                      {isUpdating ? (
                        <Loader2
                          className="h-3.5 w-3.5 animate-spin"
                          strokeWidth={STROKE}
                        />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                      )}
                    </span>
                  </button>
                </form>
              )}

              {/* ── STEP 2: Payment ── */}
              {step === 'payment' && (
                <div className="space-y-6">
                  {/* Confirmation summary */}
                  <section className="hev-shell rounded-[1.5rem] p-[5px]">
                    <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-7">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => setStep('shipping')}
                          className="inline-flex items-center gap-1 text-[12px] text-foreground/55 hover:text-foreground hev-spring-fast"
                        >
                          <ArrowLeft className="h-3 w-3" strokeWidth={STROKE} />
                          Edit
                        </button>
                      </div>
                      <dl className="divide-y divide-foreground/[0.07] text-[13.5px]">
                        <div className="flex justify-between py-2.5 first:pt-0">
                          <dt className="text-foreground/60">Contact</dt>
                          <dd className="text-foreground text-right truncate max-w-[60%]">
                            {watchedEmail || '—'}
                          </dd>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <dt className="text-foreground/60">Ship to</dt>
                          <dd className="text-foreground text-right truncate max-w-[60%]">
                            {watchedAddress.address_1}, {watchedAddress.city}
                          </dd>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <dt className="text-foreground/60">Method</dt>
                          <dd className="text-foreground text-right truncate max-w-[60%]">
                            {shippingOptions.find(
                              (o: ShippingOption) => o.id === selectedShipping,
                            )?.name || 'Selected'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </section>

                  {/* Payment */}
                  <section className="hev-shell rounded-[1.5rem] p-[5px]">
                    <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-8 space-y-5">

                      {(() => {
                        // Demo fallback
                        if (
                          !loadingProviders &&
                          availableProviders.length === 0
                        ) {
                          return (
                            <p className="text-[13px] text-foreground/60 leading-relaxed">
                              This is a demo store. Orders are placed using the
                              system payment provider — no real payment is
                              processed.
                            </p>
                          )
                        }

                        if (!cart) {
                          return (
                            <div className="flex items-center justify-center py-6">
                              <Loader2
                                className="h-5 w-5 animate-spin text-foreground/40"
                                strokeWidth={STROKE}
                              />
                              <span className="ml-3 text-[13px] text-foreground/55">
                                Initialising payment…
                              </span>
                            </div>
                          )
                        }

                        const expressProviders = availableProviders.filter(
                          (p) => p.kind === 'express',
                        )
                        const formProviders = availableProviders.filter(
                          (p) => p.kind !== 'express',
                        )

                        const renderAdapter = (
                          provider: (typeof availableProviders)[number],
                        ) => {
                          const Adapter = provider.Component
                          return (
                            <Adapter
                              key={provider.id}
                              cart={cart}
                              sessionData={sessions[provider.id] ?? null}
                              isCompleting={isUpdating}
                              onApproved={async () => {
                                const order = await completeCheckout()
                                if (order) {
                                  toast.success('Order placed successfully!')
                                  router.push(buildSuccessUrl(order))
                                }
                              }}
                              onError={(msg) => {
                                clearError()
                                toast.error(msg)
                              }}
                            />
                          )
                        }

                        return (
                          <div className="space-y-4">
                            {expressProviders.length > 0 && (
                              <div className="space-y-3">
                                {expressProviders.map(renderAdapter)}
                              </div>
                            )}

                            {expressProviders.length > 0 &&
                              formProviders.length > 0 && (
                                <div
                                  className="flex items-center gap-3 my-2"
                                  aria-hidden
                                >
                                  <div className="flex-1 h-px bg-foreground/10" />
                                  <span className="text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                                    or pay with card
                                  </span>
                                  <div className="flex-1 h-px bg-foreground/10" />
                                </div>
                              )}

                            {formProviders.length > 0 && (
                              <div className="space-y-3">
                                {formProviders.map(renderAdapter)}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </section>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="group inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground/80 pl-2 pr-4 py-1 hev-spring-fast"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:-translate-x-[2px]">
                        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={STROKE} />
                      </span>
                      <span className="text-[12.5px] font-medium tracking-tight">
                        Back to shipping
                      </span>
                    </button>

                    {availableProviders.length === 0 && (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isUpdating}
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press disabled:opacity-50"
                      >
                        <span className="text-[13px] font-medium tracking-tight pr-1">
                          {isUpdating ? 'Placing…' : 'Place order'}
                        </span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                          {isUpdating ? (
                            <Loader2
                              className="h-3.5 w-3.5 animate-spin"
                              strokeWidth={STROKE}
                            />
                          ) : (
                            <ArrowUpRight
                              className="h-3.5 w-3.5"
                              strokeWidth={STROKE}
                            />
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ============ RIGHT COLUMN: Order Summary ============ */}
            <div>
              <div className="lg:sticky lg:top-28 space-y-4">
                <div className="hev-shell rounded-[1.5rem] p-[5px]">
                  <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 sm:p-7 space-y-6">

                    {!hasItems ? (
                      <div className="text-center py-6">
                        <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
                          <ShoppingBag
                            className="h-4 w-4 text-foreground/70"
                            strokeWidth={STROKE}
                          />
                        </span>
                        <p className="font-editorial italic text-foreground text-lg mt-4 leading-tight">
                          Your bag is empty.
                        </p>
                        <Link
                          href="/products"
                          prefetch
                          className="group mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.08] text-foreground pl-4 pr-1 py-1 hev-spring-fast"
                        >
                          <span className="text-[12.5px] font-medium tracking-tight">
                            Browse the season
                          </span>
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                            <ArrowUpRight
                              className="h-3 w-3"
                              strokeWidth={STROKE}
                            />
                          </span>
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Items list */}
                        <ul className="divide-y divide-foreground/[0.07]">
                          {cart?.items?.map((item: CartLineItem) => (
                            <li
                              key={item.id}
                              className="flex gap-3 py-3 first:pt-0"
                            >
                              <div className="hev-shell rounded-2xl p-[3px] shrink-0">
                                <div className="hev-core relative h-16 w-14 rounded-[calc(1rem-3px)] overflow-hidden">
                                  <Image
                                    src={getProductImage(
                                      item.thumbnail,
                                      item.product_id || item.id,
                                    )}
                                    alt={item.title}
                                    fill
                                    sizes="60px"
                                    className="object-cover"
                                  />
                                  <span
                                    className="absolute -top-1 -right-1 grid place-items-center h-4 w-4 rounded-full text-[9px] font-semibold tabular-nums text-background"
                                    style={{
                                      background: 'hsl(var(--foreground))',
                                    }}
                                  >
                                    {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-editorial text-foreground text-[15px] leading-tight truncate">
                                  {item.title}
                                </p>
                                {item.variant?.title &&
                                  item.variant.title !== 'Default' && (
                                    <p className="text-[11px] text-foreground/55 mt-0.5">
                                      {item.variant.title}
                                    </p>
                                  )}
                              </div>
                              <p className="font-editorial text-foreground text-[15px] tabular-nums shrink-0">
                                {formatPrice(item.unit_price, currency)}
                              </p>
                            </li>
                          ))}
                        </ul>

                        {/* Promo code */}
                        <div className="pt-2 border-t border-foreground/[0.07]">
                          <PromoCodeInput
                            appliedPromoCodes={appliedPromoCodes}
                            discountTotal={discountTotal}
                            currencyCode={currency}
                            isApplyingPromo={isApplyingPromo}
                            isRemovingPromo={isRemovingPromo}
                            onApply={applyPromoCode}
                            onRemove={removePromoCode}
                          />
                        </div>

                        {/* Totals */}
                        <dl className="divide-y divide-foreground/[0.07] border-t border-foreground/[0.07] text-[13px]">
                          {(() => {
                            const isTaxInclusive = cart?.items?.some(
                              (item: CartLineItem) => item.is_tax_inclusive,
                            )
                            const checkoutSubtotal = isTaxInclusive
                              ? (cart?.original_item_total ?? 0)
                              : (cart?.original_item_subtotal ?? cart?.subtotal ?? 0)
                            return (
                              <>
                                <div className="flex justify-between py-2.5">
                                  <dt className="text-foreground/60">
                                    Subtotal
                                  </dt>
                                  <dd className="text-foreground tabular-nums">
                                    {formatPrice(checkoutSubtotal, currency)}
                                  </dd>
                                </div>
                                {discountTotal > 0 && (
                                  <div
                                    className="flex justify-between py-2.5"
                                    style={{ color: 'hsl(var(--accent))' }}
                                  >
                                    <dt>Discount</dt>
                                    <dd className="tabular-nums">
                                      −{formatPrice(discountTotal, currency)}
                                    </dd>
                                  </div>
                                )}
                                {cart?.shipping_total != null &&
                                  cart.shipping_total > 0 && (
                                    <div className="flex justify-between py-2.5">
                                      <dt className="text-foreground/60">
                                        Shipping
                                      </dt>
                                      <dd className="text-foreground tabular-nums">
                                        {formatPrice(
                                          cart.shipping_total,
                                          currency,
                                        )}
                                      </dd>
                                    </div>
                                  )}
                                {cart?.tax_total != null &&
                                  cart.tax_total > 0 && (
                                    <div className="flex justify-between py-2.5">
                                      <dt className="text-foreground/60">
                                        {isTaxInclusive ? 'Includes tax' : 'Tax'}
                                      </dt>
                                      <dd className="text-foreground tabular-nums">
                                        {isTaxInclusive ? '' : '+'}
                                        {formatPrice(cart.tax_total, currency)}
                                      </dd>
                                    </div>
                                  )}
                              </>
                            )
                          })()}
                        </dl>

                        <div className="pt-3 border-t border-foreground/[0.08] flex items-baseline justify-between">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                            Total
                          </span>
                          <span className="font-editorial text-foreground text-2xl tabular-nums">
                            {formatPrice(cart?.total || 0, currency)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* checkoutOrderSummary slot — loyalty redemption, upsells */}
                <ClientPluginSlot
                  name="checkoutOrderSummary"
                  context={{ cartId: cart?.id, total: cart?.total }}
                />
              </div>
            </div>
          </div>

          {/* Compliance footer */}
          <div className="mt-14 pt-8 border-t border-foreground/[0.08] text-center">
            <p className="text-[12px] text-foreground/55 leading-relaxed">
              By completing your order, you agree to our{' '}
              <Link
                href="/terms"
                prefetch
                className="text-foreground link-underline pb-0.5"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                prefetch
                className="text-foreground link-underline pb-0.5"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

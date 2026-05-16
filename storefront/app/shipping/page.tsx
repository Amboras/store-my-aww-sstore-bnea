import type { Metadata } from 'next'
import { getPolicies } from '@/lib/get-policies'
import { Truck, RotateCcw, Package } from 'lucide-react'
import { PolicyMarkdown } from '@/components/policy-markdown'
import { PolicyShell } from '@/components/policy/policy-shell'

const STROKE = 1.25

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Shipping methods, delivery times, return policy, and exchange information.',
}

const SHIPPING_METHODS: Array<{
  method: string
  time: string
  cost: string
}> = [
  { method: 'Standard', time: '5 – 7 business days', cost: 'Free over $75 · $5.99' },
  { method: 'Express', time: '2 – 3 business days', cost: '$12.00' },
  { method: 'Overnight', time: '1 business day', cost: '$25.00' },
  { method: 'International', time: '10 – 14 business days', cost: 'Calculated at checkout' },
]

export default async function ShippingPage() {
  const policies = await getPolicies()

  const shippingPolicy = policies?.shipping_policy
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : undefined

  return (
    <PolicyShell
      eyebrow="Care · ship & return"
      title={
        <>
          Shipping &amp;{' '}
          <span className="italic font-normal text-foreground/85">returns</span>.
        </>
      }
      updatedAt={updatedAt}
      subtitle="How long it takes, what it costs, and what to do when the piece isn't quite right."
    >
      {shippingPolicy ? (
        <PolicyMarkdown content={shippingPolicy} />
      ) : (
        <>
          {/* Shipping */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.05]">
                <Truck
                  className="h-4 w-4 text-foreground/70"
                  strokeWidth={STROKE}
                />
              </span>
              <h2 className="!mt-0 !mb-0">Shipping</h2>
            </div>

            <p>
              Free standard shipping on every order over $75. Pieces are
              packed within one to two business days, by hand, from the
              atelier in Lisbon.
            </p>

            {/* Editorial method table — divider-only, serif method names */}
            <ul className="not-prose mt-4 divide-y divide-foreground/[0.08] border-y border-foreground/[0.08]">
              <li className="grid grid-cols-12 gap-3 py-3 text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                <span className="col-span-4 sm:col-span-3">Method</span>
                <span className="col-span-4 sm:col-span-5">Delivery</span>
                <span className="col-span-4 sm:col-span-4 text-right">
                  Cost
                </span>
              </li>
              {SHIPPING_METHODS.map((row) => (
                <li
                  key={row.method}
                  className="grid grid-cols-12 gap-3 py-4 items-baseline"
                >
                  <span className="col-span-4 sm:col-span-3 font-editorial text-foreground text-lg leading-tight">
                    {row.method}
                  </span>
                  <span className="col-span-4 sm:col-span-5 text-[13.5px] text-foreground/70 tabular-nums">
                    {row.time}
                  </span>
                  <span className="col-span-4 sm:col-span-4 text-right text-[13.5px] text-foreground tabular-nums">
                    {row.cost}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5">
              Every parcel ships with tracking — the link lands in your inbox
              the moment the box leaves the atelier.
            </p>
          </section>

          {/* Returns */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.05]">
                <RotateCcw
                  className="h-4 w-4 text-foreground/70"
                  strokeWidth={STROKE}
                />
              </span>
              <h2 className="!mt-0 !mb-0">Returns</h2>
            </div>

            <p>
              We want the piece to feel right. If it doesn&rsquo;t, returns are
              accepted within thirty days of delivery on items that meet the
              criteria below.
            </p>
            <ul>
              <li>Unworn, unwashed, in original condition with tags attached</li>
              <li>Items marked final sale are not eligible for return</li>
              <li>Return shipping is free for domestic orders</li>
              <li>
                Approved refunds land back on the original payment method within
                five to seven business days
              </li>
            </ul>
          </section>

          {/* Exchanges */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.05]">
                <Package
                  className="h-4 w-4 text-foreground/70"
                  strokeWidth={STROKE}
                />
              </span>
              <h2 className="!mt-0 !mb-0">Exchanges</h2>
            </div>

            <p>
              Need a different size or colour? Exchanges are free on every
              full-price piece. Start one from your account, or write to the
              studio and we&rsquo;ll handle it by hand.
            </p>
          </section>
        </>
      )}
    </PolicyShell>
  )
}

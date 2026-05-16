import type { Metadata } from 'next'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'
import { PolicyShell } from '@/components/policy/policy-shell'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund eligibility, processing times, and non-refundable items.',
}

export default async function RefundPolicyPage() {
  const policies = await getPolicies()

  const policy = policies?.refund_policy
  const contactEmail = policies?.contact_email || 'support@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'March 2026'

  return (
    <PolicyShell
      eyebrow="Care · refunds"
      title={
        <>
          Refund{' '}
          <span className="italic font-normal text-foreground/85">policy</span>.
        </>
      }
      updatedAt={updatedAt}
      subtitle="Thirty days, no fuss — provided the piece comes back in the condition it left."
    >
      {policy ? (
        <PolicyMarkdown content={policy} />
      ) : (
        <>
          <section>
            <h2>Refund eligibility</h2>
            <p>
              Returns are accepted within thirty days of delivery, for full
              refund, on items that meet our return criteria.
            </p>
            <ul>
              <li>Original condition, tags attached</li>
              <li>Unworn, unwashed, undamaged</li>
              <li>Original packaging where possible</li>
            </ul>
          </section>

          <section>
            <h2>Non-refundable items</h2>
            <p>The following are final sale:</p>
            <ul>
              <li>Items marked final sale at purchase</li>
              <li>Gift cards</li>
              <li>Downloadable goods</li>
              <li>Personal care items</li>
            </ul>
          </section>

          <section>
            <h2>Processing</h2>
            <p>
              Once we receive and inspect the return, we&rsquo;ll notify you of
              approval or rejection. Approved refunds are processed within five
              to seven business days to the original payment method.
            </p>
          </section>

          <section>
            <h2>Late or missing refunds</h2>
            <p>
              If you haven&rsquo;t received the refund after seven business
              days, check your bank, then your card issuer. If it still
              hasn&rsquo;t landed, write to{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and
              we&rsquo;ll chase it.
            </p>
          </section>

          <section>
            <h2>Exchanges</h2>
            <p>
              For size or colour swaps, initiate a return and place a new order
              for the piece you want — it&rsquo;s faster than waiting on the
              exchange.
            </p>
          </section>
        </>
      )}
    </PolicyShell>
  )
}

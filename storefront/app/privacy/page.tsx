import type { Metadata } from 'next'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'
import { PolicyShell } from '@/components/policy/policy-shell'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your personal information.',
}

export default async function PrivacyPage() {
  const policies = await getPolicies()

  const policy = policies?.privacy_policy
  const contactEmail = policies?.contact_email || 'privacy@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'March 2026'

  return (
    <PolicyShell
      eyebrow="Legal · privacy"
      title={
        <>
          Privacy{' '}
          <span className="italic font-normal text-foreground/85">policy</span>.
        </>
      }
      updatedAt={updatedAt}
      subtitle="A short, plain-language note on what we collect, what we do with it, and how to opt out."
    >
      {policy ? (
        <PolicyMarkdown content={policy} />
      ) : (
        <>
          <section>
            <h2>Information we collect</h2>
            <p>
              When you visit our store, we collect device information, your
              interaction with the store, and information necessary to process
              your purchases. We may collect additional details if you contact us
              for customer support.
            </p>
          </section>

          <section>
            <h2>How we use your information</h2>
            <p>We use what we collect to:</p>
            <ul>
              <li>Process and fulfil your orders</li>
              <li>Communicate about orders, products, and seasonal dispatches</li>
              <li>Screen orders for potential risk or fraud</li>
              <li>Improve and optimise the store</li>
              <li>Share product news, only if you opt in</li>
            </ul>
          </section>

          <section>
            <h2>Sharing your information</h2>
            <p>
              We share personal information with service providers — payment
              processors, shipping carriers, analytics — strictly to deliver
              what you asked us to. No data sold, full stop.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              EU and UK residents may request access, correction, or deletion of
              the personal information we hold. Reach the studio and we&rsquo;ll
              respond within thirty days.
            </p>
          </section>

          <section>
            <h2>Data retention</h2>
            <p>
              Order information is retained for our records unless you ask us to
              delete it. Account telemetry is purged after twelve months.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For privacy questions, write to{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>
        </>
      )}
    </PolicyShell>
  )
}

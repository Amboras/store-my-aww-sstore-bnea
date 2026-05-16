import type { Metadata } from 'next'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'
import { PolicyShell } from '@/components/policy/policy-shell'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How we use cookies, third-party cookies, and how to manage your preferences.',
}

export default async function CookiePolicyPage() {
  const policies = await getPolicies()

  const policy = policies?.cookie_policy
  const contactEmail = policies?.contact_email || 'privacy@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'March 2026'

  return (
    <PolicyShell
      eyebrow="Legal · cookies"
      title={
        <>
          Cookie{' '}
          <span className="italic font-normal text-foreground/85">policy</span>.
        </>
      }
      updatedAt={updatedAt}
      subtitle="The small files we use to keep the cart working and to understand how the store is used."
    >
      {policy ? (
        <PolicyMarkdown content={policy} />
      ) : (
        <>
          <section>
            <h2>What cookies are</h2>
            <p>
              Cookies are small text files placed on your device when you visit
              our site. They make web pages work more efficiently and help us
              understand how the store is used.
            </p>
          </section>

          <section>
            <h2>How we use cookies</h2>
            <p>We use cookies for four jobs:</p>
            <ul>
              <li>
                <strong>Essential</strong> — required for the site to function
                (cart, checkout, sign-in).
              </li>
              <li>
                <strong>Analytics</strong> — help us understand how visitors
                interact with the store.
              </li>
              <li>
                <strong>Marketing</strong> — track behaviour to show relevant
                ads, only with consent.
              </li>
              <li>
                <strong>Preferences</strong> — remember your settings between
                visits.
              </li>
            </ul>
          </section>

          <section>
            <h2>Third-party cookies</h2>
            <p>
              We use third-party services — analytics, payment processors —
              that may set their own cookies. These help us analyse traffic and
              process payments securely.
            </p>
          </section>

          <section>
            <h2>Managing cookies</h2>
            <p>
              You can manage cookies through your browser settings. Disabling
              essential cookies will break the cart and checkout. Open the
              footer&rsquo;s &ldquo;Manage cookies&rdquo; control to update
              your consent at any time.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about our use of cookies?{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>
        </>
      )}
    </PolicyShell>
  )
}

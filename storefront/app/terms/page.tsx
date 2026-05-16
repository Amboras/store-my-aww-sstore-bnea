import type { Metadata } from 'next'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'
import { PolicyShell } from '@/components/policy/policy-shell'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Our terms — online store terms, pricing, and general conditions.',
}

export default async function TermsPage() {
  const policies = await getPolicies()

  const policy = policies?.terms_of_service
  const storeName = policies?.store_name || 'the studio'
  const contactEmail = policies?.contact_email || 'legal@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'March 2026'

  return (
    <PolicyShell
      eyebrow="Legal · terms"
      title={
        <>
          Terms of{' '}
          <span className="italic font-normal text-foreground/85">service</span>.
        </>
      }
      updatedAt={updatedAt}
      subtitle="The contract between you and the studio when you use the site or place an order."
    >
      {policy ? (
        <PolicyMarkdown content={policy} />
      ) : (
        <>
          <section>
            <h2>Overview</h2>
            <p>
              This website is operated by {storeName}. Throughout the site, the
              terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo;
              refer to {storeName}. We offer this site, including all
              information, tools, and services, conditioned upon your acceptance
              of these terms and the policies referenced here.
            </p>
          </section>

          <section>
            <h2>Online store terms</h2>
            <p>
              By agreeing to these terms, you represent that you are at least
              the age of majority in your jurisdiction. You may not use our
              products for any illegal or unauthorised purpose, nor may you
              violate any laws in your region.
            </p>
          </section>

          <section>
            <h2>General conditions</h2>
            <p>
              We reserve the right to refuse service to anyone for any reason at
              any time. Your content (excluding payment information) may be
              transferred unencrypted over networks and adapted to technical
              requirements.
            </p>
          </section>

          <section>
            <h2>Accuracy of information</h2>
            <p>
              The material on this site is provided for general information
              only. We may make small revisions without notice. Do not rely on
              this site as the sole basis for decisions of consequence.
            </p>
          </section>

          <section>
            <h2>Products &amp; pricing</h2>
            <p>
              Some pieces are available exclusively online and may have limited
              quantities. We reserve the right to limit quantities and to
              correct pricing or description errors when we discover them.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these terms go to{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>
        </>
      )}
    </PolicyShell>
  )
}

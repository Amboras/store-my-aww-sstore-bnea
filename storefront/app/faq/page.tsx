import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import { FaqAccordion } from './faq-accordion'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions on orders, shipping, returns, and more.',
}

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5–7 business days within the US. Express (2–3 business days) is available at checkout. International orders typically arrive within 10–14 business days.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes — we ship to forty-seven countries. International rates and delivery times vary by destination. You\'ll see the exact cost at checkout before you commit.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you\'ll receive a confirmation email with a tracking link. You can also check status anytime through your account dashboard under Orders.',
  },
  {
    q: 'Are your pieces sustainably made?',
    a: 'We work with artisans and small ateliers committed to ethical practice and low-impact materials. Packaging is recycled and recyclable, and we offset every shipment\'s carbon at point of sale.',
  },
  {
    q: 'Can I modify or cancel my order?',
    a: 'Orders can be modified or cancelled within two hours of placement. After that we begin fulfilment and may not be able to change things. Reach the studio immediately if you need help.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'Yes — complimentary on every order. Select the gift option at checkout and add a personal message; we hand-write it on the card.',
  },
  {
    q: 'How do I care for my pieces?',
    a: 'Care instructions ship with every piece and live on the product page. When in doubt, follow the label sewn into the garment or write to the studio for guidance.',
  },
]

export default function FaqPage() {
  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      {/* Header */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-10 lg:pb-12">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 right-[-10%] h-[460px] w-[460px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/3 -left-20 h-[400px] w-[400px] rounded-full blur-3xl opacity-40"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.16), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <span className="hev-eyebrow">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: 'hsl(var(--accent))' }}
                />
                Support · {String(faqs.length).padStart(2, '0')} questions
              </span>
              <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.25rem,4.8vw,3.75rem)]">
                Common{' '}
                <span className="italic font-normal text-foreground/85">
                  questions
                </span>
                .
              </h1>
              <p className="mt-4 text-[14.5px] leading-relaxed text-foreground/65 max-w-lg">
                The short answers most people need. If the one you&rsquo;re
                after isn&rsquo;t here, write to the studio — we read everything.
              </p>
            </div>

            <div className="lg:col-span-4 lg:justify-self-end">
              <Link
                href="/contact"
                prefetch
                className="group inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground pl-5 pr-1 py-1 hev-spring-fast"
              >
                <span className="text-[12.5px] font-medium tracking-tight">
                  Still stuck? Write to us
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </div>
  )
}

'use client'

import { usePolicies } from '@/hooks/use-policies'
import {
  Mail,
  MapPin,
  Clock,
  Phone,
  Loader2,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

const INPUT_CLASS =
  'w-full rounded-full bg-foreground/[0.04] px-5 py-3 text-[13.5px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/15 hev-spring-fast'
const INPUT_STYLE: React.CSSProperties = {
  boxShadow: 'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
}
const LABEL_CLASS =
  'text-[10px] uppercase tracking-[0.2em] text-foreground/55'

const TOPICS = [
  'Select a topic',
  'Order inquiry',
  'Product question',
  'Returns & exchanges',
  'Wholesale',
  'Other',
]

export default function ContactPage() {
  const { policies, isLoading, error } = usePolicies()

  const contactEmail = policies?.contact_email
  const contactPhone = policies?.contact_phone
  const contactAddress = policies?.contact_address

  const infoBlocks = [
    contactEmail && {
      key: 'email',
      icon: Mail,
      label: 'Email',
      value: contactEmail,
      meta: 'We respond within twenty-four hours',
    },
    contactPhone && {
      key: 'phone',
      icon: Phone,
      label: 'Phone',
      value: contactPhone,
      meta: 'Mon – Fri · 9am to 6pm Lisbon',
    },
    contactAddress && {
      key: 'address',
      icon: MapPin,
      label: 'Atelier',
      value: contactAddress,
      meta: null,
    },
    {
      key: 'hours',
      icon: Clock,
      label: 'Hours',
      value: 'Mon – Fri · 9am to 6pm\nSat – Sun · 10am to 4pm',
      meta: 'All times Lisbon (WET)',
    },
  ].filter(Boolean) as Array<{
    key: string
    icon: typeof Mail
    label: string
    value: string
    meta: string | null
  }>

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      {/* Header */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-10 lg:pb-12">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/3 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.18), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.5rem,5.2vw,4.5rem)]">
              Say{' '}
              <span className="italic font-normal text-foreground/85">
                hello
              </span>
              .
            </h1>
            <p className="mt-5 text-[14.5px] leading-relaxed text-foreground/65 max-w-lg">
              Questions on a piece, an order, or just want to compare notes on
              the season — write us a few lines and we&rsquo;ll get back within a
              day.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="hev-shell rounded-[1.75rem] p-[5px]">
                <div className="hev-core rounded-[calc(1.75rem-5px)] p-6 sm:p-8 lg:p-10">

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-6 space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="first" className={LABEL_CLASS}>
                          First name
                        </label>
                        <input
                          id="first"
                          type="text"
                          placeholder="Mira"
                          autoComplete="given-name"
                          className={INPUT_CLASS}
                          style={INPUT_STYLE}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="last" className={LABEL_CLASS}>
                          Last name
                        </label>
                        <input
                          id="last"
                          type="text"
                          placeholder="Halterman"
                          autoComplete="family-name"
                          className={INPUT_CLASS}
                          style={INPUT_STYLE}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className={LABEL_CLASS}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@yourdomain.com"
                        autoComplete="email"
                        className={INPUT_CLASS}
                        style={INPUT_STYLE}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="topic" className={LABEL_CLASS}>
                        Topic
                      </label>
                      <div className="relative">
                        <select
                          id="topic"
                          defaultValue=""
                          className={`${INPUT_CLASS} appearance-none pr-12 cursor-pointer`}
                          style={INPUT_STYLE}
                        >
                          {TOPICS.map((t, i) => (
                            <option
                              key={t}
                              value={i === 0 ? '' : t}
                              disabled={i === 0}
                            >
                              {t}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/55"
                          strokeWidth={STROKE}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className={LABEL_CLASS}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="A few lines about what you need…"
                        className="w-full rounded-[1.25rem] bg-foreground/[0.04] px-5 py-4 text-[13.5px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/15 resize-none hev-spring-fast"
                        style={INPUT_STYLE}
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
                      >
                        <span className="text-[13px] font-medium tracking-tight pr-1">
                          Send message
                        </span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                          <ArrowUpRight
                            className="h-3.5 w-3.5"
                            strokeWidth={STROKE}
                          />
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Info column */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-6">

                {isLoading ? (
                  <div className="hev-shell rounded-[1.5rem] p-[5px]">
                    <div className="hev-core rounded-[calc(1.5rem-5px)] h-44 grid place-items-center">
                      <Loader2
                        className="h-5 w-5 animate-spin text-foreground/40"
                        strokeWidth={STROKE}
                      />
                    </div>
                  </div>
                ) : error ? (
                  <p className="font-editorial italic text-foreground/65 text-base">
                    Couldn&rsquo;t load contact details. Try again in a moment.
                  </p>
                ) : (
                  <ul className="divide-y divide-foreground/[0.08] border-y border-foreground/[0.08]">
                    {infoBlocks.map((b) => {
                      const Icon = b.icon
                      return (
                        <li
                          key={b.key}
                          className="flex items-start gap-4 py-5"
                        >
                          <span className="grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.05] shrink-0">
                            <Icon
                              className="h-4 w-4 text-foreground/70"
                              strokeWidth={STROKE}
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                              {b.label}
                            </p>
                            <p className="font-editorial text-foreground text-lg leading-tight mt-1 whitespace-pre-line">
                              {b.value}
                            </p>
                            {b.meta && (
                              <p className="text-[12px] text-foreground/55 mt-1.5">
                                {b.meta}
                              </p>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

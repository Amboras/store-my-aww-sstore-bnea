import type { ReactNode } from 'react'
import { Cormorant_Garamond } from 'next/font/google'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

interface PolicyShellProps {
  eyebrow?: string
  /** Pass JSX so you can italicise part of the title via <span className="italic font-normal text-foreground/85">…</span>. */
  title: ReactNode
  updatedAt?: string
  subtitle?: ReactNode
  /** Page body — either <PolicyMarkdown> output or a list of fallback <section> blocks. */
  children: ReactNode
}

/**
 * Editorial Luxury chrome for policy / legal / informational pages.
 * Server-component safe (no client hooks).
 */
export function PolicyShell({
  eyebrow,
  title,
  updatedAt,
  subtitle,
  children,
}: PolicyShellProps) {
  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      {/* Header */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-10 lg:pb-12">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full blur-3xl opacity-50"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.25rem,4.6vw,3.75rem)]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-4 text-[14.5px] leading-relaxed text-foreground/65 max-w-lg">
                  {subtitle}
                </p>
              )}
            </div>

            {updatedAt && (
              <div className="lg:col-span-4 lg:justify-self-end">
                <div className="inline-flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                    Last updated
                  </span>
                  <span className="font-editorial text-foreground text-2xl mt-1.5">
                    {updatedAt}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl hev-shell rounded-[1.75rem] p-[5px]">
            <div className="hev-core rounded-[calc(1.75rem-5px)] p-8 sm:p-10 lg:p-12">
              <div className="policy-body text-[14.5px] leading-[1.75] text-foreground/75">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

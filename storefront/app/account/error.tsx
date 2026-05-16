'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, ArrowUpRight } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Account error:', error)
    }
  }, [error])

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-28 lg:pb-36">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.14), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="mx-auto max-w-lg hev-shell rounded-[1.75rem] p-[5px]">
            <div className="hev-core rounded-[calc(1.75rem-5px)] p-10 sm:p-12 text-center">
              <span className="inline-grid place-items-center h-12 w-12 rounded-full bg-foreground/[0.05]">
                <AlertCircle
                  className="h-5 w-5 text-foreground/70"
                  strokeWidth={STROKE}
                />
              </span>


              <h1 className="font-editorial text-foreground mt-5 leading-[1.0] tracking-tight text-[clamp(1.75rem,3.2vw,2.5rem)]">
                We couldn&rsquo;t load{' '}
                <span className="italic font-normal text-foreground/85">
                  your account
                </span>
                .
              </h1>

              <p className="mt-4 text-[14px] text-foreground/60 max-w-sm mx-auto leading-relaxed">
                A small glitch on our end. Try again — or head home and sign in
                once more.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={reset}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-5 pr-1 py-1 hev-spring-fast hev-press"
                >
                  <span className="text-[12.5px] font-medium tracking-tight">
                    Try again
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25">
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={STROKE} />
                  </span>
                </button>
                <Link
                  href="/"
                  prefetch
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground pl-5 pr-1 py-1 hev-spring-fast"
                >
                  <span className="text-[12.5px] font-medium tracking-tight">
                    Homepage
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

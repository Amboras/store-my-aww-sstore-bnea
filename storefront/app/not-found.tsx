import Link from 'next/link'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STROKE = 1.25

export default function NotFound() {
  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-28 lg:pb-36">
        {/* Ambient backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.18), transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[-20%] right-[-12%] h-[480px] w-[480px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.2), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="hev-shell rounded-[2rem] p-[6px]">
              <div className="hev-core rounded-[calc(2rem-6px)] p-10 sm:p-14 text-center">
                {/* Eyebrow */}

                {/* Massive editorial 404 mark */}
                <p
                  aria-hidden
                  className="font-editorial italic mt-6 leading-none tracking-tight text-foreground/[0.08]"
                  style={{ fontSize: 'clamp(8rem, 22vw, 16rem)' }}
                >
                  404
                </p>

                <h1 className="font-editorial text-foreground mt-2 leading-[1.0] tracking-tight text-[clamp(1.75rem,3.4vw,2.75rem)]">
                  This page{' '}
                  <span className="italic font-normal text-foreground/85">
                    wandered off
                  </span>
                  .
                </h1>

                <p className="mt-4 text-[14.5px] text-foreground/60 max-w-md mx-auto leading-relaxed">
                  The page you&rsquo;re looking for doesn&rsquo;t exist or
                  moved with the season. Head back to the catalogue, or start
                  again from the homepage.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/"
                    prefetch
                    className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
                  >
                    <span className="text-[13px] font-medium tracking-tight pr-1">
                      Back to home
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                      <ArrowUpRight
                        className="h-3.5 w-3.5"
                        strokeWidth={STROKE}
                      />
                    </span>
                  </Link>
                  <Link
                    href="/products"
                    prefetch
                    className="group inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground pl-5 pr-1 py-1 hev-spring-fast"
                  >
                    <span className="text-[12.5px] font-medium tracking-tight inline-flex items-center gap-1.5">
                      <ShoppingBag
                        className="h-3.5 w-3.5"
                        strokeWidth={STROKE}
                      />
                      Browse the season
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                      <ArrowUpRight
                        className="h-3.5 w-3.5"
                        strokeWidth={STROKE}
                      />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

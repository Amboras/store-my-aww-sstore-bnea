import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import { Reveal } from '@/components/marketing/reveal'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'

export const metadata: Metadata = { title: 'About — The studio' }

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const STATS = [
  { k: '47.2%', t: 'Recycled or bio-based materials, across the season' },
  { k: '90', t: 'Days of in-studio wear before any piece ships' },
  { k: 'Life', t: 'In-house hardware repair, for as long as you own it' },
  { k: '0', t: 'Net shipping emissions, offset at point of sale' },
]

const PRINCIPLES: Array<{ k: string; title: string; body: string }> = [
  {
    k: '01',
    title: 'Fewer, finer pieces',
    body: 'Each season opens with a single material study. We refine the hardware until the prototype outlasts the brief, then build the season around it. Forty-seven pieces, no filler — never an even fifty.',
  },
  {
    k: '02',
    title: 'Repair before replace',
    body: 'Anything we make, we can mend. Send the piece back, we patch the wool, re-stitch the hem, or swap out the hardware. We track the work in the same atelier that cut the original.',
  },
  {
    k: '03',
    title: 'Quiet supply chain',
    body: 'We work with eight ateliers across Portugal, northern Italy and the UK. Every supplier signs a wage-floor commitment and gets paid on the calendar week of fulfilment, not on net-90 terms.',
  },
  {
    k: '04',
    title: 'Slow over loud',
    body: 'No flash sales, no inflated MSRPs, no countdown timers. One restock per month if the inventory holds. If a piece sells out, it sells out — we would rather wait nine weeks than over-produce.',
  },
]

export default function AboutPage() {
  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay (Editorial Luxury) */}
      <div aria-hidden className="hev-grain" />

      {/* ─────────────────────────── HEADER ─────────────────────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-12 lg:pb-16">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.18), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/3 right-[-10%] h-[460px] w-[460px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.20), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
              <div className="lg:col-span-8">
                <span className="hev-eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: 'hsl(var(--accent))' }}
                  />
                  The studio · since 2024
                </span>

                <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.75rem,5.6vw,5rem)]">
                  A small practice,{' '}
                  <span className="italic font-normal text-foreground/85">
                    measured in
                  </span>{' '}
                  pieces.
                </h1>

                <p className="mt-6 text-[15px] leading-relaxed text-foreground/65 max-w-lg">
                  We design and ship a single edition each season, from a low-grid
                  atelier in Lisbon. Forty-seven pieces, refined over nine months,
                  then sent out to forty-seven countries.
                </p>
              </div>

              {/* Right-side inline anchor metrics */}
              <div className="lg:col-span-4 lg:justify-self-end">
                <dl className="grid grid-cols-2 gap-x-6 max-w-xs">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Atelier
                    </dt>
                    <dd className="font-editorial text-2xl tabular-nums text-foreground mt-1.5">
                      Lisbon
                    </dd>
                  </div>
                  <div className="border-l border-foreground/10 pl-6">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Edition
                    </dt>
                    <dd className="font-editorial text-2xl tabular-nums text-foreground mt-1.5">
                      26
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── EDITORIAL IMAGE — Z-Axis Cascade with floating chip ───────── */}
      <section className="relative overflow-hidden pb-20 lg:pb-28">
        <div className="container-custom">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-7 relative">
                <div
                  className="hev-shell rounded-[2rem] p-[6px] hev-spring"
                  style={{ transform: 'rotate(-1.2deg)' }}
                >
                  <div className="hev-core relative aspect-[5/4] rounded-[calc(2rem-6px)] overflow-hidden">
                    <Image
                      src={LIFESTYLE_PLACEHOLDER}
                      alt="The atelier — frame 03"
                      fill
                      sizes="(max-width: 1024px) 100vw, 56vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, hsl(0 0% 5% / 0.35), transparent)',
                      }}
                    />
                    <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
                      <span className="hev-eyebrow bg-background/70 backdrop-blur">
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ background: 'hsl(var(--accent))' }}
                        />
                        Inside the atelier · 03
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating "sample table" chip */}
                <div
                  className="absolute right-2 sm:-right-3 -bottom-5 sm:-bottom-8 max-w-[280px] hev-shell rounded-[1.5rem] p-[5px] hev-spring hidden sm:block"
                  style={{ transform: 'rotate(2deg)' }}
                >
                  <div className="hev-core rounded-[calc(1.5rem-5px)] px-4 py-3 flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-full shrink-0"
                      style={{
                        background:
                          'conic-gradient(from 140deg, hsl(var(--accent) / 0.85), hsl(35 50% 70% / 0.75), hsl(var(--accent) / 0.45))',
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 leading-none">
                        Sample table
                      </p>
                      <p className="font-editorial italic text-[15px] leading-tight text-foreground mt-1">
                        12 in-house, 9 in test
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pull-quote / manifesto */}
              <div className="lg:col-span-5">
                <span className="hev-eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: 'hsl(var(--accent))' }}
                  />
                  Manifesto
                </span>

                <p className="font-editorial text-foreground mt-5 leading-[1.05] tracking-tight text-[clamp(1.75rem,3vw,2.5rem)]">
                  &ldquo;Everyday objects should be{' '}
                  <span className="italic">made to outlast</span> the season they
                  were cut for. Anything else is{' '}
                  <span className="italic">noise</span>.&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="inline-block h-px w-10"
                    style={{ background: 'hsl(var(--foreground) / 0.25)' }}
                  />
                  <span className="text-[12px] uppercase tracking-[0.2em] text-foreground/55">
                    Studio brief · 2024
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── STATS — divider-only ─────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="container-custom">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-foreground/[0.08] border-y border-foreground/[0.08]">
              {STATS.map((s, i) => (
                <div
                  key={s.t}
                  className={`py-8 lg:py-10 ${
                    i === 0 ? 'lg:pl-0 lg:pr-8' : 'lg:px-8'
                  } ${i % 2 === 1 ? 'pl-6 lg:pl-8' : 'pr-6 lg:pr-8'}`}
                >
                  <p className="font-editorial text-foreground text-[clamp(2.25rem,3.6vw,3rem)] leading-none tabular-nums">
                    {s.k}
                  </p>
                  <p className="mt-3 text-[13px] text-foreground/65 leading-relaxed max-w-[22ch]">
                    {s.t}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── PRINCIPLES ─────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="hev-eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: 'hsl(var(--accent))' }}
                  />
                  Operating principles
                </span>

                <h2 className="font-editorial mt-5 leading-[0.95] tracking-tight text-[clamp(2rem,3.6vw,3rem)] text-foreground">
                  Four rules,{' '}
                  <span className="italic font-normal text-foreground/85">
                    no exceptions
                  </span>
                  .
                </h2>

                <p className="mt-5 text-[14px] leading-relaxed text-foreground/65 max-w-xs">
                  Written on the studio wall. Re-read every Monday before any
                  decision goes into production.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <ul className="divide-y divide-foreground/[0.08] border-y border-foreground/[0.08]">
                {PRINCIPLES.map((p, i) => (
                  <Reveal key={p.k} delay={i * 90}>
                    <li className="grid grid-cols-12 gap-4 py-8 lg:py-10">
                      <div className="col-span-2 lg:col-span-1">
                        <span className="font-editorial italic text-foreground/45 text-2xl tabular-nums">
                          {p.k}
                        </span>
                      </div>
                      <div className="col-span-10 lg:col-span-11">
                        <h3 className="font-editorial text-foreground text-[clamp(1.5rem,2.4vw,2rem)] leading-tight tracking-tight">
                          {p.title}
                        </h3>
                        <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/70 max-w-xl">
                          {p.body}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── SECONDARY EDITORIAL IMAGE ─────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="container-custom">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5 lg:order-1 order-2">
                <span className="hev-eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: 'hsl(var(--accent))' }}
                  />
                  Sustainability
                </span>

                <h2 className="font-editorial text-foreground mt-5 leading-[1.0] tracking-tight text-[clamp(2rem,3.6vw,2.75rem)]">
                  Quiet on the{' '}
                  <span className="italic font-normal text-foreground/85">
                    supply chain
                  </span>
                  ,<br />loud on the receipt.
                </h2>

                <p className="mt-6 text-[14.5px] leading-relaxed text-foreground/70 max-w-md">
                  Every order ships in recycled or recyclable packaging. We offset
                  one hundred percent of shipping emissions through verified
                  carbon removal — and we publish the receipt every quarter, line
                  by line, on the studio journal.
                </p>

                <Link
                  href="/products"
                  prefetch
                  className="group relative inline-flex items-center gap-2 mt-8 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
                >
                  <span className="text-[13px] font-medium tracking-tight pr-1">
                    Browse the season
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                  </span>
                </Link>
              </div>

              <div className="lg:col-span-7 lg:order-2 order-1 relative">
                <div
                  className="hev-shell rounded-[2rem] p-[6px] hev-spring"
                  style={{ transform: 'rotate(1deg)' }}
                >
                  <div className="hev-core relative aspect-[5/4] rounded-[calc(2rem-6px)] overflow-hidden">
                    <Image
                      src={HERO_PLACEHOLDER}
                      alt="Season 26 — first look"
                      fill
                      sizes="(max-width: 1024px) 100vw, 56vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, hsl(0 0% 5% / 0.35), transparent)',
                      }}
                    />
                    <div className="absolute right-5 top-5 sm:right-6 sm:top-6">
                      <span className="hev-eyebrow bg-background/70 backdrop-blur">
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ background: 'hsl(var(--accent))' }}
                        />
                        Edition 26 · Frame 02
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── CLOSING CTA ─────────────────────────── */}
      <section className="relative overflow-hidden py-28 lg:py-36">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute bottom-[-25%] left-1/2 -translate-x-1/2 h-[680px] w-[820px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="hev-eyebrow">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: 'hsl(var(--accent))' }}
                />
                What next
              </span>

              <h2 className="font-editorial mt-5 leading-[0.95] tracking-tight text-[clamp(2.25rem,4.4vw,3.5rem)] text-foreground">
                Open the season,{' '}
                <span className="italic font-normal text-foreground/85">
                  or write to the studio
                </span>
                .
              </h2>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Link
                  href="/products"
                  prefetch
                  className="group relative inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
                >
                  <span className="text-[13px] font-medium tracking-tight pr-1">
                    Browse the catalogue
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                  </span>
                </Link>
                <Link
                  href="/contact"
                  prefetch
                  className="group relative inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground pl-5 pr-1 py-1 hev-spring-fast"
                >
                  <span className="text-[12.5px] font-medium tracking-tight">
                    Contact the studio
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

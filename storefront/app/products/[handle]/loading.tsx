export default function ProductDetailLoading() {
  return (
    <div>
      {/* Breadcrumb strip skeleton */}
      <section className="pt-28 sm:pt-32 lg:pt-36 pb-6">
        <div className="container-custom">
          <div className="h-3 w-56 rounded-full bg-foreground/[0.05]" />
        </div>
      </section>

      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ── Image skeleton ── */}
            <div className="space-y-3 sm:space-y-4">
              <div
                className="hev-shell rounded-[2rem] p-[6px] hev-rise-soft"
                style={{ animationDelay: '0ms' }}
              >
                <div className="hev-core relative aspect-[3/4] rounded-[calc(2rem-6px)] overflow-hidden">
                  <div className="absolute inset-0 bg-foreground/[0.04]" />
                  <div
                    className="absolute inset-0 -translate-x-full"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.04), transparent)',
                      animation: 'hev-shimmer 1.6s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="hev-shell rounded-[1rem] p-[4px] hev-rise-soft"
                    style={{ animationDelay: `${80 + i * 70}ms` }}
                  >
                    <div className="hev-core relative aspect-[3/4] rounded-[calc(1rem-4px)] overflow-hidden">
                      <div className="absolute inset-0 bg-foreground/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Info skeleton ── */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-7">
              {/* Eyebrow + title */}
              <div className="space-y-4">
                <div className="h-5 w-32 rounded-full bg-foreground/[0.06]" />
                <div className="h-12 w-4/5 rounded-md bg-foreground/[0.06]" />
                <div className="h-4 w-2/5 rounded-md bg-foreground/[0.04]" />
              </div>

              {/* Price */}
              <div className="h-8 w-32 rounded-md bg-foreground/[0.06]" />

              {/* Variant pills */}
              <div className="space-y-3">
                <div className="h-3 w-16 rounded bg-foreground/[0.05]" />
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-14 rounded-full bg-foreground/[0.05]"
                    />
                  ))}
                </div>
              </div>

              {/* Quantity + Add to bag */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-28 rounded-full bg-foreground/[0.05]" />
                <div className="h-12 flex-1 min-w-[200px] rounded-full bg-foreground/[0.08]" />
              </div>

              {/* Trust signals */}
              <div className="pt-6 border-t border-foreground/[0.08]">
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-2.5">
                      <div className="h-8 w-8 rounded-full bg-foreground/[0.05]" />
                      <div className="h-4 w-24 rounded bg-foreground/[0.05]" />
                      <div className="h-3 w-20 rounded bg-foreground/[0.04]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Accordion */}
              <div className="border-t border-foreground/[0.08]">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-6 py-5 border-b border-foreground/[0.08]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-4 rounded bg-foreground/[0.05]" />
                      <div className="h-5 w-40 rounded bg-foreground/[0.05]" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-foreground/[0.05]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

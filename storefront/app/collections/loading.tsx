export default function CollectionsLoading() {
  return (
    <div>
      {/* ── Header skeleton ── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-12 lg:pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-8 space-y-5">
              <div className="h-5 w-44 rounded-full bg-foreground/[0.06]" />
              <div className="h-16 w-[min(640px,90%)] rounded-md bg-foreground/[0.06]" />
              <div className="h-4 w-[min(440px,80%)] rounded-md bg-foreground/[0.04]" />
            </div>
            <div className="lg:col-span-4 lg:justify-self-end grid grid-cols-2 gap-x-6 max-w-xs">
              <div className="space-y-2">
                <div className="h-2.5 w-20 rounded bg-foreground/[0.05]" />
                <div className="h-6 w-16 rounded bg-foreground/[0.06]" />
              </div>
              <div className="space-y-2 border-l border-foreground/10 pl-6">
                <div className="h-2.5 w-20 rounded bg-foreground/[0.05]" />
                <div className="h-6 w-16 rounded bg-foreground/[0.06]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid skeleton ── */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="hev-rise-soft"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="hev-shell rounded-[1.75rem] p-[5px]">
                  <div className="hev-core relative aspect-[4/5] rounded-[calc(1.75rem-5px)] overflow-hidden">
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
                <div className="mt-4 px-1 space-y-2">
                  <div className="h-3 w-full max-w-[260px] rounded-md bg-foreground/[0.04]" />
                  <div className="h-3 w-2/3 max-w-[180px] rounded-md bg-foreground/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

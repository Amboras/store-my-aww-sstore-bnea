import { notFound } from 'next/navigation'
import { medusaServerClient } from '@/lib/medusa-client'
import ProductGrid from '@/components/product/product-grid'
import { PluginSlot } from '@/components/PluginSlot'
import { Cormorant_Garamond } from 'next/font/google'
import { Reveal } from '@/components/marketing/reveal'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

async function getCollection(handle: string) {
  try {
    const response = await medusaServerClient.store.collection.list({
      handle: [handle],
    })
    return response.collections?.[0] || null
  } catch (error) {
    console.error('Error fetching collection:', error)
    return null
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const collection = await getCollection(handle)

  if (!collection) {
    notFound()
  }

  const description = collection.metadata?.description
  const hasDescription = typeof description === 'string' && description

  const titleWords = String(collection.title ?? '').trim().split(/\s+/)
  const titleLead = titleWords.slice(0, -1).join(' ')
  const titleTail = titleWords.length > 1 ? titleWords[titleWords.length - 1] : ''
  const singleWord = !titleTail

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
            className="absolute top-1/3 right-[-12%] h-[460px] w-[460px] rounded-full blur-3xl opacity-45"
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

                <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2.75rem,5.6vw,5rem)]">
                  {singleWord ? (
                    <span className="italic font-normal">{collection.title}</span>
                  ) : (
                    <>
                      {titleLead}{' '}
                      <span className="italic font-normal text-foreground/85">
                        {titleTail}
                      </span>
                    </>
                  )}
                </h1>

                {hasDescription && (
                  <p className="mt-6 text-[15px] leading-relaxed text-foreground/65 max-w-xl">
                    {description as string}
                  </p>
                )}
              </div>

              {/* Right inline metric */}
              <div className="lg:col-span-4 lg:justify-self-end">
                <dl className="grid grid-cols-2 gap-x-6 max-w-xs">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      Handle
                    </dt>
                    <dd className="font-editorial text-2xl tabular-nums text-foreground mt-1.5 truncate">
                      {String(collection.handle).slice(0, 10) || '—'}
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

      {/* ─────────────────────────── BODY ─────────────────────────── */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          {/* Filter enhancements, promo banners */}
          <PluginSlot
            name="collectionAboveGrid"
            context={{
              collectionId: collection.id,
              collectionTitle: collection.title,
            }}
          />

          <Reveal delay={100}>
            <ProductGrid collectionId={collection.id} limit={100} />
          </Reveal>

          {/* Load-more extensions, banners */}
          <PluginSlot
            name="collectionBelowGrid"
            context={{ collectionId: collection.id }}
          />
        </div>
      </section>
    </div>
  )
}

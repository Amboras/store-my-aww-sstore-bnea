## Installed Plugins

### product reviews
npm: @amboras-dev/reviews

star ratings and customer reviews for your product

**Components (written to your workspace — edit freely):**

> BEFORE rendering any of these components, open the file with the Read tool and read the exported TypeScript `Props` interface. Required props MUST be passed or the build will fail with a type error at runtime.

`StarRating` — Reusable star rating display (read-only or interactive)
  Destination:    `components/plugins/reviews/StarRating.tsx`
  Required props: rating: number
  Optional props: size: sm | md | lg, onRate: (rating: number) => void, interactive: boolean
  Usage:          `<StarRating rating={4.5} />`

`ReviewsWidget` — Product page reviews section — shows approved reviews with stats, pagination, media, and merchant replies
  Destination:    `components/plugins/reviews/ReviewsWidget.tsx`
  Required props: productId: string

  Usage:          `<ReviewsWidget productId={product.id} />`

`OrderReviewForm` — Order detail page review section — shows review status per item with write/edit forms and discount code reward
  Destination:    `components/plugins/reviews/OrderReviewForm.tsx`
  Required props: items: Array<{ id, product_id, product_title, variant_title?, thumbnail? }>, orderId: string
  Optional props: orderFulfillmentStatus: string
  Usage:          `<OrderReviewForm orderId={order.id} items={order.items} orderFulfillmentStatus={order.fulfillment_status} />`

**Hooks (from npm package — import, do not copy):**

`useProductReviews` — `useProductReviews(productId: string, options?: { page?, perPage? })`
  Returns: { data: { reviews, stats, count }, isLoading, error }
  Import:  `import { useProductReviews } from '@amboras-dev/reviews'`

`useMyReviews` — `useMyReviews(options?: { orderIds?: string[] })`
  Returns: { data: { reviews: MyReview[] }, isLoading }
  Import:  `import { useMyReviews } from '@amboras-dev/reviews'`

`useCreateReview` — `useCreateReview()`
  Returns: { mutateAsync, isPending } — input: { product_id, order_id, rating, title?, content?, media? }
  Import:  `import { useCreateReview } from '@amboras-dev/reviews'`

`useUpdateReview` — `useUpdateReview()`
  Returns: { mutateAsync, isPending } — input: { reviewId, rating?, title?, content?, media? }
  Import:  `import { useUpdateReview } from '@amboras-dev/reviews'`

**API endpoints:**
  GET  /store/products/:id/reviews — public approved reviews + stats
  GET  /store/reviews/me — customer own reviews (filter by order_ids)
  POST /store/reviews — submit review (verified purchase + discount code)
  PUT  /store/reviews/:id — edit own review (re-moderation)
  GET    /admin/reviews — list all reviews (filter by status, product_id)  ← admin auth required
  GET    /admin/reviews/:id — single review detail  ← admin auth required
  POST   /admin/reviews/:id/status — approve/reject with reply  ← admin auth required
  DELETE /admin/reviews/:id — soft delete  ← admin auth required
  GET    /admin/review-settings — get review configuration  ← admin auth required
  POST   /admin/review-settings — update review configuration  ← admin auth required

**AI Tools (available in chat — call directly):**

`update_review_settings` — Update any review setting. All fields optional, only provided fields are saved.
  Use when merchant asks to change: auto-accept threshold, discount rewards, email reminders, branding.
  Example: update_review_settings({ auto_accept_threshold: 4, discount_enabled: true, review_discount_percent: 20 })

`install_plugin` — Reinstall the reviews plugin (re-fetches components, re-runs pnpm add).
`list_plugins` — Check if reviews plugin is installed and what version.

### Klaviyo
npm: @amboras-dev/klaviyo

Email and SMS marketing for ecommerce — flows, segments, and predictive analytics powered by your store data.

**Components (written to your workspace — edit freely):**

> BEFORE rendering any of these components, open the file with the Read tool and read the exported TypeScript `Props` interface. Required props MUST be passed or the build will fail with a type error at runtime.

`KlaviyoProvider` — Loads klaviyo.js when a publicKey is provided. Renders nothing when null — disconnect propagates cleanly on the next render.
  Destination:    `app/layout.tsx`
  Required props: children: ReactNode, publicKey: string | null— pass from getActiveIntegrations()
  Optional props: strategy: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' (optional, default afterInteractive)
  Usage:          `<KlaviyoProvider publicKey={klaviyoPublicKey}>{children}</KlaviyoProvider>`

`KlaviyoViewedProduct` — Drop-in PDP component. Fires Klaviyo's "Viewed Product" event once per productId. Renders null. Safe to render from a Server Component PDP.
  Destination:    `app/products/[handle]/page.tsx`
  Required props: productId: string, productName: string
  Optional props: sku: string | null, brand: string | null, price: number | null (optional, in major units, NOT cents), imageUrl: string | null, categories: string[], currencyCode: string | null (optional, ISO 4217)
  Usage:          `<KlaviyoViewedProduct productId={product.id} productName={product.title} sku={firstVariant.sku} price={firstVariant.calculated_price.calculated_amount / 100} currencyCode={firstVariant.calculated_price.currency_code} />`

**Hooks (from npm package — import, do not copy):**

`useKlaviyoIdentifyEffect` — `useKlaviyoIdentifyEffect(email: string | null | undefined, extra?: KlaviyoIdentifyAttributes)`
  Returns: void — fires klaviyo.identify on email transitions. Dedupes via ref so re-renders don't spam Klaviyo.
  Import:  `import { useKlaviyoIdentifyEffect } from '@amboras-dev/klaviyo'`

`useKlaviyoTrack` — `useKlaviyoTrack(): (metric: string, properties?: KlaviyoEventProperties) => void`
  Returns: A stable callback. Use to fire custom or e-commerce events (Added to Cart, etc.) from client components.
  Import:  `import { useKlaviyoTrack } from '@amboras-dev/klaviyo'`

`klaviyoTrack` — `klaviyoTrack(metric: string, properties?: KlaviyoEventProperties): void`
  Returns: Imperative variant. Call from event handlers (e.g. add-to-cart click) without needing a hook.
  Import:  `import { klaviyoTrack } from '@amboras-dev/klaviyo'`

`klaviyoIdentify` — `klaviyoIdentify(attrs: KlaviyoIdentifyAttributes): void`
  Returns: Imperative identify. Use after login/register flows where useEffect doesn't fit.
  Import:  `import { klaviyoIdentify } from '@amboras-dev/klaviyo'`

`getActiveIntegrations` — `getActiveIntegrations(opts?: { baseUrl?, publishableKey?, cache?, revalidate? }): Promise<ActiveIntegrationsResponse | null>`
  Returns: Server-only — import from "@amboras-dev/klaviyo/server". Fetches /store/integrations/active from Medusa with 60s revalidation. Returns null on any failure (fail-closed).
  Import:  `import { getActiveIntegrations } from '@amboras-dev/klaviyo'`

**API endpoints:**
  GET /store/integrations/active — { klaviyo: { enabled, publicKey } | null } — used by getActiveIntegrations() at render time
  GET    /api/v1/integrations/klaviyo/status — { enabled, accountId?, organizationName? }  ← admin auth required
  POST   /api/v1/integrations/klaviyo/connect — body { privateKey } — validates with Klaviyo + encrypts + syncs to Medusa  ← admin auth required
  POST   /api/v1/integrations/klaviyo/disconnect — soft-deletes credential + signals Medusa to drop cache  ← admin auth required

**Onboarding:**

You are wiring the @amboras-dev/klaviyo plugin into a Next.js storefront. The plugin's npm package and `.claude/plugins.md` manifest are already installed in the workspace — read
  `.claude/plugins.md` first to learn the public API surface (KlaviyoProvider, KlaviyoViewedProduct, klaviyoTrack, klaviyoIdentify, useKlaviyoIdentifyEffect, getActiveIntegrations).

  Your job is to wire those imports into the merchant's storefront code. Do every step below. Each must be idempotent — if a re-run sees the wiring already in place, skip it cleanly.
  Don't duplicate event firings.

  ## 1. Load klaviyo.js (root layout)

  Edit `app/layout.tsx`:
  - Make `RootLayout` async if it isn't already.
  - Import `getActiveIntegrations` from `@amboras-dev/klaviyo/server` and `KlaviyoProvider` from `@amboras-dev/klaviyo`.
  - At the top of the layout body, fetch integrations and extract the public key:
    const integrations = await getActiveIntegrations()
    const klaviyoPublicKey = integrations?.klaviyo?.enabled ? integrations.klaviyo.publicKey : null


  ## 2. Track Viewed Product (PDP)

  Edit `app/products/[handle]/page.tsx` (the product detail page — usually a Server Component):
  - Import `KlaviyoViewedProduct` from `@amboras-dev/klaviyo`.
  - Render it ONCE per page render with the product's data:
  - productId: the product id (`prod_*`)
  - productName: the product title
  - sku: first variant's sku, or null
  - price: first variant's calculated_price.calculated_amount divided by 100 (Klaviyo wants major units, NOT cents)
  - currencyCode: first variant's calculated_price.currency_code
  - imageUrl: product thumbnail or first product image
  - Place it BEFORE the rest of the PDP content so the event fires as early as possible.

  ## 3. Identify customer on auth (login + register)

  Edit the auth hook (search for `hooks/use-auth.ts` or wherever login/register live):
  - Import `klaviyoIdentify` from `@amboras-dev/klaviyo`.
  - After a successful login (`medusaClient.auth.login(...)` resolves) AND after a successful register, fetch the customer (`medusaClient.store.customer.retrieve()`) and call:
    klaviyoIdentify({
      $email: customer.email,
      $first_name: customer.first_name,
      $last_name: customer.last_name,
      $phone_number: customer.phone,
    })
  - Skip nullish fields. Only fire after the customer object is loaded.

  ## 4. Track Added to Cart (cart hook)

  Edit the cart hook (search for `hooks/use-cart.ts` or whatever owns `addLineItem`):
  - Import `klaviyoTrack` from `@amboras-dev/klaviyo`.
  - After a successful `addLineItem` call (when the cart returns updated), fire:
    klaviyoTrack('Added to Cart', {
      AddedItemProductID: <THE PRODUCT ID, e.g. prod_*. NOT the variant id.>,
      AddedItemVariantID: <variant id, e.g. variant_*>,
      AddedItemSKU: ,
      AddedItemProductName: ,
      AddedItemQuantity: ,
      AddedItemPrice: <unit price in major units, /100 from Medusa cents>,
      $value: <unit price * quantity in major units>,
      Items: <full updated cart items array, mapped to {ProductID, VariantID, SKU, ProductName, Quantity, ItemPrice, RowTotal, ImageURL}>,
      ItemCount: ,
      CheckoutURL: ,
    })
  - Critical: `AddedItemProductID` MUST be the product id (`prod_*`), not the variant id. The variant id goes in `AddedItemVariantID`. This convention matches Klaviyo's Shopify
  integration so flow templates work.

  ## 5. Track Started Checkout + identify on email (checkout page)

  Edit `app/checkout/page.tsx` (or the equivalent checkout route):
  - Import `klaviyoTrack` and `klaviyoIdentify` from `@amboras-dev/klaviyo`.
  - When the user enters the checkout (e.g. on mount of the email step), fire:
    klaviyoTrack('Started Checkout', {
      $value: cart.total / 100,
      Items: <cart items array, same shape as Added to Cart>,
      ItemCount: ,
      CheckoutURL: ,
      CurrencyCode: cart.region?.currency_code,
    })
  - When the user fills in the email field at checkout (BEFORE login), call:
    klaviyoIdentify({ $email: enteredEmail })
  (Bind on email change, dedupe via the hook variant `useKlaviyoIdentifyEffect` or via your own ref.)

  ## DO NOT do these

  - Do NOT add a marketing-consent checkbox to the checkout. That's a separate "Marketing consent capture" install action the merchant explicitly opts into (legal/regional
  implications).
  - Do NOT modify `next.config.mjs` — the package handles its own Next.js compatibility.
  - Do NOT install or remove other npm packages. The plugin is already pinned at the right version.

  ## Property name convention

  All event property names follow Klaviyo's Shopify integration convention exactly. Capitalization matters: `ProductID` not `productId`, `AddedItemSKU` not `AddedItemSku`, etc. This
  lets out-of-the-box Klaviyo flow templates work without remapping.

  When done, summarize for the merchant: which files you edited, which events are now firing, and any storefront-specific decisions you made (e.g. "I used `hooks/use-cart-store.ts`
  because that's where this storefront's cart logic lives").

**Uninstall:**

You are uninstalling the @amboras-dev/klaviyo plugin from a Next.js storefront. The npm package will be removed automatically; your job is to remove the wiring from the storefront
  source.

  Be surgical — only remove imports and call sites of the klaviyo package. Don't touch unrelated code.

  ## 1. Remove klaviyo from `app/layout.tsx`

  - Remove the `import { KlaviyoProvider } from '@amboras-dev/klaviyo'` and `import { getActiveIntegrations } from '@amboras-dev/klaviyo/server'` lines.
  - Remove the `await getActiveIntegrations()` call and the `klaviyoPublicKey` variable.
  - Remove the `<KlaviyoProvider>` wrapper, leaving its children in place.
  - If `RootLayout` is now sync (no other awaits), revert `async`. If other awaits remain, keep `async`.

  ## 2. Remove `<KlaviyoViewedProduct>` from the PDP

  - In `app/products/[handle]/page.tsx`, remove the import and the JSX usage of `<KlaviyoViewedProduct ... />`.

  ## 3. Remove identify calls from the auth hook

  - Remove the `import { klaviyoIdentify } from '@amboras-dev/klaviyo'` line.
  - Remove every `klaviyoIdentify(...)` call site from login + register success handlers.
  - If the import was used nowhere else, drop it.

  ## 4. Remove cart event tracking

  - Remove the `import { klaviyoTrack }` line.
  - Remove the `klaviyoTrack('Added to Cart', { ... })` call from the addLineItem success path.

  ## 5. Remove checkout tracking + identify

  - Remove the `klaviyoTrack` and `klaviyoIdentify` imports.
  - Remove the `klaviyoTrack('Started Checkout', ...)` call.
  - Remove the `klaviyoIdentify({ $email })` call from the email-entry step.

  ## DO NOT

  - Do NOT remove `@amboras-dev/klaviyo` from package.json or pnpm-lock.yaml — the platform handles dependency removal.
  - Do NOT delete `.claude/plugins.md` — the platform regenerates it.
  - Do NOT touch the merchant's actual cart / auth / checkout business logic. Only the lines that import or call into `@amboras-dev/klaviyo`.

  When done, summarize what files you edited and what you removed. Note any klaviyo-related code you couldn't safely remove (if any) so the merchant can review.

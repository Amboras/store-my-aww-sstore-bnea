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

'use client'

import { useState } from 'react'
import { useProductReviews } from '@amboras-dev/reviews'
import { MessageCircle, Loader2 } from 'lucide-react'
import StarRating from './StarRating'

interface Props {
  productId: string
}

const PER_PAGE = 5

export default function ReviewsWidget({ productId }: Props) {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useProductReviews(productId, {
    page,
    perPage: PER_PAGE,
  })

  if (isLoading) {
    return (
      <section className="border-t py-10">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (error) {
    return null
  }

  const reviews = data?.reviews || []
  const stats = data?.stats
  const totalCount = data?.count || 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE))

  const hasReviews = totalCount > 0

  return (
    <section className="border-t py-10 lg:py-14">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h3 font-heading font-semibold mb-6">
            Customer Reviews
          </h2>

          {/* Summary */}
          {hasReviews && stats ? (
            <div className="grid sm:grid-cols-[auto,1fr] gap-8 pb-8 border-b">
              {/* Average rating */}
              <div className="text-center sm:text-left">
                <div className="text-4xl font-heading font-semibold">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="mt-2">
                  <StarRating rating={stats.averageRating} size="md" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on {stats.totalCount} review
                  {stats.totalCount === 1 ? '' : 's'}
                </p>
              </div>

              {/* Distribution bars */}
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = stats.distribution?.[stars] || 0
                  const percent =
                    stats.totalCount > 0
                      ? (count / stats.totalCount) * 100
                      : 0
                  return (
                    <div
                      key={stars}
                      className="grid grid-cols-[auto,1fr,auto] items-center gap-3 text-xs"
                    >
                      <span className="w-8 text-muted-foreground">
                        {stars} star
                      </span>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground tabular-nums">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 border border-dashed rounded-sm text-center">
              <MessageCircle
                className="h-8 w-8 mx-auto text-muted-foreground/40"
                strokeWidth={1.5}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          )}

          {/* Reviews list */}
          {hasReviews && (
            <div className="mt-8 space-y-8">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-b last:border-b-0 pb-8 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <StarRating rating={review.rating} size="sm" />
                      {review.title && (
                        <h3 className="mt-2 font-medium">{review.title}</h3>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {review.customer_name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(review.created_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {review.content && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                      {review.content}
                    </p>
                  )}

                  {/* Media */}
                  {review.media && review.media.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.media.map((m, idx) =>
                        m.type === 'image' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={idx}
                            src={m.url}
                            alt=""
                            className="w-20 h-20 object-cover rounded-sm border"
                          />
                        ) : (
                          <video
                            key={idx}
                            src={m.url}
                            className="w-20 h-20 object-cover rounded-sm border"
                            controls
                          />
                        ),
                      )}
                    </div>
                  )}

                  {/* Merchant reply */}
                  {review.reply && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-accent/40 bg-muted/30 rounded-sm py-3 pr-3">
                      <p className="text-xs font-medium text-accent mb-1">
                        Store response
                      </p>
                      <p className="text-sm text-foreground/80 whitespace-pre-line">
                        {review.reply}
                      </p>
                      {review.reply_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.reply_at).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border rounded-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border rounded-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

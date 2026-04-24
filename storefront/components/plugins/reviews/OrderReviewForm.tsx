'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Pencil, Check, Gift, Copy } from 'lucide-react'
import {
  useMyReviews,
  useCreateReview,
  useUpdateReview,
} from '@amboras-dev/reviews'
import StarRating from './StarRating'

interface OrderItemSummary {
  id: string
  product_id: string
  product_title: string
  variant_title?: string
  thumbnail?: string | null
}

interface Props {
  items: OrderItemSummary[]
  orderId: string
  orderFulfillmentStatus?: string
}

export default function OrderReviewForm({
  items,
  orderId,
  orderFulfillmentStatus,
}: Props) {
  const { data, isLoading } = useMyReviews({ orderIds: [orderId] })
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [discountCode, setDiscountCode] = useState<string | null>(null)

  // Only allow reviews after shipment/delivery
  const canReview =
    orderFulfillmentStatus === 'shipped' ||
    orderFulfillmentStatus === 'partially_shipped' ||
    orderFulfillmentStatus === 'delivered' ||
    orderFulfillmentStatus === 'fulfilled'

  if (isLoading) {
    return (
      <div className="border rounded-sm p-5">
        <h2 className="font-medium mb-4">Reviews</h2>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const reviewsByProduct = new Map(
    (data?.reviews || []).map((r) => [r.product_id, r]),
  )

  // Deduplicate items by product_id (multiple variants of same product)
  const uniqueItems = Array.from(
    new Map(items.map((i) => [i.product_id, i])).values(),
  )

  return (
    <div className="border rounded-sm p-5">
      <h2 className="font-medium mb-1">Reviews</h2>
      <p className="text-xs text-muted-foreground mb-4">
        {canReview
          ? 'Share your experience with these items'
          : 'You can leave a review once your order ships'}
      </p>

      {discountCode && (
        <div className="mb-4 rounded-sm border border-accent/40 bg-accent/5 p-3 flex items-start gap-3">
          <Gift className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              Thanks for your review! Here&apos;s your discount code:
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 bg-background border rounded-sm px-2 py-1.5 text-sm font-mono truncate">
                {discountCode}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(discountCode)
                  toast.success('Code copied to clipboard')
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs border rounded-sm hover:bg-muted transition-colors"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {uniqueItems.map((item) => {
          const existingReview = reviewsByProduct.get(item.product_id)
          const isEditing = editingItem === item.product_id

          return (
            <div
              key={item.id}
              className="border rounded-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 flex-shrink-0 bg-muted rounded overflow-hidden">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={item.product_title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{item.product_title}</h4>
                  {item.variant_title && item.variant_title !== 'Default' && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.variant_title}
                    </p>
                  )}

                  {/* Existing review display */}
                  {existingReview && !isEditing && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <StarRating rating={existingReview.rating} size="sm" />
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            existingReview.status === 'approved'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : existingReview.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {existingReview.status === 'approved'
                            ? 'Published'
                            : existingReview.status === 'pending'
                              ? 'Awaiting approval'
                              : 'Rejected'}
                        </span>
                      </div>
                      {existingReview.title && (
                        <p className="mt-2 text-sm font-medium">
                          {existingReview.title}
                        </p>
                      )}
                      {existingReview.content && (
                        <p className="mt-1 text-sm text-foreground/80 whitespace-pre-line">
                          {existingReview.content}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setEditingItem(item.product_id)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4 hover:text-accent transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit review
                      </button>
                    </div>
                  )}

                  {/* Write / edit form */}
                  {!existingReview && canReview && !isEditing && (
                    <button
                      type="button"
                      onClick={() => setEditingItem(item.product_id)}
                      className="mt-3 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-muted transition-colors"
                    >
                      Write a review
                    </button>
                  )}

                  {!canReview && !existingReview && (
                    <p className="mt-3 text-xs text-muted-foreground italic">
                      Available after shipment
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <ReviewForm
                  productId={item.product_id}
                  orderId={orderId}
                  existingReview={existingReview || null}
                  onCancel={() => setEditingItem(null)}
                  onSuccess={(code) => {
                    setEditingItem(null)
                    if (code) setDiscountCode(code)
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ReviewFormProps {
  productId: string
  orderId: string
  existingReview: {
    id: string
    rating: number
    title: string | null
    content: string | null
  } | null
  onCancel: () => void
  onSuccess: (discountCode: string | null) => void
}

function ReviewForm({
  productId,
  orderId,
  existingReview,
  onCancel,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [title, setTitle] = useState(existingReview?.title || '')
  const [content, setContent] = useState(existingReview?.content || '')

  const createReview = useCreateReview()
  const updateReview = useUpdateReview()

  const isPending = createReview.isPending || updateReview.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating < 1) {
      toast.error('Please select a rating')
      return
    }

    try {
      if (existingReview) {
        await updateReview.mutateAsync({
          reviewId: existingReview.id,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        })
        toast.success('Review updated — awaiting re-approval')
        onSuccess(null)
      } else {
        const result = await createReview.mutateAsync({
          product_id: productId,
          order_id: orderId,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        })
        toast.success('Thanks for your review!')
        onSuccess(result.discount_code || null)
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit review')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t pt-4">
      <div>
        <label className="block text-xs font-medium mb-1.5">
          Your rating <span className="text-destructive">*</span>
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRate={setRating}
        />
      </div>

      <div>
        <label htmlFor={`title-${productId}`} className="block text-xs font-medium mb-1.5">
          Title (optional)
        </label>
        <input
          id={`title-${productId}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Sum it up in a few words"
          className="w-full px-3 py-2 text-sm border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor={`content-${productId}`} className="block text-xs font-medium mb-1.5">
          Your review (optional)
        </label>
        <textarea
          id={`content-${productId}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="What did you like or dislike? How was the fit and quality?"
          className="w-full px-3 py-2 text-sm border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending || rating < 1}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {existingReview ? 'Update review' : 'Submit review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium border rounded-sm hover:bg-muted disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

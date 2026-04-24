'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  Loader2,
  Pencil,
  Check,
  Gift,
  Copy,
  ImagePlus,
  X,
  Play,
} from 'lucide-react'
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

// Media upload constraints
const MAX_FILES = 5
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

interface MediaItem {
  url: string
  type: 'image' | 'video'
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
    media?: MediaItem[] | null
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
  const [media, setMedia] = useState<MediaItem[]>(existingReview?.media || [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createReview = useCreateReview()
  const updateReview = useUpdateReview()

  const isPending = createReview.isPending || updateReview.isPending || uploading

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Strip data URL prefix (e.g. "data:image/jpeg;base64,")
        const base64 = result.split(',')[1] || ''
        resolve(base64)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

  const validateFile = (file: File): string | null => {
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type)
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      return `${file.name}: unsupported file type`
    }
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return `${file.name}: image must be under 5MB`
    }
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return `${file.name}: video must be under 50MB`
    }
    return null
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Reset so same file can be re-picked after removal
    if (fileInputRef.current) fileInputRef.current.value = ''

    if (media.length + files.length > MAX_FILES) {
      toast.error(`You can attach up to ${MAX_FILES} files total`)
      return
    }

    // Validate all files upfront
    for (const file of files) {
      const err = validateFile(file)
      if (err) {
        toast.error(err)
        return
      }
    }

    setUploading(true)
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
      const storeId = process.env.NEXT_PUBLIC_STORE_ID

      const uploaded: MediaItem[] = []

      for (const file of files) {
        const base64 = await fileToBase64(file)
        const type: 'image' | 'video' = ACCEPTED_IMAGE_TYPES.includes(file.type)
          ? 'image'
          : 'video'

        const res = await fetch(`${backendUrl}/store/reviews/upload`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': publishableKey,
            ...(storeId ? { 'X-Store-Environment-ID': storeId } : {}),
          },
          body: JSON.stringify({
            filename: file.name,
            mime_type: file.type,
            content: base64,
          }),
        })

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}))
          throw new Error(errJson.message || `Failed to upload ${file.name}`)
        }

        const json = await res.json()
        const url = json.url || json.file?.url || json.media?.url
        if (!url) {
          throw new Error(`No URL returned for ${file.name}`)
        }

        uploaded.push({ url, type })
      }

      setMedia((prev) => [...prev, ...uploaded])
      toast.success(
        `${uploaded.length} ${uploaded.length === 1 ? 'file' : 'files'} attached`,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index))
  }

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
          media: media.length > 0 ? media : undefined,
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
          media: media.length > 0 ? media : undefined,
        })
        toast.success('Thanks for your review!')
        onSuccess(result.discount_code || null)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit review'
      toast.error(message)
    }
  }

  const canAddMore = media.length < MAX_FILES

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

      {/* Media upload */}
      <div>
        <label className="block text-xs font-medium mb-1.5">
          Photos & videos (optional)
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Up to {MAX_FILES} files · Images under 5MB · Videos under 50MB
        </p>

        {media.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
            {media.map((item, idx) => (
              <div
                key={idx}
                className="relative aspect-square bg-muted rounded-sm overflow-hidden group border"
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={`Upload ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/90 rounded-full p-1.5">
                        <Play className="h-3 w-3 text-foreground fill-foreground" />
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(idx)}
                  disabled={isPending}
                  aria-label="Remove"
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:cursor-not-allowed"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {canAddMore && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',')}
              multiple
              onChange={handleFileSelect}
              disabled={isPending}
              className="hidden"
              id={`media-${productId}`}
            />
            <label
              htmlFor={`media-${productId}`}
              className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-medium border border-dashed rounded-sm transition-colors ${
                isPending
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-muted cursor-pointer'
              }`}
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploading
                ? 'Uploading…'
                : media.length > 0
                  ? `Add more (${media.length}/${MAX_FILES})`
                  : 'Add photos or videos'}
            </label>
          </>
        )}
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

/**
 * Stub for @amboras-dev/reviews hooks.
 * The reviews plugin package is not currently installed.
 * These stubs return empty/no-op results so the build succeeds.
 */
import { useMutation, useQuery } from '@tanstack/react-query'

interface MediaItem {
  url: string
  type: 'image' | 'video'
}

interface Review {
  id: string
  product_id: string
  order_id: string
  rating: number
  title: string | null
  content: string | null
  status: 'pending' | 'approved' | 'rejected'
  customer_name?: string | null
  created_at: string
  reply?: string | null
  reply_at?: string | null
  media?: MediaItem[] | null
  discount_code?: string | null
}

interface ReviewStats {
  averageRating: number
  totalCount: number
  distribution?: Record<number, number>
}

interface ProductReviewsResult {
  reviews: Review[]
  count: number
  stats?: ReviewStats
}

interface MyReviewsResult {
  reviews: Review[]
}

interface CreateReviewResult {
  discount_code?: string | null
}

export function useProductReviews(_productId: string, _opts?: { page?: number; perPage?: number }) {
  return useQuery<ProductReviewsResult>({
    queryKey: ['product-reviews-stub', _productId],
    queryFn: async (): Promise<ProductReviewsResult> => ({ reviews: [], count: 0 }),
    enabled: false,
  })
}

export function useMyReviews(_opts?: { orderIds?: string[] }) {
  return useQuery<MyReviewsResult>({
    queryKey: ['my-reviews-stub', _opts?.orderIds],
    queryFn: async (): Promise<MyReviewsResult> => ({ reviews: [] }),
    enabled: false,
  })
}

export function useCreateReview() {
  return useMutation<CreateReviewResult, Error, unknown>({
    mutationFn: async (_data: unknown): Promise<CreateReviewResult> => ({ discount_code: null }),
  })
}

export function useUpdateReview() {
  return useMutation<unknown, Error, unknown>({
    mutationFn: async (_data: unknown): Promise<unknown> => ({}),
  })
}

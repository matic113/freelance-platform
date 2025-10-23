import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { 
  adminReviewService, 
  Review, 
  ReviewStats 
} from '@/services/adminReview.service';
import { PageResponse } from '@/types/api';

const reviewQueryKeys = {
  all: ['admin', 'reviews'] as const,
  list: (params: Record<string, unknown>) => ['admin', 'reviews', 'list', params] as const,
  detail: (id: string) => ['admin', 'reviews', 'detail', id] as const,
  byUser: (userId: string, params: Record<string, unknown>) => 
    ['admin', 'reviews', 'user', userId, params] as const,
  byRating: (rating: number, params: Record<string, unknown>) => 
    ['admin', 'reviews', 'rating', rating, params] as const,
  lowRated: (params: Record<string, unknown>) => ['admin', 'reviews', 'low-rated', params] as const,
  search: (query: string, params: Record<string, unknown>) => 
    ['admin', 'reviews', 'search', query, params] as const,
  stats: ['admin', 'reviews', 'stats'] as const,
};

interface UseReviewsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const useAdminReviews = (
  params: UseReviewsParams = {},
  options?: UseQueryOptions<PageResponse<Review>>
) => {
  return useQuery({
    queryKey: reviewQueryKeys.list(params),
    queryFn: () => adminReviewService.getAllReviews(params),
    ...options,
  });
};

export const useAdminReview = (
  reviewId: string,
  options?: UseQueryOptions<Review>
) => {
  return useQuery({
    queryKey: reviewQueryKeys.detail(reviewId),
    queryFn: () => adminReviewService.getReviewById(reviewId),
    enabled: !!reviewId,
    ...options,
  });
};

export const useAdminReviewsForUser = (
  userId: string,
  params: UseReviewsParams = {},
  options?: UseQueryOptions<PageResponse<Review>>
) => {
  return useQuery({
    queryKey: reviewQueryKeys.byUser(userId, params),
    queryFn: () => adminReviewService.getReviewsForUser(userId, params),
    enabled: !!userId,
    ...options,
  });
};

export const useAdminReviewsByRating = (
  rating: number,
  params: UseReviewsParams = {},
  options?: UseQueryOptions<PageResponse<Review>>
) => {
  return useQuery({
    queryKey: reviewQueryKeys.byRating(rating, params),
    queryFn: () => adminReviewService.getReviewsByRating(rating, params),
    enabled: rating >= 1 && rating <= 5,
    ...options,
  });
};

export const useAdminLowRatedReviews = (
  params: UseReviewsParams = {},
  options?: UseQueryOptions<PageResponse<Review>>
) => {
  return useQuery({
    queryKey: reviewQueryKeys.lowRated(params),
    queryFn: () => adminReviewService.getLowRatedReviews(params),
    ...options,
  });
};

export const useAdminSearchReviews = (
  query: string,
  params: UseReviewsParams = {},
  options?: UseQueryOptions<PageResponse<Review>>
) => {
  return useQuery({
    queryKey: reviewQueryKeys.search(query, params),
    queryFn: () => adminReviewService.searchReviews(query, params),
    enabled: !!query && query.trim().length > 0,
    ...options,
  });
};

export const useAdminReviewStats = (
  options?: UseQueryOptions<ReviewStats>
) => {
  return useQuery({
    queryKey: reviewQueryKeys.stats,
    queryFn: () => adminReviewService.getReviewStats(),
    ...options,
  });
};

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => 
      adminReviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
    },
  });
};

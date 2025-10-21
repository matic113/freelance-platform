import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { ReviewResponse, CreateReviewRequest, PageResponse } from '@/types/api';

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  user: (userId: string) => [...reviewKeys.all, 'user', userId] as const,
  contract: (contractId: string) => [...reviewKeys.all, 'contract', contractId] as const,
  statistics: (userId: string) => [...reviewKeys.all, 'statistics', userId] as const,
  search: (query: string) => [...reviewKeys.all, 'search', query] as const,
};

// Get all reviews with filters
export const useReviews = (params?: {
  userId?: string;
  contractId?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: reviewKeys.list(params || {}),
    queryFn: () => reviewService.getReviews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get review by ID
export const useReview = (id: string) => {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewService.getReview(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get reviews for user
export const useUserReviews = (userId: string, params?: {
  type?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: reviewKeys.user(userId),
    queryFn: () => reviewService.getUserReviews(userId, params),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get reviews for contract
export const useContractReviews = (contractId: string, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: reviewKeys.contract(contractId),
    queryFn: () => reviewService.getContractReviews(contractId, page, size),
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user review statistics
export const useUserReviewStatistics = (userId: string) => {
  return useQuery({
    queryKey: reviewKeys.statistics(userId),
    queryFn: () => reviewService.getUserReviewStatistics(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search reviews
export const useSearchReviews = (query: string, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: reviewKeys.search(query),
  queryFn: () => reviewService.searchReviews(query, page, size),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get current user's reviews (both sent and received)
export const useMyReviews = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['reviews', 'my-reviews', page, size],
    queryFn: () => reviewService.getMyReviews(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create review mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data) => {
      // Add review to cache
      queryClient.setQueryData(reviewKeys.detail(data.id), data);
      // Invalidate related queries used across the UI
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'search'] });
      queryClient.invalidateQueries({ queryKey: reviewKeys.user(data.revieweeId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.contract(data.contractId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.statistics(data.revieweeId) });
    },
    onError: (error) => {
      console.error('Create review error:', error);
    },
  });
};

// Update review mutation
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateReviewRequest }) =>
      reviewService.updateReview(id, data),
    onSuccess: (data, variables) => {
      // Update review in cache
      queryClient.setQueryData(reviewKeys.detail(variables.id), data);
      // Invalidate related queries used across the UI
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'search'] });
      queryClient.invalidateQueries({ queryKey: reviewKeys.user(data.revieweeId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.contract(data.contractId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.statistics(data.revieweeId) });
    },
    onError: (error) => {
      console.error('Update review error:', error);
    },
  });
};

// Delete review mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: (_, reviewId) => {
      // Remove review from cache
      queryClient.removeQueries({ queryKey: reviewKeys.detail(reviewId) });
      // Invalidate related queries used across the UI
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'search'] });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (error) => {
      console.error('Delete review error:', error);
    },
  });
};

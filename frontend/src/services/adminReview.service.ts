import { apiService } from './api';
import { PageResponse } from '@/types/api';

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  revieweeId: string;
  revieweeName: string;
  revieweeEmail: string;
  rating: number;
  comment?: string;
  additionalFeedback?: string;
  projectName?: string;
  projectCategory?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewStats {
  totalReviews: number;
  rating5Count: number;
  rating4Count: number;
  rating3Count: number;
  rating2Count: number;
  rating1Count: number;
  averageRating: number;
}

interface PaginatedParams {
  page?: number;
  size?: number;
  sort?: string;
}

const defaultPagination: Required<Pick<PaginatedParams, 'page' | 'size'>> = {
  page: 0,
  size: 20,
};

export const adminReviewService = {
  getAllReviews: async (params: PaginatedParams = {}): Promise<PageResponse<Review>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Review>>('/admin/reviews', { params: mergedParams });
  },

  getReviewById: async (reviewId: string): Promise<Review> => {
    return apiService.get<Review>(`/admin/reviews/${reviewId}`);
  },

  getReviewsForUser: async (userId: string, params: PaginatedParams = {}): Promise<PageResponse<Review>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Review>>(`/admin/reviews/user/${userId}`, { params: mergedParams });
  },

  getReviewsByRating: async (rating: number, params: PaginatedParams = {}): Promise<PageResponse<Review>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Review>>(`/admin/reviews/rating/${rating}`, { params: mergedParams });
  },

  getLowRatedReviews: async (params: PaginatedParams = {}): Promise<PageResponse<Review>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Review>>('/admin/reviews/low-rated', { params: mergedParams });
  },

  searchReviews: async (query: string, params: PaginatedParams = {}): Promise<PageResponse<Review>> => {
    const mergedParams = { ...defaultPagination, ...params, query };
    return apiService.get<PageResponse<Review>>('/admin/reviews/search', { params: mergedParams });
  },

  getReviewStats: async (): Promise<ReviewStats> => {
    return apiService.get<ReviewStats>('/admin/reviews/stats');
  },

  deleteReview: async (reviewId: string): Promise<string> => {
    return apiService.delete<string>(`/admin/reviews/${reviewId}`);
  },
};

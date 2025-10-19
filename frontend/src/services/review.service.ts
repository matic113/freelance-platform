import { apiService } from './api';
import { 
  ReviewResponse, 
  CreateReviewRequest,
  PageResponse
} from '@/types/api';

export const reviewService = {
  // Test endpoint to verify API is working
  testApi: async (): Promise<any> => {
    return apiService.get('/reviews/test');
  },

  // Get current user's reviews (both sent and received)
  getMyReviews: async (page: number = 0, size: number = 20): Promise<PageResponse<ReviewResponse>> => {
    return apiService.get<PageResponse<ReviewResponse>>('/reviews/my-reviews', {
      params: { page, size },
    });
  },

  // Get all reviews with filters
  getReviews: async (params?: {
    userId?: string;
    contractId?: string;
    minRating?: number;
    maxRating?: number;
    page?: number;
    size?: number;
  }): Promise<PageResponse<ReviewResponse>> => {
    // Convert page/size to Spring Boot pagination format
    const queryParams: any = {};
    if (params?.userId) queryParams.userId = params.userId;
    if (params?.contractId) queryParams.contractId = params.contractId;
    if (params?.minRating) queryParams.minRating = params.minRating;
    if (params?.maxRating) queryParams.maxRating = params.maxRating;
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.size !== undefined) queryParams.size = params.size;
    
    return apiService.get<PageResponse<ReviewResponse>>('/reviews', { params: queryParams });
  },

  // Create review
  createReview: async (data: CreateReviewRequest): Promise<ReviewResponse> => {
    return apiService.post<ReviewResponse>('/reviews', data);
  },

  // Get review by ID
  getReview: async (id: string): Promise<ReviewResponse> => {
    return apiService.get<ReviewResponse>(`/reviews/${id}`);
  },

  // Get reviews for user
  getUserReviews: async (userId: string, params?: {
    type?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<ReviewResponse>> => {
    return apiService.get<PageResponse<ReviewResponse>>(`/reviews/user/${userId}`, { params });
  },

  // Get reviews for contract
  getContractReviews: async (contractId: string, page: number = 0, size: number = 20): Promise<PageResponse<ReviewResponse>> => {
    return apiService.get<PageResponse<ReviewResponse>>(`/reviews/contract/${contractId}`, {
      params: { page, size },
    });
  },

  // Get user review statistics
  getUserReviewStatistics: async (userId: string): Promise<any> => {
    return apiService.get(`/reviews/statistics/${userId}`);
  },

  // Search reviews
  searchReviews: async (query: string, page: number = 0, size: number = 20): Promise<PageResponse<ReviewResponse>> => {
    return apiService.get<PageResponse<ReviewResponse>>('/reviews/search', {
      params: { query, page, size },
    });
  },

  // Update review
  updateReview: async (id: string, data: CreateReviewRequest): Promise<ReviewResponse> => {
    return apiService.put<ReviewResponse>(`/reviews/${id}`, data);
  },

  // Delete review
  deleteReview: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/reviews/${id}`);
  },

  // Report review
  reportReview: async (id: string, reportData: any): Promise<any> => {
    return apiService.post(`/reviews/${id}/report`, reportData);
  },
};

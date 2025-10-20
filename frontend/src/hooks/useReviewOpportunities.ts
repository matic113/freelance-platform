import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export interface ReviewOpportunity {
  id: string;
  contractId: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeName: string;
  reviewSubmitted: boolean;
  invitationEmailSent: boolean;
  projectTitle: string;
  createdAt: string;
  reviewSubmittedAt?: string;
}

export interface ContractReviewStatus {
  contractId: string;
  reviews: ReviewOpportunity[];
  totalReviewsNeeded: number;
  completedReviews: number;
  pendingReviews: number;
}

export const reviewOpportunityKeys = {
  all: ['reviewOpportunities'] as const,
  pending: () => [...reviewOpportunityKeys.all, 'pending'] as const,
  pendingList: (page: number, size: number) => [...reviewOpportunityKeys.pending(), { page, size }] as const,
  contractStatus: (contractId: string) => [...reviewOpportunityKeys.all, 'contractStatus', contractId] as const,
};

export const usePendingReviews = (page: number = 0, size: number = 20, enabled: boolean = true) => {
  return useQuery({
    queryKey: reviewOpportunityKeys.pendingList(page, size),
    queryFn: async () => {
      try {
        const response = await api.get('/reviews/pending', {
          params: {
            page,
            size,
            sort: 'createdAt,desc'
          }
        });
        return response.data || { content: [], totalElements: 0, totalPages: 0 };
      } catch (error) {
        console.error('Error fetching pending reviews:', error);
        return { content: [], totalElements: 0, totalPages: 0 };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled,
  });
};

export const useContractReviewStatus = (contractId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: reviewOpportunityKeys.contractStatus(contractId),
    queryFn: async () => {
      try {
        const response = await api.get(`/reviews/contract/${contractId}/status`);
        return response.data as ContractReviewStatus;
      } catch (error) {
        console.error('Error fetching contract review status:', error);
        return {
          contractId,
          reviews: [],
          totalReviewsNeeded: 0,
          completedReviews: 0,
          pendingReviews: 0
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && !!contractId,
  });
};

export const useInvalidateReviewOpportunities = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidatePending: () => {
      queryClient.invalidateQueries({ queryKey: reviewOpportunityKeys.pending() });
    },
    invalidateContractStatus: (contractId: string) => {
      queryClient.invalidateQueries({ queryKey: reviewOpportunityKeys.contractStatus(contractId) });
    },
  };
};

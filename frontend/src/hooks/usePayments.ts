import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import { PaymentRequestResponse, CreatePaymentRequestRequest, PageResponse } from '@/types/api';

// Query keys
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentKeys.details(), id] as const,
  myRequests: () => [...paymentKeys.all, 'my-requests'] as const,
  receivedRequests: () => [...paymentKeys.all, 'received-requests'] as const,
  contract: (contractId: number) => [...paymentKeys.all, 'contract', contractId] as const,
};

// Get payment request by ID
export const usePaymentRequest = (id: number) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentService.getPaymentRequest(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get current user's payment requests
export const useMyPaymentRequests = (page: number = 0, size: number = 20, sort: string = 'requestedAt,desc') => {
  return useQuery({
    queryKey: paymentKeys.myRequests(),
    queryFn: () => paymentService.getMyPaymentRequests(page, size, sort),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get received payment requests (for clients)
export const useReceivedPaymentRequests = (page: number = 0, size: number = 20, sort: string = 'requestedAt,desc') => {
  return useQuery({
    queryKey: paymentKeys.receivedRequests(),
    queryFn: () => paymentService.getReceivedPaymentRequests(page, size, sort),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get payment requests for contract
export const useContractPaymentRequests = (contractId: number) => {
  return useQuery({
    queryKey: paymentKeys.contract(contractId),
    queryFn: () => paymentService.getContractPaymentRequests(contractId),
    enabled: !!contractId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create payment request mutation
export const useCreatePaymentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentService.createPaymentRequest,
    onSuccess: (data) => {
      // Add payment request to cache
      queryClient.setQueryData(paymentKeys.detail(data.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentKeys.myRequests() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.contract(data.contractId) });
    },
    onError: (error) => {
      console.error('Create payment request error:', error);
    },
  });
};

// Approve payment request mutation
export const useApprovePaymentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentService.approvePaymentRequest,
    onSuccess: (data, paymentRequestId) => {
      // Update payment request in cache
      queryClient.setQueryData(paymentKeys.detail(paymentRequestId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentKeys.receivedRequests() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.contract(data.contractId) });
    },
    onError: (error) => {
      console.error('Approve payment request error:', error);
    },
  });
};

// Reject payment request mutation
export const useRejectPaymentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentService.rejectPaymentRequest,
    onSuccess: (data, paymentRequestId) => {
      // Update payment request in cache
      queryClient.setQueryData(paymentKeys.detail(paymentRequestId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentKeys.receivedRequests() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.contract(data.contractId) });
    },
    onError: (error) => {
      console.error('Reject payment request error:', error);
    },
  });
};

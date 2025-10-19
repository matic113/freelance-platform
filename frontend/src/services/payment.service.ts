import { apiService } from './api';
import { 
  PaymentResponse, 
  CreatePaymentRequestRequest,
  PageResponse
} from '@/types/api';

export const paymentService = {
  // Create payment request
  createPaymentRequest: async (data: CreatePaymentRequestRequest): Promise<PaymentResponse> => {
    return apiService.post<PaymentResponse>('/payments/requests', data);
  },

  // Get payment request by ID
  getPaymentRequest: async (id: string): Promise<PaymentResponse> => {
    return apiService.get<PaymentResponse>(`/payments/requests/${id}`);
  },

  // Get current user's payment requests
  getMyPaymentRequests: async (page: number = 0, size: number = 20, sort: string = 'requestedAt,desc'): Promise<PageResponse<PaymentResponse>> => {
    return apiService.get<PageResponse<PaymentResponse>>('/payments/requests/my-requests', {
      params: { page, size, sort },
    });
  },

  // Get received payment requests (for clients)
  getReceivedPaymentRequests: async (page: number = 0, size: number = 20, sort: string = 'requestedAt,desc'): Promise<PageResponse<PaymentResponse>> => {
    return apiService.get<PageResponse<PaymentResponse>>('/payments/requests/received', {
      params: { page, size, sort },
    });
  },

  // Approve payment request (CLIENT only)
  approvePaymentRequest: async (id: string): Promise<PaymentResponse> => {
    return apiService.post<PaymentResponse>(`/payments/requests/${id}/approve`);
  },

  // Reject payment request (CLIENT only)
  rejectPaymentRequest: async (id: string): Promise<PaymentResponse> => {
    return apiService.post<PaymentResponse>(`/payments/requests/${id}/reject`);
  },

  // Get payment requests for contract
  getContractPaymentRequests: async (contractId: string): Promise<PaymentResponse[]> => {
    return apiService.get<PaymentResponse[]>(`/payments/contract/${contractId}/requests`);
  },

  // Process payment
  processPayment: async (paymentRequestId: string, paymentMethod: string, gatewayTransactionId: string): Promise<PaymentResponse> => {
    return apiService.post<PaymentResponse>(`/payments/requests/${paymentRequestId}/process`, {
      paymentMethod,
      gatewayTransactionId,
    });
  },
};

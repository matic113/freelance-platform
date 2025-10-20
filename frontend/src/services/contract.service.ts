import { apiService } from './api';
import { 
  ContractResponse, 
  MilestoneResponse, 
  PaymentResponse, 
  CreateContractRequest, 
  CreateMilestoneRequest, 
  UpdateMilestoneRequest, 
  CreatePaymentRequestRequest,
  PageResponse 
} from '@/types/contract';

// Contract Management API calls
export const contractService = {
  // Get contracts for current client
  getMyContracts: async (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<PageResponse<ContractResponse>> => {
    return apiService.get<PageResponse<ContractResponse>>(`/contracts/my-contracts?page=${page}&size=${size}&sort=${sort}`);
  },

  // Get contracts for current freelancer
  getFreelancerContracts: async (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<PageResponse<ContractResponse>> => {
    return apiService.get<PageResponse<ContractResponse>>(`/contracts/freelancer-contracts?page=${page}&size=${size}&sort=${sort}`);
  },

  // Get contract by ID
  getContract: async (id: string): Promise<ContractResponse> => {
    return apiService.get<ContractResponse>(`/contracts/${id}`);
  },

  // Create new contract
  createContract: async (request: CreateContractRequest): Promise<ContractResponse> => {
    return apiService.post<ContractResponse>('/contracts', request);
  },

  // Accept contract
  acceptContract: async (id: string): Promise<ContractResponse> => {
    return apiService.post<ContractResponse>(`/contracts/${id}/accept`);
  },

  // Reject contract
  rejectContract: async (id: string): Promise<ContractResponse> => {
    return apiService.post<ContractResponse>(`/contracts/${id}/reject`);
  },

  // Complete contract
  completeContract: async (id: string): Promise<ContractResponse> => {
    return apiService.post<ContractResponse>(`/contracts/${id}/complete`);
  },

  // Get contract milestones
  getContractMilestones: async (contractId: string): Promise<MilestoneResponse[]> => {
    return apiService.get<MilestoneResponse[]>(`/contracts/${contractId}/milestones`);
  },

  // Create milestone
  createMilestone: async (contractId: string, request: CreateMilestoneRequest): Promise<MilestoneResponse> => {
    return apiService.post<MilestoneResponse>(`/contracts/${contractId}/milestones`, request);
  },

  // Update milestone
  updateMilestone: async (contractId: string, milestoneId: string, request: UpdateMilestoneRequest): Promise<MilestoneResponse> => {
    return apiService.put<MilestoneResponse>(`/contracts/${contractId}/milestones/${milestoneId}`, request);
  },

    // Update milestone status (unified endpoint for all status transitions)
    updateMilestoneStatus: async (contractId: string, milestoneId: string, status: string): Promise<MilestoneResponse> => {
      return apiService.put<MilestoneResponse>(`/contracts/${contractId}/milestones/${milestoneId}/update-status`, { status });
    },

    // Delete milestone
    deleteMilestone: async (contractId: string, milestoneId: string): Promise<void> => {
      return apiService.delete<void>(`/contracts/${contractId}/milestones/${milestoneId}`);
    }
};

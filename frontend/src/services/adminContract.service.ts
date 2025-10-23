import { apiService } from './api';
import { PageResponse, ContractStatus } from '@/types/api';

export interface Contract {
  id: string;
  title?: string;
  description?: string;
  totalAmount: number;
  currency: string;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  projectTitle: string;
  projectId: string;
  clientName: string;
  clientEmail?: string;
  clientId: string;
  freelancerName: string;
  freelancerEmail?: string;
  freelancerId: string;
  proposalId?: string;
}

export interface Milestone {
  id: string;
  contractId: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  status: string;
  orderIndex: number;
  createdAt: string;
  completedAt?: string;
}

export interface ContractStats {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  cancelledContracts: number;
  disputedContracts: number;
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

export const adminContractService = {
  getAllContracts: async (params: PaginatedParams = {}): Promise<PageResponse<Contract>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Contract>>('/admin/contracts', { params: mergedParams });
  },

  getContractsByStatus: async (status: ContractStatus, params: PaginatedParams = {}): Promise<PageResponse<Contract>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Contract>>(`/admin/contracts/status/${status}`, { params: mergedParams });
  },

  getContractById: async (contractId: string): Promise<Contract> => {
    return apiService.get<Contract>(`/admin/contracts/${contractId}`);
  },

  getContractMilestones: async (contractId: string): Promise<Milestone[]> => {
    return apiService.get<Milestone[]>(`/admin/contracts/${contractId}/milestones`);
  },

  getAllMilestones: async (params: PaginatedParams = {}): Promise<PageResponse<Milestone>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Milestone>>('/admin/contracts/milestones', { params: mergedParams });
  },

  getMilestoneById: async (milestoneId: string): Promise<Milestone> => {
    return apiService.get<Milestone>(`/admin/contracts/milestones/${milestoneId}`);
  },

  getDisputedContracts: async (params: PaginatedParams = {}): Promise<PageResponse<Contract>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Contract>>('/admin/contracts/disputed', { params: mergedParams });
  },

  getContractStats: async (): Promise<ContractStats> => {
    return apiService.get<ContractStats>('/admin/contracts/stats');
  },
};

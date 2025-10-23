import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { 
  adminContractService, 
  Contract, 
  Milestone, 
  ContractStats 
} from '@/services/adminContract.service';
import { PageResponse, ContractStatus } from '@/types/api';

const contractQueryKeys = {
  all: ['admin', 'contracts'] as const,
  list: (params: Record<string, unknown>) => ['admin', 'contracts', 'list', params] as const,
  byStatus: (status: ContractStatus, params: Record<string, unknown>) => 
    ['admin', 'contracts', 'status', status, params] as const,
  detail: (id: string) => ['admin', 'contracts', 'detail', id] as const,
  milestones: (contractId: string) => ['admin', 'contracts', id, 'milestones'] as const,
  allMilestones: (params: Record<string, unknown>) => ['admin', 'milestones', 'list', params] as const,
  milestoneDetail: (id: string) => ['admin', 'milestones', 'detail', id] as const,
  disputed: (params: Record<string, unknown>) => ['admin', 'contracts', 'disputed', params] as const,
  stats: ['admin', 'contracts', 'stats'] as const,
};

interface UseContractsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const useAdminContracts = (
  params: UseContractsParams = {},
  options?: UseQueryOptions<PageResponse<Contract>>
) => {
  return useQuery({
    queryKey: contractQueryKeys.list(params),
    queryFn: () => adminContractService.getAllContracts(params),
    ...options,
  });
};

export const useAdminContractsByStatus = (
  status: ContractStatus,
  params: UseContractsParams = {},
  options?: UseQueryOptions<PageResponse<Contract>>
) => {
  return useQuery({
    queryKey: contractQueryKeys.byStatus(status, params),
    queryFn: () => adminContractService.getContractsByStatus(status, params),
    ...options,
  });
};

export const useAdminContract = (
  contractId: string,
  options?: UseQueryOptions<Contract>
) => {
  return useQuery({
    queryKey: contractQueryKeys.detail(contractId),
    queryFn: () => adminContractService.getContractById(contractId),
    enabled: !!contractId,
    ...options,
  });
};

export const useAdminContractMilestones = (
  contractId: string,
  options?: UseQueryOptions<Milestone[]>
) => {
  return useQuery({
    queryKey: contractQueryKeys.milestones(contractId),
    queryFn: () => adminContractService.getContractMilestones(contractId),
    enabled: !!contractId,
    ...options,
  });
};

export const useAdminAllMilestones = (
  params: UseContractsParams = {},
  options?: UseQueryOptions<PageResponse<Milestone>>
) => {
  return useQuery({
    queryKey: contractQueryKeys.allMilestones(params),
    queryFn: () => adminContractService.getAllMilestones(params),
    ...options,
  });
};

export const useAdminMilestone = (
  milestoneId: string,
  options?: UseQueryOptions<Milestone>
) => {
  return useQuery({
    queryKey: contractQueryKeys.milestoneDetail(milestoneId),
    queryFn: () => adminContractService.getMilestoneById(milestoneId),
    enabled: !!milestoneId,
    ...options,
  });
};

export const useAdminDisputedContracts = (
  params: UseContractsParams = {},
  options?: UseQueryOptions<PageResponse<Contract>>
) => {
  return useQuery({
    queryKey: contractQueryKeys.disputed(params),
    queryFn: () => adminContractService.getDisputedContracts(params),
    ...options,
  });
};

export const useAdminContractStats = (
  options?: UseQueryOptions<ContractStats>
) => {
  return useQuery({
    queryKey: contractQueryKeys.stats,
    queryFn: () => adminContractService.getContractStats(),
    ...options,
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractService } from '@/services/contract.service';
import { paymentService } from '@/services/payment.service';
import { 
  ContractResponse, 
  MilestoneResponse, 
  PaymentResponse, 
  CreateContractRequest, 
  CreateMilestoneRequest, 
  UpdateMilestoneRequest, 
  CreatePaymentRequestRequest 
} from '@/types/contract';
import { useAuth } from '@/contexts/AuthContext';

// Query keys for React Query caching
export const contractKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...contractKeys.lists(), { filters }] as const,
  details: () => [...contractKeys.all, 'detail'] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
  milestones: (contractId: string) => [...contractKeys.all, 'milestones', contractId] as const,
  payments: () => [...contractKeys.all, 'payments'] as const,
  paymentRequests: (contractId: string) => [...contractKeys.all, 'paymentRequests', contractId] as const,
};

// Contract hooks
export const useMyContracts = (page: number = 0, size: number = 20, sort: string = 'createdAt,desc', enabled: boolean = true) => {
  return useQuery({
    queryKey: contractKeys.list({ page, size, sort, type: 'my' }),
    queryFn: async () => {
      try {
        const result = await contractService.getMyContracts(page, size, sort);
        return result || { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      } catch (error) {
        console.error('Error fetching my contracts:', error);
        return { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled,
  });
};

export const useFreelancerContracts = (page: number = 0, size: number = 20, sort: string = 'createdAt,desc', enabled: boolean = true) => {
  return useQuery({
    queryKey: contractKeys.list({ page, size, sort, type: 'freelancer' }),
    queryFn: async () => {
      try {
        const result = await contractService.getFreelancerContracts(page, size, sort);
        return result || { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      } catch (error) {
        console.error('Error fetching freelancer contracts:', error);
        return { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled,
  });
};

export const useContract = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => contractService.getContract(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && !!id,
  });
};

export const useContractByProposal = (proposalId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...contractKeys.all, 'by-proposal', proposalId],
    queryFn: () => contractService.getContractByProposal(proposalId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && !!proposalId,
  });
};

export const useContractMilestones = (contractId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: contractKeys.milestones(contractId),
    queryFn: () => contractService.getContractMilestones(contractId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled && !!contractId,
  });
};

// Contract mutations
export const useCreateContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contractService.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
    onError: (error) => {
      console.error('Create contract error:', error);
    },
  });
};

export const useAcceptContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contractService.acceptContract,
    onSuccess: (data, contractId) => {
      // Update contract in cache
      queryClient.setQueryData(contractKeys.detail(contractId), data);
      // Invalidate contract lists
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
    onError: (error) => {
      console.error('Accept contract error:', error);
    },
  });
};

export const useRejectContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contractService.rejectContract,
    onSuccess: (data, contractId) => {
      // Update contract in cache
      queryClient.setQueryData(contractKeys.detail(contractId), data);
      // Invalidate contract lists
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
    onError: (error) => {
      console.error('Reject contract error:', error);
    },
  });
};

export const useCompleteContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contractService.completeContract,
    onSuccess: (data, contractId) => {
      // Update contract in cache
      queryClient.setQueryData(contractKeys.detail(contractId), data);
      // Invalidate contract lists
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
    onError: (error) => {
      console.error('Complete contract error:', error);
    },
  });
};

// Milestone mutations
export const useCreateMilestone = () => {
   const queryClient = useQueryClient();
   
   return useMutation({
     mutationFn: ({ contractId, request }: { contractId: string; request: CreateMilestoneRequest }) =>
       contractService.createMilestone(contractId, request),
     onSuccess: (data, { contractId }) => {
       // Invalidate all contract queries to refetch updated contracts
       queryClient.invalidateQueries({ queryKey: contractKeys.all });
     },
     onError: (error) => {
       console.error('Create milestone error:', error);
     },
   });
 };

export const useUpdateMilestone = () => {
   const queryClient = useQueryClient();
   
   return useMutation({
     mutationFn: ({ contractId, milestoneId, request }: { contractId: string; milestoneId: string; request: UpdateMilestoneRequest }) =>
       contractService.updateMilestone(contractId, milestoneId, request),
     onSuccess: (data, { contractId }) => {
       // Invalidate all contract queries to refetch updated contracts
       queryClient.invalidateQueries({ queryKey: contractKeys.all });
     },
     onError: (error) => {
       console.error('Update milestone error:', error);
     },
   });
 };

  export const useUpdateMilestoneStatus = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
       mutationFn: ({ contractId, milestoneId, status }: { contractId: string; milestoneId: string; status: string }) =>
         contractService.updateMilestoneStatus(contractId, milestoneId, status),
       onSuccess: (data, { contractId }) => {
         queryClient.invalidateQueries({ queryKey: contractKeys.all });
       },
       onError: (error) => {
         console.error('Update milestone status error:', error);
       },
     });
   };

export const useDeleteMilestone = () => {
   const queryClient = useQueryClient();
   
   return useMutation({
     mutationFn: ({ contractId, milestoneId }: { contractId: string; milestoneId: string }) =>
       contractService.deleteMilestone(contractId, milestoneId),
     onSuccess: (_, { contractId }) => {
       // Invalidate all contract queries to refetch updated contracts
       queryClient.invalidateQueries({ queryKey: contractKeys.all });
     },
     onError: (error) => {
       console.error('Delete milestone error:', error);
     },
   });
 };

// Payment hooks
export const useMyPaymentRequests = (page: number = 0, size: number = 20, sort: string = 'requestedAt,desc', enabled: boolean = true) => {
  return useQuery({
    queryKey: [...contractKeys.payments(), 'my-requests', { page, size, sort }],
    queryFn: async () => {
      try {
        const result = await paymentService.getMyPaymentRequests(page, size, sort);
        return result || { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      } catch (error) {
        console.error('Error fetching my payment requests:', error);
        return { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled,
  });
};

export const useReceivedPaymentRequests = (page: number = 0, size: number = 20, sort: string = 'requestedAt,desc', enabled: boolean = true) => {
  return useQuery({
    queryKey: [...contractKeys.payments(), 'received', { page, size, sort }],
    queryFn: async () => {
      try {
        const result = await paymentService.getReceivedPaymentRequests(page, size, sort);
        return result || { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      } catch (error) {
        console.error('Error fetching received payment requests:', error);
        return { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0 };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled,
  });
};

export const useContractPaymentRequests = (contractId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: contractKeys.paymentRequests(contractId),
    queryFn: () => paymentService.getContractPaymentRequests(contractId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled && !!contractId,
  });
};

// Payment mutations
export const useCreatePaymentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentService.createPaymentRequest,
    onSuccess: (data) => {
      // Invalidate payment requests for this contract
      queryClient.invalidateQueries({ queryKey: contractKeys.paymentRequests(data.contractId) });
      // Invalidate my payment requests
      queryClient.invalidateQueries({ queryKey: [...contractKeys.payments(), 'my-requests'] });
    },
    onError: (error) => {
      console.error('Create payment request error:', error);
    },
  });
};

export const useApprovePaymentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentService.approvePaymentRequest,
    onSuccess: (data) => {
      // Invalidate payment requests for this contract
      queryClient.invalidateQueries({ queryKey: contractKeys.paymentRequests(data.contractId) });
      // Invalidate received payment requests
      queryClient.invalidateQueries({ queryKey: [...contractKeys.payments(), 'received'] });
    },
    onError: (error) => {
      console.error('Approve payment request error:', error);
    },
  });
};

export const useRejectPaymentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      paymentService.rejectPaymentRequest(id, reason),
    onSuccess: (data) => {
      // Invalidate payment requests for this contract
      queryClient.invalidateQueries({ queryKey: contractKeys.paymentRequests(data.contractId) });
      // Invalidate received payment requests
      queryClient.invalidateQueries({ queryKey: [...contractKeys.payments(), 'received'] });
    },
    onError: (error) => {
      console.error('Reject payment request error:', error);
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentService.processPayment,
    onSuccess: (data) => {
      // Invalidate payment requests for this contract
      queryClient.invalidateQueries({ queryKey: contractKeys.paymentRequests(data.contractId) });
      // Invalidate received payment requests
      queryClient.invalidateQueries({ queryKey: [...contractKeys.payments(), 'received'] });
    },
    onError: (error) => {
      console.error('Process payment error:', error);
    },
  });
};
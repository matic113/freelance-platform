import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { proposalService } from '@/services/proposal.service';
import { 
  ProposalResponse, 
  SubmitProposalRequest, 
  UpdateProposalRequest,
  PageResponse
} from '@/types/api';

// Query keys
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: number) => [...proposalKeys.details(), id] as const,
  myProposals: () => [...proposalKeys.all, 'my-proposals'] as const,
  received: () => [...proposalKeys.all, 'received'] as const,
  project: (projectId: number) => [...proposalKeys.all, 'project', projectId] as const,
};

// Get proposal by ID
export const useProposal = (id: number) => {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: () => proposalService.getProposal(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get freelancer's proposals
export const useMyProposals = (page: number = 0, size: number = 20, sort: string = 'submittedAt,desc', enabled: boolean = true) => {
  return useQuery({
    queryKey: proposalKeys.myProposals(),
    queryFn: () => proposalService.getMyProposals(page, size, sort),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled,
  });
};

// Get client's received proposals
export const useReceivedProposals = (page: number = 0, size: number = 20, sort: string = 'submittedAt,desc', enabled: boolean = true) => {
  return useQuery({
    queryKey: proposalKeys.received(),
    queryFn: () => proposalService.getReceivedProposals(page, size, sort),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled,
  });
};

// Get proposals for project
export const useProposalsForProject = (projectId: number, page: number = 0, size: number = 20, sort: string = 'submittedAt,desc') => {
  return useQuery({
    queryKey: proposalKeys.project(projectId),
    queryFn: () => proposalService.getProposalsForProject(projectId, page, size, sort),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Submit proposal mutation
export const useSubmitProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalService.submitProposal,
    onSuccess: (data) => {
      // Add proposal to cache
      queryClient.setQueryData(proposalKeys.detail(data.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: proposalKeys.myProposals() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.projectId) });
    },
    onError: (error) => {
      console.error('Submit proposal error:', error);
    },
  });
};

// Update proposal mutation
export const useUpdateProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProposalRequest }) =>
      proposalService.updateProposal(id, data),
    onSuccess: (data, variables) => {
      // Update proposal in cache
      queryClient.setQueryData(proposalKeys.detail(variables.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: proposalKeys.myProposals() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.projectId) });
    },
    onError: (error) => {
      console.error('Update proposal error:', error);
    },
  });
};

// Delete proposal mutation
export const useDeleteProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalService.deleteProposal,
    onSuccess: (_, proposalId) => {
      // Remove proposal from cache
      queryClient.removeQueries({ queryKey: proposalKeys.detail(proposalId) });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: proposalKeys.myProposals() });
    },
    onError: (error) => {
      console.error('Delete proposal error:', error);
    },
  });
};

// Accept proposal mutation
export const useAcceptProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalService.acceptProposal,
    onSuccess: (data, proposalId) => {
      // Update proposal in cache
      queryClient.setQueryData(proposalKeys.detail(proposalId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: proposalKeys.received() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.projectId) });
    },
    onError: (error) => {
      console.error('Accept proposal error:', error);
    },
  });
};

// Reject proposal mutation
export const useRejectProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalService.rejectProposal,
    onSuccess: (data, proposalId) => {
      // Update proposal in cache
      queryClient.setQueryData(proposalKeys.detail(proposalId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: proposalKeys.received() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.projectId) });
    },
    onError: (error) => {
      console.error('Reject proposal error:', error);
    },
  });
};

// Withdraw proposal mutation
export const useWithdrawProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalService.withdrawProposal,
    onSuccess: (data, proposalId) => {
      // Update proposal in cache
      queryClient.setQueryData(proposalKeys.detail(proposalId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: proposalKeys.myProposals() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.projectId) });
    },
    onError: (error) => {
      console.error('Withdraw proposal error:', error);
    },
  });
};

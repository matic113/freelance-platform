import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardData } from '@/services/dashboard.service';
import { useAuth } from '@/contexts/AuthContext';
import { proposalService } from '@/services/proposal.service';
import { contractService } from '@/services/contract.service';
import { freelancerProfileService } from '@/services/freelancerProfile.service';
import { PageResponse, ProposalResponse } from '@/types/api';
import type { ContractResponse } from '@/types/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  freelancer: () => [...dashboardKeys.all, 'freelancer'] as const,
  client: () => [...dashboardKeys.all, 'client'] as const,
};

export interface FreelancerDashboardData extends DashboardData {
  proposalSuccessRate: number;
  rating: number;
  activeContracts: ContractResponse[];
  completedContracts: ContractResponse[];
  recentProposals: ProposalResponse[];
}

export const useFreelancerDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.freelancer(),
    queryFn: async (): Promise<FreelancerDashboardData> => {
      const baseData = await dashboardService.getFreelancerDashboard();
      
      const [proposalsRes, profileRes, contractsRes] = await Promise.all([
        proposalService.getMyProposals(0, 100),
        freelancerProfileService.getMyProfile().catch(() => ({ rating: 0 })),
        contractService.getFreelancerContracts(0, 100).catch(() => ({ content: [] }))
      ]);

      const totalProposals = (proposalsRes as PageResponse<ProposalResponse>).totalElements || 0;
      const acceptedProposals = (proposalsRes as PageResponse<ProposalResponse>).content?.filter((p: ProposalResponse) => p.status === 'ACCEPTED').length || 0;
      const successRate = totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0;

       const activeContracts = (contractsRes as PageResponse<ContractResponse>).content?.filter((c: ContractResponse) => c.status === 'ACTIVE') || [];
       const completedContracts = (contractsRes as PageResponse<ContractResponse>).content?.filter((c: ContractResponse) => c.status === 'COMPLETED') || [];

       return {
         ...baseData,
         proposalSuccessRate: successRate,
         rating: (profileRes as Record<string, unknown>)?.rating || 0,
         activeContracts,
         completedContracts,
         recentProposals: (proposalsRes as PageResponse<ProposalResponse>).content?.slice(0, 5) || []
       };
    },
    enabled: !authLoading && !!user && user.userType === 'FREELANCER',
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      const apiError = error as Record<string, unknown>;
      if ((apiError?.response as Record<string, unknown>)?.status === 401 || (apiError?.response as Record<string, unknown>)?.status === 403 || (apiError?.response as Record<string, unknown>)?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });
};

export const useClientDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.client(),
    queryFn: async () => {
      try {
        const [projectsRes, contractsRes, proposalsRes] = await Promise.all([
          dashboardService.getClientProjects(),
          dashboardService.getClientContracts(),
          dashboardService.getClientProposals(),
        ]);

        const activeProjects = projectsRes.content?.filter(p => p.status === 'ACTIVE').length || 0;
        const completedContracts = contractsRes.content?.filter(c => c.status === 'COMPLETED').length || 0;
        const hiredFreelancers = completedContracts > 0 ? contractsRes.content?.filter(c => c.status === 'COMPLETED').map(c => c.freelancer?.id).filter((id, idx, arr) => arr.indexOf(id) === idx).length || 0 : 0;
        
        const totalSpending = contractsRes.content?.reduce((sum, c) => sum + (c.budget || 0), 0) || 0;
        
        const satisfactionRates = contractsRes.content
          ?.filter(c => c.status === 'COMPLETED' && c.rating)
          .map(c => c.rating) || [];
        const satisfactionRate = satisfactionRates.length > 0 
          ? (satisfactionRates.reduce((a, b) => a + b, 0) / satisfactionRates.length).toFixed(1)
          : 0;

        return {
          stats: {
            activeProjects,
            hiredFreelancers,
            totalSpending,
            satisfactionRate,
          },
          recentProjects: projectsRes.content?.slice(0, 5) || [],
          recentContracts: contractsRes.content?.slice(0, 5) || [],
          recentProposals: proposalsRes.content?.slice(0, 5) || []
        };
      } catch {
        return {
          stats: {
            activeProjects: 0,
            hiredFreelancers: 0,
            totalSpending: 0,
            satisfactionRate: 0,
          },
          recentProjects: [],
          recentContracts: [],
          recentProposals: []
        };
      }
    },
    enabled: !authLoading && !!user && user.userType === 'CLIENT',
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: unknown) => {
      const apiError = error as Record<string, unknown>;
      if ((apiError?.response as Record<string, unknown>)?.status === 401 || (apiError?.response as Record<string, unknown>)?.status === 403 || (apiError?.response as Record<string, unknown>)?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });
};

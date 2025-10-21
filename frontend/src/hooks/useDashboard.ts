import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { freelancerDashboardService } from '@/services/freelancerDashboard.service';
import { useAuth } from '@/contexts/AuthContext';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  freelancer: () => [...dashboardKeys.all, 'freelancer', 'v2'] as const,
  client: () => [...dashboardKeys.all, 'client'] as const,
};

export const useFreelancerDashboard = () => {
  const { user, activeRole, isLoading: authLoading } = useAuth();
  
  const isEnabled = !authLoading && !!user && activeRole === 'FREELANCER';
  
  return useQuery({
    queryKey: dashboardKeys.freelancer(),
    queryFn: async () => {
      return await freelancerDashboardService.getFreelancerDashboard();
    },
    enabled: isEnabled,
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

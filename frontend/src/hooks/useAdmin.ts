import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { AdminDashboardResponse, AnalyticsSeries, PerformanceMetrics, PageResponse, UserResponse } from '@/types/api';

const adminQueryKeys = {
  dashboard: ['admin', 'dashboard'] as const,
  analyticsUsers: ['admin', 'analytics', 'users'] as const,
  analyticsProjects: ['admin', 'analytics', 'projects'] as const,
  analyticsRevenue: ['admin', 'analytics', 'revenue'] as const,
  analyticsPerformance: ['admin', 'analytics', 'performance'] as const,
  users: (params: Record<string, unknown>) => ['admin', 'users', params] as const,
  user: (userId: string) => ['admin', 'users', userId] as const,
};

export const useAdminDashboard = (options?: UseQueryOptions<AdminDashboardResponse>) => {
  return useQuery({
    queryKey: adminQueryKeys.dashboard,
    queryFn: () => adminService.getDashboard(),
    ...options,
  });
};

export const useAdminAnalyticsUsers = (options?: UseQueryOptions<AnalyticsSeries>) => {
  return useQuery({
    queryKey: adminQueryKeys.analyticsUsers,
    queryFn: () => adminService.getAnalyticsUsers(),
    ...options,
  });
};

export const useAdminAnalyticsProjects = (options?: UseQueryOptions<AnalyticsSeries>) => {
  return useQuery({
    queryKey: adminQueryKeys.analyticsProjects,
    queryFn: () => adminService.getAnalyticsProjects(),
    ...options,
  });
};

export const useAdminAnalyticsRevenue = (options?: UseQueryOptions<AnalyticsSeries<string>>) => {
  return useQuery({
    queryKey: adminQueryKeys.analyticsRevenue,
    queryFn: () => adminService.getAnalyticsRevenue(),
    ...options,
  });
};

export const useAdminAnalyticsPerformance = (options?: UseQueryOptions<PerformanceMetrics>) => {
  return useQuery({
    queryKey: adminQueryKeys.analyticsPerformance,
    queryFn: () => adminService.getAnalyticsPerformance(),
    ...options,
  });
};

interface UseAdminUsersParams {
  page?: number;
  size?: number;
  sort?: string;
  searchTerm?: string;
}

export const useAdminUsers = (
  params: UseAdminUsersParams = {},
  options?: UseQueryOptions<PageResponse<UserResponse>>
) => {
  const { searchTerm, ...rest } = params;

  return useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: () => {
      if (searchTerm && searchTerm.trim().length > 0) {
        return adminService.searchUsers(searchTerm, rest);
      }

      return adminService.getUsers(rest);
    },
    ...options,
  });
};

export const useAdminUser = (userId: string, options?: UseQueryOptions<UserResponse>) => {
  return useQuery({
    queryKey: adminQueryKeys.user(userId),
    queryFn: () => adminService.getUserById(userId),
    enabled: !!userId,
    ...options,
  });
};


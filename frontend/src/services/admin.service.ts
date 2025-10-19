import { apiService } from './api';
import { AdminDashboardResponse, AnalyticsSeries, PerformanceMetrics, PageResponse, UserResponse } from '@/types/api';

interface PaginatedParams {
  page?: number;
  size?: number;
  sort?: string;
}

const defaultPagination: Required<Pick<PaginatedParams, 'page' | 'size'>> = {
  page: 0,
  size: 20,
};

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardResponse> => {
    return apiService.get<AdminDashboardResponse>('/admin/dashboard');
  },

  getAnalyticsUsers: async (): Promise<AnalyticsSeries> => {
    return apiService.get<AnalyticsSeries>('/admin/analytics/users');
  },

  getAnalyticsProjects: async (): Promise<AnalyticsSeries> => {
    return apiService.get<AnalyticsSeries>('/admin/analytics/projects');
  },

  getAnalyticsRevenue: async (): Promise<AnalyticsSeries<string>> => {
    return apiService.get<AnalyticsSeries<string>>('/admin/analytics/revenue');
  },

  getAnalyticsPerformance: async (): Promise<PerformanceMetrics> => {
    return apiService.get<PerformanceMetrics>('/admin/analytics/performance');
  },

  getUsers: async (params: PaginatedParams = {}): Promise<PageResponse<UserResponse>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<UserResponse>>('/admin/users', { params: mergedParams });
  },

  searchUsers: async (searchTerm: string, params: PaginatedParams = {}): Promise<PageResponse<UserResponse>> => {
    const mergedParams = { ...defaultPagination, ...params, searchTerm };
    return apiService.get<PageResponse<UserResponse>>('/admin/users/search', {
      params: mergedParams,
    });
  },

  getUserById: async (userId: string): Promise<UserResponse> => {
    return apiService.get<UserResponse>(`/admin/users/${userId}`);
  },
};

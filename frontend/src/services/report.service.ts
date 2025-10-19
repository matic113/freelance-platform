import { apiService } from './api';
import { 
  ReportResponse, 
  CreateReportRequest,
  PageResponse
} from '@/types/api';

export const reportService = {
  // Create report
  createReport: async (data: CreateReportRequest): Promise<ReportResponse> => {
    return apiService.post<ReportResponse>('/reports', data);
  },

  // Get report by ID
  getReport: async (id: number): Promise<ReportResponse> => {
    return apiService.get<ReportResponse>(`/reports/${id}`);
  },

  // Get current user's reports
  getMyReports: async (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<PageResponse<ReportResponse>> => {
    return apiService.get<PageResponse<ReportResponse>>('/reports/my-reports', {
      params: { page, size, sort },
    });
  },
};

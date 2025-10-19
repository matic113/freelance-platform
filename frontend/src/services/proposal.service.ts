import { apiService } from './api';
import { 
  ProposalResponse, 
  SubmitProposalRequest, 
  UpdateProposalRequest,
  PageResponse
} from '@/types/api';

export const proposalService = {
  // Submit proposal
  submitProposal: async (data: SubmitProposalRequest): Promise<ProposalResponse> => {
    return apiService.post<ProposalResponse>('/proposals', data);
  },

  // Get proposal by ID
  getProposal: async (id: string): Promise<ProposalResponse> => {
    return apiService.get<ProposalResponse>(`/proposals/${id}`);
  },

  // Update proposal
  updateProposal: async (id: string, data: UpdateProposalRequest): Promise<ProposalResponse> => {
    return apiService.put<ProposalResponse>(`/proposals/${id}`, data);
  },

  // Delete proposal
  deleteProposal: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/proposals/${id}`);
  },

  // Accept proposal (CLIENT only)
  acceptProposal: async (id: string): Promise<ProposalResponse> => {
    return apiService.post<ProposalResponse>(`/proposals/${id}/accept`);
  },

  // Reject proposal (CLIENT only)
  rejectProposal: async (id: string): Promise<ProposalResponse> => {
    return apiService.post<ProposalResponse>(`/proposals/${id}/reject`);
  },

  // Withdraw proposal (FREELANCER only)
  withdrawProposal: async (id: string): Promise<ProposalResponse> => {
    return apiService.post<ProposalResponse>(`/proposals/${id}/withdraw`);
  },

  // Get freelancer's proposals
  getMyProposals: async (page: number = 0, size: number = 20, sort: string = 'submittedAt,desc'): Promise<PageResponse<ProposalResponse>> => {
    const url = `/proposals/my-proposals?page=${page}&size=${size}&sort=${sort}`;
    return apiService.get<PageResponse<ProposalResponse>>(url);
  },

  // Get client's received proposals
  getReceivedProposals: async (page: number = 0, size: number = 20, sort: string = 'submittedAt,desc'): Promise<PageResponse<ProposalResponse>> => {
    const url = `/proposals/received?page=${page}&size=${size}&sort=${sort}`;
    return apiService.get<PageResponse<ProposalResponse>>(url);
  },

   // Get proposals for specific project
   getProposalsForProject: async (projectId: string, page: number = 0, size: number = 20, sort: string = 'submittedAt,desc'): Promise<PageResponse<ProposalResponse>> => {
     const url = `/proposals/project/${projectId}?page=${page}&size=${size}&sort=${sort}`;
     return apiService.get<PageResponse<ProposalResponse>>(url);
   },

   // Get available projects for freelancer to bid on
   getAvailableProjects: async (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<PageResponse<any>> => {
     const url = `/projects/available?page=${page}&size=${size}&sort=${sort}&excludeMyProposals=true`;
     return apiService.get<PageResponse<any>>(url);
   },

   // Search available projects with filters
   searchAvailableProjects: async (
     searchTerm?: string,
     category?: string,
     minBudget?: number,
     maxBudget?: number,
     skills?: string[],
     page: number = 0,
     size: number = 20,
     sort: string = 'createdAt,desc'
   ): Promise<PageResponse<any>> => {
     const params = new URLSearchParams({
       page: page.toString(),
       size: size.toString(),
       sort,
       excludeMyProposals: 'true'
     });

     if (searchTerm) params.append('searchTerm', searchTerm);
     if (category) params.append('category', category);
     if (minBudget !== undefined) params.append('minBudget', minBudget.toString());
     if (maxBudget !== undefined) params.append('maxBudget', maxBudget.toString());
     if (skills && skills.length > 0) params.append('skills', skills.join(','));

     return apiService.get<PageResponse<any>>(`/projects/search?${params.toString()}`);
   },

   // Check if freelancer has already proposed to a project
   hasProposedToProject: async (projectId: string): Promise<boolean> => {
     const response = await apiService.get<{ hasProposed: boolean }>(`/proposals/check/${projectId}`);
     return response.hasProposed;
   },

   // Get proposal analytics for freelancer
   getProposalAnalytics: async (): Promise<any> => {
     return apiService.get<any>('/proposals/analytics/my-stats');
   },

   // Get project analytics for client (per project)
   getProjectAnalytics: async (projectId: string): Promise<any> => {
     return apiService.get<any>(`/proposals/analytics/project/${projectId}`);
   },
};

import { apiService } from './api';
import { 
  ProjectResponse, 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  ProjectSearchRequest,
  PageResponse,
  ProjectAttachment,
  FileUploadResponse
} from '@/types/api';

export const projectService = {
  // Create new project
  createProject: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    return apiService.post<ProjectResponse>('/projects', data);
  },

  // Get project by ID
  getProject: async (id: string): Promise<ProjectResponse> => {
    return apiService.get<ProjectResponse>(`/projects/${id}`);
  },

  // Update project
  updateProject: async (id: string, data: UpdateProjectRequest): Promise<ProjectResponse> => {
    return apiService.put<ProjectResponse>(`/projects/${id}`, data);
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/projects/${id}`);
  },

  // Publish project
  publishProject: async (id: string): Promise<ProjectResponse> => {
    return apiService.post<ProjectResponse>(`/projects/${id}/publish`);
  },

  // Unpublish project
  unpublishProject: async (id: string): Promise<ProjectResponse> => {
    return apiService.post<ProjectResponse>(`/projects/${id}/unpublish`);
  },

  // Get current user's projects
  getMyProjects: async (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<PageResponse<ProjectResponse>> => {
    return apiService.get<PageResponse<ProjectResponse>>('/projects/my-projects', {
      params: { page, size, sort },
    });
  },

  // Get all published projects
  getPublishedProjects: async (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<PageResponse<ProjectResponse>> => {
    return apiService.get<PageResponse<ProjectResponse>>('/projects', {
      params: { page, size, sort },
    });
  },

  // Get all projects (no pagination)
  getAllProjects: async (): Promise<ProjectResponse[]> => {
    return apiService.get<ProjectResponse[]>('/projects/all');
  },

  // Search projects
  searchProjects: async (searchParams: ProjectSearchRequest): Promise<PageResponse<ProjectResponse>> => {
    return apiService.get<PageResponse<ProjectResponse>>('/projects/search', {
      params: searchParams,
    });
  },

  // Add attachment to project
  addAttachment: async (projectId: string, file: File): Promise<ProjectAttachment> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiService.upload<ProjectAttachment>(`/projects/${projectId}/attachments`, formData);
  },

  // Remove attachment from project
  removeAttachment: async (projectId: string, attachmentId: string): Promise<void> => {
    return apiService.delete<void>(`/projects/${projectId}/attachments/${attachmentId}`);
  },

  // Get project attachments
  getProjectAttachments: async (projectId: string): Promise<ProjectAttachment[]> => {
    return apiService.get<ProjectAttachment[]>(`/projects/${projectId}/attachments`);
  },

  // Upload file (generic)
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiService.upload<FileUploadResponse>('/files/upload', formData);
  },
};

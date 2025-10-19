import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { 
  ProjectResponse, 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  ProjectSearchRequest,
  PageResponse,
  ProjectAttachment
} from '@/types/api';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  myProjects: () => [...projectKeys.all, 'my-projects'] as const,
  published: () => [...projectKeys.all, 'published'] as const,
  search: (params: ProjectSearchRequest) => [...projectKeys.all, 'search', params] as const,
  attachments: (id: string) => [...projectKeys.all, 'attachments', id] as const,
};

// Get project by ID
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get current user's projects
export const useMyProjects = (page: number = 0, size: number = 20, sort: string = 'createdAt,desc') => {
  return useQuery({
    queryKey: projectKeys.myProjects(),
    queryFn: () => projectService.getMyProjects(page, size, sort),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get published projects
export const usePublishedProjects = (page: number = 0, size: number = 20, sort: string = 'createdAt,desc') => {
  return useQuery({
    queryKey: projectKeys.published(),
    queryFn: () => projectService.getPublishedProjects(page, size, sort),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all projects (no pagination)
export const useAllProjects = () => {
  return useQuery({
    queryKey: [...projectKeys.all, 'all'],
    queryFn: () => projectService.getAllProjects(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search projects
export const useSearchProjects = (searchParams: ProjectSearchRequest) => {
  return useQuery({
    queryKey: projectKeys.search(searchParams),
    queryFn: () => projectService.searchProjects(searchParams),
    enabled: !!searchParams.searchTerm || !!searchParams.skills?.length,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get project attachments
export const useProjectAttachments = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.attachments(projectId),
    queryFn: () => projectService.getProjectAttachments(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create project mutation
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: (data) => {
      // Invalidate and refetch my projects
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
      // Add new project to cache
      queryClient.setQueryData(projectKeys.detail(data.id), data);
    },
    onError: (error) => {
      console.error('Create project error:', error);
    },
  });
};

// Update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectService.updateProject(id, data),
    onSuccess: (data, variables) => {
      // Update project in cache
      queryClient.setQueryData(projectKeys.detail(variables.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
      queryClient.invalidateQueries({ queryKey: projectKeys.published() });
    },
    onError: (error) => {
      console.error('Update project error:', error);
    },
  });
};

// Delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: (_, projectId) => {
      // Remove project from cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
      queryClient.invalidateQueries({ queryKey: projectKeys.published() });
    },
    onError: (error) => {
      console.error('Delete project error:', error);
    },
  });
};

// Publish project mutation
export const usePublishProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectService.publishProject,
    onSuccess: (data, projectId) => {
      // Update project in cache
      queryClient.setQueryData(projectKeys.detail(projectId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
      queryClient.invalidateQueries({ queryKey: projectKeys.published() });
    },
    onError: (error) => {
      console.error('Publish project error:', error);
    },
  });
};

// Unpublish project mutation
export const useUnpublishProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectService.unpublishProject,
    onSuccess: (data, projectId) => {
      // Update project in cache
      queryClient.setQueryData(projectKeys.detail(projectId), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
      queryClient.invalidateQueries({ queryKey: projectKeys.published() });
    },
    onError: (error) => {
      console.error('Unpublish project error:', error);
    },
  });
};

// Add attachment mutation
export const useAddAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      projectService.addAttachment(projectId, file),
    onSuccess: (data, variables) => {
      // Invalidate attachments query
      queryClient.invalidateQueries({ queryKey: projectKeys.attachments(variables.projectId) });
      // Update project in cache
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
    },
    onError: (error) => {
      console.error('Add attachment error:', error);
    },
  });
};

// Remove attachment mutation
export const useRemoveAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, attachmentId }: { projectId: string; attachmentId: string }) =>
      projectService.removeAttachment(projectId, attachmentId),
    onSuccess: (_, variables) => {
      // Invalidate attachments query
      queryClient.invalidateQueries({ queryKey: projectKeys.attachments(variables.projectId) });
      // Update project in cache
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
    },
    onError: (error) => {
      console.error('Remove attachment error:', error);
    },
  });
};

// Upload file mutation
export const useUploadFile = () => {
  return useMutation({
    mutationFn: projectService.uploadFile,
    onError: (error) => {
      console.error('Upload file error:', error);
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService, UpdateProfileRequest } from '@/services/user.service';
import { UserResponse, PageResponse, UserType } from '@/types/api';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  search: (searchTerm: string) => [...userKeys.all, 'search', searchTerm] as const,
};

// Get user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search users
export const useSearchUsers = (searchTerm: string, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: userKeys.search(searchTerm),
    queryFn: () => userService.searchUsers(searchTerm, page, size),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all freelancers
export const useAllFreelancers = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: [...userKeys.all, 'freelancers', page, size],
    queryFn: () => userService.getAllFreelancers(page, size),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get freelancer cards (with complete profile data)
export const useFreelancerCards = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: [...userKeys.all, 'freelancers-cards', page, size],
    queryFn: () => userService.getFreelancerCards(page, size),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(userKeys.profile(), data);
      // Update user detail cache if it exists
      queryClient.setQueryData(userKeys.detail(data.id), data);
    },
    onError: (error) => {
      console.error('Update profile error:', error);
    },
  });
};

// Update avatar mutation
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.updateAvatar,
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(userKeys.profile(), data);
      // Update user detail cache if it exists
      queryClient.setQueryData(userKeys.detail(data.id), data);
    },
    onError: (error) => {
      console.error('Update avatar error:', error);
    },
  });
};

// Upload avatar mutation
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: (data) => {
      // Update avatar using the returned file URL
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error('Upload avatar error:', error);
    },
  });
};

// Switch user role mutation
export const useSwitchUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.switchUserRole,
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(userKeys.profile(), data);
      // Update user detail cache if it exists
      queryClient.setQueryData(userKeys.detail(data.id), data);
      // Invalidate all user-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('Switch user role error:', error);
    },
  });
};

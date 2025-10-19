import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest, UserResponse } from '@/types/api';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Get current user hook
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store auth data
      authService.storeAuthData(data);
      // Update user query cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Store auth data
      authService.storeAuthData(data);
      // Update user query cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth data
      authService.clearAuthData();
      // Clear all query cache
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data
      authService.clearAuthData();
      queryClient.clear();
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      // Update stored token
      localStorage.setItem('accessToken', data.accessToken);
    },
    onError: (error) => {
      console.error('Token refresh error:', error);
      // Clear auth data on refresh failure
      authService.clearAuthData();
    },
  });
};

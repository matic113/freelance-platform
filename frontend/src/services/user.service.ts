import { apiService } from './api';
import { 
  UserResponse, 
  PageResponse,
  FileUploadResponse,
  UserType,
  NotificationSettingsResponse,
  UpdateNotificationSettingsRequest,
  BillingSettingsResponse,
  UpdateBillingSettingsRequest,
  PaymentMethodResponse,
  AddPaymentMethodRequest
} from '@/types/api';

export interface FreelancerCardResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  totalReviews?: number;
  totalProjects?: number;
  skills?: string[];
  city?: string;
  country?: string;
  availability?: string;
  experienceLevel?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
  bio?: string;
}

export interface UpdateAvatarRequest {
  avatarUrl: string;
}

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<UserResponse> => {
    return apiService.get<UserResponse>('/users/profile');
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    return apiService.put<UserResponse>('/users/profile', data);
  },

  // Update user avatar
  updateAvatar: async (avatarUrl: string): Promise<UserResponse> => {
    return apiService.put<UserResponse>(`/users/profile/avatar?avatarUrl=${encodeURIComponent(avatarUrl)}`);
  },

  // Get user by ID
  getUser: async (id: string): Promise<UserResponse> => {
    return apiService.get<UserResponse>(`/users/${id}`);
  },

  // Search users
  searchUsers: async (searchTerm: string, page: number = 0, size: number = 20): Promise<PageResponse<UserResponse>> => {
    return apiService.get<PageResponse<UserResponse>>('/users/search', {
      params: { searchTerm, page, size },
    });
  },

   // Get all freelancers
   getAllFreelancers: async (page: number = 0, size: number = 20): Promise<PageResponse<UserResponse>> => {
     return apiService.get<PageResponse<UserResponse>>('/users/freelancers', {
       params: { page, size },
     });
   },

   // Get freelancer cards with complete profile data
   getFreelancerCards: async (page: number = 0, size: number = 20): Promise<PageResponse<FreelancerCardResponse>> => {
     return apiService.get<PageResponse<FreelancerCardResponse>>('/users/freelancers/cards', {
       params: { page, size },
     });
   },

  // Upload avatar file
  uploadAvatar: async (file: File): Promise<{ fileUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiService.upload<any>('/files/upload', formData);
    return { fileUrl: response.fileUrl };
  },

  // Switch user role
  switchUserRole: async (newRole: UserType): Promise<UserResponse> => {
    return apiService.put<UserResponse>(`/users/profile/switch-role?newRole=${newRole}`);
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<string> => {
    return apiService.put<string>('/users/profile/password', {
      currentPassword,
      newPassword,
    });
  },

  // Delete account
  deleteAccount: async (password: string): Promise<string> => {
    return apiService.delete<string>('/users/profile', { password });
  },

  // Notification Settings
  getNotificationSettings: async (): Promise<NotificationSettingsResponse> => {
    return apiService.get<NotificationSettingsResponse>('/users/profile/notification-settings');
  },

  updateNotificationSettings: async (settings: UpdateNotificationSettingsRequest): Promise<NotificationSettingsResponse> => {
    return apiService.put<NotificationSettingsResponse>('/users/profile/notification-settings', settings);
  },

  // Billing Settings
  getBillingSettings: async (): Promise<BillingSettingsResponse> => {
    return apiService.get<BillingSettingsResponse>('/users/profile/billing-settings');
  },

  updateBillingSettings: async (settings: UpdateBillingSettingsRequest): Promise<BillingSettingsResponse> => {
    return apiService.put<BillingSettingsResponse>('/users/profile/billing-settings', settings);
  },

  // Payment Methods
  getPaymentMethods: async (): Promise<PaymentMethodResponse[]> => {
    return apiService.get<PaymentMethodResponse[]>('/users/profile/payment-methods');
  },

  addPaymentMethod: async (paymentMethod: AddPaymentMethodRequest): Promise<PaymentMethodResponse> => {
    return apiService.post<PaymentMethodResponse>('/users/profile/payment-methods', paymentMethod);
  },

  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<PaymentMethodResponse> => {
    return apiService.put<PaymentMethodResponse>(`/users/profile/payment-methods/${paymentMethodId}/default`);
  },

  deletePaymentMethod: async (paymentMethodId: string): Promise<string> => {
    return apiService.delete<string>(`/users/profile/payment-methods/${paymentMethodId}`);
  },
};

/**
 * Utility functions for user operations
 */

/**
 * Safely extract the current user ID from a UserResponse object
 * Returns null if user is not defined or ID is not available
 * @param user - The UserResponse object
 * @returns The user ID as a string, or null
 */
export const getCurrentUserId = (user: UserResponse | null | undefined): string | null => {
  if (!user || !user.id) {
    return null;
  }
  return user.id;
};

/**
 * Check if a message belongs to the current user
 * Compares the message sender ID with the current user ID (both as UUIDs)
 * @param senderId - The ID of the message sender
 * @param currentUserId - The ID of the current user
 * @returns true if the message was sent by the current user, false otherwise
 */
export const isMessageFromCurrentUser = (
  senderId: string | undefined,
  currentUserId: string | null
): boolean => {
  if (!senderId || !currentUserId) {
    return false;
  }
  // Compare UUIDs as strings (case-insensitive for safety)
  return senderId.toLowerCase() === currentUserId.toLowerCase();
};

/**
 * Get display name for a user
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Formatted display name
 */
export const getDisplayName = (
  firstName?: string,
  lastName?: string
): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || 'Unknown User';
};

/**
 * Get user initials for avatar fallback
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns 1-2 character initials
 */
export const getUserInitials = (
  firstName?: string,
  lastName?: string
): string => {
  let initials = '';
  if (firstName) {
    initials += firstName.charAt(0).toUpperCase();
  }
  if (lastName) {
    initials += lastName.charAt(0).toUpperCase();
  }
  return initials || 'U';
};

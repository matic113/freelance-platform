import { apiService } from './api';

export interface FreelancerProfileResponse {
  id: string;
  userId: string;
  bio?: string;
  hourlyRate?: number;
  availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  experienceLevel?: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT';
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  rating?: number;
  totalReviews?: number;
  totalEarnings?: number;
  totalProjects?: number;
  createdAt?: string;
  updatedAt?: string;
  skills?: string[];
  portfolios?: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  projectUrl?: string;
  projectType?: 'WEBSITE' | 'APP' | 'DESIGN' | 'VIDEO' | 'OTHER';
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateFreelancerProfileRequest {
  bio?: string;
  hourlyRate?: number; // Will be converted to string for BigDecimal
  availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  experienceLevel?: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT';
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  skills?: string[];
}

export interface AddPortfolioItemRequest {
  title: string;
  description?: string;
  projectUrl?: string;
  projectType?: 'WEBSITE' | 'APP' | 'DESIGN' | 'VIDEO' | 'OTHER';
  imageUrl?: string;
}

export const freelancerProfileService = {
  // Get current user's freelancer profile
  getMyProfile: async (): Promise<FreelancerProfileResponse> => {
    const response = await apiService.get('/freelancer-profile/my-profile');
    return response;
  },

  // Update current user's freelancer profile
  updateMyProfile: async (data: UpdateFreelancerProfileRequest): Promise<FreelancerProfileResponse> => {
    // Convert the data to match backend expectations
    const requestData = {
      ...data,
      // Convert hourlyRate number to string for BigDecimal handling
      hourlyRate: data.hourlyRate?.toString(),
    };
    
    // Remove skills from the request to avoid duplicate key constraint violation
    delete requestData.skills;
    
    const response = await apiService.put('/freelancer-profile/my-profile', requestData);
    return response;
  },

  // Get freelancer profile by user ID
  getFreelancerProfile: async (userId: string): Promise<FreelancerProfileResponse> => {
    const response = await apiService.get(`/freelancer-profile/${userId}`);
    return response;
  },

  // Add portfolio item
  addPortfolioItem: async (data: AddPortfolioItemRequest): Promise<PortfolioItem> => {
    const response = await apiService.post('/freelancer-profile/my-profile/portfolio', data);
    return response;
  },

  // Remove portfolio item
  removePortfolioItem: async (portfolioId: string): Promise<void> => {
    await apiService.delete(`/freelancer-profile/my-profile/portfolio/${portfolioId}`);
  },
};

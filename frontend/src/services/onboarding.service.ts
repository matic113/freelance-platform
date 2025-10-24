import api from './api';
import type {
  CompleteClientProfileRequest,
  CompleteFreelancerProfileRequest,
  OnboardingStatusResponse,
  ProfileCompletionResponse
} from '@/types/api';

export const onboardingService = {
  getOnboardingStatus: async (): Promise<OnboardingStatusResponse> => {
    const response = await api.get<OnboardingStatusResponse>('/onboarding/status');
    return response.data;
  },

  completeFreelancerProfile: async (
    request: CompleteFreelancerProfileRequest
  ): Promise<ProfileCompletionResponse> => {
    const response = await api.post<ProfileCompletionResponse>(
      '/onboarding/complete-freelancer',
      request
    );
    return response.data;
  },

  completeClientProfile: async (
    request: CompleteClientProfileRequest
  ): Promise<ProfileCompletionResponse> => {
    const response = await api.post<ProfileCompletionResponse>(
      '/onboarding/complete-client',
      request
    );
    return response.data;
  }
};

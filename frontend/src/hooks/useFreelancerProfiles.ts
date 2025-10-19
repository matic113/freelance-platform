import { useQuery } from '@tanstack/react-query';
import { freelancerProfileService, FreelancerProfileResponse } from '@/services/freelancerProfile.service';
import { userService } from '@/services/user.service';
import { UserResponse } from '@/types/api';

export interface CompleteFreelancerData {
  user: UserResponse;
  profile: FreelancerProfileResponse | null;
}

// Get complete freelancer data (user + profile)
export const useFreelancerProfile = (userId: string) => {
  return useQuery({
    queryKey: ['freelancer-profile', userId],
    queryFn: async (): Promise<CompleteFreelancerData> => {
      const [user, profile] = await Promise.allSettled([
        userService.getUser(userId),
        freelancerProfileService.getFreelancerProfile(userId)
      ]);

      return {
        user: user.status === 'fulfilled' ? user.value : null,
        profile: profile.status === 'fulfilled' ? profile.value : null
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get multiple freelancer profiles
export const useFreelancerProfiles = (userIds: string[]) => {
  return useQuery({
    queryKey: ['freelancer-profiles', userIds],
    queryFn: async (): Promise<CompleteFreelancerData[]> => {
      const results = await Promise.allSettled(
        userIds.map(async (userId) => {
          const [user, profile] = await Promise.allSettled([
            userService.getUser(userId),
            freelancerProfileService.getFreelancerProfile(userId)
          ]);

          return {
            user: user.status === 'fulfilled' ? user.value : null,
            profile: profile.status === 'fulfilled' ? profile.value : null
          };
        })
      );

      return results
        .filter((result): result is PromiseFulfilledResult<CompleteFreelancerData> => 
          result.status === 'fulfilled' && result.value.user !== null
        )
        .map(result => result.value);
    },
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

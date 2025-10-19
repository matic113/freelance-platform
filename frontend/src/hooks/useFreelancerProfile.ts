import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { freelancerProfileService, FreelancerProfileResponse, UpdateFreelancerProfileRequest, AddPortfolioItemRequest } from '@/services/freelancerProfile.service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const freelancerProfileKeys = {
  all: ['freelancerProfile'] as const,
  myProfile: () => [...freelancerProfileKeys.all, 'myProfile'] as const,
  profile: (userId: string) => [...freelancerProfileKeys.all, 'profile', userId] as const,
};

export const useMyFreelancerProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: freelancerProfileKeys.myProfile(),
    queryFn: freelancerProfileService.getMyProfile,
    enabled: !authLoading && !!user && user.userType === 'FREELANCER',
    retry: (failureCount, error: any) => {
      // Don't retry on 400 errors (likely user not a freelancer)
      if (error?.response?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useFreelancerProfile = (userId: string) => {
  return useQuery({
    queryKey: freelancerProfileKeys.profile(userId),
    queryFn: () => freelancerProfileService.getFreelancerProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateFreelancerProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: freelancerProfileService.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerProfileKeys.all });
      toast({
        title: "Profile Updated",
        description: "Your freelancer profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });
};

export const useAddPortfolioItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: freelancerProfileService.addPortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerProfileKeys.all });
      toast({
        title: "Portfolio Item Added",
        description: "Your portfolio item has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Add Failed",
        description: error.response?.data?.message || "Failed to add portfolio item",
        variant: "destructive",
      });
    },
  });
};

export const useRemovePortfolioItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: freelancerProfileService.removePortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: freelancerProfileKeys.all });
      toast({
        title: "Portfolio Item Removed",
        description: "Your portfolio item has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Remove Failed",
        description: error.response?.data?.message || "Failed to remove portfolio item",
        variant: "destructive",
      });
    },
  });
};

// Hook for profile completion calculation
export const useProfileCompletion = (profile: FreelancerProfileResponse | undefined) => {
  const calculateCompletion = () => {
    if (!profile) return 0;

    const fields = [
      profile.bio,
      profile.hourlyRate,
      profile.availability,
      profile.experienceLevel,
      profile.skills && profile.skills.length > 0,
      profile.portfolios && profile.portfolios.length > 0,
      profile.portfolioUrl,
      profile.linkedinUrl,
      profile.githubUrl,
      profile.websiteUrl,
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  return calculateCompletion();
};

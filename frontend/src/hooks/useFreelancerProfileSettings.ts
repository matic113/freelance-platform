import { useState, useEffect } from 'react';
import { freelancerProfileService, FreelancerProfileResponse, UpdateFreelancerProfileRequest } from '@/services/freelancerProfile.service';
import { useAuth } from '@/contexts/AuthContext';

export interface FreelancerProfileFormData {
  bio: string;
  hourlyRate: number;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT';
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
}

export const useFreelancerProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load freelancer profile data
  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await freelancerProfileService.getMyProfile();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load freelancer profile');
    } finally {
      setLoading(false);
    }
  };

  // Update freelancer profile
  const updateProfile = async (data: UpdateFreelancerProfileRequest) => {
    setSaving(true);
    setError(null);
    
    try {
      const updatedProfile = await freelancerProfileService.updateMyProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update freelancer profile');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Convert profile to form data
  const getFormData = (): FreelancerProfileFormData => {
    if (!profile) {
      return {
        bio: '',
        hourlyRate: 25,
        availability: 'AVAILABLE',
        experienceLevel: 'ENTRY',
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: '',
        websiteUrl: '',
      };
    }

    return {
      bio: profile.bio || '',
      hourlyRate: profile.hourlyRate || 25,
      availability: profile.availability || 'AVAILABLE',
      experienceLevel: profile.experienceLevel || 'ENTRY',
      portfolioUrl: profile.portfolioUrl || '',
      linkedinUrl: profile.linkedinUrl || '',
      githubUrl: profile.githubUrl || '',
      websiteUrl: profile.websiteUrl || '',
    };
  };

  // Convert form data to update request
  const getUpdateRequest = (formData: FreelancerProfileFormData): UpdateFreelancerProfileRequest => {
    return {
      bio: formData.bio,
      hourlyRate: formData.hourlyRate,
      availability: formData.availability,
      experienceLevel: formData.experienceLevel,
      portfolioUrl: formData.portfolioUrl,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      websiteUrl: formData.websiteUrl,
    };
  };

  // Load profile on mount
  useEffect(() => {
    if (user?.userType === 'FREELANCER') {
      loadProfile();
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    saving,
    loadProfile,
    updateProfile,
    getFormData,
    getUpdateRequest,
  };
};

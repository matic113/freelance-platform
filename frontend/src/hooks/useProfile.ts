import { useState, useEffect } from 'react';
import { userService, UpdateProfileRequest } from '@/services/user.service';
import { UserResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/config/env';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  timezone: string;
  language: string;
  bio: string;
  avatar: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load profile data
  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await userService.getProfile();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: UpdateProfileRequest) => {
    setSaving(true);
    setError(null);
    
    try {
      const updatedProfile = await userService.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Update avatar
  const updateAvatar = async (avatarUrl: string) => {
    setSaving(true);
    setError(null);
    
    try {
      const updatedProfile = await userService.updateAvatar(avatarUrl);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update avatar');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Upload avatar file
  const uploadAvatar = async (file: File) => {
    setSaving(true);
    setError(null);
    
    try {
      console.log('Uploading avatar file:', file.name, file.size, file.type);
      const uploadResponse = await userService.uploadAvatar(file);
      console.log('Upload response:', uploadResponse);
      
      const updatedProfile = await updateAvatar(uploadResponse.fileUrl);
      console.log('Updated profile:', updatedProfile);
      
      return updatedProfile;
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Helper function to get full avatar URL
  const getAvatarUrl = (avatarUrl: string | undefined): string => {
    if (!avatarUrl) return '';
    
    if (avatarUrl.startsWith('http')) {
      return avatarUrl;
    }
    
    // Remove /api from the base URL since avatar URLs are served directly
    const baseUrl = config.apiBaseUrl.replace('/api', '');
    return `${baseUrl}${avatarUrl}`;
  };

  // Convert profile to form data
  const getFormData = (): ProfileFormData => {
    if (!profile) {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        timezone: 'GMT+3',
        language: 'ar',
        bio: '',
        avatar: '',
      };
    }

    return {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      country: profile.country || '',
      city: profile.city || '',
      timezone: profile.timezone || 'GMT+3',
      language: profile.language || 'ar',
      bio: profile.bio || '',
      avatar: getAvatarUrl(profile.avatarUrl),
    };
  };

  // Convert form data to update request
  const getUpdateRequest = (formData: ProfileFormData): UpdateProfileRequest => {
    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      timezone: formData.timezone,
      language: formData.language,
      bio: formData.bio,
    };
  };

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [user]);


  return {
    profile,
    loading,
    error,
    saving,
    loadProfile,
    updateProfile,
    updateAvatar,
    uploadAvatar,
    getFormData,
    getUpdateRequest,
  };
};

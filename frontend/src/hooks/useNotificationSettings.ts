import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';
import { NotificationSettingsResponse, UpdateNotificationSettingsRequest } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getNotificationSettings();
      setSettings(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updateRequest: UpdateNotificationSettingsRequest) => {
    try {
      setSaving(true);
      setError(null);
      const response = await userService.updateNotificationSettings(updateRequest);
      setSettings(response);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update notification settings');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  return {
    settings,
    loading,
    error,
    saving,
    loadSettings,
    updateSettings,
  };
};

import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';
import { 
  BillingSettingsResponse, 
  UpdateBillingSettingsRequest,
  PaymentMethodResponse,
  AddPaymentMethodRequest
} from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export const useBillingSettings = () => {
  const { user } = useAuth();
  const [billingSettings, setBillingSettings] = useState<BillingSettingsResponse | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadBillingSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const [settings, methods] = await Promise.all([
        userService.getBillingSettings(),
        userService.getPaymentMethods()
      ]);
      setBillingSettings(settings);
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load billing settings');
    } finally {
      setLoading(false);
    }
  };

  const updateBillingSettings = async (updateRequest: UpdateBillingSettingsRequest) => {
    try {
      setSaving(true);
      setError(null);
      const response = await userService.updateBillingSettings(updateRequest);
      setBillingSettings(response);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update billing settings');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const addPaymentMethod = async (paymentMethod: AddPaymentMethodRequest) => {
    try {
      setSaving(true);
      setError(null);
      const response = await userService.addPaymentMethod(paymentMethod);
      setPaymentMethods(prev => [...prev, response]);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add payment method');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      setSaving(true);
      setError(null);
      const response = await userService.setDefaultPaymentMethod(paymentMethodId);
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === paymentMethodId
        }))
      );
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to set default payment method');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      setSaving(true);
      setError(null);
      await userService.deletePaymentMethod(paymentMethodId);
      setPaymentMethods(prev => prev.filter(method => method.id !== paymentMethodId));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete payment method');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadBillingSettings();
  }, [user]);

  return {
    billingSettings,
    paymentMethods,
    loading,
    error,
    saving,
    loadBillingSettings,
    updateBillingSettings,
    addPaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod,
  };
};

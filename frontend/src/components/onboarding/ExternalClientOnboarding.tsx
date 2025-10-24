import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { onboardingService } from '@/services/onboarding.service';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ClientFormData {
  country: string;
  timezone: string;
  phone: string;
  city?: string;
}

const ExternalClientOnboarding = () => {
  const navigate = useNavigate();
  const { refreshUser, setActiveRole, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: {
      country: user?.country || '',
      city: user?.city || '',
      timezone: user?.timezone || ''
    }
  });

  const totalSteps = 2;

  const onSubmit = async (data: ClientFormData) => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && !data.phone) {
        toast.error('Please enter your phone number');
        return;
      }
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      setLoading(true);
      await onboardingService.completeClientProfile({
        ...data,
        avatarUrl: user?.avatarUrl || ''
      });
      
       await refreshUser();
       setActiveRole(UserType.CLIENT);
       toast.success('Profile completed successfully!');
      
      setTimeout(() => {
        navigate('/client-dashboard');
      }, 100);
    } catch (error) {
      console.error('Error completing profile:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to complete profile';
      toast.error(errorMessage || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Phone number is required' })}
                placeholder="+1 (555) 123-4567"
                className="mt-2"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                {...register('country', { required: 'Country is required' })}
                placeholder="United States"
                className="mt-2"
              />
              {errors.country && <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <Label htmlFor="city">City (optional)</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="New York"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone *</Label>
              <Input
                id="timezone"
                {...register('timezone', { required: 'Timezone is required' })}
                placeholder="America/New_York"
                className="mt-2"
              />
              {errors.timezone && <p className="text-sm text-red-600 mt-1">{errors.timezone.message}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Contact Information',
    'Location'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}</CardTitle>
        <CardDescription>
          Complete all steps to start hiring freelancers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 mx-1 rounded ${
                  i + 1 <= currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || loading}
            >
              Previous
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : currentStep === totalSteps ? (
                'Complete Profile'
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExternalClientOnboarding;

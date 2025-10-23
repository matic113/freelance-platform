import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { onboardingService } from '@/services/onboarding.service';
import { presignedUploadService } from '@/services/fileUpload.service';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, X, Upload } from 'lucide-react';

interface ClientFormData {
  avatarUrl: string;
  country: string;
  timezone: string;
  phone: string;
  city?: string;
}

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const { refreshUser, setActiveRole } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ClientFormData>();

  const totalSteps = 3;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setLoading(true);
      toast.info('Uploading avatar...');

      const presignedData = await presignedUploadService.getPresignedUrlForAvatar(
        file.name,
        file.type
      );

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedData.uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      });

      console.log('Upload successful. File URL:', presignedData.fileUrl);
      setAvatarUrl(presignedData.fileUrl);
      setValue('avatarUrl', presignedData.fileUrl);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && !avatarUrl) {
        toast.error('Please upload a profile picture');
        return;
      }
      if (currentStep === 2 && !data.phone) {
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
        avatarUrl
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
              <Label htmlFor="avatar">Profile Picture *</Label>
              <div className="mt-2 flex flex-col items-center">
                {avatarUrl ? (
                  <div className="relative inline-block">
                    <img
                      key={avatarUrl}
                      src={avatarUrl}
                      alt="Profile"
                      crossOrigin="anonymous"
                      className="w-32 h-32 rounded-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load avatar image:', avatarUrl);
                      }}
                      onLoad={() => {
                        console.log('Avatar image loaded successfully:', avatarUrl);
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => {
                        setAvatarUrl('');
                        setValue('avatarUrl', '');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload profile picture</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
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

      case 3:
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
    'Profile Picture',
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

export default ClientOnboarding;

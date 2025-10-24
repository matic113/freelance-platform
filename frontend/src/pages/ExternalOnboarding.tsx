import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { onboardingService } from '@/services/onboarding.service';
import ExternalFreelancerOnboarding from '@/components/onboarding/ExternalFreelancerOnboarding';
import ExternalClientOnboarding from '@/components/onboarding/ExternalClientOnboarding';
import { UserType } from '@/types/api';
import { Loader2 } from 'lucide-react';

const ExternalOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    
    const checkStatus = async () => {
      if (!user) return;
      
      try {
        const status = await onboardingService.getOnboardingStatus();
        
        const isProfileComplete = user.activeRole === UserType.FREELANCER 
          ? status.freelancerProfileCompleted 
          : status.clientProfileCompleted;
        
        if (isProfileComplete) {
          hasCheckedRef.current = true;
          navigate(status.redirectUrl, { replace: true });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Let's set up your account so you can get started
          </p>
        </div>

        {user.activeRole === UserType.FREELANCER ? (
          <ExternalFreelancerOnboarding />
        ) : user.activeRole === UserType.CLIENT ? (
          <ExternalClientOnboarding />
        ) : (
          <div className="text-center text-red-600">
            Invalid user role. Please contact support.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalOnboarding;

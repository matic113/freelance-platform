import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { onboardingService } from '@/services/onboarding.service';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ExperienceLevel, SkillRequest } from '@/types/api';
import { Loader2, Plus, X } from 'lucide-react';

interface FreelancerFormData {
  bio: string;
  hourlyRate: number;
  experienceLevel: ExperienceLevel;
  country: string;
  timezone: string;
  city?: string;
}

const ExternalFreelancerOnboarding = () => {
  const navigate = useNavigate();
  const { refreshUser, setActiveRole, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillRequest[]>([]);
  const [newSkill, setNewSkill] = useState({ skillName: '', proficiencyLevel: 3, description: '' });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FreelancerFormData>({
    defaultValues: {
      experienceLevel: ExperienceLevel.ENTRY,
      country: user?.country || '',
      city: user?.city || '',
      timezone: user?.timezone || ''
    }
  });

  const totalSteps = 4;

  const addSkill = () => {
    if (!newSkill.skillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }
    if (newSkill.proficiencyLevel < 1 || newSkill.proficiencyLevel > 5) {
      toast.error('Proficiency level must be between 1 and 5');
      return;
    }
    if (skills.some(s => s.skillName.toLowerCase() === newSkill.skillName.trim().toLowerCase())) {
      toast.error('This skill has already been added');
      return;
    }
    setSkills([...skills, { ...newSkill }]);
    setNewSkill({ skillName: '', proficiencyLevel: 3, description: '' });
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FreelancerFormData) => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && (!data.bio || data.bio.length < 50)) {
        toast.error('Bio must be at least 50 characters');
        return;
      }
      if (currentStep === 2 && (!data.hourlyRate || data.hourlyRate <= 0)) {
        toast.error('Please enter a valid hourly rate');
        return;
      }
      if (currentStep === 3 && skills.length < 3) {
        toast.error('Please add at least 3 skills');
        return;
      }
      setCurrentStep(currentStep + 1);
      return;
    }

    if (skills.length < 3) {
      toast.error('Please add at least 3 skills before completing your profile');
      return;
    }

    try {
      setLoading(true);
      await onboardingService.completeFreelancerProfile({
        ...data,
        avatarUrl: user?.avatarUrl || '',
        skills
      });
      
       await refreshUser();
       setActiveRole(UserType.FREELANCER);
       toast.success('Profile completed successfully!');
      
      setTimeout(() => {
        navigate('/freelancer-dashboard');
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
              <Label htmlFor="bio">Bio * (minimum 50 characters)</Label>
              <Textarea
                id="bio"
                {...register('bio', { 
                  required: 'Bio is required',
                  minLength: { value: 50, message: 'Bio must be at least 50 characters' }
                })}
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                rows={6}
                className="mt-2"
              />
              {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>}
              <p className="text-sm text-gray-500 mt-1">
                {watch('bio')?.length || 0} / 50 characters
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                {...register('hourlyRate', { 
                  required: 'Hourly rate is required',
                  min: { value: 0.01, message: 'Hourly rate must be greater than 0' }
                })}
                placeholder="50.00"
                className="mt-2"
              />
              {errors.hourlyRate && <p className="text-sm text-red-600 mt-1">{errors.hourlyRate.message}</p>}
            </div>
            <div>
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <Select
                defaultValue={ExperienceLevel.ENTRY}
                onValueChange={(value) => setValue('experienceLevel', value as ExperienceLevel)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ExperienceLevel.ENTRY}>Entry Level</SelectItem>
                  <SelectItem value={ExperienceLevel.INTERMEDIATE}>Intermediate</SelectItem>
                  <SelectItem value={ExperienceLevel.EXPERT}>Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Skills * (minimum 3)</Label>
              <div className="mt-2 space-y-3">
                <div className="grid grid-cols-12 gap-2">
                  <Input
                    placeholder="Skill name (e.g., JavaScript)"
                    value={newSkill.skillName}
                    onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                    className="col-span-5"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Level (1-5)"
                    value={newSkill.proficiencyLevel}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: parseInt(e.target.value) || 3 })}
                    className="col-span-2"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    className="col-span-4"
                  />
                  <Button type="button" onClick={addSkill} className="col-span-1">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="space-y-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{skill.skillName}</p>
                          <p className="text-sm text-gray-600">
                            Level: {skill.proficiencyLevel}/5
                            {skill.description && ` - ${skill.description}`}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {skills.length} / 3 skills added
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
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
    'About You',
    'Rate & Experience',
    'Skills',
    'Location'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}</CardTitle>
        <CardDescription>
          Complete all steps to start finding projects
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

export default ExternalFreelancerOnboarding;

import { useQuery, useMutation } from '@tanstack/react-query';
import { contentService, SuccessStoriesResponse, ClientExperiencesResponse, AboutUsResponse, ContentResponse } from '@/services/content.service';

// Hook for success stories
export const useSuccessStories = () => {
  return useQuery<SuccessStoriesResponse>({
    queryKey: ['success-stories'],
    queryFn: contentService.getSuccessStories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for client experiences/testimonials
export const useClientExperiences = () => {
  return useQuery<ClientExperiencesResponse>({
    queryKey: ['client-experiences'],
    queryFn: contentService.getClientExperiences,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for about us content
export const useAboutUs = () => {
  return useQuery<AboutUsResponse>({
    queryKey: ['about-us'],
    queryFn: contentService.getAboutUs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for privacy policy
export const usePrivacyPolicy = () => {
  return useQuery<ContentResponse>({
    queryKey: ['privacy-policy'],
    queryFn: contentService.getPrivacyPolicy,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for terms of use
export const useTermsOfUse = () => {
  return useQuery<ContentResponse>({
    queryKey: ['terms-of-use'],
    queryFn: contentService.getTermsOfUse,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for cookie policy
export const useCookiePolicy = () => {
  return useQuery<ContentResponse>({
    queryKey: ['cookie-policy'],
    queryFn: contentService.getCookiePolicy,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for submitting contact form
export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: contentService.submitContactForm,
    onError: (error) => {
      console.error('Submit contact form error:', error);
    },
  });
};

// FAQ hooks
export const useFAQs = () => {
  return useQuery({
    queryKey: ['content', 'faqs'],
    queryFn: contentService.getFAQs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFAQsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['content', 'faqs', 'category', category],
    queryFn: () => contentService.getFAQsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchFAQs = (searchTerm: string) => {
  return useQuery({
    queryKey: ['content', 'faqs', 'search', searchTerm],
    queryFn: () => contentService.searchFAQs(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
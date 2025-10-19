import { apiService } from './api';

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  client: string;
  freelancer: string;
  project: string;
  duration: string;
  budget: string;
  image?: string;
  rating?: number;
  testimonial?: string;
  results?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SuccessStoriesResponse {
  title: string;
  stories: SuccessStory[];
}

export interface ClientExperience {
  id: string;
  clientName: string;
  clientTitle: string;
  rating: number;
  comment: string;
  project: string;
  date: string;
}

export interface ClientExperiencesResponse {
  title: string;
  testimonials: ClientExperience[];
}

export interface AboutUsResponse {
  title: string;
  content: string;
  mission: string;
  vision: string;
  founded: string;
  teamSize: string;
  countries: string;
}

export interface ContentResponse {
  title: string;
  content: string;
}

export const contentService = {
  // Get success stories
  getSuccessStories: async (): Promise<SuccessStoriesResponse> => {
    return apiService.get<SuccessStoriesResponse>('/content/success-stories');
  },

  // Get client experiences/testimonials
  getClientExperiences: async (): Promise<ClientExperiencesResponse> => {
    return apiService.get<ClientExperiencesResponse>('/content/client-experiences');
  },

  // Get about us content
  getAboutUs: async (): Promise<AboutUsResponse> => {
    return apiService.get<AboutUsResponse>('/content/about-us');
  },

  // Get privacy policy
  getPrivacyPolicy: async (): Promise<ContentResponse> => {
    return apiService.get<ContentResponse>('/content/privacy-policy');
  },

  // Get terms of use
  getTermsOfUse: async (): Promise<ContentResponse> => {
    return apiService.get<ContentResponse>('/content/terms-of-use');
  },

  // Get cookie policy
  getCookiePolicy: async (): Promise<ContentResponse> => {
    return apiService.get<ContentResponse>('/content/cookie-policy');
  },

  // Submit contact form
  submitContactForm: async (data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    subject: string;
    category: string;
    message: string;
  }): Promise<{ success: boolean; message: string; ticketId?: string; submittedAt?: string }> => {
    return apiService.post<{ success: boolean; message: string; ticketId?: string; submittedAt?: string }>('/content/contact-us', data);
  },

  // FAQ methods
  getFAQs: async (): Promise<{
    success: boolean;
    faqs?: Record<string, any[]>;
    totalCount?: number;
    message?: string;
  }> => {
    return apiService.get('/content/faqs');
  },

  getFAQsByCategory: async (category: string): Promise<{
    success: boolean;
    faqs?: any[];
    category?: string;
    count?: number;
    message?: string;
  }> => {
    return apiService.get(`/content/faqs/category/${category}`);
  },

  searchFAQs: async (searchTerm: string): Promise<{
    success: boolean;
    faqs?: any[];
    searchTerm?: string;
    count?: number;
    message?: string;
  }> => {
    return apiService.get(`/content/faqs/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  },
};

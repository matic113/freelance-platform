import { apiService } from './api';
import { 
  PortfolioItem, 
  AddPortfolioRequest 
} from '@/types/api';

export const portfolioService = {
  // Get current user's portfolio
  getCurrentUserPortfolio: async (): Promise<PortfolioItem[]> => {
    return apiService.get<PortfolioItem[]>('/portfolio/my-portfolio');
  },

  // Get freelancer's portfolio
  getFreelancerPortfolio: async (freelancerId: string): Promise<PortfolioItem[]> => {
    return apiService.get<PortfolioItem[]>(`/portfolio/freelancer/${freelancerId}`);
  },

  // Get featured portfolio items
  getFeaturedPortfolioItems: async (): Promise<PortfolioItem[]> => {
    return apiService.get<PortfolioItem[]>('/portfolio/featured');
  },

  // Search portfolio items
  searchPortfolioItems: async (searchTerm: string): Promise<PortfolioItem[]> => {
    return apiService.get<PortfolioItem[]>('/portfolio/search', {
      params: { searchTerm },
    });
  },

  // Get portfolio item by ID
  getPortfolioItem: async (portfolioId: string): Promise<PortfolioItem> => {
    return apiService.get<PortfolioItem>(`/portfolio/${portfolioId}`);
  },

  // Add portfolio item
  addPortfolioItem: async (request: AddPortfolioRequest): Promise<PortfolioItem> => {
    return apiService.post<PortfolioItem>('/portfolio/add', request);
  },

  // Update portfolio item
  updatePortfolioItem: async (portfolioId: string, request: AddPortfolioRequest): Promise<PortfolioItem> => {
    return apiService.put<PortfolioItem>(`/portfolio/${portfolioId}`, request);
  },

  // Delete portfolio item
  deletePortfolioItem: async (portfolioId: string): Promise<void> => {
    return apiService.delete<void>(`/portfolio/${portfolioId}`);
  },
};

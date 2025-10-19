import { useState, useEffect } from 'react';
import { portfolioService } from '@/services/portfolio.service';
import { 
  PortfolioItem, 
  AddPortfolioRequest 
} from '@/types/api';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [featuredPortfolio, setFeaturedPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current user's portfolio
  const loadPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const portfolioData = await portfolioService.getCurrentUserPortfolio();
      console.log('Loaded portfolio data:', portfolioData);
      setPortfolio(portfolioData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Load featured portfolio items
  const loadFeaturedPortfolio = async () => {
    try {
      const featuredData = await portfolioService.getFeaturedPortfolioItems();
      setFeaturedPortfolio(featuredData);
    } catch (err) {
      console.error('Failed to load featured portfolio:', err);
    }
  };

  // Search portfolio items
  const searchPortfolio = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await loadPortfolio();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const searchResults = await portfolioService.searchPortfolioItems(searchTerm);
      setPortfolio(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Add portfolio item
  const addPortfolioItem = async (request: AddPortfolioRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await portfolioService.addPortfolioItem(request);
      console.log('Added new portfolio item:', newItem);
      setPortfolio(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add portfolio item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update portfolio item
  const updatePortfolioItem = async (portfolioId: string, request: AddPortfolioRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedItem = await portfolioService.updatePortfolioItem(portfolioId, request);
      setPortfolio(prev => 
        prev.map(item => 
          item.id === portfolioId ? updatedItem : item
        )
      );
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete portfolio item
  const deletePortfolioItem = async (portfolioId: string) => {
    setLoading(true);
    setError(null);
    try {
      await portfolioService.deletePortfolioItem(portfolioId);
      setPortfolio(prev => prev.filter(item => item.id !== portfolioId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    loadPortfolio();
    loadFeaturedPortfolio();
  }, []);

  return {
    portfolio,
    featuredPortfolio,
    loading,
    error,
    loadPortfolio,
    loadFeaturedPortfolio,
    searchPortfolio,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
  };
};

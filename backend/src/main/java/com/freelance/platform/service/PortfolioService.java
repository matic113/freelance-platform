package com.freelance.platform.service;

import com.freelance.platform.dto.request.AddPortfolioRequest;
import com.freelance.platform.dto.response.PortfolioResponse;
import com.freelance.platform.entity.FreelancerProfile;
import com.freelance.platform.entity.Portfolio;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.PortfolioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PortfolioService {
    
    @Autowired
    private PortfolioRepository portfolioRepository;
    
    @Autowired
    private FreelancerProfileService freelancerProfileService;
    
    @Autowired
    private AuthService authService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Add portfolio item
    public PortfolioResponse addPortfolioItem(AddPortfolioRequest request) {
        try {
            System.out.println("Adding portfolio item with request: " + request);
            User currentUser = authService.getCurrentUser();
            System.out.println("Current user: " + currentUser.getId());
            
            FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
            System.out.println("Freelancer profile: " + freelancerProfile.getId());
            
            Portfolio portfolio = new Portfolio();
            portfolio.setFreelancer(freelancerProfile);
            portfolio.setTitle(request.getTitle());
            portfolio.setDescription(request.getDescription());
            portfolio.setImageUrls(convertImageUrlsToString(request.getImageUrls()));
            portfolio.setProjectUrl(request.getProjectUrl());
            portfolio.setGithubUrl(request.getGithubUrl());
            portfolio.setTechnologies(request.getTechnologies());
            portfolio.setProjectDate(request.getProjectDate());
            portfolio.setIsFeatured(request.getIsFeatured());
            
            System.out.println("Portfolio before save: " + portfolio);
            System.out.println("Freelancer profile ID: " + freelancerProfile.getId());
            System.out.println("Freelancer profile: " + freelancerProfile);
            Portfolio savedPortfolio = portfolioRepository.save(portfolio);
            System.out.println("Portfolio saved successfully: " + savedPortfolio.getId());
            
            return mapToPortfolioResponse(savedPortfolio);
        } catch (Exception e) {
            System.err.println("Error in addPortfolioItem: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    // Update portfolio item
    public PortfolioResponse updatePortfolioItem(UUID portfolioId, AddPortfolioRequest request) {
        User currentUser = authService.getCurrentUser();
        FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
        
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found"));
        
        // Verify ownership
        if (!portfolio.getFreelancer().getId().equals(freelancerProfile.getId())) {
            throw new RuntimeException("You can only update your own portfolio items");
        }
        
        portfolio.setTitle(request.getTitle());
        portfolio.setDescription(request.getDescription());
        portfolio.setImageUrls(convertImageUrlsToString(request.getImageUrls()));
        portfolio.setProjectUrl(request.getProjectUrl());
        portfolio.setGithubUrl(request.getGithubUrl());
        portfolio.setTechnologies(request.getTechnologies());
        portfolio.setProjectDate(request.getProjectDate());
        portfolio.setIsFeatured(request.getIsFeatured());
        
        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        
        return mapToPortfolioResponse(updatedPortfolio);
    }
    
    // Delete portfolio item
    public void deletePortfolioItem(UUID portfolioId) {
        User currentUser = authService.getCurrentUser();
        FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
        
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found"));
        
        // Verify ownership
        if (!portfolio.getFreelancer().getId().equals(freelancerProfile.getId())) {
            throw new RuntimeException("You can only delete your own portfolio items");
        }
        
        portfolioRepository.delete(portfolio);
    }
    
    // Get freelancer's portfolio
    public List<PortfolioResponse> getFreelancerPortfolio(UUID freelancerId) {
        return portfolioRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId).stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }
    
    // Get current user's portfolio
    public List<PortfolioResponse> getCurrentUserPortfolio() {
        User currentUser = authService.getCurrentUser();
        FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
        return getFreelancerPortfolio(freelancerProfile.getId());
    }
    
    // Get featured portfolio items
    public List<PortfolioResponse> getFeaturedPortfolioItems() {
        return portfolioRepository.findByIsFeaturedTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }
    
    // Search portfolio items
    public List<PortfolioResponse> searchPortfolioItems(String searchTerm) {
        return portfolioRepository.searchPortfolios(searchTerm).stream()
                .map(this::mapToPortfolioResponse)
                .collect(Collectors.toList());
    }
    
    // Get portfolio item by ID
    public PortfolioResponse getPortfolioItem(UUID portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found"));
        
        return mapToPortfolioResponse(portfolio);
    }
    
    // Helper methods
    private String convertImageUrlsToString(List<String> imageUrls) {
        System.out.println("Converting image URLs to string: " + imageUrls);
        if (imageUrls == null || imageUrls.isEmpty()) {
            return null;
        }
        try {
            String result = objectMapper.writeValueAsString(imageUrls);
            System.out.println("Converted to JSON: " + result);
            return result;
        } catch (JsonProcessingException e) {
            System.err.println("Failed to convert image URLs to JSON: " + e.getMessage());
            throw new RuntimeException("Failed to convert image URLs to JSON", e);
        }
    }
    
    private List<String> convertStringToImageUrls(String imageUrlsJson) {
        if (imageUrlsJson == null || imageUrlsJson.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(imageUrlsJson, List.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to image URLs", e);
        }
    }
    
    private PortfolioResponse mapToPortfolioResponse(Portfolio portfolio) {
        PortfolioResponse response = new PortfolioResponse();
        response.setId(portfolio.getId());
        response.setTitle(portfolio.getTitle());
        response.setDescription(portfolio.getDescription());
        response.setImageUrls(convertStringToImageUrls(portfolio.getImageUrls()));
        response.setProjectUrl(portfolio.getProjectUrl());
        response.setGithubUrl(portfolio.getGithubUrl());
        response.setTechnologies(portfolio.getTechnologies());
        response.setProjectDate(portfolio.getProjectDate());
        response.setIsFeatured(portfolio.getIsFeatured());
        response.setCreatedAt(portfolio.getCreatedAt());
        response.setUpdatedAt(portfolio.getUpdatedAt());
        return response;
    }
}

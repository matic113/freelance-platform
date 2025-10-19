package com.freelance.platform.service;

import com.freelance.platform.dto.request.UpdateFreelancerProfileRequest;
import com.freelance.platform.dto.request.AddPortfolioItemRequest;
import com.freelance.platform.dto.response.FreelancerProfileResponse;
import com.freelance.platform.entity.*;
import com.freelance.platform.repository.FreelancerProfileRepository;
import com.freelance.platform.repository.UserRepository;
import com.freelance.platform.repository.FreelancerSkillRepository;
import com.freelance.platform.repository.SkillRepository;
import com.freelance.platform.repository.PortfolioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class FreelancerProfileService {

    @Autowired
    private FreelancerProfileRepository freelancerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FreelancerSkillRepository freelancerSkillRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FreelancerProfile getFreelancerProfileEntity(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isFreelancer()) {
            throw new IllegalArgumentException("User is not a freelancer. Current user type: " + user.getRoles());
        }

        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile == null) {
            // Create a basic profile if it doesn't exist
            profile = new FreelancerProfile(user);
            profile = freelancerProfileRepository.save(profile);
        }

        return profile;
    }

    public FreelancerProfileResponse getFreelancerProfile(UUID userId) {
        System.out.println("=== FREELANCER PROFILE SERVICE START ===");
        System.out.println("User ID: " + userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("User found: " + user.getEmail() + ", Type: " + user.getRoles());

        if (!user.isFreelancer()) {
            throw new IllegalArgumentException("User is not a freelancer. Current user type: " + user.getRoles());
        }

        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElse(null);

        System.out.println("Profile found: " + (profile != null ? profile.getId() : "null"));

        if (profile == null) {
            System.out.println("Creating new profile for user: " + userId);
            // Create a basic profile if it doesn't exist
            profile = new FreelancerProfile(user);
            profile = freelancerProfileRepository.save(profile);
            System.out.println("New profile created: " + profile.getId());
        }

        // Fetch skills and portfolios separately to avoid MultipleBagFetchException
        System.out.println("Fetching skills and portfolios separately...");
        FreelancerProfile profileWithSkills = freelancerProfileRepository.findByUserIdWithSkills(userId).orElse(profile);
        FreelancerProfile profileWithPortfolios = freelancerProfileRepository.findByUserIdWithPortfolios(userId).orElse(profile);
        
        // Merge the data
        if (profileWithSkills.getSkills() != null) {
            profile.setSkills(profileWithSkills.getSkills());
        }
        if (profileWithPortfolios.getPortfolios() != null) {
            profile.setPortfolios(profileWithPortfolios.getPortfolios());
        }

        System.out.println("Mapping profile to response...");
        FreelancerProfileResponse response = mapToResponse(profile);
        System.out.println("Response mapped successfully");
        
        return response;
    }

    public FreelancerProfileResponse updateFreelancerProfile(UUID userId, UpdateFreelancerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isFreelancer()) {
            throw new RuntimeException("User is not a freelancer");
        }

        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElse(new FreelancerProfile(user));

        // Update basic profile information
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getHourlyRate() != null) {
            profile.setHourlyRate(request.getHourlyRate());
        }
        if (request.getAvailability() != null) {
            profile.setAvailability(request.getAvailability());
        }
        if (request.getExperienceLevel() != null) {
            profile.setExperienceLevel(request.getExperienceLevel());
        }
        if (request.getPortfolioUrl() != null) {
            profile.setPortfolioUrl(request.getPortfolioUrl());
        }
        if (request.getLinkedinUrl() != null) {
            profile.setLinkedinUrl(request.getLinkedinUrl());
        }
        if (request.getGithubUrl() != null) {
            profile.setGithubUrl(request.getGithubUrl());
        }
        if (request.getWebsiteUrl() != null) {
            profile.setWebsiteUrl(request.getWebsiteUrl());
        }

        // Update skills if provided
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            // Remove existing skills
            freelancerSkillRepository.deleteByFreelancer(profile);
            
            // Add new skills
            for (String skillName : request.getSkills()) {
                Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(skillName);
                            return skillRepository.save(newSkill);
                        });

                FreelancerSkill freelancerSkill = new FreelancerSkill(
                        profile, 
                        skill, 
                        3 // Default proficiency level (Intermediate)
                    );
                freelancerSkillRepository.save(freelancerSkill);
            }
        }

        profile = freelancerProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    private FreelancerProfileResponse mapToResponse(FreelancerProfile profile) {
        System.out.println("=== MAPPING PROFILE TO RESPONSE ===");
        
        FreelancerProfileResponse response = new FreelancerProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setBio(profile.getBio());
        response.setHourlyRate(profile.getHourlyRate());
        response.setAvailability(profile.getAvailability());
        response.setExperienceLevel(profile.getExperienceLevel());
        response.setPortfolioUrl(profile.getPortfolioUrl());
        response.setLinkedinUrl(profile.getLinkedinUrl());
        response.setGithubUrl(profile.getGithubUrl());
        response.setWebsiteUrl(profile.getWebsiteUrl());
        response.setRating(profile.getRating());
        response.setTotalReviews(profile.getTotalReviews());
        response.setTotalEarnings(profile.getTotalEarnings());
        response.setTotalProjects(profile.getTotalProjects());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());

        System.out.println("Basic profile fields mapped");

        // Map skills - now eagerly loaded
        List<String> skillNames = new ArrayList<>();
        if (profile.getSkills() != null) {
            System.out.println("Mapping skills, count: " + profile.getSkills().size());
            skillNames = profile.getSkills().stream()
                    .map(fs -> fs.getSkill().getName())
                    .collect(Collectors.toList());
        }
        response.setSkills(skillNames);
        System.out.println("Skills mapped: " + skillNames.size());

        // Map portfolios - now eagerly loaded
        List<FreelancerProfileResponse.PortfolioItem> portfolioItems = new ArrayList<>();
        if (profile.getPortfolios() != null) {
            System.out.println("Mapping portfolios, count: " + profile.getPortfolios().size());
            portfolioItems = profile.getPortfolios().stream()
                    .map(portfolio -> {
                        FreelancerProfileResponse.PortfolioItem item = new FreelancerProfileResponse.PortfolioItem();
                        item.setId(portfolio.getId());
                        item.setTitle(portfolio.getTitle());
                        item.setDescription(portfolio.getDescription());
                        item.setProjectUrl(portfolio.getProjectUrl());
                        item.setTechnologies(portfolio.getTechnologies());
                        item.setImageUrls(convertStringToImageUrls(portfolio.getImageUrls()));
                        item.setCreatedAt(portfolio.getCreatedAt());
                        item.setUpdatedAt(portfolio.getUpdatedAt());
                        return item;
                    })
                    .collect(Collectors.toList());
        }
        response.setPortfolios(portfolioItems);
        System.out.println("Portfolios mapped: " + portfolioItems.size());

        System.out.println("=== MAPPING COMPLETE ===");
        return response;
    }

    public FreelancerProfileResponse.PortfolioItem addPortfolioItem(UUID userId, AddPortfolioItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isFreelancer()) {
            throw new RuntimeException("User is not a freelancer");
        }

        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        Portfolio portfolio = new Portfolio();
        portfolio.setFreelancer(profile);
        portfolio.setTitle(request.getTitle());
        portfolio.setDescription(request.getDescription());
        portfolio.setProjectUrl(request.getProjectUrl());
        portfolio.setTechnologies(request.getTechnologies());
        portfolio.setImageUrls(convertImageUrlsToString(request.getImageUrls()));

        portfolio = portfolioRepository.save(portfolio);

        // Map to response
        FreelancerProfileResponse.PortfolioItem item = new FreelancerProfileResponse.PortfolioItem();
        item.setId(portfolio.getId());
        item.setTitle(portfolio.getTitle());
        item.setDescription(portfolio.getDescription());
        item.setProjectUrl(portfolio.getProjectUrl());
        item.setTechnologies(portfolio.getTechnologies());
        item.setImageUrls(convertStringToImageUrls(portfolio.getImageUrls()));
        item.setCreatedAt(portfolio.getCreatedAt());
        item.setUpdatedAt(portfolio.getUpdatedAt());

        return item;
    }

    public void removePortfolioItem(UUID userId, UUID portfolioId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isFreelancer()) {
            throw new RuntimeException("User is not a freelancer");
        }

        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found"));

        if (!portfolio.getFreelancer().getId().equals(profile.getId())) {
            throw new RuntimeException("Portfolio item does not belong to this freelancer");
        }

        portfolioRepository.delete(portfolio);
    }
    
    // Helper methods for JSON conversion
    private String convertImageUrlsToString(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(imageUrls);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert image URLs to JSON", e);
        }
    }
    
    private List<String> convertStringToImageUrls(String imageUrlsJson) {
        if (imageUrlsJson == null || imageUrlsJson.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(imageUrlsJson, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to image URLs", e);
        }
    }
}

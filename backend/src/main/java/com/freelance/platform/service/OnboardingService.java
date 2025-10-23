package com.freelance.platform.service;

import com.freelance.platform.dto.request.CompleteClientProfileRequest;
import com.freelance.platform.dto.request.CompleteFreelancerProfileRequest;
import com.freelance.platform.dto.request.SkillRequest;
import com.freelance.platform.dto.response.OnboardingStatusResponse;
import com.freelance.platform.dto.response.ProfileCompletionResponse;
import com.freelance.platform.dto.response.UserResponse;
import com.freelance.platform.entity.*;
import com.freelance.platform.repository.FreelancerProfileRepository;
import com.freelance.platform.repository.FreelancerSkillRepository;
import com.freelance.platform.repository.SkillRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class OnboardingService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FreelancerProfileRepository freelancerProfileRepository;
    
    @Autowired
    private FreelancerSkillRepository freelancerSkillRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    public OnboardingStatusResponse checkProfileCompletion(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> checklist = new HashMap<>();
        
        if (user.isFreelancer()) {
            FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId).orElse(null);
            
            checklist.put("hasBio", profile != null && profile.getBio() != null && profile.getBio().length() >= 50);
            checklist.put("hasHourlyRate", profile != null && profile.getHourlyRate() != null && profile.getHourlyRate().doubleValue() > 0);
            checklist.put("hasExperienceLevel", profile != null && profile.getExperienceLevel() != null);
            checklist.put("hasLocation", user.getCountry() != null && user.getTimezone() != null);
            checklist.put("hasAvatar", user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty());
            
            long skillsCount = freelancerSkillRepository.countByFreelancerId(profile != null ? profile.getId() : UUID.randomUUID());
            checklist.put("hasSkills", skillsCount >= 3);
            checklist.put("skillsCount", skillsCount);
        } else if (user.isClient()) {
            checklist.put("hasLocation", user.getCountry() != null && user.getTimezone() != null);
            checklist.put("hasPhone", user.getPhone() != null && !user.getPhone().isEmpty());
            checklist.put("hasAvatar", user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty());
        }
        
        String redirectUrl = user.getProfileCompleted() ? getDashboardUrl(user) : "/onboarding";
        
        return new OnboardingStatusResponse(
            user.getProfileCompleted(),
            user.getActiveRole(),
            redirectUrl,
            checklist
        );
    }
    
    public ProfileCompletionResponse completeFreelancerProfile(UUID userId, CompleteFreelancerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.isFreelancer()) {
            throw new IllegalArgumentException("User is not a freelancer");
        }
        
        user.setCountry(request.getCountry());
        user.setTimezone(request.getTimezone());
        user.setAvatarUrl(request.getAvatarUrl());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        
        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    FreelancerProfile newProfile = new FreelancerProfile(user);
                    return freelancerProfileRepository.save(newProfile);
                });
        
        profile.setBio(request.getBio());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setExperienceLevel(request.getExperienceLevel());
        
        freelancerProfileRepository.save(profile);
        
        freelancerSkillRepository.deleteByFreelancerId(profile.getId());
        
        for (SkillRequest skillReq : request.getSkills()) {
            Skill skill = skillRepository.findByName(skillReq.getSkillName())
                    .orElseGet(() -> {
                        Skill newSkill = new Skill(skillReq.getSkillName(), null, null);
                        return skillRepository.save(newSkill);
                    });
            
            FreelancerSkill freelancerSkill = new FreelancerSkill(profile, skill, skillReq.getProficiencyLevel());
            if (skillReq.getDescription() != null) {
                freelancerSkill.setDescription(skillReq.getDescription());
            }
            freelancerSkillRepository.save(freelancerSkill);
        }
        
        user.setProfileCompleted(true);
        user.setProfileCompletedAt(LocalDateTime.now());
        user.setActiveRole(Role.FREELANCER);
        userRepository.save(user);
        
        UserResponse userResponse = mapUserToResponse(user);
        
        return new ProfileCompletionResponse(true, "Freelancer profile completed successfully", userResponse);
    }
    
    public ProfileCompletionResponse completeClientProfile(UUID userId, CompleteClientProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.isClient()) {
            throw new IllegalArgumentException("User is not a client");
        }
        
        user.setCountry(request.getCountry());
        user.setTimezone(request.getTimezone());
        user.setPhone(request.getPhone());
        user.setAvatarUrl(request.getAvatarUrl());
        
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        
        user.setProfileCompleted(true);
        user.setProfileCompletedAt(LocalDateTime.now());
        user.setActiveRole(Role.CLIENT);
        userRepository.save(user);
        
        UserResponse userResponse = mapUserToResponse(user);
        
        return new ProfileCompletionResponse(true, "Client profile completed successfully", userResponse);
    }
    
    private String getDashboardUrl(User user) {
        if (user.isAdmin()) {
            return "/admin/dashboard";
        } else if (user.isFreelancer()) {
            return "/freelancer/dashboard";
        } else if (user.isClient()) {
            return "/client/dashboard";
        }
        return "/";
    }
    
    private UserResponse mapUserToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRoles(user.getRoles());
        response.setActiveRole(user.getActiveRole());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setPhone(user.getPhone());
        response.setCountry(user.getCountry());
        response.setCity(user.getCity());
        response.setTimezone(user.getTimezone());
        response.setLanguage(user.getLanguage());
        response.setIsVerified(user.getIsVerified());
        response.setIsActive(user.getIsActive());
        response.setProfileCompleted(user.getProfileCompleted());
        response.setProfileCompletedAt(user.getProfileCompletedAt());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}

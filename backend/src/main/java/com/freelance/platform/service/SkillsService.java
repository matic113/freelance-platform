package com.freelance.platform.service;

import com.freelance.platform.dto.request.AddSkillRequest;
import com.freelance.platform.dto.request.UpdateSkillRequest;
import com.freelance.platform.dto.response.FreelancerSkillResponse;
import com.freelance.platform.dto.response.SkillResponse;
import com.freelance.platform.entity.FreelancerProfile;
import com.freelance.platform.entity.FreelancerSkill;
import com.freelance.platform.entity.Skill;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.FreelancerSkillRepository;
import com.freelance.platform.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SkillsService {
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Autowired
    private FreelancerSkillRepository freelancerSkillRepository;
    
    @Autowired
    private FreelancerProfileService freelancerProfileService;
    
    @Autowired
    private AuthService authService;
    
    // Get all available skills
    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAllOrderByName().stream()
                .map(this::mapToSkillResponse)
                .collect(Collectors.toList());
    }
    
    // Get skills by category
    public List<SkillResponse> getSkillsByCategory(String category) {
        return skillRepository.findByCategory(category).stream()
                .map(this::mapToSkillResponse)
                .collect(Collectors.toList());
    }
    
    // Search skills
    public List<SkillResponse> searchSkills(String searchTerm) {
        return skillRepository.findByNameContainingIgnoreCase(searchTerm).stream()
                .map(this::mapToSkillResponse)
                .collect(Collectors.toList());
    }
    
    // Get all skill categories
    public List<String> getAllCategories() {
        return skillRepository.findAllCategories();
    }
    
    // Add skill to freelancer
    public FreelancerSkillResponse addSkillToFreelancer(AddSkillRequest request) {
        User currentUser = authService.getCurrentUser();
        System.out.println("Adding skill for user: " + currentUser.getId());
        FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
        System.out.println("Freelancer profile ID: " + freelancerProfile.getId());
        
        // Find or create skill
        Skill skill = skillRepository.findByName(request.getSkillName())
                .orElseGet(() -> {
                    Skill newSkill = new Skill(request.getSkillName(), "", "General");
                    return skillRepository.save(newSkill);
                });
        
        // Check if skill already exists for this freelancer
        if (freelancerSkillRepository.existsByFreelancerAndSkill(freelancerProfile, skill)) {
            throw new RuntimeException("Skill already exists for this freelancer");
        }
        
        // Create freelancer skill
        FreelancerSkill freelancerSkill = new FreelancerSkill();
        freelancerSkill.setFreelancer(freelancerProfile);
        freelancerSkill.setSkill(skill);
        freelancerSkill.setProficiencyLevel(request.getProficiencyLevel());
        freelancerSkill.setDescription(request.getDescription());
        
        FreelancerSkill savedFreelancerSkill = freelancerSkillRepository.save(freelancerSkill);
        System.out.println("Saved freelancer skill with ID: " + savedFreelancerSkill.getId());
        
        return mapToFreelancerSkillResponse(savedFreelancerSkill);
    }
    
    // Update freelancer skill
    public FreelancerSkillResponse updateFreelancerSkill(UUID skillId, UpdateSkillRequest request) {
        User currentUser = authService.getCurrentUser();
        FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
        
        FreelancerSkill freelancerSkill = freelancerSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        
        // Verify ownership
        if (!freelancerSkill.getFreelancer().getId().equals(freelancerProfile.getId())) {
            throw new RuntimeException("You can only update your own skills");
        }
        
        freelancerSkill.setProficiencyLevel(request.getProficiencyLevel());
        freelancerSkill.setDescription(request.getDescription());
        
        FreelancerSkill updatedFreelancerSkill = freelancerSkillRepository.save(freelancerSkill);
        
        return mapToFreelancerSkillResponse(updatedFreelancerSkill);
    }
    
    // Remove skill from freelancer
    public void removeSkillFromFreelancer(UUID skillId) {
        User currentUser = authService.getCurrentUser();
        FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
        
        FreelancerSkill freelancerSkill = freelancerSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        
        // Verify ownership
        if (!freelancerSkill.getFreelancer().getId().equals(freelancerProfile.getId())) {
            throw new RuntimeException("You can only remove your own skills");
        }
        
        freelancerSkillRepository.delete(freelancerSkill);
    }
    
    // Get freelancer's skills
    public List<FreelancerSkillResponse> getFreelancerSkills(UUID freelancerId) {
        System.out.println("Querying skills for freelancer ID: " + freelancerId);
        List<FreelancerSkill> freelancerSkills = freelancerSkillRepository.findByFreelancerIdWithSkill(freelancerId);
        System.out.println("Found " + freelancerSkills.size() + " freelancer skills from database");
        return freelancerSkills.stream()
                .map(this::mapToFreelancerSkillResponse)
                .collect(Collectors.toList());
    }
    
    // Get current user's skills
    public List<FreelancerSkillResponse> getCurrentUserSkills() {
        User currentUser = authService.getCurrentUser();
        System.out.println("Getting skills for user: " + currentUser.getId());
        FreelancerProfile freelancerProfile = freelancerProfileService.getFreelancerProfileEntity(currentUser.getId());
        System.out.println("Freelancer profile ID: " + freelancerProfile.getId());
        List<FreelancerSkillResponse> skills = getFreelancerSkills(freelancerProfile.getId());
        System.out.println("Found " + skills.size() + " skills for user");
        return skills;
    }
    
    // Helper methods
    private SkillResponse mapToSkillResponse(Skill skill) {
        SkillResponse response = new SkillResponse();
        response.setId(skill.getId());
        response.setName(skill.getName());
        response.setDescription(skill.getDescription());
        response.setCategory(skill.getCategory());
        response.setCreatedAt(skill.getCreatedAt());
        response.setUpdatedAt(skill.getUpdatedAt());
        return response;
    }
    
    private FreelancerSkillResponse mapToFreelancerSkillResponse(FreelancerSkill freelancerSkill) {
        FreelancerSkillResponse response = new FreelancerSkillResponse();
        response.setId(freelancerSkill.getId());
        response.setSkill(mapToSkillResponse(freelancerSkill.getSkill()));
        response.setProficiencyLevel(freelancerSkill.getProficiencyLevel());
        response.setDescription(freelancerSkill.getDescription());
        response.setCreatedAt(freelancerSkill.getCreatedAt());
        return response;
    }
}

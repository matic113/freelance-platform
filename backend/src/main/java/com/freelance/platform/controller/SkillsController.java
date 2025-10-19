package com.freelance.platform.controller;

import com.freelance.platform.dto.request.AddSkillRequest;
import com.freelance.platform.dto.request.UpdateSkillRequest;
import com.freelance.platform.dto.response.FreelancerSkillResponse;
import com.freelance.platform.dto.response.SkillResponse;
import com.freelance.platform.service.SkillsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skills")
@Tag(name = "Skills Management", description = "APIs for managing skills")
public class SkillsController {
    
    @Autowired
    private SkillsService skillsService;
    
    @GetMapping
    @Operation(summary = "Get all skills", description = "Get a list of all available skills")
    public ResponseEntity<List<SkillResponse>> getAllSkills() {
        List<SkillResponse> skills = skillsService.getAllSkills();
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/categories")
    @Operation(summary = "Get all skill categories", description = "Get a list of all skill categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = skillsService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search skills", description = "Search skills by name")
    public ResponseEntity<List<SkillResponse>> searchSkills(@RequestParam String searchTerm) {
        List<SkillResponse> skills = skillsService.searchSkills(searchTerm);
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/category/{category}")
    @Operation(summary = "Get skills by category", description = "Get skills filtered by category")
    public ResponseEntity<List<SkillResponse>> getSkillsByCategory(@PathVariable String category) {
        List<SkillResponse> skills = skillsService.getSkillsByCategory(category);
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/my-skills")
    @Operation(summary = "Get current user's skills", description = "Get skills of the currently authenticated freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<FreelancerSkillResponse>> getCurrentUserSkills() {
        List<FreelancerSkillResponse> skills = skillsService.getCurrentUserSkills();
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/freelancer/{freelancerId}")
    @Operation(summary = "Get freelancer's skills", description = "Get skills of a specific freelancer")
    public ResponseEntity<List<FreelancerSkillResponse>> getFreelancerSkills(@PathVariable UUID freelancerId) {
        List<FreelancerSkillResponse> skills = skillsService.getFreelancerSkills(freelancerId);
        return ResponseEntity.ok(skills);
    }
    
    @PostMapping("/add")
    @Operation(summary = "Add skill to freelancer", description = "Add a new skill to the current freelancer's profile")
    @PreAuthorize("hasRole('FREELANCER')")
    @Transactional
    public ResponseEntity<FreelancerSkillResponse> addSkill(@Valid @RequestBody AddSkillRequest request) {
        FreelancerSkillResponse skill = skillsService.addSkillToFreelancer(request);
        return ResponseEntity.ok(skill);
    }
    
    @PutMapping("/{skillId}")
    @Operation(summary = "Update freelancer skill", description = "Update a skill in the current freelancer's profile")
    @PreAuthorize("hasRole('FREELANCER')")
    @Transactional
    public ResponseEntity<FreelancerSkillResponse> updateSkill(
            @PathVariable UUID skillId, 
            @Valid @RequestBody UpdateSkillRequest request) {
        FreelancerSkillResponse skill = skillsService.updateFreelancerSkill(skillId, request);
        return ResponseEntity.ok(skill);
    }
    
    @DeleteMapping("/{skillId}")
    @Operation(summary = "Remove skill from freelancer", description = "Remove a skill from the current freelancer's profile")
    @PreAuthorize("hasRole('FREELANCER')")
    @Transactional
    public ResponseEntity<Void> removeSkill(@PathVariable UUID skillId) {
        skillsService.removeSkillFromFreelancer(skillId);
        return ResponseEntity.ok().build();
    }
}

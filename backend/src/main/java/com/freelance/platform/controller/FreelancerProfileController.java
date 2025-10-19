package com.freelance.platform.controller;

import com.freelance.platform.dto.request.UpdateFreelancerProfileRequest;
import com.freelance.platform.dto.request.AddPortfolioItemRequest;
import com.freelance.platform.dto.response.FreelancerProfileResponse;
import com.freelance.platform.service.FreelancerProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/freelancer-profile")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
public class FreelancerProfileController {

    @Autowired
    private FreelancerProfileService freelancerProfileService;

    @GetMapping("/my-profile")
    public ResponseEntity<FreelancerProfileResponse> getMyProfile(Authentication authentication) {
        com.freelance.platform.security.UserPrincipal userPrincipal = (com.freelance.platform.security.UserPrincipal) authentication.getPrincipal();
        
        try {
            System.out.println("=== FREELANCER PROFILE CONTROLLER START ===");
            System.out.println("User ID: " + userPrincipal.getId());
            
            FreelancerProfileResponse profile = freelancerProfileService.getFreelancerProfile(userPrincipal.getId());
            
            System.out.println("Profile retrieved successfully: " + profile.getId());
            System.out.println("Profile skills count: " + (profile.getSkills() != null ? profile.getSkills().size() : 0));
            System.out.println("Profile portfolios count: " + (profile.getPortfolios() != null ? profile.getPortfolios().size() : 0));
            
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException e) {
            System.err.println("IllegalArgumentException: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            System.err.println("RuntimeException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            System.err.println("Unexpected exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/my-profile")
    public ResponseEntity<FreelancerProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateFreelancerProfileRequest request,
            Authentication authentication) {
        com.freelance.platform.security.UserPrincipal userPrincipal = (com.freelance.platform.security.UserPrincipal) authentication.getPrincipal();
        FreelancerProfileResponse updatedProfile = freelancerProfileService.updateFreelancerProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<FreelancerProfileResponse> getFreelancerProfile(@PathVariable UUID userId) {
        FreelancerProfileResponse profile = freelancerProfileService.getFreelancerProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/my-profile/portfolio")
    public ResponseEntity<FreelancerProfileResponse.PortfolioItem> addPortfolioItem(
            @Valid @RequestBody AddPortfolioItemRequest request,
            Authentication authentication) {
        com.freelance.platform.security.UserPrincipal userPrincipal = (com.freelance.platform.security.UserPrincipal) authentication.getPrincipal();
        FreelancerProfileResponse.PortfolioItem portfolioItem = freelancerProfileService.addPortfolioItem(userPrincipal.getId(), request);
        return ResponseEntity.ok(portfolioItem);
    }

    @DeleteMapping("/my-profile/portfolio/{portfolioId}")
    public ResponseEntity<Void> removePortfolioItem(
            @PathVariable UUID portfolioId,
            Authentication authentication) {
        com.freelance.platform.security.UserPrincipal userPrincipal = (com.freelance.platform.security.UserPrincipal) authentication.getPrincipal();
        freelancerProfileService.removePortfolioItem(userPrincipal.getId(), portfolioId);
        return ResponseEntity.ok().build();
    }
}

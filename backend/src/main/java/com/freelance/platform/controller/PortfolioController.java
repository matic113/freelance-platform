package com.freelance.platform.controller;

import com.freelance.platform.dto.request.AddPortfolioRequest;
import com.freelance.platform.dto.response.PortfolioResponse;
import com.freelance.platform.service.PortfolioService;
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
@RequestMapping("/api/portfolio")
@Tag(name = "Portfolio Management", description = "APIs for managing portfolio items")
public class PortfolioController {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println("=== TEST ENDPOINT CALLED ===");
        return ResponseEntity.ok("Portfolio controller is working!");
    }
    
    @GetMapping("/my-portfolio")
    @Operation(summary = "Get current user's portfolio", description = "Get portfolio items of the currently authenticated freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<PortfolioResponse>> getCurrentUserPortfolio() {
        List<PortfolioResponse> portfolio = portfolioService.getCurrentUserPortfolio();
        return ResponseEntity.ok(portfolio);
    }
    
    @GetMapping("/freelancer/{freelancerId}")
    @Operation(summary = "Get freelancer's portfolio", description = "Get portfolio items of a specific freelancer")
    public ResponseEntity<List<PortfolioResponse>> getFreelancerPortfolio(@PathVariable UUID freelancerId) {
        List<PortfolioResponse> portfolio = portfolioService.getFreelancerPortfolio(freelancerId);
        return ResponseEntity.ok(portfolio);
    }
    
    @GetMapping("/featured")
    @Operation(summary = "Get featured portfolio items", description = "Get all featured portfolio items")
    public ResponseEntity<List<PortfolioResponse>> getFeaturedPortfolioItems() {
        List<PortfolioResponse> portfolio = portfolioService.getFeaturedPortfolioItems();
        return ResponseEntity.ok(portfolio);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search portfolio items", description = "Search portfolio items by title, description, or technologies")
    public ResponseEntity<List<PortfolioResponse>> searchPortfolioItems(@RequestParam String searchTerm) {
        List<PortfolioResponse> portfolio = portfolioService.searchPortfolioItems(searchTerm);
        return ResponseEntity.ok(portfolio);
    }
    
    @GetMapping("/{portfolioId}")
    @Operation(summary = "Get portfolio item", description = "Get a specific portfolio item by ID")
    public ResponseEntity<PortfolioResponse> getPortfolioItem(@PathVariable UUID portfolioId) {
        PortfolioResponse portfolio = portfolioService.getPortfolioItem(portfolioId);
        return ResponseEntity.ok(portfolio);
    }
    
    @PostMapping("/add")
    @Operation(summary = "Add portfolio item", description = "Add a new portfolio item to the current freelancer's profile")
    @PreAuthorize("hasRole('FREELANCER')")
    @Transactional
    public ResponseEntity<PortfolioResponse> addPortfolioItem(@Valid @RequestBody AddPortfolioRequest request) {
        try {
            System.out.println("=== PORTFOLIO CONTROLLER START ===");
            System.out.println("Controller received request: " + request);
            System.out.println("Request title: " + request.getTitle());
            System.out.println("Request imageUrls: " + request.getImageUrls());
            
            PortfolioResponse portfolio = portfolioService.addPortfolioItem(request);
            System.out.println("=== PORTFOLIO CONTROLLER SUCCESS ===");
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            System.err.println("=== PORTFOLIO CONTROLLER ERROR ===");
            System.err.println("Controller error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== END ERROR ===");
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/{portfolioId}")
    @Operation(summary = "Update portfolio item", description = "Update a portfolio item in the current freelancer's profile")
    @PreAuthorize("hasRole('FREELANCER')")
    @Transactional
    public ResponseEntity<PortfolioResponse> updatePortfolioItem(
            @PathVariable UUID portfolioId, 
            @Valid @RequestBody AddPortfolioRequest request) {
        PortfolioResponse portfolio = portfolioService.updatePortfolioItem(portfolioId, request);
        return ResponseEntity.ok(portfolio);
    }
    
    @DeleteMapping("/{portfolioId}")
    @Operation(summary = "Delete portfolio item", description = "Delete a portfolio item from the current freelancer's profile")
    @PreAuthorize("hasRole('FREELANCER')")
    @Transactional
    public ResponseEntity<Void> deletePortfolioItem(@PathVariable UUID portfolioId) {
        portfolioService.deletePortfolioItem(portfolioId);
        return ResponseEntity.ok().build();
    }
}

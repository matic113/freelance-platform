package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.response.AdminReviewDTO;
import com.freelance.platform.entity.Review;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.repository.ReviewRepository;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.admin.AdminActionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reviews")
@Tag(name = "Admin Review Management", description = "APIs for managing platform reviews")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewController {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private AdminActionService adminActionService;
    
    @GetMapping
    @Operation(summary = "Get all reviews", description = "Get paginated list of all reviews")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<Page<AdminReviewDTO>> getAllReviews(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminReviewDTO> reviews = reviewRepository.findAll(pageable)
            .map(AdminReviewDTO::fromEntity);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/{reviewId}")
    @Operation(summary = "Get review by ID", description = "Get review details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Review retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<AdminReviewDTO> getReviewById(
            @Parameter(description = "Review ID") @PathVariable UUID reviewId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        
        return ResponseEntity.ok(AdminReviewDTO.fromEntity(review));
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get reviews for user", description = "Get all reviews where user is reviewer or reviewee")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
    })
    public ResponseEntity<Page<AdminReviewDTO>> getReviewsForUser(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminReviewDTO> reviews = reviewRepository.findReviewsForUser(userId, pageable)
            .map(AdminReviewDTO::fromEntity);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/rating/{rating}")
    @Operation(summary = "Get reviews by rating", description = "Get all reviews with specific rating")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
    })
    public ResponseEntity<Page<AdminReviewDTO>> getReviewsByRating(
            @Parameter(description = "Rating (1-5)") @PathVariable Integer rating,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminReviewDTO> reviews = reviewRepository.findReviewsWithFilters(null, null, rating, rating, pageable)
            .map(AdminReviewDTO::fromEntity);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/low-rated")
    @Operation(summary = "Get low-rated reviews", description = "Get reviews with rating 1-2 (potentially problematic)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Low-rated reviews retrieved successfully")
    })
    public ResponseEntity<Page<AdminReviewDTO>> getLowRatedReviews(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminReviewDTO> reviews = reviewRepository.findReviewsWithFilters(null, null, 1, 2, pageable)
            .map(AdminReviewDTO::fromEntity);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search reviews", description = "Search reviews by comment content")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Page<AdminReviewDTO>> searchReviews(
            @Parameter(description = "Search query") @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminReviewDTO> reviews = reviewRepository.searchByCommentContainingIgnoreCase(query, pageable)
            .map(AdminReviewDTO::fromEntity);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get review statistics", description = "Get platform review statistics")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    })
    public ResponseEntity<?> getReviewStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        long totalReviews = reviewRepository.count();
        long rating5 = reviewRepository.countByRating(5);
        long rating4 = reviewRepository.countByRating(4);
        long rating3 = reviewRepository.countByRating(3);
        long rating2 = reviewRepository.countByRating(2);
        long rating1 = reviewRepository.countByRating(1);
        
        var stats = new java.util.HashMap<String, Object>();
        stats.put("totalReviews", totalReviews);
        stats.put("rating5Count", rating5);
        stats.put("rating4Count", rating4);
        stats.put("rating3Count", rating3);
        stats.put("rating2Count", rating2);
        stats.put("rating1Count", rating1);
        
        if (totalReviews > 0) {
            double avgRating = (5 * rating5 + 4 * rating4 + 3 * rating3 + 2 * rating2 + 1 * rating1) / (double) totalReviews;
            stats.put("averageRating", Math.round(avgRating * 100.0) / 100.0);
        } else {
            stats.put("averageRating", 0.0);
        }
        
        return ResponseEntity.ok(stats);
    }
    
    @DeleteMapping("/{reviewId}")
    @Operation(summary = "Delete review", description = "Delete a review (use cautiously, affects ratings)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Review deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<?> deleteReview(
            @Parameter(description = "Review ID") @PathVariable UUID reviewId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        
        reviewRepository.delete(review);
        
        adminActionService.logAction(
            currentUser.getId(),
            "DELETE_REVIEW",
            "Review",
            reviewId.toString(),
            "Deleted review: " + review.getRating() + " stars by " + review.getReviewer().getEmail()
        );
        
        return ResponseEntity.ok().body("Review deleted successfully");
    }
}

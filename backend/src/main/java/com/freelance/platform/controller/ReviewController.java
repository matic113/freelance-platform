package com.freelance.platform.controller;

import com.freelance.platform.dto.request.CreateReviewRequest;
import com.freelance.platform.dto.response.ReviewResponse;
import com.freelance.platform.dto.response.ReviewOpportunityResponse;
import com.freelance.platform.entity.ReviewOpportunity;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.freelance.platform.security.UserPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "APIs for review and rating system")
@SecurityRequirement(name = "bearerAuth")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Get reviews", description = "Get paginated list of reviews")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully")
    })
    public ResponseEntity<Page<ReviewResponse>> getReviews(
            @Parameter(description = "User ID to filter by") @RequestParam(required = false) UUID userId,
            @Parameter(description = "Contract ID to filter by") @RequestParam(required = false) UUID contractId,
            @Parameter(description = "Minimum rating") @RequestParam(required = false) Integer minRating,
            @Parameter(description = "Maximum rating") @RequestParam(required = false) Integer maxRating,
            @PageableDefault(size = 20) Pageable pageable) {
        
        System.out.println("ReviewController.getReviews called with userId: " + userId);
        
        Page<ReviewResponse> reviews = reviewService.getReviews(userId, contractId, minRating, maxRating, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/my-reviews")
    @Operation(summary = "Get current user's reviews", description = "Get all reviews for the authenticated user (both sent and received)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User reviews retrieved successfully")
    })
    public ResponseEntity<Page<ReviewResponse>> getMyReviews(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        
        System.out.println("ReviewController.getMyReviews called for user: " + currentUser.getId());
        
        Page<ReviewResponse> reviews = reviewService.getReviewsForCurrentUser(currentUser.getId(), pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/test")
    @Operation(summary = "Test endpoint", description = "Simple test endpoint to verify API is working")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Reviews API is working");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create review", description = "Create a new review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReviewResponse response = reviewService.createReview(request, currentUser.getId());
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get review by ID", description = "Get a specific review by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<ReviewResponse> getReview(
            @Parameter(description = "Review ID") @PathVariable UUID id) {
        
        ReviewResponse response = reviewService.getReview(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update review", description = "Update an existing review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<ReviewResponse> updateReview(
            @Parameter(description = "Review ID") @PathVariable UUID id,
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReviewResponse response = reviewService.updateReview(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete review", description = "Delete a review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "Review ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        reviewService.deleteReview(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user reviews", description = "Get all reviews for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User reviews retrieved successfully")
    })
    public ResponseEntity<Page<ReviewResponse>> getUserReviews(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Parameter(description = "Review type") @RequestParam(required = false) String type,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<ReviewResponse> reviews = reviewService.getUserReviews(userId, type, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/contract/{contractId}")
    @Operation(summary = "Get contract reviews", description = "Get all reviews for a specific contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contract reviews retrieved successfully")
    })
    public ResponseEntity<Page<ReviewResponse>> getContractReviews(
            @Parameter(description = "Contract ID") @PathVariable UUID contractId,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<ReviewResponse> reviews = reviewService.getContractReviews(contractId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/statistics/{userId}")
    @Operation(summary = "Get user review statistics", description = "Get review statistics for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review statistics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getUserReviewStatistics(
            @Parameter(description = "User ID") @PathVariable UUID userId) {
        
        System.out.println("ReviewController.getUserReviewStatistics called with userId: " + userId);
        
        Map<String, Object> statistics = reviewService.getUserReviewStatistics(userId);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/{id}/report")
    @Operation(summary = "Report review", description = "Report an inappropriate review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review reported successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Map<String, Object>> reportReview(
            @Parameter(description = "Review ID") @PathVariable UUID id,
            @RequestBody Map<String, Object> reportData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = reviewService.reportReview(id, reportData, currentUser.getId());
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search reviews", description = "Search reviews by content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Page<ReviewResponse>> searchReviews(
            @Parameter(description = "Search query") @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<ReviewResponse> reviews = reviewService.searchReviews(query, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending reviews", description = "Get pending review opportunities for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pending reviews retrieved successfully")
    })
    public ResponseEntity<Page<ReviewOpportunityResponse>> getPendingReviews(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<ReviewOpportunity> opportunities = reviewService.getPendingReviewsForUser(currentUser.getId(), pageable);
        Page<ReviewOpportunityResponse> responses = opportunities.map(this::convertToResponse);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/contract/{contractId}/status")
    @Operation(summary = "Get contract review status", description = "Get review status for a specific contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contract review status retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getContractReviewStatus(
            @Parameter(description = "Contract ID") @PathVariable UUID contractId) {
        
        List<ReviewOpportunity> opportunities = reviewService.getContractReviewStatuses(contractId);
        List<ReviewOpportunityResponse> responses = opportunities.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("contractId", contractId);
        result.put("reviews", responses);
        result.put("totalReviewsNeeded", responses.size());
        result.put("completedReviews", responses.stream().filter(ReviewOpportunityResponse::getReviewSubmitted).count());
        result.put("pendingReviews", responses.stream().filter(r -> !r.getReviewSubmitted()).count());
        
        return ResponseEntity.ok(result);
    }

    private ReviewOpportunityResponse convertToResponse(ReviewOpportunity opportunity) {
        ReviewOpportunityResponse response = new ReviewOpportunityResponse();
        response.setId(opportunity.getId());
        response.setContractId(opportunity.getContract().getId());
        response.setReviewerId(opportunity.getReviewer().getId());
        response.setReviewerName(opportunity.getReviewer().getFirstName() + " " + opportunity.getReviewer().getLastName());
        response.setRevieweeId(opportunity.getReviewee().getId());
        response.setRevieweeName(opportunity.getReviewee().getFirstName() + " " + opportunity.getReviewee().getLastName());
        response.setReviewSubmitted(opportunity.getReviewSubmitted());
        response.setInvitationEmailSent(opportunity.getInvitationEmailSent());
        response.setProjectTitle(opportunity.getContract().getProject().getTitle());
        response.setCreatedAt(opportunity.getCreatedAt());
        response.setReviewSubmittedAt(opportunity.getReviewSubmittedAt());
        return response;
    }
}

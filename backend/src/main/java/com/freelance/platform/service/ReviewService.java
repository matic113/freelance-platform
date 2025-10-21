package com.freelance.platform.service;

import com.freelance.platform.dto.request.CreateReviewRequest;
import com.freelance.platform.dto.response.ReviewResponse;
import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.Review;
import com.freelance.platform.entity.ReviewOpportunity;
import com.freelance.platform.entity.User;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.ContractRepository;
import com.freelance.platform.repository.ReviewOpportunityRepository;
import com.freelance.platform.repository.ReviewRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewOpportunityRepository reviewOpportunityRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailNotificationService emailNotificationService;

    public Page<ReviewResponse> getReviews(UUID userId, UUID contractId, Integer minRating, Integer maxRating, Pageable pageable) {
        System.out.println("ReviewService.getReviews called with userId: " + userId + ", contractId: " + contractId);
        
        Page<Review> reviews = reviewRepository.findReviewsWithFilters(userId, contractId, minRating, maxRating, pageable);
        
        System.out.println("Found " + reviews.getTotalElements() + " reviews");
        
        return reviews.map(this::convertToResponse);
    }

    public Page<ReviewResponse> getReviewsForCurrentUser(UUID currentUserId, Pageable pageable) {
        System.out.println("ReviewService.getReviewsForCurrentUser called with currentUserId: " + currentUserId);
        
        // Get reviews where current user is either reviewer or reviewee
        Page<Review> reviews = reviewRepository.findReviewsForUser(currentUserId, pageable);
        
        System.out.println("Found " + reviews.getTotalElements() + " reviews for current user");
        
        return reviews.map(this::convertToResponse);
    }

    public ReviewResponse createReview(CreateReviewRequest request, UUID reviewerId) {
        Contract contract = contractRepository.findById(UUID.fromString(request.getContractId()))
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user can review this contract
        if (!contract.getClient().getId().equals(reviewerId) && !contract.getFreelancer().getId().equals(reviewerId)) {
            throw new UnauthorizedException("You are not authorized to review this contract");
        }

        // Check if contract is completed
        if (!contract.getStatus().name().equals("COMPLETED")) {
            throw new UnauthorizedException("Contract must be completed before reviewing");
        }

        // Check if review already exists
        UUID revieweeId = contract.getClient().getId().equals(reviewerId) ? 
                contract.getFreelancer().getId() : contract.getClient().getId();
        
        if (reviewRepository.existsByContractIdAndReviewerId(UUID.fromString(request.getContractId()), reviewerId)) {
            throw new UnauthorizedException("You have already reviewed this contract");
        }

        Review review = new Review();
        review.setContract(contract);
        review.setReviewer(reviewer);
        review.setReviewee(contract.getClient().getId().equals(reviewerId) ? 
                contract.getFreelancer() : contract.getClient());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setAdditionalFeedback(request.getAdditionalFeedback());
        review.setCreatedAt(LocalDateTime.now());
        
        if (contract != null && contract.getProject() != null) {
            review.setProjectName(contract.getProject().getTitle());
            review.setProjectCategory(contract.getProject().getCategory());
        }

        Review savedReview = reviewRepository.save(review);
        
        // Mark review opportunity as submitted
        reviewOpportunityRepository.findByContractIdAndReviewerId(contract.getId(), reviewerId)
                .ifPresent(opportunity -> {
                    opportunity.setReview(savedReview);
                    opportunity.setReviewSubmitted(true);
                    opportunity.setReviewSubmittedAt(LocalDateTime.now());
                    reviewOpportunityRepository.save(opportunity);
                });
        
        emailNotificationService.sendNewReviewEmail(review.getReviewee(), 
                review.getReviewer().getFirstName() + " " + review.getReviewer().getLastName(), 
                review.getRating());
        
        return convertToResponse(savedReview);
    }

    public ReviewResponse getReview(UUID id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        
        return convertToResponse(review);
    }

    public ReviewResponse updateReview(UUID id, CreateReviewRequest request, UUID userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Check if user can update this review
        if (!review.getReviewer().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        return convertToResponse(savedReview);
    }

    public void deleteReview(UUID id, UUID userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Check if user can delete this review
        if (!review.getReviewer().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    public Page<ReviewResponse> getUserReviews(UUID userId, String type, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId, pageable);
        
        return reviews.map(this::convertToResponse);
    }

    public Page<ReviewResponse> getContractReviews(UUID contractId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByContractIdOrderByCreatedAtDesc(contractId, pageable);
        
        return reviews.map(this::convertToResponse);
    }

    public Map<String, Object> getUserReviewStatistics(UUID userId) {
        System.out.println("ReviewService.getUserReviewStatistics called with userId: " + userId);
        
        Map<String, Object> statistics = new HashMap<>();
        
        Double averageRating = reviewRepository.getAverageRatingByRevieweeId(userId);
        Long totalReviews = reviewRepository.countByRevieweeId(userId);
        
        System.out.println("Average rating: " + averageRating + ", Total reviews: " + totalReviews);
        
        statistics.put("averageRating", averageRating != null ? averageRating : 0.0);
        statistics.put("totalReviews", totalReviews);
        statistics.put("ratingDistribution", reviewRepository.getRatingDistributionByRevieweeId(userId));
        
        return statistics;
    }

    public Map<String, Object> reportReview(UUID id, Map<String, Object> reportData, UUID userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // In a real implementation, you would create a report entity
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Review reported successfully");
        response.put("reportId", UUID.randomUUID().toString());
        
        return response;
    }

    public Page<ReviewOpportunity> getPendingReviewsForUser(UUID userId, Pageable pageable) {
        return reviewOpportunityRepository.findPendingReviewsForUser(userId, pageable);
    }

    public void createReviewOpportunities(Contract contract) {
        ReviewOpportunity clientReviewsFreelancer = new ReviewOpportunity(
                contract,
                contract.getClient(),
                contract.getFreelancer()
        );
        
        ReviewOpportunity freelancerReviewsClient = new ReviewOpportunity(
                contract,
                contract.getFreelancer(),
                contract.getClient()
        );
        
        reviewOpportunityRepository.save(clientReviewsFreelancer);
        reviewOpportunityRepository.save(freelancerReviewsClient);
    }

    public List<ReviewOpportunity> getContractReviewStatuses(UUID contractId) {
        return reviewOpportunityRepository.findByContractId(contractId);
    }

    public Page<ReviewResponse> searchReviews(String query, Pageable pageable) {
        Page<Review> reviews = reviewRepository.searchByCommentContainingIgnoreCase(query, pageable);
        
        return reviews.map(this::convertToResponse);
    }

    private ReviewResponse convertToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
         response.setId(review.getId());
         response.setContractId(review.getContract().getId());
         response.setReviewerId(review.getReviewer().getId());
         response.setReviewerName(review.getReviewer().getFirstName() + " " + review.getReviewer().getLastName());
         response.setRevieweeId(review.getReviewee().getId());
         response.setRevieweeName(review.getReviewee().getFirstName() + " " + review.getReviewee().getLastName());
         response.setRating(review.getRating());
         response.setComment(review.getComment());
         response.setAdditionalFeedback(review.getAdditionalFeedback());
         response.setProjectName(review.getProjectName());
         response.setProjectCategory(review.getProjectCategory());
         response.setCreatedAt(review.getCreatedAt());
         response.setUpdatedAt(review.getUpdatedAt());
         
         return response;
    }
}

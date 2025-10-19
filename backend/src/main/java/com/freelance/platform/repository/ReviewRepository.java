package com.freelance.platform.repository;

import com.freelance.platform.entity.Review;
import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    
    List<Review> findByContract(Contract contract);
    
    List<Review> findByReviewer(User reviewer);
    
    List<Review> findByReviewee(User reviewee);
    
    @Query("SELECT r FROM Review r WHERE r.contract = :contract ORDER BY r.createdAt DESC")
    List<Review> findByContractOrderByCreatedAtDesc(@Param("contract") Contract contract);
    
    @Query("SELECT r FROM Review r WHERE r.reviewer = :reviewer ORDER BY r.createdAt DESC")
    List<Review> findByReviewerOrderByCreatedAtDesc(@Param("reviewer") User reviewer);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee ORDER BY r.createdAt DESC")
    List<Review> findByRevieweeOrderByCreatedAtDesc(@Param("reviewee") User reviewee);
    
    @Query("SELECT r FROM Review r WHERE r.reviewer = :reviewer ORDER BY r.createdAt DESC")
    Page<Review> findByReviewerOrderByCreatedAtDesc(@Param("reviewer") User reviewer, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee ORDER BY r.createdAt DESC")
    Page<Review> findByRevieweeOrderByCreatedAtDesc(@Param("reviewee") User reviewee, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.rating >= :minRating ORDER BY r.createdAt DESC")
    List<Review> findByRatingGreaterThanEqual(@Param("minRating") Integer minRating);
    
    @Query("SELECT r FROM Review r WHERE r.rating = :rating ORDER BY r.createdAt DESC")
    List<Review> findByRating(@Param("rating") Integer rating);
    
    @Query("SELECT r FROM Review r WHERE r.rating BETWEEN :minRating AND :maxRating ORDER BY r.createdAt DESC")
    List<Review> findByRatingBetween(@Param("minRating") Integer minRating, @Param("maxRating") Integer maxRating);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee AND r.rating >= :minRating ORDER BY r.createdAt DESC")
    List<Review> findByRevieweeAndRatingGreaterThanEqual(@Param("reviewee") User reviewee, @Param("minRating") Integer minRating);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee AND r.rating = :rating ORDER BY r.createdAt DESC")
    List<Review> findByRevieweeAndRating(@Param("reviewee") User reviewee, @Param("rating") Integer rating);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee AND r.rating BETWEEN :minRating AND :maxRating ORDER BY r.createdAt DESC")
    List<Review> findByRevieweeAndRatingBetween(@Param("reviewee") User reviewee, @Param("minRating") Integer minRating, @Param("maxRating") Integer maxRating);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.contract = :contract")
    long countByContract(@Param("contract") Contract contract);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewer = :reviewer")
    long countByReviewer(@Param("reviewer") User reviewer);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewee = :reviewee")
    long countByReviewee(@Param("reviewee") User reviewee);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewee = :reviewee AND r.rating = :rating")
    long countByRevieweeAndRating(@Param("reviewee") User reviewee, @Param("rating") Integer rating);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee = :reviewee")
    Double getAverageRatingByReviewee(@Param("reviewee") User reviewee);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.contract = :contract")
    Double getAverageRatingByContract(@Param("contract") Contract contract);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating >= :minRating")
    long countByRatingGreaterThanEqual(@Param("minRating") Integer minRating);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating = :rating")
    long countByRating(@Param("rating") Integer rating);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.rating BETWEEN :minRating AND :maxRating")
    long countByRatingBetween(@Param("minRating") Integer minRating, @Param("maxRating") Integer maxRating);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee ORDER BY r.rating DESC, r.createdAt DESC")
    List<Review> findTopRatedReviewsByReviewee(@Param("reviewee") User reviewee);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee ORDER BY r.rating DESC, r.createdAt DESC")
    Page<Review> findTopRatedReviewsByReviewee(@Param("reviewee") User reviewee, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee ORDER BY r.rating ASC, r.createdAt DESC")
    List<Review> findLowestRatedReviewsByReviewee(@Param("reviewee") User reviewee);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee = :reviewee ORDER BY r.rating ASC, r.createdAt DESC")
    Page<Review> findLowestRatedReviewsByReviewee(@Param("reviewee") User reviewee, Pageable pageable);
    
    boolean existsByContractAndReviewer(Contract contract, User reviewer);
    
    @Query("SELECT r FROM Review r WHERE r.contract = :contract AND r.reviewer = :reviewer")
    Optional<Review> findByContractAndReviewer(@Param("contract") Contract contract, @Param("reviewer") User reviewer);
    
    // Additional methods needed by ReviewService
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Double getAverageRatingByRevieweeId(@Param("revieweeId") UUID revieweeId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Long countByRevieweeId(@Param("revieweeId") UUID revieweeId);
    
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.reviewee.id = :revieweeId GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingDistributionByRevieweeId(@Param("revieweeId") UUID revieweeId);
    
    @Query("SELECT r FROM Review r WHERE " +
           "(:userId IS NULL OR r.reviewee.id = :userId OR r.reviewer.id = :userId) AND " +
           "(:contractId IS NULL OR r.contract.id = :contractId) AND " +
           "(:minRating IS NULL OR r.rating >= :minRating) AND " +
           "(:maxRating IS NULL OR r.rating <= :maxRating) " +
           "ORDER BY r.createdAt DESC")
    Page<Review> findReviewsWithFilters(@Param("userId") UUID userId, 
                                       @Param("contractId") UUID contractId, 
                                       @Param("minRating") Integer minRating, 
                                       @Param("maxRating") Integer maxRating, 
                                       Pageable pageable);
    
    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.contract.id = :contractId AND r.reviewer.id = :reviewerId")
    boolean existsByContractIdAndReviewerId(@Param("contractId") UUID contractId, @Param("reviewerId") UUID reviewerId);
    
    @Query("SELECT r FROM Review r WHERE r.reviewee.id = :revieweeId ORDER BY r.createdAt DESC")
    Page<Review> findByRevieweeIdOrderByCreatedAtDesc(@Param("revieweeId") UUID revieweeId, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.contract.id = :contractId ORDER BY r.createdAt DESC")
    Page<Review> findByContractIdOrderByCreatedAtDesc(@Param("contractId") UUID contractId, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE LOWER(r.comment) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY r.createdAt DESC")
    Page<Review> searchByCommentContainingIgnoreCase(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.reviewer.id = :userId OR r.reviewee.id = :userId ORDER BY r.createdAt DESC")
    Page<Review> findReviewsForUser(@Param("userId") UUID userId, Pageable pageable);

    // Analytics trend method
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(r.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "AVG(r.rating) AS avg_rating " +
                   "FROM reviews r " +
                   "WHERE r.reviewee.id = :revieweeId " +
                   "AND r.created_at >= :startDate " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> getRatingTrendByRevieweeId(@Param("revieweeId") UUID revieweeId, @Param("startDate") LocalDateTime startDate);
}

package com.freelance.platform.repository;

import com.freelance.platform.entity.ReviewOpportunity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewOpportunityRepository extends JpaRepository<ReviewOpportunity, UUID> {
    
    @Query("SELECT ro FROM ReviewOpportunity ro WHERE ro.reviewer.id = :reviewerId AND ro.reviewSubmitted = false ORDER BY ro.createdAt DESC")
    Page<ReviewOpportunity> findPendingReviewsForUser(@Param("reviewerId") UUID reviewerId, Pageable pageable);
    
    @Query("SELECT ro FROM ReviewOpportunity ro WHERE ro.contract.id = :contractId ORDER BY ro.createdAt DESC")
    List<ReviewOpportunity> findByContractId(@Param("contractId") UUID contractId);
    
    @Query("SELECT ro FROM ReviewOpportunity ro WHERE ro.contract.id = :contractId AND ro.reviewer.id = :reviewerId")
    Optional<ReviewOpportunity> findByContractIdAndReviewerId(@Param("contractId") UUID contractId, @Param("reviewerId") UUID reviewerId);
    
    @Query("SELECT COUNT(ro) FROM ReviewOpportunity ro WHERE ro.contract.id = :contractId AND ro.reviewSubmitted = true")
    Long countSubmittedReviewsForContract(@Param("contractId") UUID contractId);
    
    @Query("SELECT ro FROM ReviewOpportunity ro WHERE ro.reviewer.id = :reviewerId AND ro.reviewee.id = :revieweeId AND ro.contract.id = :contractId")
    Optional<ReviewOpportunity> findByContractAndUsers(@Param("contractId") UUID contractId, @Param("reviewerId") UUID reviewerId, @Param("revieweeId") UUID revieweeId);
    
    @Query("SELECT ro FROM ReviewOpportunity ro WHERE ro.reviewSubmitted = false AND ro.invitationEmailSent = false ORDER BY ro.createdAt ASC")
    List<ReviewOpportunity> findUninvitedReviewOpportunities();
    
    @Query("SELECT ro FROM ReviewOpportunity ro WHERE ro.contract.id = :contractId AND ro.review IS NOT NULL")
    List<ReviewOpportunity> findCompletedReviewsForContract(@Param("contractId") UUID contractId);
    
    boolean existsByContractIdAndReviewerId(UUID contractId, UUID reviewerId);
}

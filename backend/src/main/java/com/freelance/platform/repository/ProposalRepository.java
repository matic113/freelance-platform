package com.freelance.platform.repository;

import com.freelance.platform.entity.Proposal;
import com.freelance.platform.entity.User;
import com.freelance.platform.entity.Project;
import com.freelance.platform.entity.ProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, UUID> {
    
    List<Proposal> findByFreelancer(User freelancer);
    
    List<Proposal> findByClient(User client);
    
    List<Proposal> findByProject(Project project);
    
    List<Proposal> findByStatus(ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.freelancer = :freelancer ORDER BY p.submittedAt DESC")
    List<Proposal> findByFreelancerOrderBySubmittedAtDesc(@Param("freelancer") User freelancer);
    
    @Query("SELECT p FROM Proposal p WHERE p.client = :client ORDER BY p.submittedAt DESC")
    List<Proposal> findByClientOrderBySubmittedAtDesc(@Param("client") User client);
    
    @Query("SELECT p FROM Proposal p WHERE p.project = :project ORDER BY p.submittedAt DESC")
    List<Proposal> findByProjectOrderBySubmittedAtDesc(@Param("project") Project project);
    
    @Query("SELECT p FROM Proposal p WHERE p.status = :status ORDER BY p.submittedAt DESC")
    List<Proposal> findByStatusOrderBySubmittedAtDesc(@Param("status") ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.freelancer = :freelancer AND p.status = :status ORDER BY p.submittedAt DESC")
    List<Proposal> findByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.client = :client AND p.status = :status ORDER BY p.submittedAt DESC")
    List<Proposal> findByClientAndStatus(@Param("client") User client, @Param("status") ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.project = :project AND p.status = :status ORDER BY p.submittedAt DESC")
    List<Proposal> findByProjectAndStatus(@Param("project") Project project, @Param("status") ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.freelancer = :freelancer ORDER BY p.submittedAt DESC")
    Page<Proposal> findByFreelancerOrderBySubmittedAtDesc(@Param("freelancer") User freelancer, Pageable pageable);
    
    @Query("SELECT p FROM Proposal p WHERE p.client = :client ORDER BY p.submittedAt DESC")
    Page<Proposal> findByClientOrderBySubmittedAtDesc(@Param("client") User client, Pageable pageable);
    
    @Query("SELECT p FROM Proposal p WHERE p.project = :project ORDER BY p.submittedAt DESC")
    Page<Proposal> findByProjectOrderBySubmittedAtDesc(@Param("project") Project project, Pageable pageable);
    
    @Query("SELECT p FROM Proposal p WHERE p.proposedAmount BETWEEN :minAmount AND :maxAmount AND p.status = :status")
    List<Proposal> findByAmountRange(@Param("minAmount") BigDecimal minAmount, @Param("maxAmount") BigDecimal maxAmount, @Param("status") ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.proposedAmount <= :maxAmount AND p.status = :status ORDER BY p.proposedAmount ASC")
    List<Proposal> findLowestBidProposals(@Param("maxAmount") BigDecimal maxAmount, @Param("status") ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.proposedAmount >= :minAmount AND p.status = :status ORDER BY p.proposedAmount DESC")
    List<Proposal> findHighestBidProposals(@Param("minAmount") BigDecimal minAmount, @Param("status") ProposalStatus status);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer = :freelancer")
    long countByFreelancer(@Param("freelancer") User freelancer);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.client = :client")
    long countByClient(@Param("client") User client);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.project = :project")
    long countByProject(@Param("project") Project project);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.status = :status")
    long countByStatus(@Param("status") ProposalStatus status);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer = :freelancer AND p.status = :status")
    long countByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") ProposalStatus status);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.client = :client AND p.status = :status")
    long countByClientAndStatus(@Param("client") User client, @Param("status") ProposalStatus status);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.project = :project AND p.status = :status")
    long countByProjectAndStatus(@Param("project") Project project, @Param("status") ProposalStatus status);
    
    @Query("SELECT AVG(p.proposedAmount) FROM Proposal p WHERE p.project = :project AND p.status = :status")
    BigDecimal getAverageProposalAmountByProject(@Param("project") Project project, @Param("status") ProposalStatus status);
    
    @Query("SELECT MIN(p.proposedAmount) FROM Proposal p WHERE p.project = :project AND p.status = :status")
    BigDecimal getMinProposalAmountByProject(@Param("project") Project project, @Param("status") ProposalStatus status);
    
    @Query("SELECT MAX(p.proposedAmount) FROM Proposal p WHERE p.project = :project AND p.status = :status")
    BigDecimal getMaxProposalAmountByProject(@Param("project") Project project, @Param("status") ProposalStatus status);
    
    boolean existsByFreelancerAndProject(User freelancer, Project project);
    
    @Query("SELECT p FROM Proposal p WHERE p.freelancer = :freelancer AND p.project = :project")
    Optional<Proposal> findByFreelancerAndProject(@Param("freelancer") User freelancer, @Param("project") Project project);
    
    // Additional methods needed by ProposalService
    Page<Proposal> findByFreelancerIdOrderBySubmittedAtDesc(UUID freelancerId, Pageable pageable);
    
    Page<Proposal> findByClientIdOrderBySubmittedAtDesc(UUID clientId, Pageable pageable);
    
    Page<Proposal> findByProjectIdOrderBySubmittedAtDesc(UUID projectId, Pageable pageable);
    
    boolean existsByProjectAndFreelancer(Project project, User freelancer);
    
    // Analytics methods
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer.id = :freelancerId")
    long countByFreelancerId(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer.id = :freelancerId AND p.status = :status")
    long countByFreelancerIdAndStatus(@Param("freelancerId") UUID freelancerId, @Param("status") String status);
    
    // Analytics - monthly proposal counts (UTC)
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(p.submitted_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM proposals p " +
                   "WHERE p.submitted_at >= (UTC_TIMESTAMP() - INTERVAL 12 MONTH) " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> findMonthlyProposalCountsLast12MonthsUtc();
}

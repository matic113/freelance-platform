package com.freelance.platform.repository;

import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.User;
import com.freelance.platform.entity.Project;
import com.freelance.platform.entity.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ContractRepository extends JpaRepository<Contract, UUID> {
    
    List<Contract> findByClient(User client);
    
    List<Contract> findByFreelancer(User freelancer);
    
    List<Contract> findByProject(Project project);
    
    List<Contract> findByStatus(ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.client = :client ORDER BY c.createdAt DESC")
    List<Contract> findByClientOrderByCreatedAtDesc(@Param("client") User client);
    
    @Query("SELECT c FROM Contract c WHERE c.freelancer = :freelancer ORDER BY c.createdAt DESC")
    List<Contract> findByFreelancerOrderByCreatedAtDesc(@Param("freelancer") User freelancer);
    
    @Query("SELECT c FROM Contract c WHERE c.project = :project ORDER BY c.createdAt DESC")
    List<Contract> findByProjectOrderByCreatedAtDesc(@Param("project") Project project);
    
    @Query("SELECT c FROM Contract c WHERE c.status = :status ORDER BY c.createdAt DESC")
    List<Contract> findByStatusOrderByCreatedAtDesc(@Param("status") ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.client = :client ORDER BY c.createdAt DESC")
    Page<Contract> findByClientOrderByCreatedAtDesc(@Param("client") User client, Pageable pageable);
    
    @Query("SELECT c FROM Contract c WHERE c.freelancer = :freelancer ORDER BY c.createdAt DESC")
    Page<Contract> findByFreelancerOrderByCreatedAtDesc(@Param("freelancer") User freelancer, Pageable pageable);
    
    @Query("SELECT c FROM Contract c WHERE c.client.id = :clientId ORDER BY c.createdAt DESC")
    Page<Contract> findByClientIdOrderByCreatedAtDesc(@Param("clientId") UUID clientId, Pageable pageable);
    
    @Query("SELECT c FROM Contract c WHERE c.freelancer.id = :freelancerId ORDER BY c.createdAt DESC")
    Page<Contract> findByFreelancerIdOrderByCreatedAtDesc(@Param("freelancerId") UUID freelancerId, Pageable pageable);
    
    @Query("SELECT c FROM Contract c WHERE c.status = :status ORDER BY c.createdAt DESC")
    Page<Contract> findByStatusOrderByCreatedAtDesc(@Param("status") ContractStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Contract c WHERE c.startDate >= :startDate AND c.endDate <= :endDate")
    List<Contract> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Contract c WHERE c.endDate < :currentDate AND c.status = :status")
    List<Contract> findExpiredContracts(@Param("currentDate") LocalDate currentDate, @Param("status") ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.endDate BETWEEN :startDate AND :endDate AND c.status = :status")
    List<Contract> findContractsEndingSoon(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.client = :client AND c.status = :status ORDER BY c.createdAt DESC")
    List<Contract> findByClientAndStatus(@Param("client") User client, @Param("status") ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.freelancer = :freelancer AND c.status = :status ORDER BY c.createdAt DESC")
    List<Contract> findByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.project = :project AND c.status = :status ORDER BY c.createdAt DESC")
    List<Contract> findByProjectAndStatus(@Param("project") Project project, @Param("status") ContractStatus status);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.client = :client")
    long countByClient(@Param("client") User client);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.freelancer = :freelancer")
    long countByFreelancer(@Param("freelancer") User freelancer);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.project = :project")
    long countByProject(@Param("project") Project project);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = :status")
    long countByStatus(@Param("status") ContractStatus status);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.client = :client AND c.status = :status")
    long countByClientAndStatus(@Param("client") User client, @Param("status") ContractStatus status);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.freelancer = :freelancer AND c.status = :status")
    long countByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") ContractStatus status);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.project = :project AND c.status = :status")
    long countByProjectAndStatus(@Param("project") Project project, @Param("status") ContractStatus status);
    
    @Query("SELECT SUM(c.totalAmount) FROM Contract c WHERE c.client = :client AND c.status = :status")
    Double getTotalAmountByClientAndStatus(@Param("client") User client, @Param("status") ContractStatus status);
    
    @Query("SELECT SUM(c.totalAmount) FROM Contract c WHERE c.freelancer = :freelancer AND c.status = :status")
    Double getTotalAmountByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") ContractStatus status);
    
    @Query("SELECT AVG(c.totalAmount) FROM Contract c WHERE c.status = :status")
    Double getAverageContractAmount(@Param("status") ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.status = 'DISPUTED' ORDER BY c.createdAt DESC")
    List<Contract> findDisputedContracts();
    
    @Query("SELECT c FROM Contract c WHERE c.status = 'DISPUTED' ORDER BY c.createdAt DESC")
    Page<Contract> findDisputedContracts(Pageable pageable);
    
    // Additional methods needed by ContractService
    
    boolean existsByProposal(com.freelance.platform.entity.Proposal proposal);
    
    @Query("SELECT c FROM Contract c WHERE c.proposal.id = :proposalId")
    Contract findByProposalId(@Param("proposalId") UUID proposalId);
    
    // Additional methods for analytics
    @Query("SELECT c FROM Contract c ORDER BY c.createdAt DESC")
    List<Contract> findTop10ByOrderByCreatedAtDesc();
    
    // Analytics methods
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.freelancer.id = :freelancerId AND c.status = :status")
    long countByFreelancerIdAndStatus(@Param("freelancerId") UUID freelancerId, @Param("status") ContractStatus status);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.client.id = :clientId AND c.status = :status")
    long countByClientIdAndStatus(@Param("clientId") UUID clientId, @Param("status") ContractStatus status);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.freelancer.id = :freelancerId")
    long countByFreelancerId(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.client.id = :clientId")
    long countByClientId(@Param("clientId") UUID clientId);
    
    @Query("SELECT COUNT(DISTINCT c.client.id) FROM Contract c WHERE c.freelancer.id = :freelancerId")
    long countDistinctClientsByFreelancerId(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT AVG(c.totalAmount) FROM Contract c WHERE c.freelancer.id = :freelancerId")
    Double getAverageContractValueByFreelancerId(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT AVG(c.totalAmount) FROM Contract c WHERE c.client.id = :clientId")
    Double getAverageContractValueByClientId(@Param("clientId") UUID clientId);
    // Analytics - monthly contract counts (UTC)
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(c.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM contracts c " +
                   "WHERE c.created_at >= (UTC_TIMESTAMP() - INTERVAL 12 MONTH) " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> findMonthlyContractCountsLast12MonthsUtc();

    // Analytics trend methods
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(c.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM contracts c " +
                   "WHERE c.freelancer.id = :freelancerId " +
                   "AND c.created_at >= :startDate " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> getProjectTrendByFreelancerId(@Param("freelancerId") UUID freelancerId, @Param("startDate") LocalDateTime startDate);

    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(c.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM contracts c " +
                   "WHERE c.client.id = :clientId " +
                   "AND c.created_at >= :startDate " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> getFreelancerTrendByClientId(@Param("clientId") UUID clientId, @Param("startDate") LocalDateTime startDate);
}

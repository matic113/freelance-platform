package com.freelance.platform.repository;

import com.freelance.platform.entity.Transaction;
import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.PaymentRequest;
import com.freelance.platform.entity.TransactionType;
import com.freelance.platform.entity.TransactionStatus;
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
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    List<Transaction> findByContract(Contract contract);
    
    List<Transaction> findByPaymentRequest(PaymentRequest paymentRequest);
    
    List<Transaction> findByTransactionType(TransactionType transactionType);
    
    List<Transaction> findByStatus(TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.contract = :contract ORDER BY t.createdAt DESC")
    List<Transaction> findByContractOrderByCreatedAtDesc(@Param("contract") Contract contract);
    
    @Query("SELECT t FROM Transaction t WHERE t.paymentRequest = :paymentRequest ORDER BY t.createdAt DESC")
    List<Transaction> findByPaymentRequestOrderByCreatedAtDesc(@Param("paymentRequest") PaymentRequest paymentRequest);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = :status ORDER BY t.createdAt DESC")
    List<Transaction> findByStatusOrderByCreatedAtDesc(@Param("status") TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.transactionType = :transactionType ORDER BY t.createdAt DESC")
    List<Transaction> findByTransactionTypeOrderByCreatedAtDesc(@Param("transactionType") TransactionType transactionType);
    
    @Query("SELECT t FROM Transaction t WHERE t.contract = :contract ORDER BY t.createdAt DESC")
    Page<Transaction> findByContractOrderByCreatedAtDesc(@Param("contract") Contract contract, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = :status ORDER BY t.createdAt DESC")
    Page<Transaction> findByStatusOrderByCreatedAtDesc(@Param("status") TransactionStatus status, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.transactionType = :transactionType ORDER BY t.createdAt DESC")
    Page<Transaction> findByTransactionTypeOrderByCreatedAtDesc(@Param("transactionType") TransactionType transactionType, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.completedAt BETWEEN :startDate AND :endDate AND t.status = :status ORDER BY t.completedAt DESC")
    List<Transaction> findCompletedTransactionsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("status") TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.paymentGateway = :paymentGateway ORDER BY t.createdAt DESC")
    List<Transaction> findByPaymentGateway(@Param("paymentGateway") String paymentGateway);
    
    @Query("SELECT t FROM Transaction t WHERE t.paymentMethod = :paymentMethod ORDER BY t.createdAt DESC")
    List<Transaction> findByPaymentMethod(@Param("paymentMethod") String paymentMethod);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.contract = :contract")
    long countByContract(@Param("contract") Contract contract);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.paymentRequest = :paymentRequest")
    long countByPaymentRequest(@Param("paymentRequest") PaymentRequest paymentRequest);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status")
    long countByStatus(@Param("status") TransactionStatus status);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.transactionType = :transactionType")
    long countByTransactionType(@Param("transactionType") TransactionType transactionType);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.contract = :contract AND t.status = :status")
    Double getTotalAmountByContractAndStatus(@Param("contract") Contract contract, @Param("status") TransactionStatus status);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = :status")
    Double getTotalAmountByStatus(@Param("status") TransactionStatus status);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.transactionType = :transactionType AND t.status = :status")
    Double getTotalAmountByTypeAndStatus(@Param("transactionType") TransactionType transactionType, @Param("status") TransactionStatus status);
    
    @Query("SELECT AVG(t.amount) FROM Transaction t WHERE t.status = :status")
    Double getAverageAmountByStatus(@Param("status") TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.gatewayTransactionId = :gatewayTransactionId")
    Optional<Transaction> findByGatewayTransactionId(@Param("gatewayTransactionId") String gatewayTransactionId);
    
    @Query("SELECT DISTINCT t.paymentGateway FROM Transaction t WHERE t.paymentGateway IS NOT NULL ORDER BY t.paymentGateway")
    List<String> findAllPaymentGateways();
    
    @Query("SELECT DISTINCT t.paymentMethod FROM Transaction t WHERE t.paymentMethod IS NOT NULL ORDER BY t.paymentMethod")
    List<String> findAllPaymentMethods();
    
    // Additional method needed by PaymentService
    List<Transaction> findByContractIdOrderByCreatedAtDesc(UUID contractId);
    
    // Additional method for analytics
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = :status AND t.createdAt BETWEEN :startDate AND :endDate")
    Double getTotalAmountByStatusAndDateRange(@Param("status") TransactionStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Analytics methods
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.contract.freelancer.id = :freelancerId AND t.status = 'COMPLETED'")
    Double sumAmountByFreelancerId(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.contract.client.id = :clientId AND t.status = 'COMPLETED'")
    Double sumAmountByClientId(@Param("clientId") UUID clientId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.contract.freelancer.id = :freelancerId AND t.status = 'COMPLETED' AND MONTH(t.createdAt) = :month")
    Double sumAmountByFreelancerIdAndMonth(@Param("freelancerId") UUID freelancerId, @Param("month") int month);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.contract.client.id = :clientId AND t.status = 'COMPLETED' AND MONTH(t.createdAt) = :month")
    Double sumAmountByClientIdAndMonth(@Param("clientId") UUID clientId, @Param("month") int month);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.contract.freelancer.id = :freelancerId AND t.status = 'COMPLETED' AND YEAR(t.createdAt) = :year")
    Double sumAmountByFreelancerIdAndYear(@Param("freelancerId") UUID freelancerId, @Param("year") int year);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.contract.client.id = :clientId AND t.status = 'COMPLETED' AND YEAR(t.createdAt) = :year")
    Double sumAmountByClientIdAndYear(@Param("clientId") UUID clientId, @Param("year") int year);
    
    @Query("SELECT AVG(t.amount) FROM Transaction t WHERE t.contract.freelancer.id = :freelancerId AND t.status = 'COMPLETED'")
    Double getAverageEarningPerProjectByFreelancerId(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT AVG(t.amount) FROM Transaction t WHERE t.contract.client.id = :clientId AND t.status = 'COMPLETED'")
    Double getAverageSpendingPerProjectByClientId(@Param("clientId") UUID clientId);

    // Analytics - monthly transaction counts and revenue (UTC)
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(t.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM transactions t " +
                   "WHERE t.created_at >= (UTC_TIMESTAMP() - INTERVAL 12 MONTH) " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> findMonthlyTransactionCountsLast12MonthsUtc();
    
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(t.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "SUM(t.amount) AS total " +
                   "FROM transactions t " +
                   "WHERE t.status = 'COMPLETED' " +
                   "AND t.created_at >= (UTC_TIMESTAMP() - INTERVAL 12 MONTH) " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> findMonthlyRevenueLast12MonthsUtc();

    // Analytics trend methods
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(t.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "SUM(t.amount) AS total " +
                   "FROM transactions t " +
                   "WHERE t.status = 'COMPLETED' " +
                   "AND t.contract.freelancer.id = :freelancerId " +
                   "AND t.created_at >= :startDate " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> getEarningsTrendByFreelancerId(@Param("freelancerId") UUID freelancerId, @Param("startDate") LocalDateTime startDate);

    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(t.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "SUM(t.amount) AS total " +
                   "FROM transactions t " +
                   "WHERE t.status = 'COMPLETED' " +
                   "AND t.contract.client.id = :clientId " +
                   "AND t.created_at >= :startDate " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> getSpendingTrendByClientId(@Param("clientId") UUID clientId, @Param("startDate") LocalDateTime startDate);

    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(t.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "SUM(t.amount) AS total " +
                   "FROM transactions t " +
                   "WHERE t.status = 'COMPLETED' " +
                   "AND t.contract.freelancer.id = :freelancerId " +
                   "GROUP BY ym " +
                   "ORDER BY ym DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<Object[]> getTopEarningMonthsByFreelancerId(@Param("freelancerId") UUID freelancerId, @Param("limit") int limit);
}

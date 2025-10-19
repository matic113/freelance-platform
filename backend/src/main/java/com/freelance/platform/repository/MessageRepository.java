package com.freelance.platform.repository;

import com.freelance.platform.entity.Message;
import com.freelance.platform.entity.User;
import com.freelance.platform.entity.Project;
import com.freelance.platform.entity.MessageType;
import com.freelance.platform.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    
    List<Message> findBySender(User sender);
    
    List<Message> findByRecipient(User recipient);
    
    List<Message> findByProject(Project project);
    
    List<Message> findByMessageType(MessageType messageType);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :sender ORDER BY m.createdAt DESC")
    List<Message> findBySenderOrderByCreatedAtDesc(@Param("sender") User sender);
    
    @Query("SELECT m FROM Message m WHERE m.recipient = :recipient ORDER BY m.createdAt DESC")
    List<Message> findByRecipientOrderByCreatedAtDesc(@Param("recipient") User recipient);
    
    @Query("SELECT m FROM Message m WHERE m.project = :project ORDER BY m.createdAt ASC")
    List<Message> findByProjectOrderByCreatedAtAsc(@Param("project") Project project);
    
    @Query("SELECT m FROM Message m WHERE m.project = :project ORDER BY m.createdAt DESC")
    List<Message> findByProjectOrderByCreatedAtDesc(@Param("project") Project project);
    
    @Query("SELECT m FROM Message m WHERE m.messageType = :messageType ORDER BY m.createdAt DESC")
    List<Message> findByMessageTypeOrderByCreatedAtDesc(@Param("messageType") MessageType messageType);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :sender ORDER BY m.createdAt DESC")
    Page<Message> findBySenderOrderByCreatedAtDesc(@Param("sender") User sender, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.recipient = :recipient ORDER BY m.createdAt DESC")
    Page<Message> findByRecipientOrderByCreatedAtDesc(@Param("recipient") User recipient, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.project = :project ORDER BY m.createdAt DESC")
    Page<Message> findByProjectOrderByCreatedAtDesc(@Param("project") Project project, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :sender AND m.recipient = :recipient ORDER BY m.createdAt ASC")
    List<Message> findConversationBetweenUsers(@Param("sender") User sender, @Param("recipient") User recipient);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :sender AND m.recipient = :recipient ORDER BY m.createdAt ASC")
    Page<Message> findConversationBetweenUsers(@Param("sender") User sender, @Param("recipient") User recipient, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :sender AND m.recipient = :recipient AND m.project = :project ORDER BY m.createdAt ASC")
    List<Message> findConversationBetweenUsersForProject(@Param("sender") User sender, @Param("recipient") User recipient, @Param("project") Project project);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :sender AND m.recipient = :recipient AND m.project = :project ORDER BY m.createdAt ASC")
    Page<Message> findConversationBetweenUsersForProject(@Param("sender") User sender, @Param("recipient") User recipient, @Param("project") Project project, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.recipient = :recipient AND m.isRead = false ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesByRecipient(@Param("recipient") User recipient);
    
    @Query("SELECT m FROM Message m WHERE m.recipient = :recipient AND m.isRead = false ORDER BY m.createdAt DESC")
    Page<Message> findUnreadMessagesByRecipient(@Param("recipient") User recipient, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.recipient = :recipient AND m.project = :project AND m.isRead = false ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesByRecipientAndProject(@Param("recipient") User recipient, @Param("project") Project project);
    
    @Query("SELECT m FROM Message m WHERE m.createdAt BETWEEN :startDate AND :endDate ORDER BY m.createdAt DESC")
    List<Message> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT m FROM Message m WHERE m.createdAt BETWEEN :startDate AND :endDate ORDER BY m.createdAt DESC")
    Page<Message> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender = :sender")
    long countBySender(@Param("sender") User sender);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient = :recipient")
    long countByRecipient(@Param("recipient") User recipient);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.project = :project")
    long countByProject(@Param("project") Project project);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.messageType = :messageType")
    long countByMessageType(@Param("messageType") MessageType messageType);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient = :recipient AND m.isRead = false")
    long countUnreadMessagesByRecipient(@Param("recipient") User recipient);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient = :recipient AND m.project = :project AND m.isRead = false")
    long countUnreadMessagesByRecipientAndProject(@Param("recipient") User recipient, @Param("project") Project project);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender = :sender AND m.recipient = :recipient")
    long countConversationMessages(@Param("sender") User sender, @Param("recipient") User recipient);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender = :sender AND m.recipient = :recipient AND m.project = :project")
    long countConversationMessagesForProject(@Param("sender") User sender, @Param("recipient") User recipient, @Param("project") Project project);
    
    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.recipient = :recipient")
    List<User> findSendersByRecipient(@Param("recipient") User recipient);
    
    @Query("SELECT DISTINCT m.recipient FROM Message m WHERE m.sender = :sender")
    List<User> findRecipientsBySender(@Param("sender") User sender);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :user OR m.recipient = :user ORDER BY m.createdAt DESC")
    List<Message> findMessagesByUser(@Param("user") User user);
    
    @Query("SELECT m FROM Message m WHERE m.sender = :user OR m.recipient = :user ORDER BY m.createdAt DESC")
    Page<Message> findMessagesByUser(@Param("user") User user, Pageable pageable);
    
    // Additional methods needed by MessageService
    @Query("SELECT m FROM Message m WHERE m.project.id = :projectId AND ((m.sender.id = :userId1 AND m.recipient.id = :userId2) OR (m.sender.id = :userId2 AND m.recipient.id = :userId1)) ORDER BY m.createdAt ASC")
    Page<Message> findConversationBetweenUsers(@Param("projectId") UUID projectId, @Param("userId1") UUID userId1, @Param("userId2") UUID userId2, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.project.id = :projectId AND (m.sender.id = :userId OR m.recipient.id = :userId) ORDER BY m.createdAt DESC")
    Page<Message> findByProjectIdAndUserInvolvedOrderByCreatedAtDesc(@Param("projectId") UUID projectId, @Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.recipient.id = :userId ORDER BY m.createdAt DESC")
    List<Message> findLatestMessagesByUser(@Param("userId") UUID userId);
    
    @Query("SELECT m FROM Message m WHERE m.project.id = :projectId AND ((m.sender.id = :userId1 AND m.recipient.id = :userId2) OR (m.sender.id = :userId2 AND m.recipient.id = :userId1)) AND m.recipient.id = :currentUserId AND m.isRead = false ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesInConversation(@Param("projectId") UUID projectId, @Param("userId1") UUID userId1, @Param("userId2") UUID userId2, @Param("currentUserId") UUID currentUserId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient.id = :userId AND m.isRead = false")
    long countUnreadMessagesByUser(@Param("userId") UUID userId);
    
    @Query("SELECT m FROM Message m WHERE m.recipient.id = :userId AND m.isRead = false ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesByUser(@Param("userId") UUID userId);
    
    boolean existsByProjectAndSender(Project project, User sender);
    
    // Direct message methods (no project)
    @Query("SELECT m FROM Message m WHERE m.project IS NULL AND ((m.sender.id = :userId1 AND m.recipient.id = :userId2) OR (m.sender.id = :userId2 AND m.recipient.id = :userId1)) ORDER BY m.createdAt ASC")
    Page<Message> findDirectConversationBetweenUsers(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.project IS NULL AND (m.sender.id = :userId OR m.recipient.id = :userId) ORDER BY m.createdAt DESC")
    List<Message> findDirectMessagesByUser(@Param("userId") UUID userId);
    
    // Conversation-based message queries (new)
    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation ORDER BY m.createdAt ASC")
    Page<Message> findByConversationOrderByCreatedAtAsc(@Param("conversation") Conversation conversation, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation AND m.recipient.id = :userId AND m.isRead = false")
    List<Message> findUnreadMessagesByConversationAndRecipient(@Param("conversation") Conversation conversation, @Param("userId") UUID userId);
}

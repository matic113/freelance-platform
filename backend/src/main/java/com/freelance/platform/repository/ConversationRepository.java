package com.freelance.platform.repository;

import com.freelance.platform.entity.Conversation;
import com.freelance.platform.entity.ConversationType;
import com.freelance.platform.entity.Project;
import com.freelance.platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    
    /**
     * Find a direct message conversation between two users
     * Returns conversation regardless of participant order
     */
    @Query("SELECT c FROM Conversation c WHERE c.type = 'DIRECT_MESSAGE' AND " +
           "((c.participant1 = :user1 AND c.participant2 = :user2) OR " +
           "(c.participant1 = :user2 AND c.participant2 = :user1))")
    Optional<Conversation> findDirectMessageConversation(@Param("user1") User user1, @Param("user2") User user2);
    
    /**
     * Get all conversations for a user (both as participant1 and participant2), sorted by recent
     * Excludes blocked conversations
     */
    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.participant1 = :user AND c.participant1Blocked = false) OR " +
           "(c.participant2 = :user AND c.participant2Blocked = false) " +
           "ORDER BY c.lastMessageAt DESC")
    Page<Conversation> findUserConversations(@Param("user") User user, Pageable pageable);
    
    /**
     * Get all conversations for a user that are direct messages only
     */
    @Query("SELECT c FROM Conversation c WHERE c.type = 'DIRECT_MESSAGE' AND " +
           "((c.participant1 = :user AND c.participant1Blocked = false) OR " +
           "(c.participant2 = :user AND c.participant2Blocked = false)) " +
           "ORDER BY c.lastMessageAt DESC")
    Page<Conversation> findDirectMessageConversations(@Param("user") User user, Pageable pageable);
    
    /**
     * Find conversations by type
     */
    @Query("SELECT c FROM Conversation c WHERE c.type = :type AND " +
           "((c.participant1 = :user) OR (c.participant2 = :user)) " +
           "ORDER BY c.lastMessageAt DESC")
    Page<Conversation> findByTypeAndParticipant(@Param("type") ConversationType type, 
                                                @Param("user") User user, Pageable pageable);
    
     /**
      * Count unread conversations for a user (where user is participant1 or participant2)
      * This can be optimized with a custom query if needed
      */
     @Query("SELECT COUNT(c) FROM Conversation c WHERE " +
            "((c.participant1 = :user AND c.participant1Blocked = false) OR " +
            "(c.participant2 = :user AND c.participant2Blocked = false))")
     Long countUserConversations(@Param("user") User user);
     
     /**
      * Find a project-based conversation between two users for a specific project
      */
     @Query("SELECT c FROM Conversation c WHERE c.project = :project AND c.type = 'PROJECT_CHAT' AND " +
            "((c.participant1 = :user1 AND c.participant2 = :user2) OR " +
            "(c.participant1 = :user2 AND c.participant2 = :user1))")
     Optional<Conversation> findProjectConversation(@Param("project") Project project, 
                                                     @Param("user1") User user1, 
                                                     @Param("user2") User user2);
}

package com.freelance.platform.service;

import com.freelance.platform.entity.Conversation;
import com.freelance.platform.entity.ConversationType;
import com.freelance.platform.entity.User;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.ConversationRepository;
import com.freelance.platform.repository.ProjectRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service layer for managing conversations (direct messaging and project chats)
 */
@Service
public class ConversationService {
    
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    
    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }
    
    /**
     * Get or create a direct message conversation between two users
     * @param currentUserId The ID of the current user
     * @param otherUserEmail The email of the other user
     * @return The conversation (existing or newly created)
     */
    @Transactional
    public Conversation getOrCreateDirectMessageConversation(UUID currentUserId, String otherUserEmail) {
        User currentUser = userRepository.findById(currentUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        User otherUser = userRepository.findByEmail(otherUserEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User with email " + otherUserEmail + " not found"));
        
        if (currentUser.getId().equals(otherUser.getId())) {
            throw new UnauthorizedException("Cannot create conversation with yourself");
        }
        
        return conversationRepository
            .findDirectMessageConversation(currentUser, otherUser)
            .orElseGet(() -> {
                Conversation newConversation = new Conversation(currentUser, otherUser, ConversationType.DIRECT_MESSAGE);
                return conversationRepository.save(newConversation);
            });
    }
    
    /**
     * Get or create a direct message conversation between two users by user ID
     * @param currentUserId The ID of the current user
     * @param otherUserId The ID of the other user
     * @return The conversation (existing or newly created)
     */
    @Transactional
    public Conversation getOrCreateDirectMessageConversationById(UUID currentUserId, UUID otherUserId) {
        User currentUser = userRepository.findById(currentUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        User otherUser = userRepository.findById(otherUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User with ID " + otherUserId + " not found"));
        
        if (currentUser.getId().equals(otherUser.getId())) {
            throw new UnauthorizedException("Cannot create conversation with yourself");
        }
        
        return conversationRepository
            .findDirectMessageConversation(currentUser, otherUser)
            .orElseGet(() -> {
                Conversation newConversation = new Conversation(currentUser, otherUser, ConversationType.DIRECT_MESSAGE);
                return conversationRepository.save(newConversation);
            });
    }
    
    /**
     * Get all conversations for a user
     * @param userId The user ID
     * @param pageable Pagination info
     * @return Page of conversations sorted by most recent
     */
    @Transactional(readOnly = true)
    public Page<Conversation> getUserConversations(UUID userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return conversationRepository.findUserConversations(user, pageable);
    }
    
    /**
     * Get all direct message conversations for a user
     * @param userId The user ID
     * @param pageable Pagination info
     * @return Page of direct message conversations
     */
    @Transactional(readOnly = true)
    public Page<Conversation> getUserDirectMessageConversations(UUID userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return conversationRepository.findDirectMessageConversations(user, pageable);
    }
    
    /**
     * Get a specific conversation by ID
     * @param conversationId The conversation ID
     * @param userId The user ID (for authorization)
     * @return The conversation
     */
    @Transactional(readOnly = true)
    public Conversation getConversation(UUID conversationId, UUID userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        
        // Verify user is a participant
        if (!isUserParticipant(conversation, userId)) {
            throw new UnauthorizedException("User is not a participant in this conversation");
        }
        
        return conversation;
    }
    
    /**
     * Check if user is a participant in the conversation
     */
    public boolean isUserParticipant(Conversation conversation, UUID userId) {
        return (conversation.getParticipant1() != null && conversation.getParticipant1().getId().equals(userId)) ||
               (conversation.getParticipant2() != null && conversation.getParticipant2().getId().equals(userId));
    }
    
    /**
     * Check if user is blocked in the conversation
     */
    public boolean isUserBlocked(Conversation conversation, UUID userId) {
        if (conversation.getParticipant1() != null && conversation.getParticipant1().getId().equals(userId)) {
            return conversation.getParticipant1Blocked();
        } else if (conversation.getParticipant2() != null && conversation.getParticipant2().getId().equals(userId)) {
            return conversation.getParticipant2Blocked();
        }
        return false;
    }
    
    /**
     * Update the last message timestamp and preview for a conversation
     * @param conversationId The conversation ID
     * @param messagePreview The preview of the last message
     */
    @Transactional
    public void updateLastMessage(UUID conversationId, String messagePreview) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        
        conversation.setLastMessageAt(LocalDateTime.now());
        conversation.setLastMessagePreview(messagePreview);
        conversationRepository.save(conversation);
    }
    
    /**
     * Block a user in a conversation
     * @param conversationId The conversation ID
     * @param userId The user performing the block
     */
    @Transactional
    public void blockUser(UUID conversationId, UUID userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        
        if (conversation.getParticipant1() != null && conversation.getParticipant1().getId().equals(userId)) {
            conversation.setParticipant1Blocked(true);
        } else if (conversation.getParticipant2() != null && conversation.getParticipant2().getId().equals(userId)) {
            conversation.setParticipant2Blocked(true);
        } else {
            throw new UnauthorizedException("User is not a participant in this conversation");
        }
        
        conversationRepository.save(conversation);
    }
    
    /**
     * Unblock a user in a conversation
     * @param conversationId The conversation ID
     * @param userId The user performing the unblock
     */
    @Transactional
    public void unblockUser(UUID conversationId, UUID userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        
        if (conversation.getParticipant1() != null && conversation.getParticipant1().getId().equals(userId)) {
            conversation.setParticipant1Blocked(false);
        } else if (conversation.getParticipant2() != null && conversation.getParticipant2().getId().equals(userId)) {
            conversation.setParticipant2Blocked(false);
        } else {
            throw new UnauthorizedException("User is not a participant in this conversation");
        }
        
        conversationRepository.save(conversation);
    }

    /**
     * Get all conversations of a specific type for a user
     * @param userId The user ID
     * @param type The conversation type (DIRECT_MESSAGE or PROJECT_CHAT)
     * @param pageable Pagination info
     * @return Page of conversations of the specified type
     */
    @Transactional(readOnly = true)
    public Page<Conversation> getConversationsByType(UUID userId, ConversationType type, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return conversationRepository.findByTypeAndParticipant(type, user, pageable);
    }

    /**
     * Get or create a project conversation for a specific project
     * @param projectId The project ID
     * @param userId The user ID (must be participant in the project)
     * @return The project conversation
     */
    @Transactional
    public Conversation getOrCreateProjectConversation(UUID projectId, UUID userId) {
        com.freelance.platform.entity.Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Verify user is involved with the project (is client or has active contract)
        // For now, we'll check if user is the client - this can be extended to check contracts
        if (!project.getClient().getId().equals(userId)) {
            // In a real scenario, you might check if user has an active contract on this project
            throw new UnauthorizedException("User is not involved in this project");
        }
        
        // Find existing conversation for this project
        return conversationRepository.findProjectConversation(project, project.getClient(), currentUser)
            .orElseGet(() -> {
                Conversation newConversation = new Conversation(
                    project.getClient(),
                    currentUser,
                    project,
                    ConversationType.PROJECT_CHAT
                );
                newConversation.setLastMessageAt(LocalDateTime.now());
                return conversationRepository.save(newConversation);
            });
    }
}

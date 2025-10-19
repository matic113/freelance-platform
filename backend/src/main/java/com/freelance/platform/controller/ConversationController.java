package com.freelance.platform.controller;

import com.freelance.platform.dto.request.MessageRequest;
import com.freelance.platform.dto.response.ConversationResponse;
import com.freelance.platform.dto.response.FileUploadResponse;
import com.freelance.platform.dto.response.MessageResponse;
import com.freelance.platform.entity.Conversation;
import com.freelance.platform.entity.User;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.service.ConversationService;
import com.freelance.platform.service.MessageService;
import com.freelance.platform.service.StorageService;
import com.freelance.platform.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

/**
 * REST endpoints for managing conversations (direct messages)
 */
@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private StorageService storageService;

    /**
     * Start a new conversation or get existing one with a user by email
     * POST /api/conversations/start-by-email?email=user@example.com
     */
    @PostMapping("/start-by-email")
    public ResponseEntity<ConversationResponse> startConversationByEmail(
            @RequestParam String email,
            Authentication authentication) {
        try {
            UUID currentUserId = extractUserId(authentication);
            Conversation conversation = conversationService.getOrCreateDirectMessageConversation(currentUserId, email);
            return ResponseEntity.ok(mapToConversationResponse(conversation, currentUserId));
        } catch (ResourceNotFoundException e) {
            throw e;
        }
    }

    /**
     * Start a new conversation or get existing one with a user by ID
     * POST /api/conversations/start/{userId}
     */
    @PostMapping("/start/{userId}")
    public ResponseEntity<ConversationResponse> startConversationById(
            @PathVariable UUID userId,
            Authentication authentication) {
        try {
            UUID currentUserId = extractUserId(authentication);
            Conversation conversation = conversationService.getOrCreateDirectMessageConversationById(currentUserId, userId);
            return ResponseEntity.ok(mapToConversationResponse(conversation, currentUserId));
        } catch (ResourceNotFoundException e) {
            throw e;
        }
    }

    /**
     * Get all conversations for the current user
     * GET /api/conversations?page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<ConversationResponse>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
    UUID userId = extractUserId(authentication);
    Pageable pageable = PageRequest.of(page, size);
    Page<Conversation> conversations = conversationService.getUserConversations(userId, pageable);
    return ResponseEntity.ok(conversations.map(conversation -> mapToConversationResponse(conversation, userId)));
    }

    /**
     * Get a specific conversation by ID
     * GET /api/conversations/{conversationId}
     */
    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse> getConversation(
            @PathVariable UUID conversationId,
            Authentication authentication) {
    UUID userId = extractUserId(authentication);
    Conversation conversation = conversationService.getConversation(conversationId, userId);
    return ResponseEntity.ok(mapToConversationResponse(conversation, userId));
    }

    /**
     * Get messages in a conversation
     * GET /api/conversations/{conversationId}/messages?page=0&size=50
     */
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<Page<MessageResponse>> getConversationMessages(
            @PathVariable UUID conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<MessageResponse> messages = messageService.getConversationMessages(conversationId, userId, pageable);
        return ResponseEntity.ok(messages);
    }

    /**
     * Send a message in a conversation
     * POST /api/conversations/{conversationId}/messages
     */
    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable UUID conversationId,
            @RequestBody MessageRequest request,
            Authentication authentication) {
        UUID senderId = extractUserId(authentication);
        MessageResponse response = messageService.sendMessage(conversationId, request, senderId);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark all messages in a conversation as read
     * PUT /api/conversations/{conversationId}/read
     */
    @PutMapping("/{conversationId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable UUID conversationId,
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        messageService.markConversationAsRead(conversationId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark a specific message as read
     * PUT /api/conversations/messages/{messageId}/read
     */
    @PutMapping("/messages/{messageId}/read")
    public ResponseEntity<Void> markMessageAsRead(
            @PathVariable UUID messageId,
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        messageService.markAsRead(messageId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Block a user in a conversation
     * POST /api/conversations/{conversationId}/block
     */
    @PostMapping("/{conversationId}/block")
    public ResponseEntity<Void> blockUserInConversation(
            @PathVariable UUID conversationId,
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        conversationService.blockUser(conversationId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Unblock a user in a conversation
     * DELETE /api/conversations/{conversationId}/block
     */
    @DeleteMapping("/{conversationId}/block")
    public ResponseEntity<Void> unblockUserInConversation(
            @PathVariable UUID conversationId,
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        conversationService.unblockUser(conversationId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete a message
     * DELETE /api/conversations/messages/{messageId}
     */
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable UUID messageId,
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        messageService.deleteMessage(messageId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Get unread message count for current user
     * GET /api/conversations/unread/count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<UnreadCountResponse> getUnreadMessageCount(
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        long count = messageService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(new UnreadCountResponse(count));
    }

    /**
     * Upload file for messaging
     * POST /api/conversations/{conversationId}/upload
     */
    @PostMapping("/{conversationId}/upload")
    public ResponseEntity<FileUploadResponse> uploadFileForConversation(
            @PathVariable UUID conversationId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "messages") String folder,
            Authentication authentication) {
        UUID userId = extractUserId(authentication);
        conversationService.getConversation(conversationId, userId);

        String objectName = storageService.uploadFile(file, "conversations/" + conversationId + "/" + folder);
        String downloadUrl = storageService.getPresignedDownloadUrl(objectName, 24);

        FileUploadResponse response = new FileUploadResponse(
                objectName,
                file.getOriginalFilename(),
                downloadUrl,
                file.getSize(),
                file.getContentType(),
                folder
        );

        return ResponseEntity.ok(response);
    }

    private UUID extractUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getId();
        }

        String name = authentication.getName();
        try {
            return UUID.fromString(name);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user identifier");
        }
    }

    // Helper methods and DTOs

    private ConversationResponse mapToConversationResponse(Conversation conversation, UUID currentUserId) {
        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setType(conversation.getType());
        response.setLastMessageAt(conversation.getLastMessageAt());
        response.setLastMessagePreview(conversation.getLastMessagePreview());
        response.setCreatedAt(conversation.getCreatedAt());

        // Determine the other participant relative to current user
        User participant1 = conversation.getParticipant1();
        User participant2 = conversation.getParticipant2();
        User otherParticipant = null;

        if (currentUserId != null) {
            if (participant1 != null && currentUserId.equals(participant1.getId())) {
                otherParticipant = participant2;
            } else if (participant2 != null && currentUserId.equals(participant2.getId())) {
                otherParticipant = participant1;
            }
        }

        if (otherParticipant == null) {
            otherParticipant = participant2 != null ? participant2 : participant1;
        }

        if (otherParticipant != null) {
            response.setOtherParticipantId(otherParticipant.getId());

            String firstName = otherParticipant.getFirstName() != null ? otherParticipant.getFirstName() : "";
            String lastName = otherParticipant.getLastName() != null ? otherParticipant.getLastName() : "";
            String fullName = (firstName + " " + lastName).trim();
            response.setOtherParticipantName(fullName.isEmpty() ? otherParticipant.getEmail() : fullName);

            response.setOtherParticipantEmail(otherParticipant.getEmail());
            response.setOtherParticipantAvatar(otherParticipant.getAvatarUrl());
        }

        return response;
    }

    /**
     * DTO for unread message count response
     */
    public static class UnreadCountResponse {
        private long count;

        public UnreadCountResponse(long count) {
            this.count = count;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }
}

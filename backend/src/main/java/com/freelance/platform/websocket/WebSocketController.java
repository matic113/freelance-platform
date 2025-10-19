package com.freelance.platform.websocket;

import com.freelance.platform.dto.request.MessageRequest;
import com.freelance.platform.dto.response.MessageResponse;
import com.freelance.platform.entity.MessageType;
import com.freelance.platform.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.UUID;

/**
 * WebSocket controller for real-time messaging
 * Refactored to use Conversation model instead of project-centric design
 */
@Controller
public class WebSocketController {

    @Autowired
    private com.freelance.platform.service.MessageService messageService;

    /**
     * Send a message in a conversation via WebSocket
     * Route: /app/chat.sendMessage
     * Message format: {
     *   "conversationId": "uuid",
     *   "content": "message content",
     *   "messageType": "TEXT",
     *   "attachments": []
     * }
     */
    @MessageMapping("/chat.sendMessage")
    public MessageResponse sendMessage(@Payload WebSocketMessageRequest messageRequest,
                                       SimpMessageHeaderAccessor headerAccessor) {
        // Get user from authentication
        UserPrincipal user = (UserPrincipal) headerAccessor.getUser();

        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        // Validate required fields
        if (messageRequest.getConversationId() == null) {
            throw new RuntimeException("Conversation ID is required");
        }

        // Convert WebSocket request to service request
        MessageRequest serviceRequest = new MessageRequest();
        serviceRequest.setContent(messageRequest.getContent());
        if (messageRequest.getMessageType() != null) {
            try {
                serviceRequest.setMessageType(MessageType.valueOf(messageRequest.getMessageType()));
            } catch (IllegalArgumentException e) {
                serviceRequest.setMessageType(MessageType.TEXT);
            }
        }
        serviceRequest.setAttachments(messageRequest.getAttachments());

        // Send message through the service
        return messageService.sendMessage(messageRequest.getConversationId(), serviceRequest, user.getId());
    }

    /**
     * Add user to WebSocket session
     * Route: /app/chat.addUser
     */
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload String username, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in websocket session
        headerAccessor.getSessionAttributes().put("username", username);
    }

    /**
     * DTO for WebSocket message requests
     */
    public static class WebSocketMessageRequest {
        private UUID conversationId;
        private String content;
        private String messageType;
        private java.util.List<String> attachments;

        // Constructors
        public WebSocketMessageRequest() {}

        // Getters and Setters
        public UUID getConversationId() {
            return conversationId;
        }

        public void setConversationId(UUID conversationId) {
            this.conversationId = conversationId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getMessageType() {
            return messageType;
        }

        public void setMessageType(String messageType) {
            this.messageType = messageType;
        }

        public java.util.List<String> getAttachments() {
            return attachments;
        }

        public void setAttachments(java.util.List<String> attachments) {
            this.attachments = attachments;
        }
    }
}

package com.freelance.platform.service;

import com.freelance.platform.dto.request.MessageRequest;
import com.freelance.platform.dto.response.MessageResponse;
import com.freelance.platform.entity.Conversation;
import com.freelance.platform.entity.Message;
import com.freelance.platform.entity.User;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.ConversationRepository;
import com.freelance.platform.repository.MessageRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing messages within conversations
 * Refactored to use Conversation entity instead of project-centric design
 */
@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailNotificationService emailNotificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Send a message in a conversation
     * @param conversationId The ID of the conversation
     * @param request The message request (content, attachments, etc.)
     * @param senderId The ID of the sender
     * @return The sent message response
     */
    public MessageResponse sendMessage(UUID conversationId, MessageRequest request, UUID senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        // Verify sender is a participant in the conversation
        if (!conversation.isUserParticipant(sender)) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        // Check if sender is blocked by the other participant
        if (conversationService.isUserBlocked(conversation, senderId)) {
            throw new UnauthorizedException("You are blocked in this conversation");
        }

        // Create and save the message
        Message message = new Message(conversation, sender, request.getContent(),
                request.getMessageType() != null ? request.getMessageType() : com.freelance.platform.entity.MessageType.TEXT);
        message.setAttachments(request.getAttachments());
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        // Update conversation's last message timestamp
        String preview = request.getContent().length() > 100 ?
                request.getContent().substring(0, 100) + "..." : request.getContent();
        conversationService.updateLastMessage(conversationId, preview);

        // Send real-time message via WebSocket
        MessageResponse messageResponse = mapToMessageResponse(savedMessage);
        User recipient = conversation.getOtherParticipant(sender);
    String destination = "/queue/messages";
    messagingTemplate.convertAndSendToUser(recipient.getId().toString(), destination, messageResponse);
    messagingTemplate.convertAndSendToUser(sender.getId().toString(), destination, messageResponse);

    // Broadcast to conversation topic so both clients can update conversation lists
    messagingTemplate.convertAndSend(
        String.format("/topic/conversations/%s", conversationId),
        messageResponse
    );

        // Send notification to recipient
        String notificationTitle = "New Message Received";
        String notificationMessage;
        String notificationData;
        
        // Customize notification based on conversation type
        if (conversation.getType() == com.freelance.platform.entity.ConversationType.PROJECT_CHAT && conversation.getProject() != null) {
            notificationMessage = String.format("New message from %s %s in project '%s'", 
                sender.getFirstName(), sender.getLastName(), conversation.getProject().getTitle());
            notificationData = String.format("{\"conversationId\":\"%s\",\"senderId\":\"%s\",\"projectId\":\"%s\",\"type\":\"PROJECT_CHAT\"}", 
                conversationId, sender.getId(), conversation.getProject().getId());
        } else {
            notificationMessage = String.format("You received a new message from %s %s", 
                sender.getFirstName(), sender.getLastName());
            notificationData = String.format("{\"conversationId\":\"%s\",\"senderId\":\"%s\",\"type\":\"DIRECT_MESSAGE\"}", 
                conversationId, sender.getId());
        }
        
        notificationService.createNotificationForUser(
                recipient.getId(),
                "NEW_MESSAGE",
                notificationTitle,
                notificationMessage,
                "medium",
                notificationData
        );

        // Send email notification to recipient if enabled
        emailNotificationService.sendNewMessageEmail(
                recipient,
                sender.getFirstName() + " " + sender.getLastName(),
                sender.getFirstName(),
                sender.getLastName(),
                ""
        );

        return messageResponse;
    }

    /**
     * Get a message by ID (with authorization check)
     */
    public MessageResponse getMessageById(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        // Verify user is a participant in the conversation
        if (!message.getConversation().isUserParticipant(userRepository.findById(userId).orElseThrow())) {
            throw new UnauthorizedException("You are not authorized to view this message");
        }

        return mapToMessageResponse(message);
    }

    /**
     * Get all messages in a conversation (paginated)
     */
    public Page<MessageResponse> getConversationMessages(UUID conversationId, UUID userId, Pageable pageable) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        // Verify user is a participant
        if (!conversation.isUserParticipant(userRepository.findById(userId).orElseThrow())) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        Page<Message> messages = messageRepository.findByConversationOrderByCreatedAtAsc(conversation, pageable);
        return messages.map(this::mapToMessageResponse);
    }

    /**
     * Mark a message as read
     */
    public void markAsRead(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        // Verify user is the recipient
        if (!message.getRecipient().getId().equals(userId)) {
            throw new UnauthorizedException("You can only mark your own received messages as read");
        }

        message.setIsRead(true);
        messageRepository.save(message);
    }

    /**
     * Mark all unread messages in a conversation as read for a specific user
     */
    public void markConversationAsRead(UUID conversationId, UUID userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        // Verify user is a participant
        if (!conversation.isUserParticipant(userRepository.findById(userId).orElseThrow())) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        messageRepository.findUnreadMessagesByConversationAndRecipient(conversation, userId)
                .forEach(message -> {
                    message.setIsRead(true);
                    messageRepository.save(message);
                });
    }

    /**
     * Get count of unread messages for a user
     */
    public long getUnreadMessageCount(UUID userId) {
        return messageRepository.countUnreadMessagesByRecipient(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    /**
     * Delete a message (only sender can delete)
     */
    public void deleteMessage(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        // Verify user is the sender
        if (!message.getSender().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own messages");
        }

        messageRepository.delete(message);
    }

    /**
     * Map Message entity to MessageResponse DTO
     */
    private MessageResponse mapToMessageResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setSenderId(message.getSender().getId());
        response.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        response.setRecipientId(message.getRecipient().getId());
        response.setRecipientName(message.getRecipient().getFirstName() + " " + message.getRecipient().getLastName());
        response.setConversationId(message.getConversation().getId());
        response.setContent(message.getContent());
        response.setMessageType(message.getMessageType());
        response.setAttachments(message.getAttachments());
        response.setIsRead(message.getIsRead());
        response.setCreatedAt(message.getCreatedAt());

        response.setSentAt(message.getCreatedAt());

    MessageResponse.MessageParticipant senderParticipant = new MessageResponse.MessageParticipant(
        message.getSender().getId(),
        message.getSender().getFirstName(),
        message.getSender().getLastName(),
        message.getSender().getEmail(),
        message.getSender().getAvatarUrl()
    );

    MessageResponse.MessageParticipant recipientParticipant = new MessageResponse.MessageParticipant(
        message.getRecipient().getId(),
        message.getRecipient().getFirstName(),
        message.getRecipient().getLastName(),
        message.getRecipient().getEmail(),
        message.getRecipient().getAvatarUrl()
    );

    response.setSender(senderParticipant);
    response.setRecipient(recipientParticipant);

        return response;
    }
}

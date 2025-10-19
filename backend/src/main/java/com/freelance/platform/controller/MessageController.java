package com.freelance.platform.controller;

import com.freelance.platform.dto.response.MessageResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Legacy Message Controller
 * 
 * DEPRECATED: Use ConversationController (/api/conversations) for all new message operations.
 * 
 * This controller provides minimal support for existing functionality.
 * All message operations should go through the conversation-based system.
 */
@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messages (Legacy)", description = "Legacy message endpoints - use /api/conversations instead")
@SecurityRequirement(name = "bearerAuth")
public class MessageController {

    @Autowired
    private MessageService messageService;

    /**
     * Get a single message by ID
     * DEPRECATED: Use GET /api/conversations/{conversationId}/messages instead
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get message by ID (Legacy)", deprecated = true)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message found"),
            @ApiResponse(responseCode = "404", description = "Message not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<MessageResponse> getMessage(
            @Parameter(description = "Message ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        MessageResponse response = messageService.getMessageById(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Mark a single message as read
     * DEPRECATED: Use PUT /api/conversations/{conversationId}/read instead
     */
    @PutMapping("/{id}/read")
    @Operation(summary = "Mark message as read (Legacy)", deprecated = true)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Message marked as read"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Message not found")
    })
    public ResponseEntity<Void> markAsRead(
            @Parameter(description = "Message ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        messageService.markAsRead(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete a message
     * DEPRECATED: Use DELETE /api/conversations/messages/{messageId} instead
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete message (Legacy)", deprecated = true)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Message deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Message not found")
    })
    public ResponseEntity<Void> deleteMessage(
            @Parameter(description = "Message ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        messageService.deleteMessage(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Get unread message count
     * Still useful - returns total unread messages across all conversations
     */
    @GetMapping("/unread/count")
    @Operation(summary = "Get unread message count")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Count retrieved"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Long> getUnreadMessageCount(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        long count = messageService.getUnreadMessageCount(currentUser.getId());
        return ResponseEntity.ok(count);
    }
}

import { apiService } from './api';
import { 
  MessageResponse, 
  PageResponse
} from '@/types/api';

/**
 * Message Service - Conversation-based messaging
 * 
 * DEPRECATED ENDPOINTS: This service has been migrated to use the conversation model.
 * All old endpoints (getConversation, getConversations, etc.) are removed.
 * 
 * Use conversationService instead for all new code!
 * 
 * These utility methods remain for backward compatibility:
 */
export const messageService = {
  /**
   * Get a single message by ID
   * @deprecated Use conversationService.getConversationMessages() instead
   */
  getMessage: async (id: string): Promise<MessageResponse> => {
    return apiService.get<MessageResponse>(`/messages/${id}`);
  },

  /**
   * Mark a single message as read
   * @deprecated Use conversationService.markConversationAsRead() instead
   */
  markAsRead: async (id: string): Promise<void> => {
    return apiService.put<void>(`/messages/${id}/read`);
  },

  /**
   * Delete a message
   * @deprecated Use conversationService.deleteMessage() instead
   */
  deleteMessage: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/messages/${id}`);
  },

  /**
   * Get unread message count across all conversations
   * Useful for notification badges
   */
  getUnreadCount: async (): Promise<number> => {
    return apiService.get<number>('/messages/unread/count');
  },
};

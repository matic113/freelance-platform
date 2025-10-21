import { apiService } from './api';
import {
  ConversationResponse,
  MessageResponse,
  PageResponse
} from '@/types/api';

/**
 * Conversation Service - Peer-to-peer messaging API
 * 
 * Handles all conversation and message operations:
 * - Creating and listing conversations
 * - Sending and retrieving messages within conversations
 * - Managing conversation state (read status, blocking, etc.)
 */
export const conversationService = {
  /**
   * Start a new conversation by recipient email address
   * Creates a new conversation if one doesn't exist, or retrieves existing one
   * 
   * @param email - Email address of the recipient
   * @returns ConversationResponse with the conversation details
   */
  startConversationByEmail: async (email: string): Promise<ConversationResponse> => {
    return apiService.post<ConversationResponse>('/conversations/start-by-email', { email });
  },

  /**
   * Start a new conversation with a specific user by ID
   * Creates a new conversation if one doesn't exist, or retrieves existing one
   * 
   * @param userId - ID of the user to start conversation with
   * @returns ConversationResponse with the conversation details
   */
  startConversationById: async (userId: string): Promise<ConversationResponse> => {
    return apiService.post<ConversationResponse>(`/conversations/start/${userId}`);
  },

  /**
   * Get all conversations for the current user
   * Returns paginated list of conversations sorted by last message date
   * 
   * @param page - Page number (0-indexed)
   * @param size - Number of conversations per page
   * @returns PageResponse containing conversation list
   */
  getConversations: async (page: number = 0, size: number = 20): Promise<PageResponse<ConversationResponse>> => {
    return apiService.get<PageResponse<ConversationResponse>>(`/conversations?page=${page}&size=${size}`);
  },

  /**
   * Get a single conversation by ID
   * Includes basic conversation info without messages
   * 
   * @param conversationId - ID of the conversation
   * @returns ConversationResponse with conversation details
   */
  getConversation: async (conversationId: string): Promise<ConversationResponse> => {
    return apiService.get<ConversationResponse>(`/conversations/${conversationId}`);
  },

  /**
   * Get all messages in a specific conversation
   * Returns paginated list of messages sorted by creation date
   * 
   * @param conversationId - ID of the conversation
   * @param page - Page number (0-indexed)
   * @param size - Number of messages per page
   * @returns PageResponse containing messages
   */
  getConversationMessages: async (
    conversationId: string,
    page: number = 0,
    size: number = 50
  ): Promise<PageResponse<MessageResponse>> => {
    return apiService.get<PageResponse<MessageResponse>>(
      `/conversations/${conversationId}/messages?page=${page}&size=${size}`
    );
  },

  /**
   * Send a message within a conversation
   * Broadcasts message to all conversation participants via WebSocket
   * 
   * @param conversationId - ID of the conversation
   * @param content - Message text content
   * @param attachments - Optional array of attachment IDs/URLs
   * @returns MessageResponse with the created message
   */
  sendMessage: async (
    conversationId: string,
    content: string,
    attachments?: string[]
  ): Promise<MessageResponse> => {
    return apiService.post<MessageResponse>(
      `/conversations/${conversationId}/messages`,
      {
        content,
        messageType: 'TEXT',
        attachments: attachments || []
      }
    );
  },

  /**
   * Mark a specific conversation as read
   * Clears unread message count for this conversation
   * 
   * @param conversationId - ID of the conversation
   */
  markConversationAsRead: async (conversationId: string): Promise<void> => {
    return apiService.put<void>(`/conversations/${conversationId}/read`);
  },

  /**
   * Get unread message count across all conversations
   * Useful for notification badges
   * 
   * @returns Number of unread messages
   */
  getUnreadCount: async (): Promise<number> => {
    return apiService.get<number>('/conversations/unread/count');
  },

  /**
   * Block a user in a conversation
   * Prevents further messages from that user in this conversation
   * 
   * @param conversationId - ID of the conversation
   */
  blockUser: async (conversationId: string): Promise<void> => {
    return apiService.post<void>(`/conversations/${conversationId}/block`);
  },

  /**
   * Unblock a user in a conversation
   * Allows messages from the user again
   * 
   * @param conversationId - ID of the conversation
   */
  unblockUser: async (conversationId: string): Promise<void> => {
    return apiService.delete<void>(`/conversations/${conversationId}/block`);
  },

  /**
   * Delete a message by ID
   * Only the message sender can delete their own messages
   * 
   * @param messageId - ID of the message to delete
   */
  deleteMessage: async (messageId: string): Promise<void> => {
    return apiService.delete<void>(`/messages/${messageId}`);
  },

  /**
   * Mark a single message as read
   * Updates read status for individual message
   * 
   * @param messageId - ID of the message
   */
  markMessageAsRead: async (messageId: string): Promise<void> => {
    return apiService.put<void>(`/messages/${messageId}/read`);
  },

  /**
   * Search for users to start messaging with
   * Returns only essential user info (id, firstName, lastName, email, avatarUrl)
   * 
   * @param searchTerm - Email or name to search for
   * @param page - Page number (0-indexed)
   * @param size - Number of results per page
   * @returns PageResponse containing user search results
   */
  searchUsersForMessaging: async (
    searchTerm: string,
    page: number = 0,
    size: number = 20
  ): Promise<any> => {
    return apiService.get<any>(
      `/users/search-for-messaging?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`
    );
  },

  /**
   * Get or create a project conversation
   * 
   * @param projectId - ID of the project
   * @returns ConversationResponse with the project conversation
   */
  getProjectConversation: async (projectId: string): Promise<ConversationResponse> => {
    return apiService.get<ConversationResponse>(`/conversations/project/${projectId}`);
  },

  /**
   * Get conversations filtered by type
   * 
   * @param type - Conversation type ('DIRECT_MESSAGE' or 'PROJECT_CHAT')
   * @param page - Page number (0-indexed)
   * @param size - Number of conversations per page
   * @returns PageResponse containing filtered conversations
   */
  getConversationsByType: async (
    type: 'DIRECT_MESSAGE' | 'PROJECT_CHAT',
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<ConversationResponse>> => {
    return apiService.get<PageResponse<ConversationResponse>>(
      `/conversations/filter?type=${type}&page=${page}&size=${size}`
    );
  },
};

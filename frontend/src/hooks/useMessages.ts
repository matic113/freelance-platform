import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/message.service';
import { MessageResponse, SendMessageRequest, PageResponse } from '@/types/api';

// Query keys
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...messageKeys.lists(), filters] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: number) => [...messageKeys.details(), id] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (userId: number) => [...messageKeys.all, 'conversation', userId] as const,
  unreadCount: () => [...messageKeys.all, 'unread-count'] as const,
};

// Get conversations
export const useConversations = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: () => messageService.getConversations(page, size),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get conversation with user
export const useConversation = (userId: string | number, page: number = 0, size: number = 50) => {
  return useQuery({
    queryKey: messageKeys.conversation(userId as number),
    queryFn: () => messageService.getConversation(userId as string, page, size),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get unread message count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: messageKeys.unreadCount(),
    queryFn: () => messageService.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: (data, variables) => {
      // Invalidate conversation query
      queryClient.invalidateQueries({ queryKey: messageKeys.conversation(variables.recipientId) });
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
    },
    onError: (error) => {
      console.error('Send message error:', error);
    },
  });
};

// Mark message as read mutation
export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageService.markAsRead,
    onSuccess: (data) => {
      // Update message in cache
      queryClient.setQueryData(messageKeys.detail(data.id), data);
      // Invalidate conversation query
      queryClient.invalidateQueries({ queryKey: messageKeys.conversation(data.senderId) });
      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
    },
    onError: (error) => {
      console.error('Mark message as read error:', error);
    },
  });
};

// Mark conversation as read mutation
export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageService.markConversationAsRead,
    onSuccess: (_, userId) => {
      // Invalidate conversation query
      queryClient.invalidateQueries({ queryKey: messageKeys.conversation(userId) });
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
    },
    onError: (error) => {
      console.error('Mark conversation as read error:', error);
    },
  });
};

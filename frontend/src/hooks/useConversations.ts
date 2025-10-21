import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '@/services/conversation.service';
import { messageService } from '@/services/message.service';
import { ConversationResponse, MessageResponse, PageResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook for managing conversations
 * Handles fetching, creating, and managing conversation state
 */
export const useConversations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all conversations
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    error: conversationsError,
    isPending,
  } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => conversationService.getConversations(0, 50),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get unread count
  const { data: unreadCount } = useQuery({
    queryKey: ['unreadCount', user?.id],
    queryFn: () => conversationService.getUnreadCount(),
    enabled: !!user?.id,
    staleTime: 1000 * 30, // 30 seconds
  });

   // Start conversation by email
   const startConversationByEmail = useMutation({
     mutationFn: (email: string) =>
       conversationService.startConversationByEmail(email),
     onSuccess: (conversation) => {
       queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
       queryClient.refetchQueries({ queryKey: ['conversations', user?.id] });
       return conversation;
     },
   });

   // Start conversation by user ID
   const startConversationById = useMutation({
     mutationFn: (userId: string) =>
       conversationService.startConversationById(userId),
     onSuccess: (conversation) => {
       queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
       queryClient.refetchQueries({ queryKey: ['conversations', user?.id] });
       return conversation;
     },
   });

  // Create conversations query hook for lazy loading
  const useConversationMessages = (
    conversationId: string | null,
    page: number = 0
  ) => {
    return useQuery({
      queryKey: ['conversationMessages', conversationId, page],
      queryFn: () => {
        if (!conversationId) return null;
        return conversationService.getConversationMessages(conversationId, page, 50);
      },
      enabled: !!conversationId,
      staleTime: 1000 * 30, // 30 seconds
      refetchInterval: 3000, // Poll every 3 seconds for new messages
      refetchIntervalInBackground: true, // Continue polling even when tab is in background
    });
  };

  // Send message in conversation
  const sendMessage = useMutation({
    mutationFn: ({
      conversationId,
      content,
      attachments,
    }: {
      conversationId: string;
      content: string;
      attachments?: string[];
    }) => conversationService.sendMessage(conversationId, content, attachments),
    onSuccess: (message, { conversationId }) => {
      // Invalidate conversation messages
      queryClient.invalidateQueries({
        queryKey: ['conversationMessages', conversationId],
      });
      // Invalidate conversations list for updated timestamps
      queryClient.invalidateQueries({
        queryKey: ['conversations', user?.id],
      });
    },
  });

  // Mark conversation as read
  const markConversationAsRead = useMutation({
    mutationFn: (conversationId: string) =>
      conversationService.markConversationAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['unreadCount', user?.id],
      });
      // Invalidate messages to refetch with updated read status
      queryClient.invalidateQueries({
        queryKey: ['conversationMessages', conversationId],
      });
    },
  });

  // Block user
  const blockUser = useMutation({
    mutationFn: (conversationId: string) =>
      conversationService.blockUser(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', user?.id],
      });
    },
  });

  // Unblock user
  const unblockUser = useMutation({
    mutationFn: (conversationId: string) =>
      conversationService.unblockUser(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', user?.id],
      });
    },
  });

  return {
    // State
    conversations: conversationsData?.content || [],
    isLoading: isLoadingConversations || isPending,
    error: conversationsError,
    unreadCount: unreadCount || 0,

    // Queries
    useConversationMessages,

    // Mutations
    startConversationByEmail: startConversationByEmail.mutate,
    startConversationById: startConversationById.mutate,
    sendMessage: sendMessage.mutate,
    markConversationAsRead: markConversationAsRead.mutate,
    blockUser: blockUser.mutate,
    unblockUser: unblockUser.mutate,

    // Mutation states
    isCreating: startConversationByEmail.isPending || startConversationById.isPending,
    isSending: sendMessage.isPending,
  };
};

/**
 * Hook for fetching direct message conversations only
 */
export const useDirectMessages = (page: number = 0, size: number = 20) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['directMessages', user?.id, page],
    queryFn: () => conversationService.getConversationsByType('DIRECT_MESSAGE', page, size),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for fetching project chat conversations only
 */
export const useProjectChats = (page: number = 0, size: number = 20) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['projectChats', user?.id, page],
    queryFn: () => conversationService.getConversationsByType('PROJECT_CHAT', page, size),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for getting a specific project conversation
 */
export const useProjectConversation = (projectId: string | null) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['projectConversation', projectId],
    queryFn: () => conversationService.getProjectConversation(projectId!),
    enabled: !!projectId,
    staleTime: 1000 * 60, // 1 minute
  });

  const openProjectChat = (conversationId: string) => {
    queryClient.setQueryData(['selectedConversation'], conversationId);
  };

  return {
    conversation: data,
    isLoading,
    error,
    openProjectChat,
  };
};
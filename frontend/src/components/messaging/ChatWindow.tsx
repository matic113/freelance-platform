import React, { useState, useCallback, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageResponse, ConversationResponse } from '@/types/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatWindowProps {
  messages: MessageResponse[];
  conversation: ConversationResponse | null;
  currentUserId: string;
  isLoading?: boolean;
  onSendMessage: (content: string) => Promise<void>;
  onBack?: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isSending?: boolean;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  conversation,
  currentUserId,
  isLoading = false,
  onSendMessage,
  onBack,
  hasMore = false,
  onLoadMore,
  isSending = false,
  className,
}) => {
  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        await onSendMessage(content);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [onSendMessage]
  );

  if (!conversation) {
    return (
      <div className={cn('flex flex-col h-full bg-background items-center justify-center', className)}>
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    );
  }

  // Sort messages by creation time
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <div className="border-b bg-muted/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {conversation.type !== 'PROJECT_CHAT' && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.otherParticipantAvatar} />
              <AvatarFallback>
                {(conversation.otherParticipantName || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}

          <div>
            <div className="flex items-center gap-2">
              {conversation.type === 'PROJECT_CHAT' && conversation.projectTitle ? (
                <h2 className="font-semibold">{conversation.projectTitle} Project Chat</h2>
              ) : (
                <h2 className="font-semibold">{conversation.otherParticipantName}</h2>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {conversation.type === 'PROJECT_CHAT' 
                ? `with ${conversation.otherParticipantName}`
                : conversation.otherParticipantEmail
              }
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={sortedMessages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />

      {/* Input */}
      <MessageInput
        onSend={handleSendMessage}
        isLoading={isSending}
        disabled={isLoading}
        placeholder={`Message ${conversation.otherParticipantName}...`}
      />
    </div>
  );
};

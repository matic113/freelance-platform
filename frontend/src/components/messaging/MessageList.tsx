import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageBubble } from './MessageBubble';
import { MessageResponse } from '@/types/api';

interface MessageListProps {
  messages: MessageResponse[];
  currentUserId: string;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isLoading = false,
  onLoadMore,
  hasMore = false,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col gap-4">
        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">No messages yet. Start a conversation!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender.id === currentUserId}
            showAvatar={index === 0 || messages[index - 1]?.sender.id !== message.sender.id}
          />
        ))}

        {/* Loading skeleton */}
        {isLoading && (
          <>
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-2/3 ml-auto" />
            <Skeleton className="h-12 w-3/4" />
          </>
        )}

        {/* Scroll anchor */}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
};

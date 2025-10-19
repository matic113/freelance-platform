import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ConversationResponse } from '@/types/api';

interface ConversationListProps {
  conversations: ConversationResponse[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation?: () => void;
  isLoading?: boolean;
  totalUnread?: number;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading = false,
  totalUnread = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (conv) =>
        conv.otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.otherParticipantEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  return (
    <div className="w-full lg:w-80 bg-muted/30 border-r flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-5 w-5" />
          <h2 className="font-semibold text-lg">Messages</h2>
          {totalUnread > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {totalUnread}
            </Badge>
          )}
          {onNewConversation && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewConversation}
              className="ml-auto lg:ml-2"
              title="Start new conversation"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 mb-2 rounded-lg" />
              ))}
            </>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-muted-foreground text-center">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  'w-full p-3 rounded-lg mb-2 text-left transition-colors hover:bg-muted',
                  selectedConversationId === conversation.id && 'bg-blue-100 dark:bg-blue-950'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                    {conversation.otherParticipantAvatar ? (
                      <img
                        src={conversation.otherParticipantAvatar}
                        alt={conversation.otherParticipantName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      conversation.otherParticipantName
                        .split(' ')
                        .map((n) => n.charAt(0))
                        .join('')
                        .substring(0, 2)
                    )}
                  </div>

                  {/* Conversation info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {conversation.otherParticipantName}
                      </h3>
                      {(conversation.unreadCount ?? 0) > 0 && (
                        <Badge variant="default" className="ml-2 flex-shrink-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessagePreview}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageResponse } from '@/types/api';

interface MessageBubbleProps {
  message: MessageResponse;
  isCurrentUser: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  showAvatar = false,
}) => {
  const timestamp = new Date(message.sentAt);
  const isToday = new Date().toDateString() === timestamp.toDateString();
  const displayTime = isToday
    ? format(timestamp, 'HH:mm')
    : format(timestamp, 'MMM dd, HH:mm');

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 items-end', // <-- This is correct
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar - show on other user's messages */}
      {!isCurrentUser && showAvatar && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
          {message.sender.avatarUrl ? (
            <img
              src={message.sender.avatarUrl}
              alt={message.sender.firstName}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {message.sender.firstName.charAt(0)}
              {message.sender.lastName.charAt(0)}
            </>
          )}
        </div>
      )}

      {/* Placeholder for avatar spacing when not shown */}
      {!isCurrentUser && !showAvatar && (
        <div className="flex-shrink-0 w-8 h-8" />
      )}

      {/* Message bubble wrapper */}
      <div
        className={cn(
          'max-w-xs lg:max-w-md xl:max-w-lg',
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className="flex flex-col">
          {/* Sender name - show on group chats */}
          {!isCurrentUser && showAvatar && (
            <span className="text-xs text-muted-foreground mb-1">
              {message.sender.firstName} {message.sender.lastName}
            </span>
          )}

          {/* Message content */}
          <div
            className={cn(
              'px-4 py-2 rounded-lg break-words',
              isCurrentUser
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-muted text-foreground rounded-bl-none'
            )}
          >
            <p className="text-sm">{message.content}</p>
          </div>

          {/* Timestamp and read status */}
          <div
            className={cn(
              'flex items-center gap-1 text-xs text-muted-foreground mt-1',
              isCurrentUser ? 'justify-end' : 'justify-start'
            )}
          >
            <span>{displayTime}</span>
            {isCurrentUser && (
              <span className="flex gap-0.5">
                {message.isRead ? (
                  <>
                    <span>✓</span>
                    <span>✓</span>
                  </>
                ) : (
                  <span>✓</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

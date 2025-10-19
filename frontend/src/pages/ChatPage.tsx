import React, { useState, useCallback, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useAuth';
import { useConversations, useConversation, useSendMessage } from '@/hooks/useMessages';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useFileUpload } from '@/hooks/useFileUpload';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUploadInput } from '@/components/FileUploadInput';
import { FileAttachmentPreview } from '@/components/FileAttachmentPreview';
import { MessageCircle, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MessageResponse } from '@/types/api';
import { useSearchParams } from 'react-router-dom';
import { FileUploadResponse } from '@/services/fileUpload.service';

const ChatPage: React.FC = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    initialUserId ? parseInt(initialUserId, 10) : null
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState<FileUploadResponse | null>(null);
  
  const { data: conversationData, isLoading: conversationLoading } = useConversation(
    selectedUserId || 0,
    0,
    50
  );
  
  const sendMessage = useSendMessage();
  const { isConnected } = useWebSocket();
  const { uploadFile, isUploading, uploadProgress } = useFileUpload({
    maxFileSizeMB: 10,
    onSuccess: (file) => {
      setAttachedFile(file);
    },
  });

  // Handle file selection
  const handleFileSelected = useCallback(async (file: File) => {
    if (!selectedUserId) {
      alert('Please select a conversation first');
      return;
    }

    try {
      await uploadFile(selectedUserId.toString(), file);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  }, [selectedUserId, uploadFile]);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if ((!messageText.trim() && !attachedFile) || !selectedUserId || !currentUser) return;

    try {
      await sendMessage.mutateAsync({
        recipientId: selectedUserId.toString(),
        content: messageText.trim() || (attachedFile ? `[Attachment: ${attachedFile.originalFileName}]` : ''),
        attachments: attachedFile ? [attachedFile.objectName] : [],
      });
      setMessageText('');
      setAttachedFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [messageText, attachedFile, selectedUserId, currentUser, sendMessage]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get messages for selected conversation
  const messages = (conversationData?.content || []) as MessageResponse[];
  
  // Build a map of unique conversations with their last message
  const conversationMap = new Map<number, { userId: number; lastMessage?: MessageResponse }>();
  conversations.forEach((msg) => {
    // Convert currentUser.id (string) to number for comparison
    const currentUserId = currentUser?.id ? parseInt(currentUser.id, 10) : NaN;
    const otherId = msg.senderId === currentUserId ? msg.recipientId : msg.senderId;
    if (!conversationMap.has(otherId) || !conversationMap.get(otherId)?.lastMessage) {
      conversationMap.set(otherId, { userId: otherId, lastMessage: msg });
    }
  });

  const conversationList = Array.from(conversationMap.values());
  const selectedConversation = conversationList.find(c => c.userId === selectedUserId);

  return (
    <DashboardShell>
      <div className="h-[calc(100vh-120px)] flex gap-4 max-w-7xl mx-auto">
        {/* Conversations Sidebar */}
        <Card className="w-80 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-3">Messages</h2>
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversationsLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-2 mb-2">
                    <Skeleton className="h-16 rounded" />
                  </div>
                ))
              ) : conversationList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                conversationList.map((conv) => {
                  const lastMsg = conv.lastMessage;
                  const currentUserId = currentUser?.id ? parseInt(currentUser.id, 10) : NaN;
                  const otherPerson = lastMsg?.senderId === currentUserId 
                    ? lastMsg?.recipient 
                    : lastMsg?.sender;
                  const otherPersonName = otherPerson 
                    ? `${otherPerson.firstName || ''} ${otherPerson.lastName || ''}`.trim()
                    : 'Unknown User';
                  
                  return (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-colors mb-1 hover:bg-muted',
                        selectedUserId === conv.userId && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {otherPersonName}
                          </p>
                          <p className="text-xs opacity-70 truncate">
                            {lastMsg?.content || 'No messages'}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {selectedUserId && selectedConversation?.lastMessage ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(selectedConversation.lastMessage?.sender?.firstName?.[0] || '?').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {selectedConversation.lastMessage?.sender 
                        ? `${selectedConversation.lastMessage.sender.firstName || ''} ${selectedConversation.lastMessage.sender.lastName || ''}`.trim()
                        : selectedConversation.lastMessage?.recipient 
                        ? `${selectedConversation.lastMessage.recipient.firstName || ''} ${selectedConversation.lastMessage.recipient.lastName || ''}`.trim()
                        : 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isConnected ? '🟢 Online' : '⚪ Offline'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserId(null)}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {conversationLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
                        <Skeleton className={cn('h-10 rounded-lg', i % 2 === 0 ? 'w-48' : 'w-56')} />
                      </div>
                    ))
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Start a new conversation</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const currentUserId = currentUser?.id ? parseInt(currentUser.id, 10) : NaN;
                      const isSentByMe = msg.senderId === currentUserId;
                      
                      return (
                        <div
                          key={msg.id}
                          className={cn('flex', isSentByMe ? 'justify-end' : 'justify-start')}
                        >
                          <div
                            className={cn(
                              'max-w-xs px-4 py-2 rounded-lg',
                              isSentByMe
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted rounded-bl-none'
                            )}
                          >
                            <p className="text-sm break-words">{msg.content}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {msg.attachments.map((attachment, idx) => (
                                  <FileAttachmentPreview
                                    key={idx}
                                    objectName={attachment}
                                    originalFileName={attachment.split('/').pop() || 'File'}
                                    downloadUrl={`/api/conversations/files/${attachment}`}
                                    fileSize={0}
                                    contentType="application/octet-stream"
                                  />
                                ))}
                              </div>
                            )}
                            <p className="text-xs mt-1 opacity-70">
                              {formatDistanceToNow(new Date(msg.sentAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t space-y-2">
                {attachedFile && (
                  <div className="p-3 bg-muted rounded-lg border border-muted-foreground/20">
                    <FileAttachmentPreview
                      objectName={attachedFile.objectName}
                      originalFileName={attachedFile.originalFileName}
                      downloadUrl={attachedFile.downloadUrl}
                      fileSize={attachedFile.fileSize}
                      contentType={attachedFile.contentType}
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <FileUploadInput
                    onFileSelect={handleFileSelected}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    disabled={!selectedUserId || sendMessage.isPending}
                  />
                  <Input
                    placeholder="Type a message... (Shift+Enter for new line)"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendMessage.isPending || isUploading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!messageText.trim() && !attachedFile) || sendMessage.isPending || isUploading}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Choose a conversation from the list or start a new one
              </p>
              {!isConnected && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
                  <p className="text-xs text-yellow-700">
                    ⚠️ WebSocket connection not established. Real-time messages may not work.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
};

export default ChatPage;

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { useHideNavbarOnScroll } from "@/hooks/useHideNavbarOnScroll";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/services/admin.service";
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Archive,
  Star,
  Reply,
  Forward,
  Download,
  Eye,
  Trash2,
  Edit,
  Copy,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  FileText,
  Image,
  Film,
  File,
  X,
  Plus,
  Filter,
  SortAsc,
  SortDesc,
  MessageCircle,
  Users,
  Bell,
  BellOff,
  Pin,
  VolumeX,
  Flag,
  MoreHorizontal,
  Video
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useConversations } from "@/hooks/useConversations";
import { conversationService } from "@/services/conversation.service";
import { websocketService } from "@/services/websocket.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { fileUploadService } from "@/services/fileUpload.service";
import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserId, isMessageFromCurrentUser } from "@/services/user.service";

const getMessagePreview = (
  preview: string,
  isCurrentUserSender: boolean,
  isRTL: boolean
): string => {
  if (preview && preview.trim() !== '') {
    const maxLength = 45;
    if (preview.length > maxLength) {
      return preview.substring(0, maxLength) + ' ...';
    }
    return preview;
  }
  
  return '';
};

export default function Messages() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { user } = useAuth();
  const { toast } = useToast();
   const [searchParams, setSearchParams] = useSearchParams();
    const initialUserId = searchParams.get('userId');
    const initialConversationId = searchParams.get('conversationId');
    
    const [selectedChat, setSelectedChat] = useState<string | null>(
      initialConversationId ? initialConversationId : null
    );
    const [pendingUserId, setPendingUserId] = useState<string | null>(initialUserId);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newChatUserEmail, setNewChatUserEmail] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [replyTo, setReplyTo] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'project'>('direct');
  const fileInputRef = useRef<HTMLInputElement>(null);
   const messagesContainerRef = useRef<HTMLDivElement>(null);
   const mainContainerRef = useRef<HTMLDivElement>(null);
   const notifiedConversationsRef = useRef<Set<string>>(new Set());
   const isUserAtBottomRef = useRef(true);
   const currentUserId: string | null = getCurrentUserId(user);
   const { uploadFile, isUploading } = useFileUpload();
   const isHeaderVisible = useHideNavbarOnScroll(mainContainerRef);
   const queryClient = useQueryClient();

   // Use the new conversation hook
   const {
     conversations,
     isLoading: conversationsLoading,
     unreadCount,
     sendMessage,
     markConversationAsRead,
     useConversationMessages,
   } = useConversations();

   // Get messages for selected conversation
   const { data: messagesData, refetch: refetchMessages } = useConversationMessages(selectedChat || null);
   const messages = messagesData?.content || [];

   // WebSocket connection and real-time updates
   useEffect(() => {
     // Connect to WebSocket
     websocketService.connect().catch((error) => {
       console.error('Failed to connect to WebSocket:', error);
       toast({
         title: "Connection Error",
         description: "Failed to connect to real-time messaging. Some features may not work.",
         variant: "destructive",
       });
     });

     // Listen for incoming messages
     const handleMessage = (event: CustomEvent) => {
       const message = event.detail;
       console.log('Received message:', message);
       
       const conversationId = message.conversationId;
       
       // Check if conversation exists in current list
       const conversationExists = conversations.some(c => c.id === conversationId);
       
       if (!conversationExists) {
         queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
         queryClient.refetchQueries({ queryKey: ['conversations', user?.id] });
       }
       
       // Group notifications by conversation - only show one toast per conversation
       if (conversationId && !notifiedConversationsRef.current.has(conversationId) && selectedChat !== conversationId) {
         notifiedConversationsRef.current.add(conversationId);
         
         const conversation = conversations.find(c => c.id === conversationId);
         if (conversation) {
           toast({
             title: isRTL ? "رسالة جديدة" : "New Message",
             description: isRTL 
               ? `من ${conversation.otherParticipantName}: ${conversation.lastMessagePreview}`
               : `From ${conversation.otherParticipantName}: ${conversation.lastMessagePreview}`,
           });
         }
       }
       
       if (selectedChat) {
         refetchMessages();
       }
     };

     // Listen for read receipt updates
     const handleReadReceipt = (event: CustomEvent) => {
       console.log('Read receipt received:', event.detail);
       // Refetch messages to update read indicators
       if (selectedChat) {
         refetchMessages();
       }
     };

     window.addEventListener('websocket:message', handleMessage as EventListener);
     window.addEventListener('websocket:read-receipt', handleReadReceipt as EventListener);

     return () => {
       websocketService.disconnect();
       window.removeEventListener('websocket:message', handleMessage as EventListener);
       window.removeEventListener('websocket:read-receipt', handleReadReceipt as EventListener);
     };
    }, [toast, selectedChat, refetchMessages, conversations, isRTL, queryClient, user?.id]);

  // Clear notification tracking for current conversation when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      notifiedConversationsRef.current.delete(selectedChat);
    }
  }, [selectedChat]);

  // Mark unread messages as read when messages load
  useEffect(() => {
    if (!messages || messages.length === 0 || !selectedChat) return;

    // Find all unread messages from other users
    const unreadMessages = messages.filter(
      (msg) =>
        !msg.isRead &&
        !isMessageFromCurrentUser(msg.senderId, currentUserId)
    );

    // Mark each unread message as read
    unreadMessages.forEach((msg) => {
      conversationService.markMessageAsRead(msg.id).catch((error) => {
        console.error('Failed to mark message as read:', error);
      });
    });
  }, [messages, selectedChat, currentUserId]);

   const scrollToLastMessage = useCallback(() => {
     if (!messagesContainerRef.current || messages.length === 0) {
       return;
     }

     const container = messagesContainerRef.current;
     setTimeout(() => {
       const messageElements = container.querySelectorAll('[data-message-id]');
       if (messageElements.length > 0) {
         const lastMessage = messageElements[messageElements.length - 1];
         lastMessage.scrollIntoView({ behavior: 'auto', block: 'end' });
         isUserAtBottomRef.current = true;
       }
     }, 50);
   }, [messages.length]);

   const handleMessagesContainerScroll = useCallback(() => {
     if (!messagesContainerRef.current) return;

     const container = messagesContainerRef.current;
     const { scrollTop, scrollHeight, clientHeight } = container;
     const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
     
     isUserAtBottomRef.current = distanceFromBottom < 50;
   }, []);

   useEffect(() => {
     const container = messagesContainerRef.current;
     if (!container) return;

     container.addEventListener('scroll', handleMessagesContainerScroll);
     return () => {
       container.removeEventListener('scroll', handleMessagesContainerScroll);
     };
   }, [handleMessagesContainerScroll]);

   useEffect(() => {
     if (selectedChat && messages.length > 0 && isUserAtBottomRef.current) {
       scrollToLastMessage();
     }
   }, [messages, selectedChat, scrollToLastMessage]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedChat) return;

    setIsSendingMessage(true);
    try {
      const attachmentUrls: string[] = [];

      // Upload files if any
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const uploadResponse = await uploadFile(selectedChat, file);
            attachmentUrls.push(uploadResponse.downloadUrl);
          } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
            throw new Error(`Failed to upload file: ${file.name}`);
          }
        }
      }

      // Send message with attachments
       await sendMessage({
         conversationId: selectedChat,
         content: newMessage,
         attachments: attachmentUrls,
       });

      setNewMessage("");
      setSelectedFiles([]);
      
      // Mark conversation as read
      await markConversationAsRead(selectedChat);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

   // Handle chat selection
    const handleChatSelect = useCallback(async (conversationId: string) => {
      setSelectedChat(conversationId);
      setSearchParams({ conversationId }, { replace: true });
      isUserAtBottomRef.current = true;
      
      setTimeout(() => {
        scrollToLastMessage();
      }, 100);
      
      try {
        await markConversationAsRead(conversationId);
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    }, [scrollToLastMessage, markConversationAsRead, setSearchParams]);

   // Handle starting a conversation with a userId
    useEffect(() => {
      if (!pendingUserId || selectedChat) return;

      const startConversationWithUser = async () => {
        try {
          const conversation = await conversationService.startConversationById(pendingUserId);
          setPendingUserId(null);
          handleChatSelect(conversation.id);
        } catch (error) {
          console.error('Failed to start conversation with user:', error);
          toast({
            title: "Error",
            description: isRTL ? "فشل في بدء محادثة" : "Failed to start conversation",
            variant: "destructive",
          });
          setPendingUserId(null);
        }
      };

       startConversationWithUser();
     }, [pendingUserId, selectedChat, handleChatSelect, toast, isRTL]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Handle starting a new chat
  const handleStartNewChat = async () => {
    if (!newChatUserEmail.trim()) return;

    try {
      // Search for user by email using the secure messaging endpoint
      const response = await conversationService.searchUsersForMessaging(newChatUserEmail.trim());
      const users = response.content || [];

      if (users.length === 0) {
        toast({
          title: "Not Found",
          description: isRTL ? "لم يتم العثور على مستخدم برسالة بريد إلكترونية" : "No user found with this email",
          variant: "destructive",
        });
        return;
      }

      // Use the first matching user
      const foundUser = users[0];
      
      // Start conversation with the found user
      const conversation = await conversationService.startConversationById(foundUser.id);
      
      // Select the conversation
      handleChatSelect(conversation.id);
      setShowNewChatDialog(false);
      setNewChatUserEmail("");

      toast({
        title: "Success",
        description: isRTL ? "تم بدء محادثة جديدة" : "New chat started",
      });
    } catch (error) {
      console.error('Error searching for user:', error);
      toast({
        title: "Error",
        description: isRTL ? "حدث خطأ ما" : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };








  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    // Filter by type based on active tab
    const typeMatches = activeTab === 'direct' 
      ? conv.type === 'DIRECT_MESSAGE' 
      : conv.type === 'PROJECT_CHAT';
    
    if (!typeMatches) return false;
    
    // Filter by search term
    return (conv.otherParticipantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.otherParticipantEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.projectTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.lastMessagePreview || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get current conversation data
  const currentConversation = conversations.find(conv => conv.id === selectedChat);
  const currentMessages = messages;

  return (
    <div className={cn("min-h-screen bg-muted/30 flex flex-col", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("transition-all duration-300 ease-in-out overflow-hidden", isHeaderVisible ? "max-h-[120px]" : "max-h-0")}>
        <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
      </div>

      <main ref={mainContainerRef} className="flex-1 container mx-auto px-4 py-4 flex flex-col overflow-y-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{isRTL ? "المحادثات" : "Conversations"}</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewChatDialog(true)}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">{isRTL ? "محادثة جديدة" : "New Chat"}</span>
                  </Button>
                </div>
                
                {/* Tabs for Direct Messages and Project Chats */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'direct' | 'project')} className="w-full mb-3">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="direct" className="text-xs sm:text-sm">
                      {isRTL ? "رسائل مباشرة" : "Direct Messages"}
                    </TabsTrigger>
                    <TabsTrigger value="project" className="text-xs sm:text-sm">
                      {isRTL ? "مشاريع" : "Projects"}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {/* Search */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Input
                    placeholder={isRTL ? "البحث..." : "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                {conversationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-3 text-gray-600">
                      {isRTL ? "جاري تحميل المحادثات..." : "Loading conversations..."}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1 overflow-y-auto flex-1">
                    {filteredConversations.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          {isRTL ? "لا توجد محادثات" : "No conversations"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {isRTL ? "ابدأ محادثة جديدة" : "Start a new conversation"}
                        </p>
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => {
                         const isCurrentUserSender = conversation.otherParticipantId !== currentUserId;
                         
                         return (
                         <div
                            key={conversation.id}
                            className={cn(
                              "p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4",
                              selectedChat === conversation.id
                                ? "bg-blue-50 border-blue-500" 
                                : "border-transparent"
                            )}
                            onClick={() => handleChatSelect(conversation.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={conversation.otherParticipantAvatar} />
                                  <AvatarFallback>
                                    {(conversation.otherParticipantName || 'U').charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-sm truncate">
                                    {conversation.type === 'PROJECT_CHAT' && conversation.projectTitle
                                      ? conversation.projectTitle
                                      : conversation.otherParticipantName}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                
                                {conversation.type === 'PROJECT_CHAT' && (
                                  <p className="text-xs text-gray-500 truncate mb-1">
                                    {isRTL ? "مع" : "with"} {conversation.otherParticipantName}
                                  </p>
                                )}
                                
                                <p className="text-sm text-gray-600 truncate mb-1">
                                  {getMessagePreview(conversation.lastMessagePreview, isCurrentUserSender, isRTL)}
                                </p>
                               
                               <div className="flex items-center justify-end">
                                  {(conversation.unreadCount ?? 0) > 0 && (
                                    <Badge className="bg-blue-500 text-white text-xs">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                             </div>
                           </div>
                         </div>
                       );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] w-full flex flex-col overflow-hidden">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b pb-3 sm:pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {currentConversation?.type !== 'PROJECT_CHAT' && (
                          <Avatar className="h-8 sm:h-10 w-8 sm:w-10 flex-shrink-0">
                            <AvatarImage src={currentConversation?.otherParticipantAvatar} />
                            <AvatarFallback>
                              {(currentConversation?.otherParticipantName || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {currentConversation?.type === 'PROJECT_CHAT' && currentConversation?.projectTitle
                              ? currentConversation.projectTitle + ' Project Chat'
                              : currentConversation?.otherParticipantName || 'Unknown User'}
                          </h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 truncate">
                            <span className="text-gray-500 truncate">
                              {currentConversation?.type === 'PROJECT_CHAT'
                                ? `with ${currentConversation?.otherParticipantName}`
                                : currentConversation?.otherParticipantEmail}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto bg-white" ref={messagesContainerRef}>
                    <div className="px-3 sm:px-4 py-4 flex flex-col gap-3 sm:gap-4">
                      {conversationsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          <span className="ml-3 text-gray-600">
                            {isRTL ? "جاري تحميل الرسائل..." : "Loading messages..."}
                          </span>
                        </div>
                      ) : currentMessages.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {isRTL ? "لا توجد رسائل" : "No messages"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {isRTL ? "ابدأ المحادثة" : "Start the conversation"}
                          </p>
                        </div>
                      ) : (
                        currentMessages.map((message) => {
                          const isOwnMessage = isMessageFromCurrentUser(message.senderId, currentUserId);
                          const messageTimestamp = message.sentAt || message.readAt;
                          const formattedTime = messageTimestamp
                            ? new Date(messageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : "";

                          return (
                            <div
                              key={message.id}
                              data-message-id={message.id}
                              className={cn(
                                "flex w-full items-end gap-2 sm:gap-3",
                                isOwnMessage ? "justify-end" : "justify-start"
                              )}
                            >
                              {!isOwnMessage && (
                                <Avatar className="h-8 w-8 flex-shrink-0 hidden sm:flex">
                                  <AvatarImage src={message.sender?.avatarUrl} />
                                  <AvatarFallback>
                                    {(message.sender?.firstName || 'U').charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              <div
                                className={cn(
                                  "flex flex-col gap-1",
                                  isOwnMessage ? "items-end max-w-[85%] sm:max-w-[70%]" : "items-start max-w-[85%] sm:max-w-[70%]"
                                )}
                              >
                                 {message.content && (
                                   <div
                                     className={cn(
                                       "rounded-2xl px-4 py-2 shadow-sm word-break",
                                       isOwnMessage
                                         ? "bg-green-500 text-white"
                                         : "bg-gray-100 text-gray-900"
                                     )}
                                   >
                                     <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                                   </div>
                                 )}

                                 {message.attachments && message.attachments.length > 0 && (
                                   <div className="flex flex-col gap-2 mt-2">
                                     {message.attachments.map((attachment, idx) => {
                                       const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(attachment);
                                       const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(attachment);
                                       
                                       return (
                                         <div key={idx} className="relative">
                                           {isImage && (
                                             <a href={attachment} target="_blank" rel="noopener noreferrer" className="block max-w-xs rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                                               <img src={attachment} alt="Attachment" className="w-full h-auto object-cover max-h-64" />
                                             </a>
                                           )}
                                           {isVideo && (
                                             <video src={attachment} controls className="w-full h-auto max-w-xs rounded-lg" />
                                           )}
                                           {!isImage && !isVideo && (
                                             <a
                                               href={attachment}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               className={cn(
                                                 "flex items-center gap-2 p-2 rounded-lg max-w-xs",
                                                 isOwnMessage
                                                   ? "bg-green-600 text-white hover:bg-green-700"
                                                   : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                               )}
                                             >
                                               <Download className="h-4 w-4" />
                                               <span className="text-xs truncate">
                                                 {attachment.split('/').pop()?.split('?')[0] || 'Download'}
                                               </span>
                                             </a>
                                           )}
                                         </div>
                                       );
                                     })}
                                   </div>
                                 )}

                                 <div
                                   className={cn(
                                     "flex items-center gap-2 text-xs text-gray-500 px-2",
                                     isOwnMessage ? "justify-end" : "justify-start"
                                   )}
                                 >
                                   <span>{formattedTime}</span>
                                   {isOwnMessage && (
                                     <span className={message.isRead ? "text-blue-600 font-semibold" : "text-gray-400"}>
                                       {message.isRead ? "✓✓" : "✓"}
                                     </span>
                                   )}
                                 </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-3 sm:p-4 bg-white flex-shrink-0">
                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {isRTL ? "الملفات المحددة" : "Selected Files"}
                          </span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setSelectedFiles([])}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border text-xs sm:text-sm">
                              {getAttachmentIcon(file.type.split('/')[0])}
                              <span className="truncate max-w-[100px] sm:max-w-none">{file.name}</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-4 w-4 p-0 flex-shrink-0"
                                onClick={() => handleRemoveFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={isRTL ? "اكتب رسالة..." : "Type a message..."}
                          className="w-full h-10 px-4 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-10 w-10 p-0"
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        
                        <Button
                            size="sm"
                            onClick={handleSendMessage}
                            disabled={(!newMessage.trim() && selectedFiles.length === 0) || isSendingMessage || isUploading}
                            className="h-10 w-10 p-0"
                          >
                            {isSendingMessage || isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRTL ? "اختر محادثة" : "Select a Conversation"}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? "اختر محادثة من القائمة لبدء المراسلة"
                        : "Select a conversation from the list to start messaging"
                      }
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? "ابدأ محادثة جديدة" : "Start a New Chat"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {isRTL ? "بريد إلكتروني" : "Email Address"}
              </label>
              <Input
                placeholder={isRTL ? "أدخل البريد الإلكتروني" : "Enter email address"}
                value={newChatUserEmail}
                onChange={(e) => setNewChatUserEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleStartNewChat();
                  }
                }}
                type="email"
              />
              <p className="text-xs text-gray-500 mt-2">
                {isRTL 
                  ? "أدخل البريد الإلكتروني للشخص الذي تريد الدردشة معه"
                  : "Enter the email address of the person you want to chat with"
                }
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewChatDialog(false);
                  setNewChatUserEmail("");
                }}
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleStartNewChat}
                disabled={!newChatUserEmail.trim()}
              >
                {isRTL ? "ابدأ الدردشة" : "Start Chat"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer isRTL={isRTL} />
    </div>
  );
}
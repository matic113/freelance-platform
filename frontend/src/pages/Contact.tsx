import { useEffect, useRef, useState } from "react";
import { useLocalization } from "@/hooks/useLocalization";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Loader2, MessageCircle, ArrowLeft, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useConversations, useSendMessage } from "@/hooks/useMessages";
import { websocketService } from "@/services/websocket.service";
import { getUserInitials } from "@/services/user.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Direction = "rtl" | "ltr";

export default function Contact() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const freelancerId = searchParams.get("freelancerId");

  useEffect(() => {
    if (!freelancerId) {
      navigate("/messages");
      return;
    }
  }, [freelancerId, navigate]);

  const [inputText, setInputText] = useState("");
  const [pending, setPending] = useState(false);

  const { data: conversationsData, isLoading: conversationsLoading } =
    useConversations();
  const sendMessageMutation = useSendMessage();

  const conversations = conversationsData || [];

  const targetConversation = conversations.find(
    (conv) =>
      conv.senderId.toString() === freelancerId ||
      conv.recipientId.toString() === freelancerId
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [targetConversation]);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await websocketService.connect();
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    };

    connectWebSocket();

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const direction: Direction = isRTL ? "rtl" : "ltr";

  const messages = targetConversation ? [targetConversation] : [];

  const handleSend = async () => {
    if (!inputText.trim() || !freelancerId || !user?.id) return;

    setPending(true);

    try {
      await sendMessageMutation.mutateAsync({
        recipientId: freelancerId,
        content: inputText.trim(),
        projectId: null,
      });

      if (websocketService.isWebSocketConnected()) {
        websocketService.sendMessage("/app/chat.sendMessage", {
          recipientId: freelancerId,
          content: inputText.trim(),
        });
      }

      setInputText("");

      toast({
        title: isRTL ? "تم إرسال الرسالة" : "Message Sent",
        description: isRTL ? "تم إرسال الرسالة بنجاح" : "Message sent successfully",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: isRTL ? "خطأ في الإرسال" : "Send Error",
        description: isRTL
          ? "فشل في إرسال الرسالة"
          : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  const getOtherUserName = () => {
    if (!targetConversation) return "User";
    const isSender = targetConversation.senderId.toString() === user?.id;
    return isSender
      ? targetConversation.recipient.firstName ||
          targetConversation.recipient.firstName ||
          "Unknown"
      : targetConversation.sender.firstName ||
          targetConversation.sender.firstName ||
          "Unknown";
  };

  const getOtherUserAvatar = () => {
    if (!targetConversation) return undefined;
    const isSender = targetConversation.senderId.toString() === user?.id;
    return isSender
      ? targetConversation.recipient.avatarUrl
      : targetConversation.sender.avatarUrl;
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 flex flex-col", isRTL && "rtl")} dir={direction}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        <Card className="h-[80vh] flex flex-col shadow-lg border-0">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between bg-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <Link to="/messages">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              {conversationsLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={getOtherUserAvatar()} />
                    <AvatarFallback className="bg-gradient-to-br from-[#0A2540] to-[#0c315c] text-white">
                      {getUserInitials(
                        getOtherUserName().split(" ")[0],
                        getOtherUserName().split(" ")[1]
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {getOtherUserName()}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isRTL ? "محادثة مباشرة" : "Direct Message"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {targetConversation && (
                <Link to={`/user/${freelancerId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-[#0A2540] hover:text-white transition-colors"
                  >
                    {isRTL ? "عرض الملف الشخصي" : "View Profile"}
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"}>
                  <DropdownMenuItem
                    onClick={() => navigate("/messages")}
                  >
                    {isRTL ? "جميع الرسائل" : "All Messages"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-white space-y-4"
          >
            {conversationsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : messages.length > 0 ? (
              messages.map((m) => {
                const isMine = m.senderId.toString() === user?.id;
                const senderName = isMine ? m.sender.firstName : m.recipient.firstName;
                const senderAvatar = isMine ? m.sender.avatarUrl : m.recipient.avatarUrl;
                const isRead = m.isRead;

                return (
                  <div
                    key={m.id}
                    className={cn("flex gap-3 items-end", isMine ? "justify-end" : "justify-start")}
                  >
                    {!isMine && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={senderAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#0A2540] to-[#0c315c] text-white text-xs">
                          {getUserInitials(senderName, "")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-xs sm:max-w-sm rounded-2xl p-3 shadow-sm",
                        isMine
                          ? "bg-gradient-to-r from-[#0A2540] to-[#0c315c] text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      {m.content && (
                        <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {m.content}
                        </div>
                      )}
                      <div
                        className={cn(
                          "mt-1.5 text-xs flex items-center gap-1 justify-end",
                          isMine ? "text-white/70" : "text-gray-500"
                        )}
                      >
                        <span>{new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {isMine && (isRead ? "✓✓" : "✓")}
                      </div>
                    </div>

                    {isMine && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-[#0A2540] to-[#0c315c] text-white text-xs">
                          {getUserInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">
                  {isRTL ? "ابدأ محادثة" : "Start a Conversation"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {isRTL ? "أرسل رسالتك الأولى" : "Send your first message"}
                </p>
              </div>
            )}
          </div>

          {/* Message Composer */}
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-white rounded-b-lg">
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <Input
                placeholder={isRTL ? "اكتب رسالتك..." : "Type your message..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                dir={direction}
                className="flex-1 rounded-full border-gray-300 focus:border-[#0A2540] focus:ring-[#0A2540]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={pending}
              />
              <Button
                onClick={handleSend}
                disabled={pending || !inputText.trim() || !freelancerId}
                className="min-w-[44px] h-10 rounded-full bg-[#0A2540] text-white hover:bg-[#143861]"
                size="icon"
              >
                {pending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

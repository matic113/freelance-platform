import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { groupNotificationsByConversationId } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRTL?: boolean;
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  formatTimeAgo: (date: string) => string;
}

export const NotificationsPopover = ({
  isOpen,
  onOpenChange,
  isRTL = false,
  unreadCount,
  notifications,
  loading,
  markAsRead,
  markAllAsRead,
  formatTimeAgo,
}: NotificationsPopoverProps) => {
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={notificationButtonRef}
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-gray-100 rounded-full"
          aria-label="notifications"
        >
          <Bell className="h-5 w-5 text-[#0A2540]" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align={isRTL ? "start" : "end"}>
        <div className="notification-dropdown">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-[#0A2540]">
              {isRTL ? "الإشعارات" : "Notifications"}
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A2540] mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  {isRTL ? "جاري تحميل الإشعارات..." : "Loading notifications..."}
                </p>
              </div>
            ) : notifications.length > 0 ? (
              (() => {
                const groupedNotifications =
                  groupNotificationsByConversationId(notifications);
                return groupedNotifications.map((group) => {
                  const hasUnread = group.notifications.some((n) => !n.isRead);
                  return (
                    <div
                      key={group.conversationId}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        hasUnread ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        navigate(
                          `/messages?conversationId=${group.conversationId}`
                        );
                        onOpenChange(false);
                        group.notifications.forEach((n) => {
                          if (!n.isRead) {
                            markAsRead(n.id);
                          }
                        });
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            hasUnread ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-medium text-sm text-[#0A2540] truncate">
                              {group.latestNotification.title}
                            </h4>
                            {group.count > 1 && (
                              <Badge variant="secondary" className="ml-auto flex-shrink-0">
                                {group.count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {group.latestNotification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(
                              group.latestNotification.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">
                  {isRTL ? "لا توجد إشعارات جديدة" : "No new notifications"}
                </p>
              </div>
            )}
          </div>
          <div className="p-3 border-t text-center">
            <div className="flex gap-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#0A2540]"
                onClick={() => navigate("/notifications")}
              >
                {isRTL ? "عرض جميع الإشعارات" : "View All Notifications"}
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#0A2540]"
                  onClick={markAllAsRead}
                >
                  {isRTL ? "تمييز الكل كمقروء" : "Mark All Read"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  CheckCircle, 
  XCircle,
  DollarSign,
  MessageCircle,
  FileText,
  User,
  Clock,
  AlertCircle,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { Notification } from '@/types/contract';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
  notification: Notification;
  isRTL?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAsUnread?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isRTL = false,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal_received':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'proposal_accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'proposal_rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'payment_requested':
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
      case 'payment_approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'payment_rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'milestone_completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'contract_created':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'message_received':
        return <MessageCircle className="h-5 w-5 text-indigo-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationTypeText = (type: string) => {
    const typeMap = {
      proposal_received: isRTL ? 'عرض جديد' : 'New Proposal',
      proposal_accepted: isRTL ? 'عرض مقبول' : 'Proposal Accepted',
      proposal_rejected: isRTL ? 'عرض مرفوض' : 'Proposal Rejected',
      payment_requested: isRTL ? 'طلب دفع' : 'Payment Requested',
      payment_approved: isRTL ? 'دفع موافق عليه' : 'Payment Approved',
      payment_rejected: isRTL ? 'دفع مرفوض' : 'Payment Rejected',
      milestone_completed: isRTL ? 'مرحلة مكتملة' : 'Milestone Completed',
      contract_created: isRTL ? 'عقد جديد' : 'Contract Created',
      message_received: isRTL ? 'رسالة جديدة' : 'New Message'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <Card className={cn(
      "hover:shadow-md transition-all duration-300",
      !notification.isRead && "border-l-4 border-l-blue-500 bg-blue-50/30"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-[#0A2540]">
                    {notification.title}
                  </h4>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {getNotificationTypeText(notification.type)}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                {notification.isRead ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onMarkAsUnread?.(notification.id)}
                    className="h-8 w-8 p-0"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onMarkAsRead?.(notification.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete?.(notification.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface NotificationCenterProps {
  notifications: Notification[];
  isRTL?: boolean;
  onMarkAllAsRead?: () => void;
  onDeleteAll?: () => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAsUnread?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isRTL = false,
  onMarkAllAsRead,
  onDeleteAll,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>
              {isRTL ? 'مركز الإشعارات' : 'Notification Center'}
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onMarkAllAsRead}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isRTL ? 'تعيين الكل كمقروء' : 'Mark All Read'}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={onDeleteAll}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'حذف الكل' : 'Delete All'}
            </Button>
          </div>
        </div>
        
        <CardDescription>
          {isRTL 
            ? `لديك ${notifications.length} إشعار، ${unreadCount} غير مقروء`
            : `You have ${notifications.length} notifications, ${unreadCount} unread`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isRTL ? 'لا توجد إشعارات' : 'No Notifications'}
            </h3>
            <p className="text-gray-500">
              {isRTL 
                ? 'ستظهر الإشعارات الجديدة هنا'
                : 'New notifications will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isRTL={isRTL}
                onMarkAsRead={onMarkAsRead}
                onMarkAsUnread={onMarkAsUnread}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface NotificationBellProps {
  notifications: Notification[];
  isRTL?: boolean;
  onOpen?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  isRTL = false,
  onOpen
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onOpen}
      className="relative"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NotificationResponse } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GroupedNotification {
  conversationId: string;
  count: number;
  notifications: NotificationResponse[];
  latestNotification: NotificationResponse;
  senderId?: string;
  senderName?: string;
}

export function groupNotificationsByConversationId(
  notifications: NotificationResponse[]
): GroupedNotification[] {
  const grouped: Record<string, GroupedNotification> = {};

  notifications.forEach((notification) => {
    let conversationId: string | undefined;
    let senderId: string | undefined;
    let groupKey: string = notification.id;

    try {
      if (notification.data) {
        const parsedData = JSON.parse(notification.data);
        conversationId = parsedData.conversationId;
        senderId = parsedData.senderId;
      }
    } catch (error) {
      console.error("Error parsing notification data:", error);
    }

    if (conversationId) {
      groupKey = conversationId;
    } else {
      groupKey = notification.type;
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        conversationId: conversationId || notification.type,
        count: 0,
        notifications: [],
        latestNotification: notification,
        senderId,
      };
    }
    grouped[groupKey].notifications.push(notification);
    grouped[groupKey].count++;
    grouped[groupKey].latestNotification = notification;
  });

  return Object.values(grouped).sort(
    (a, b) =>
      new Date(b.latestNotification.createdAt).getTime() -
      new Date(a.latestNotification.createdAt).getTime()
  );
}

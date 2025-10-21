import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NotificationResponse, User, UserType } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasRole(user: User | null | undefined, role: UserType): boolean {
  if (!user) return false;
  return user.roles?.includes(role) || user.activeRole === role;
}

export function isClient(user: User | null | undefined): boolean {
  return hasRole(user, UserType.CLIENT);
}

export function isFreelancer(user: User | null | undefined): boolean {
  return hasRole(user, UserType.FREELANCER);
}

export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, UserType.ADMIN);
}

export function getUserTypeString(user: User | null | undefined): 'client' | 'freelancer' | 'admin' | null {
  if (!user) return null;
  if (user.activeRole === UserType.FREELANCER || user.roles?.includes(UserType.FREELANCER)) return 'freelancer';
  if (user.activeRole === UserType.CLIENT || user.roles?.includes(UserType.CLIENT)) return 'client';
  if (user.activeRole === UserType.ADMIN || user.roles?.includes(UserType.ADMIN)) return 'admin';
  return null;
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

export function getRoleBadgeClass(role: string): string {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'CLIENT':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'FREELANCER':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusBadgeClass(status: boolean | string): string {
  if (typeof status === 'boolean') {
    return status
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  }

  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'INACTIVE':
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'FAILED':
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHeaderNotifications } from "@/hooks/useHeaderNotifications";

export const useHeaderState = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNotificationsOpen, setIsMobileNotificationsOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { user, isAuthenticated, logout, login, register, activeRole, refreshUser } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading, 
    markAsRead, 
    markAllAsRead, 
    formatTimeAgo 
  } = useHeaderNotifications();

  useEffect(() => {
    document.documentElement.style.paddingTop = '64px';
    return () => {
      document.documentElement.style.paddingTop = '';
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
    setDropdownTimeout(timeout);
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    isMobileNotificationsOpen,
    setIsMobileNotificationsOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    handleMouseEnter,
    handleMouseLeave,
    user,
    isAuthenticated,
    logout,
    login,
    register,
    activeRole,
    refreshUser,
    notifications,
    unreadCount,
    notificationsLoading,
    markAsRead,
    markAllAsRead,
    formatTimeAgo,
  };
};

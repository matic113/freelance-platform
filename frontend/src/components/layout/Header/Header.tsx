import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useHeaderScroll } from "./useHeaderScroll";
import { useHeaderState } from "./useHeaderState";
import { config } from "@/config/env";
import { UserType } from "@/types/api";
import { useEffect } from "react";
import { HeaderDesktop } from "./HeaderDesktop";
import { HeaderMobile } from "./HeaderMobile";

const ADMIN_ROLES: UserType[] = [UserType.ADMIN];

const resolveDashboardPath = (role: UserType | null | undefined): string => {
  if (!role) return "/";
  if (role === UserType.FREELANCER) return "/freelancer-dashboard";
  if (role === UserType.CLIENT) return "/client-dashboard";
  if (ADMIN_ROLES.includes(role)) return "/admin-dashboard";
  return "/";
};

interface HeaderProps {
  isRTL?: boolean;
  onLanguageToggle?: () => void;
}

export const Header = ({ isRTL = false, onLanguageToggle }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isHeaderHidden } = useHeaderScroll();
  const {
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
    activeRole,
    notifications,
    unreadCount,
    notificationsLoading,
    markAsRead,
    markAllAsRead,
    formatTimeAgo,
  } = useHeaderState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("login") === "true" && !isAuthenticated) {
      window.dispatchEvent(new CustomEvent("auth:open-login"));
      const fromPage = urlParams.get("from");
      const newUrl = fromPage
        ? `${location.pathname}?from=${encodeURIComponent(fromPage)}`
        : location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, isAuthenticated, navigate, location.pathname]);

  const effectiveRole = useMemo<UserType | null>(() => {
    if (!user?.roles) return null;
    if (activeRole && user.roles.includes(activeRole)) return activeRole;
    if (user.activeRole && user.roles.includes(user.activeRole))
      return user.activeRole;
    return user.roles[0] ?? null;
  }, [user?.roles, user?.activeRole, activeRole]);

  const dashboardPath = resolveDashboardPath(effectiveRole);
  const isAdminView = effectiveRole
    ? ADMIN_ROLES.includes(effectiveRole)
    : false;

  const getAvatarUrl = (avatarUrl: string | undefined): string => {
    if (!avatarUrl) return "";
    if (avatarUrl.startsWith("http")) return avatarUrl;
    const baseUrl = config.apiBaseUrl.replace("/api", "");
    return `${baseUrl}${avatarUrl}`;
  };

  const userData = user
    ? {
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email,
        avatar: user.avatarUrl
          ? getAvatarUrl(user.avatarUrl)
          : ADMIN_ROLES.includes(effectiveRole ?? UserType.CLIENT)
            ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop&crop=face"
            : effectiveRole === UserType.FREELANCER
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        initials: `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase(),
        roles: user.roles,
        viewRole: effectiveRole,
        dashboardPath,
      }
    : null;

  const textColor = "#0A2540";

  const handleLogout = async () => {
    try {
      await logout();
      // Stay on current page after logout, don't navigate
      // User can manually navigate where they want
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={cn(
        "bg-white/95 backdrop-blur-sm border-b border-border fixed top-0 z-50 shadow-soft w-full transition-transform duration-300",
        isHeaderHidden ? "-translate-y-full" : "translate-y-0",
        isRTL && "rtl text-right"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
           <Link
               to="/"
               className="flex items-center h-16 hover:opacity-80 transition-opacity"
             >
               <img 
                 src="/Freint-Logo.png" 
                 alt="Freint Logo" 
                 className="h-10 w-auto object-contain"
               />
             </Link>
          </div>

          <HeaderDesktop
            textColor={textColor}
            isRTL={isRTL}
            onLanguageToggle={onLanguageToggle}
            isAuthenticated={isAuthenticated}
            userData={userData}
            effectiveRole={effectiveRole}
            isAdminView={isAdminView}
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
            unreadCount={unreadCount}
            notifications={notifications}
            notificationsLoading={notificationsLoading}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
            formatTimeAgo={formatTimeAgo}
            isDropdownOpen={isDropdownOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onLogout={handleLogout}
          />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded focus:outline-none transition-colors"
            style={{
              color: isMobileMenuOpen ? "#0A2540" : textColor,
            }}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <HeaderMobile
          isRTL={isRTL}
          onLanguageToggle={onLanguageToggle}
          isAuthenticated={isAuthenticated}
          userData={userData}
          effectiveRole={effectiveRole}
          isAdminView={isAdminView}
          isMobileMenuOpen={isMobileMenuOpen}
          isDropdownOpen={isDropdownOpen}
          isMobileNotificationsOpen={isMobileNotificationsOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          setIsMobileNotificationsOpen={setIsMobileNotificationsOpen}
          unreadCount={unreadCount}
          notifications={notifications}
          notificationsLoading={notificationsLoading}
          markAsRead={markAsRead}
          formatTimeAgo={formatTimeAgo}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

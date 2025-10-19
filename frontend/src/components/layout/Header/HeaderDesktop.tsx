import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AuthDialogs from "@/components/auth/AuthDialogs";
import { NotificationsPopover } from "./NotificationsPopover";
import { UserDropdown } from "./UserDropdown";
import { WhyAhmedDropdown } from "./WhyAhmedDropdown";
import { HeaderRoleSwitcher } from "@/components/HeaderRoleSwitcher";
import { UserType } from "@/types/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface HeaderDesktopProps {
  textColor: string;
  isRTL?: boolean;
  onLanguageToggle?: () => void;
  isAuthenticated: boolean;
  userData: {
    name: string;
    email: string;
    avatar: string;
    initials: string;
    dashboardPath: string;
  } | null;
  effectiveRole: UserType | null;
  isAdminView: boolean;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  unreadCount: number;
  notifications: Notification[];
  notificationsLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  formatTimeAgo: (date: string) => string;
  isDropdownOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLogout: () => void;
}

export const HeaderDesktop = ({
  textColor,
  isRTL = false,
  onLanguageToggle,
  isAuthenticated,
  userData,
  effectiveRole,
  isAdminView,
  isNotificationOpen,
  setIsNotificationOpen,
  unreadCount,
  notifications,
  notificationsLoading,
  markAsRead,
  markAllAsRead,
  formatTimeAgo,
  isDropdownOpen,
  onMouseEnter,
  onMouseLeave,
  onLogout,
}: HeaderDesktopProps) => {
  return (
    <>
      <nav
        className={cn(
          "hidden md:flex items-center space-x-8 rtl:space-x-reverse",
          isRTL ? "mr-8" : "ml-8"
        )}
      >
        <WhyAhmedDropdown
          isOpen={isDropdownOpen}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          isRTL={isRTL}
          textColor={textColor}
        />

        <Link
          to="/projects"
          className="font-medium hover:opacity-80"
          style={{ color: textColor }}
        >
          {isRTL ? "المشاريع" : "Projects"}
        </Link>

        {["/freelancers", "/about", "/contact-us"].map((path, idx) => {
          const labels = isRTL
            ? ["المستقلون", "حولنا", "تواصل معنا"]
            : ["Freelancers", "About", "Contact Us"];
          return (
            <Link
              key={path}
              to={path}
              className="font-medium hover:opacity-80"
              style={{ color: textColor }}
            >
              {labels[idx]}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center space-x-4 rtl:space-x-reverse relative">
        <div className="hidden md:flex items-center rtl:space-x-reverse gap-3">
          {isAuthenticated && userData ? (
            <>
              <HeaderRoleSwitcher isRTL={isRTL} />
              <UserDropdown
                user={userData}
                effectiveRole={effectiveRole}
                isAdminView={isAdminView}
                onLogout={onLogout}
                isRTL={isRTL}
              />
              <NotificationsPopover
                isOpen={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
                isRTL={isRTL}
                unreadCount={unreadCount}
                notifications={notifications}
                loading={notificationsLoading}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                formatTimeAgo={formatTimeAgo}
              />
            </>
          ) : (
            <>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("auth:open-login"))}
                className="w-full rounded-full border border-[#0A2540] text-[#0A2540] bg-white font-medium hover:bg-[#0A2540] hover:text-white hover:border-[#0A2540] hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {isRTL ? "تسجيل الدخول" : "Sign In"}
              </Button>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("auth:open-register"))}
                className="w-full rounded-full bg-[#0A2540] text-white font-semibold hover:bg-[#142b52] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                {isRTL ? "إنشاء حساب" : "Sign Up"}
              </Button>
              <AuthDialogs isRTL={isRTL} />
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onLanguageToggle}
            className="hidden md:flex items-center gap-2 px-2 py-1 font-medium hover:bg-transparent"
            style={{ color: textColor }}
            title={isRTL ? "اللغة" : "Language"}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">{isRTL ? "AR" : "EN"}</span>
          </Button>
        </div>
      </div>
    </>
  );
};

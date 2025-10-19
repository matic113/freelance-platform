import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Globe,
  Bell,
  User,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AuthDialogs from "@/components/auth/AuthDialogs";
import { UserType } from "@/types/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface HeaderMobileProps {
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
  isMobileMenuOpen: boolean;
  isDropdownOpen: boolean;
  isMobileNotificationsOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  setIsMobileNotificationsOpen: (open: boolean) => void;
  unreadCount: number;
  notifications: Notification[];
  notificationsLoading: boolean;
  markAsRead: (id: string) => void;
  formatTimeAgo: (date: string) => string;
  onLogout: () => void;
}

export const HeaderMobile = ({
  isRTL = false,
  onLanguageToggle,
  isAuthenticated,
  userData,
  effectiveRole,
  isAdminView,
  isMobileMenuOpen,
  isDropdownOpen,
  isMobileNotificationsOpen,
  setIsDropdownOpen,
  setIsMobileNotificationsOpen,
  unreadCount,
  notifications,
  notificationsLoading,
  markAsRead,
  formatTimeAgo,
  onLogout,
}: HeaderMobileProps) => {
  const navigate = useNavigate();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="md:hidden max-h-[calc(100vh-80px)] overflow-y-auto border-t border-gray-200 animate-fade-in bg-white shadow-lg">
      <div className="px-4 py-6">
        {isAuthenticated && userData ? (
          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#0A2540] to-[#1a3a5c] rounded-xl text-white mb-4">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-white text-[#0A2540] font-semibold">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-white">{userData.name}</p>
                <p className="text-sm text-white/80">{userData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-white/80">
                    {isRTL ? "متصل" : "Online"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <Link to={userData.dashboardPath}>
                <Button
                  className="w-full justify-start bg-gray-50 hover:bg-[#0A2540]/10 hover:text-[#0A2540] text-[#0A2540]"
                  variant="ghost"
                >
                  <User className="mr-2 h-4 w-4" />
                  {isRTL ? "لوحة التحكم" : "Dashboard"}
                </Button>
              </Link>
              <Link to="/messages">
                <Button
                  className="w-full justify-start bg-gray-50 hover:bg-[#0A2540]/10 hover:text-[#0A2540] text-[#0A2540]"
                  variant="ghost"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {isRTL ? "الرسائل" : "Messages"}
                </Button>
              </Link>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div
                className="flex items-center justify-between mb-3 cursor-pointer"
                onClick={() => setIsMobileNotificationsOpen(!isMobileNotificationsOpen)}
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#0A2540]" />
                  <span className="font-medium text-[#0A2540]">
                    {isRTL ? "الإشعارات" : "Notifications"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0A2540] transition-transform ${
                      isMobileNotificationsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {isMobileNotificationsOpen && (
                <div className="space-y-2 max-h-32 overflow-y-auto animate-fade-in">
                  {notificationsLoading ? (
                    <div className="p-3 text-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A2540] mx-auto"></div>
                      <p className="text-xs text-gray-500 mt-1">
                        {isRTL ? "جاري التحميل..." : "Loading..."}
                      </p>
                    </div>
                  ) : notifications.length > 0 ? (
                    <>
                      {notifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg text-sm border cursor-pointer ${
                            !notification.isRead
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white border-gray-200"
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                !notification.isRead
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-[#0A2540] text-xs">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {notifications.length > 3 && (
                        <div className="text-center pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-[#0A2540] hover:bg-[#0A2540]/5 hover:text-[#0A2540]"
                            onClick={() => navigate("/notifications")}
                          >
                            {isRTL
                              ? "عرض جميع الإشعارات"
                              : "View All Notifications"}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      <p className="text-xs">
                        {isRTL ? "لا توجد إشعارات جديدة" : "No new notifications"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {isRTL ? "تسجيل الدخول" : "Authentication"}
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("auth:open-login"))}
                className="w-full rounded-lg border border-[#0A2540] text-[#0A2540] bg-white font-medium hover:bg-[#0A2540] hover:text-white transition-colors"
              >
                {isRTL ? "تسجيل الدخول" : "Sign In"}
              </Button>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("auth:open-register"))}
                className="w-full rounded-lg bg-[#0A2540] text-white font-semibold hover:bg-[#1a3a5c] transition-colors"
              >
                {isRTL ? "إنشاء حساب" : "Sign Up"}
              </Button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {isRTL ? "التنقل" : "Navigation"}
          </h3>
          <nav className="space-y-1">
            <div className="mb-2">
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full px-3 py-3 font-medium text-left text-[#0A2540] hover:bg-[#0A2540]/5 hover:text-[#0A2540] rounded-lg transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-[#0A2540]/10 rounded">
                    <Settings className="w-4 h-4 text-[#0A2540]" />
                  </div>
                  {isRTL ? "لماذا أحمد" : "Why Ahmed"}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#0A2540] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isDropdownOpen && (
                <div className="ml-8 mt-2 space-y-1 animate-fade-in">
                  {[
                    { path: "/success-stories", label: isRTL ? "قصص النجاح" : "Success Stories" },
                    { path: "/client-experiences", label: isRTL ? "تجارب العملاء" : "Client Experiences" },
                    { path: "/reviews", label: isRTL ? "تقييمات" : "Reviews" },
                    { path: "/how-to-hire", label: isRTL ? "كيفية التوظيف" : "How to Hire" },
                    { path: "/how-to-find-work", label: isRTL ? "كيفية العثور على عمل" : "How to Find Work" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block py-2 px-3 text-sm text-gray-600 hover:text-[#0A2540] hover:bg-[#0A2540]/5 rounded-md transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { path: "/projects", label: isRTL ? "المشاريع" : "Projects", icon: FileText },
              { path: "/freelancers", label: isRTL ? "المستقلون" : "Freelancers", icon: User },
              { path: "/about", label: isRTL ? "حولنا" : "About", icon: Settings },
              { path: "/contact-us", label: isRTL ? "تواصل معنا" : "Contact Us", icon: MessageCircle },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-3 text-[#0A2540] hover:bg-[#0A2540]/5 hover:text-[#0A2540] rounded-lg transition-colors"
              >
                <div className="p-1 bg-[#0A2540]/10 rounded">
                  <item.icon className="w-4 h-4 text-[#0A2540]" />
                </div>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {isAuthenticated && !isAdminView && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {isRTL ? "الحساب" : "Account"}
            </h3>
            <div className="space-y-1">
              {[
                { path: "/profile", label: isRTL ? "الملف الشخصي" : "Profile", icon: User },
                { path: "/projects", label: isRTL ? "المشاريع" : "Projects", icon: FileText },
                { path: "/settings", label: isRTL ? "الإعدادات" : "Settings", icon: Settings },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-[#0A2540] hover:bg-[#0A2540]/5 rounded-lg transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {isRTL ? "اللغة" : "Language"}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onLanguageToggle}
            className="flex items-center gap-3 px-3 py-3 text-[#0A2540] border-gray-200 hover:bg-[#0A2540]/5 hover:text-[#0A2540] rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4 text-[#0A2540]" />
            <span className="text-sm font-medium">
              {isRTL ? "العربية" : "English"}
            </span>
            <span className="text-xs bg-[#0A2540] text-white px-2 py-1 rounded-full">
              {isRTL ? "AR" : "EN"}
            </span>
          </Button>
        </div>

        {isAuthenticated && (
          <div className="border-t border-gray-200 pt-4">
            <Button
              onClick={onLogout}
              className="w-full rounded-lg border border-red-200 text-red-600 bg-red-50 font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isRTL ? "تسجيل الخروج" : "Logout"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

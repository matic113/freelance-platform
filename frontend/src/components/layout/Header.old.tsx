import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  Menu,
  Bell,
  Globe,
  ChevronDown,
  X,
  User,
  Settings,
  LogOut,
  MessageCircle,
  FileText,
  HelpCircle,
  Send,
  Star,
  Shield,
  Users,
} from "lucide-react";
import { cn, groupNotificationsByConversationId } from "@/lib/utils";
import { HeaderRoleSwitcher } from "@/components/HeaderRoleSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types/api";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { config } from "@/config/env";
import { useHeaderNotifications } from "@/hooks/useHeaderNotifications";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthDialogs from "@/components/auth/AuthDialogs";

const ADMIN_ROLES: UserType[] = [
  UserType.ADMIN,
];

const resolveDashboardPath = (role: UserType | null | undefined): string => {
  if (!role) {
    return "/";
  }

  if (role === UserType.FREELANCER) {
    return "/freelancer-dashboard";
  }

  if (role === UserType.CLIENT) {
    return "/client-dashboard";
  }

  if (ADMIN_ROLES.includes(role)) {
    return "/admin-dashboard";
  }

  return "/";
};

interface HeaderProps {
  isRTL?: boolean;
  onLanguageToggle?: () => void;
}

export const Header = ({ isRTL = false, onLanguageToggle }: HeaderProps) => {
   const location = useLocation();
   const navigate = useNavigate();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isMobileNotificationsOpen, setIsMobileNotificationsOpen] = useState(false);
   const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
   const [isHeaderHidden, setIsHeaderHidden] = useState(false);
   const lastScrollYRef = useRef(0);
   const notificationButtonRef = useRef<HTMLButtonElement>(null);
   // Auth dialogs/state moved to AuthDialogs component (use global events to open)
   
   // Use AuthContext instead of local state
   const { user, isAuthenticated, logout, login, register, activeRole, refreshUser } = useAuth();

   const handleScroll = useCallback(() => {
     const currentScrollY = window.scrollY;
     if (currentScrollY > 100) {
       if (currentScrollY > lastScrollYRef.current) {
         setIsHeaderHidden(true);
       } else {
         setIsHeaderHidden(false);
       }
     } else {
       setIsHeaderHidden(false);
     }
     lastScrollYRef.current = currentScrollY;
   }, []);

   useEffect(() => {
     window.addEventListener('scroll', handleScroll);
     document.body.style.paddingTop = '64px';
     return () => {
       window.removeEventListener('scroll', handleScroll);
       document.body.style.paddingTop = '';
     };
   }, [handleScroll]);
  
  // Use real notifications
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading, 
    markAsRead, 
    markAllAsRead, 
    formatTimeAgo 
  } = useHeaderNotifications();

  // Auth dialog behavior (OTP resend cooldown, verification etc) is handled inside AuthDialogs

  // Check for login query parameter and open login modal via global event
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('login') === 'true' && !isAuthenticated) {
      // Dispatch global event so AuthDialogs (rendered in this header) will open the login dialog
      window.dispatchEvent(new CustomEvent('auth:open-login'));
      // Clean up the URL by removing only the login parameter, keep the from parameter
      const fromPage = urlParams.get('from');
      const newUrl = fromPage ? `${location.pathname}?from=${encodeURIComponent(fromPage)}` : location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, isAuthenticated, navigate, location.pathname]);
  

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const effectiveRole = useMemo<UserType | null>(() => {
    if (!user?.roles) {
      return null;
    }

    if (activeRole && user.roles.includes(activeRole)) {
      return activeRole;
    }

    if (user.activeRole && user.roles.includes(user.activeRole)) {
      return user.activeRole;
    }

    return user.roles[0] ?? null;
  }, [user?.roles, user?.activeRole, activeRole]);

  const dashboardPath = resolveDashboardPath(effectiveRole);
  const isAdminView = effectiveRole ? ADMIN_ROLES.includes(effectiveRole) : false;

  // Helper function to get full avatar URL (same as profile page)
  const getAvatarUrl = (avatarUrl: string | undefined): string => {
    if (!avatarUrl) return '';
    
    if (avatarUrl.startsWith('http')) {
      return avatarUrl;
    }
    
    // Remove /api from the base URL since avatar URLs are served directly
    const baseUrl = config.apiBaseUrl.replace('/api', '');
    return `${baseUrl}${avatarUrl}`;
  };

  const userData = user
    ? {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        avatar: user.avatarUrl
          ? getAvatarUrl(user.avatarUrl)
          : ADMIN_ROLES.includes(effectiveRole ?? UserType.CLIENT)
            ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop&crop=face"
            : effectiveRole === UserType.FREELANCER
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        initials: `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase(),
        roles: user.roles,
        viewRole: effectiveRole,
        dashboardPath,
      }
    : null;

  const textColor = "#0A2540";

  // Handle dropdown hover with delay
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
    }, 150); // 150ms delay
    setDropdownTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      // Prevent scroll on touch devices
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
   }, [isMobileMenuOpen]);

   // Auth handlers have been moved to AuthDialogs component; header only dispatches events to open dialogs

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to home even if logout fails
      navigate('/');
    }
  };

  const whyAhmedMegaMenu = [
    {
      category: isRTL ? "قصص وتجارب" : "Stories & Experiences",
      links: [
        { text: isRTL ? "قصص النجاح" : "Success Stories", path: "/success-stories" },
        { text: isRTL ? "تجارب العملاء" : "Client Experiences", path: "/client-experiences" },
        { text: isRTL ? "تقييمات" : "Reviews", path: "/reviews" },
      ],
    },
    {
      category: isRTL ? "الإرشادات" : "Guides",
      links: [
        { text: isRTL ? "كيفية التوظيف" : "How to Hire", path: "/how-to-hire" },
        { text: isRTL ? "كيفية العثور على عمل" : "How to Find Work", path: "/how-to-find-work" },
      ],
    },
  ];



  return (
    <>
    <header
      className={cn(
        "bg-white/95 backdrop-blur-sm border-b border-border fixed top-0 z-50 shadow-soft w-full transition-transform duration-300",
        isHeaderHidden ? "-translate-y-full" : "translate-y-0",
        isRTL && "rtl text-right"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link
              to="/"
              className="text-2xl font-bold tracking-wide"
              style={{ color: textColor }}
            >
              {isRTL ? "أحمد" : "AhmedMA"}
            </Link>
          </div>

          <nav
            className={cn(
              "hidden md:flex items-center space-x-8 rtl:space-x-reverse",
              isRTL ? "mr-8" : "ml-8"
            )}
          >
   {/* Why Ahmed Dropdown */}
<div
  className="relative font-medium transition-colors cursor-pointer"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  <div
    className="flex items-center gap-1 font-medium hover:opacity-80"
    style={{ color: textColor }}
  >
    {isRTL ? "لماذا أحمد" : "Why Ahmed"}
    <ChevronDown className="w-4 h-4" stroke={textColor} />
  </div>

  {/* Dropdown */}
  {isDropdownOpen && (
    <div
      className={cn(
         "absolute top-full mt-2 w-[400px] bg-white border border-border rounded-md z-50 shadow-xl p-6 grid grid-cols-2 gap-6 animate-fade-in",
        isRTL ? "right-0 text-right" : "left-0 text-left"
      )}
    >
      {whyAhmedMegaMenu.map((section, idx) => (
        <div key={idx}>
          <h4 className="font-semibold mb-2 text-[#0A2540]">{section.category}</h4>
          <ul className="space-y-2 leading-relaxed">
            {section.links.map((link, i) => (
              <li key={i}>
                <Link
                  to={link.path}
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )}
</div>




            {/* Projects Link */}
  <Link
    to="/projects"
              className="font-medium hover:opacity-80"
    style={{ color: textColor }}
  >
    {isRTL ? "المشاريع" : "Projects"}
  </Link>



            {/* Other Navigation Links */}
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

          {/* Right Section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse relative">
            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center rtl:space-x-reverse gap-3">
              {isAuthenticated && userData ? (
                <>
                  <HeaderRoleSwitcher isRTL={isRTL} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userData.avatar} alt={userData.name} />
                          <AvatarFallback className="bg-[#0A2540] text-white text-sm">{userData.initials}</AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block text-left">
                          <p className="text-sm font-medium text-[#0A2540]">{userData.name}</p>
                          <p className="text-xs text-gray-500">{userData.email}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{userData.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={userData.dashboardPath} className="flex items-center"><User className="mr-2 h-4 w-4" /><span>{isRTL ? 'لوحة التحكم' : 'Dashboard'}</span></Link>
                      </DropdownMenuItem>
                      {isAdminView && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to="/admin-dashboard" className="flex items-center"><Shield className="mr-2 h-4 w-4" /><span>{isRTL ? 'لوحة الإدارة' : 'Admin Dashboard'}</span></Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/admin/users" className="flex items-center"><Users className="mr-2 h-4 w-4" /><span>{isRTL ? 'إدارة المستخدمين' : 'User Management'}</span></Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center"><User className="mr-2 h-4 w-4" /><span>{isRTL ? 'الملف الشخصي' : 'Profile'}</span></Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/messages" className="flex items-center"><MessageCircle className="mr-2 h-4 w-4" /><span>{isRTL ? 'الرسائل' : 'Messages'}</span></Link>
                      </DropdownMenuItem>
                      {!isAdminView && (
                        <>
                          <DropdownMenuItem asChild><Link to="/projects" className="flex items-center"><FileText className="mr-2 h-4 w-4" /><span>{isRTL ? 'المشاريع' : 'Projects'}</span></Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to="/contracts" className="flex items-center"><FileText className="mr-2 h-4 w-4" /><span>{isRTL ? 'العقود' : 'Contracts'}</span></Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to="/proposals" className="flex items-center"><Send className="mr-2 h-4 w-4" /><span>{isRTL ? 'العروض' : 'Proposals'}</span></Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to="/reviews" className="flex items-center"><Star className="mr-2 h-4 w-4" /><span>{isRTL ? 'التقييمات' : 'Reviews'}</span></Link></DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem asChild><Link to="/notifications" className="flex items-center"><Bell className="mr-2 h-4 w-4" /><span>{isRTL ? 'الإشعارات' : 'Notifications'}</span></Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/settings" className="flex items-center"><Settings className="mr-2 h-4 w-4" /><span>{isRTL ? 'الإعدادات' : 'Settings'}</span></Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/help" className="flex items-center"><HelpCircle className="mr-2 h-4 w-4" /><span>{isRTL ? 'المساعدة' : 'Help'}</span></Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /><span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Notifications button and dropdown kept as-is */}
                    <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                      <PopoverTrigger asChild>
                        <Button ref={notificationButtonRef} variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100 rounded-full" aria-label="notifications">
                          <Bell className="h-5 w-5 text-[#0A2540]" />
                          {unreadCount > 0 && (<Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">{unreadCount}</Badge>)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align={isRTL ? "start" : "end"}>
                        <div className="notification-dropdown">
                          <div className="p-4 border-b"><h3 className="font-semibold text-[#0A2540]">{isRTL ? 'الإشعارات' : 'Notifications'}</h3></div>
                          <div className="max-h-96 overflow-y-auto">
                            {notificationsLoading ? (
                              <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A2540] mx-auto"></div>
                                <p className="text-sm text-gray-500 mt-2">{isRTL ? 'جاري تحميل الإشعارات...' : 'Loading notifications...'}</p>
                              </div>
                            ) : notifications.length > 0 ? (
                              (() => {
                                const groupedNotifications = groupNotificationsByConversationId(notifications);
                                return groupedNotifications.map((group) => {
                                  const hasUnread = group.notifications.some(n => !n.isRead);
                                  return (
                                    <div
                                      key={group.conversationId}
                                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${hasUnread ? 'bg-blue-50' : ''}`}
                                      onClick={() => {
                                        navigate(`/messages?conversationId=${group.conversationId}`);
                                        setIsNotificationOpen(false);
                                        group.notifications.forEach(n => {
                                          if (!n.isRead) {
                                            markAsRead(n.id);
                                          }
                                        });
                                      }}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${hasUnread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between gap-2">
                                            <h4 className="font-medium text-sm text-[#0A2540] truncate">{group.latestNotification.title}</h4>
                                            {group.count > 1 && (
                                              <Badge variant="secondary" className="ml-auto flex-shrink-0">{group.count}</Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600 mt-1 truncate">{group.latestNotification.message}</p>
                                          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(group.latestNotification.createdAt)}</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">{isRTL ? 'لا توجد إشعارات جديدة' : 'No new notifications'}</p>
                              </div>
                            )}
                          </div>
                          <div className="p-3 border-t text-center"><div className="flex gap-2 justify-center"><Button variant="ghost" size="sm" className="text-[#0A2540]" onClick={() => navigate('/notifications')}>{isRTL ? 'عرض جميع الإشعارات' : 'View All Notifications'}</Button>{unreadCount > 0 && (<Button variant="ghost" size="sm" className="text-[#0A2540]" onClick={markAllAsRead}>{isRTL ? 'تمييز الكل كمقروء' : 'Mark All Read'}</Button>)}</div></div>
                        </div>
                      </PopoverContent>
                    </Popover>

                 </>
               ) : (
                 <>
                   <Button onClick={() => window.dispatchEvent(new CustomEvent('auth:open-login'))} className="w-full rounded-full border border-[#0A2540] text-[#0A2540] bg-white font-medium hover:bg-[#0A2540] hover:text-white hover:border-[#0A2540] hover:scale-105 transition-all duration-300 ease-in-out">{isRTL ? 'تسجيل الدخول' : 'Sign In'}</Button>
                   <Button onClick={() => window.dispatchEvent(new CustomEvent('auth:open-register'))} className="w-full rounded-full bg-[#0A2540] text-white font-semibold hover:bg-[#142b52] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">{isRTL ? 'إنشاء حساب' : 'Sign Up'}</Button>
                   <AuthDialogs isRTL={isRTL} />
                 </>
               )}

               <Button variant="ghost" size="sm" onClick={onLanguageToggle} className="hidden md:flex items-center gap-2 px-2 py-1 font-medium hover:bg-transparent" style={{ color: textColor }} title={isRTL ? 'اللغة' : 'Language'}>
                 <Globe className="w-4 h-4" />
                 <span className="text-sm">{isRTL ? 'AR' : 'EN'}</span>
               </Button>
            </div>

            {/*  Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded focus:outline-none transition-colors"
              style={{ color: isMobileMenuOpen ? "#0A2540" : textColor }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden max-h-[calc(100vh-80px)] overflow-y-auto border-t border-gray-200 animate-fade-in bg-white shadow-lg">
            <div className="px-4 py-6">
              {/* User Profile Section - FIRST PRIORITY */}
              {isAuthenticated && userData ? (
                <div className="mb-6">
                  {/* User Profile Header */}
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
                        <span className="text-xs text-white/80">{isRTL ? "متصل" : "Online"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions - High Priority */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                      <Link to={userData.dashboardPath}>
                        <Button className="w-full justify-start bg-gray-50 hover:bg-[#0A2540]/10 hover:text-[#0A2540] text-[#0A2540]" variant="ghost">
                          <User className="mr-2 h-4 w-4" />
                          {isRTL ? "لوحة التحكم" : "Dashboard"}
                        </Button>
                      </Link>
                      <Link to="/messages">
                        <Button className="w-full justify-start bg-gray-50 hover:bg-[#0A2540]/10 hover:text-[#0A2540] text-[#0A2540]" variant="ghost">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {isRTL ? "الرسائل" : "Messages"}
                        </Button>
                      </Link>
                  </div>

                  {/* Notifications - High Priority */}
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
                        <ChevronDown className={`w-4 h-4 text-[#0A2540] transition-transform ${isMobileNotificationsOpen ? 'rotate-180' : ''}`} />
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
                                  !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                                }`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex items-start gap-2">
                                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    !notification.isRead ? 'bg-blue-500' : 'bg-gray-300'
                                  }`} />
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
                                  onClick={() => navigate('/notifications')}
                                >
                                  {isRTL ? "عرض جميع الإشعارات" : "View All Notifications"}
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
                      onClick={() => window.dispatchEvent(new CustomEvent('auth:open-login'))}
                      className="w-full rounded-lg border border-[#0A2540] text-[#0A2540] bg-white font-medium hover:bg-[#0A2540] hover:text-white transition-colors"
                    >
                      {isRTL ? "تسجيل الدخول" : "Sign In"}
                    </Button>
                    <Button 
                      onClick={() => window.dispatchEvent(new CustomEvent('auth:open-register'))}
                      className="w-full rounded-lg bg-[#0A2540] text-white font-semibold hover:bg-[#1a3a5c] transition-colors"
                    >
                      {isRTL ? "إنشاء حساب" : "Sign Up"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation Section - SECOND PRIORITY */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {isRTL ? "التنقل" : "Navigation"}
                </h3>
                <nav className="space-y-1">
                  {/* Why Ahmed Mobile Dropdown */}
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
                      <ChevronDown className={`w-4 h-4 text-[#0A2540] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </Button>

                    {isDropdownOpen && (
                      <div className="ml-8 mt-2 space-y-1 animate-fade-in">
                        {whyAhmedMegaMenu.flatMap((sec) => sec.links).map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            className="block py-2 px-3 text-sm text-gray-600 hover:text-[#0A2540] hover:bg-[#0A2540]/5 rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Main Navigation Links */}
                  {([
                    { path: "/projects", label: isRTL ? "المشاريع" : "Projects", icon: FileText },
                    { path: "/freelancers", label: isRTL ? "المستقلون" : "Freelancers", icon: User },
                    { path: "/about", label: isRTL ? "حولنا" : "About", icon: Settings },
                    { path: "/contact-us", label: isRTL ? "تواصل معنا" : "Contact Us", icon: MessageCircle },
                  ] as const).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-3 text-[#0A2540] hover:bg-[#0A2540]/5 hover:text-[#0A2540] rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="p-1 bg-[#0A2540]/10 rounded">
                        <item.icon className="w-4 h-4 text-[#0A2540]" />
                      </div>
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Account Menu - THIRD PRIORITY (Only for logged users) */}
              {isAuthenticated && !isAdminView && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {isRTL ? "الحساب" : "Account"}
                  </h3>
                  <div className="space-y-1">
                    {[
                      { path: "/profile", label: isRTL ? "الملف الشخصي" : "Profile", icon: User },
                      { path: "/projects", label: isRTL ? "المشاريع" : "Projects", icon: FileText },
                      { path: "/settings", label: isRTL ? "الإعدادات" : "Settings", icon: Settings }
                    ].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-[#0A2540] hover:bg-[#0A2540]/5 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Language Toggle - FOURTH PRIORITY */}
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

              {/* Logout - LAST PRIORITY (Only for logged users) */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-4">
                  <Button 
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-red-200 text-red-600 bg-red-50 font-medium hover:bg-red-100 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isRTL ? "تسجيل الخروج" : "Logout"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

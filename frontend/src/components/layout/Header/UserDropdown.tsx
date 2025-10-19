import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  MessageCircle,
  FileText,
  Send,
  Star,
  Shield,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { UserType } from "@/types/api";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    initials: string;
    dashboardPath: string;
  };
  effectiveRole: UserType | null;
  isAdminView: boolean;
  onLogout: () => void;
  isRTL?: boolean;
}

export const UserDropdown = ({
  user,
  effectiveRole,
  isAdminView,
  onLogout,
  isRTL = false,
}: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#0A2540] text-white text-sm">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-[#0A2540]">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={user.dashboardPath} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{isRTL ? "لوحة التحكم" : "Dashboard"}</span>
          </Link>
        </DropdownMenuItem>
        {isAdminView && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin-dashboard" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>{isRTL ? "لوحة الإدارة" : "Admin Dashboard"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>{isRTL ? "إدارة المستخدمين" : "User Management"}</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{isRTL ? "الملف الشخصي" : "Profile"}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/messages" className="flex items-center">
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>{isRTL ? "الرسائل" : "Messages"}</span>
          </Link>
        </DropdownMenuItem>
        {!isAdminView && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/projects" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>{isRTL ? "المشاريع" : "Projects"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/contracts" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>{isRTL ? "العقود" : "Contracts"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/proposals" className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                <span>{isRTL ? "العروض" : "Proposals"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/reviews" className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                <span>{isRTL ? "التقييمات" : "Reviews"}</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{isRTL ? "الإشعارات" : "Notifications"}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{isRTL ? "الإعدادات" : "Settings"}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/help" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>{isRTL ? "المساعدة" : "Help"}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isRTL ? "تسجيل الخروج" : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

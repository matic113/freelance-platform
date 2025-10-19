import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface HeaderRoleSwitcherProps {
  className?: string;
  isRTL?: boolean;
}

const roleLabels: Record<UserType, { label: string; rtlLabel: string }> = {
  [UserType.CLIENT]: { label: 'Client', rtlLabel: 'عميل' },
  [UserType.FREELANCER]: { label: 'Freelancer', rtlLabel: 'مستقل' },
  [UserType.ADMIN]: { label: 'Admin', rtlLabel: 'مسؤول' },
};

const PRIMARY_VIEW_ROLES: UserType[] = [
  UserType.CLIENT,
  UserType.FREELANCER,
  UserType.ADMIN,
];

const roleDashboardMap: Record<UserType, string> = {
  [UserType.CLIENT]: '/client-dashboard',
  [UserType.FREELANCER]: '/freelancer-dashboard',
  [UserType.ADMIN]: '/admin-dashboard',
};

const dashboardRoutes = ['/client-dashboard', '/freelancer-dashboard', '/admin-dashboard'];

export function HeaderRoleSwitcher({ className, isRTL = false }: HeaderRoleSwitcherProps) {
  const { user, setActiveRole, activeRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const availableRoles = useMemo(() => {
    if (!user?.roles) {
      return [];
    }

    return user.roles.filter((role) => PRIMARY_VIEW_ROLES.includes(role));
  }, [user?.roles]);

  if (!user || availableRoles.length <= 1) {
    return null;
  }

  const handleRoleSwitch = (nextRole: UserType) => {
    if (activeRole === nextRole) {
      return;
    }

    setActiveRole(nextRole);

    const labels = roleLabels[nextRole];
    const displayLabel = isRTL ? labels?.rtlLabel ?? nextRole : labels?.label ?? nextRole;
    toast.success(isRTL ? `تم التبديل إلى ${displayLabel}` : `Switched to ${displayLabel} view`);

    // Navigate to the appropriate dashboard if currently on a dashboard route
    if (dashboardRoutes.includes(location.pathname)) {
      const targetDashboard = roleDashboardMap[nextRole];
      navigate(targetDashboard, { replace: true });
    }
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex bg-muted rounded-full p-1.5 shadow-sm">
        {availableRoles.map((role) => {
          const isActive = activeRole === role;
          const labels = roleLabels[role];
          const displayLabel = isRTL ? labels?.rtlLabel ?? role : labels?.label ?? role;

          return (
            <button
              key={role}
              type="button"
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full',
                isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/60',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !isLoading && handleRoleSwitch(role)}
            >
              {isLoading && isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>{displayLabel}</span>
              
            </button>
          );
        })}
      </div>
    </div>
  );
}

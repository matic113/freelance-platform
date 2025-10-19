import { useLocalization } from '@/hooks/useLocalization';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Briefcase, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { UserType } from '@/types/api';

interface RoleSwitcherProps {
  className?: string;
}

const roleMeta: Record<UserType, { path: string; icon: React.ElementType; color: string; bg: string; text: string }> = {
  [UserType.CLIENT]: {
    path: '/client-dashboard',
    icon: User,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    text: 'Find freelancers and launch your projects',
  },
  [UserType.FREELANCER]: {
    path: '/freelancer-dashboard',
    icon: Briefcase,
    color: 'text-green-600',
    bg: 'bg-green-100',
    text: 'Find projects and start working',
  },
  [UserType.ADMIN]: {
    path: '/admin-dashboard',
    icon: Shield,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    text: 'Manage platform operations and analytics',
  },
};

const PRIMARY_ROLES: UserType[] = [UserType.CLIENT, UserType.FREELANCER, UserType.ADMIN];

export function RoleSwitcher({ className }: RoleSwitcherProps) {
  const { isRTL } = useLocalization();
  const { user, activeRole, setActiveRole } = useAuth();

  if (!user?.roles || user.roles.length <= 1) {
    return null;
  }

  const availableRoles = user.roles.filter((role) => PRIMARY_ROLES.includes(role));

  const renderTitle = (role: UserType) => {
    switch (role) {
      case UserType.CLIENT:
        return isRTL ? 'عميل' : 'Client';
      case UserType.FREELANCER:
        return isRTL ? 'مستقل' : 'Freelancer';
      case UserType.ADMIN:
        return isRTL ? 'مسؤول' : 'Admin';
      default:
        return role;
    }
  };

  const renderDescription = (role: UserType) => {
    const baseText = roleMeta[role]?.text ?? '';
    if (!isRTL) {
      return baseText;
    }

    switch (role) {
      case UserType.CLIENT:
        return 'ابحث عن مستقلين وأطلق مشاريعك';
      case UserType.FREELANCER:
        return 'ابحث عن مشاريع وابدأ العمل';
      case UserType.ADMIN:
        return 'قم بإدارة المنصة وتحليل الأداء';
      default:
        return baseText;
    }
  };

  return (
    <Card className={cn('mb-6', className)}>
      <CardContent className="p-6">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-[#0A2540]">
            {isRTL ? 'تبديل العرض' : 'Switch View'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isRTL
              ? 'اختر العرض المناسب للوصول إلى الأدوات الصحيحة'
              : 'Select the view that matches how you want to work now'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {availableRoles.map((role) => {
            const meta = roleMeta[role];
            if (!meta) {
              return null;
            }

            const isActive = activeRole === role;
            const Icon = meta.icon;

            return (
              <Link key={role} href={meta.path} onClick={() => setActiveRole(role)}>
                <Card
                  className={cn(
                    'transition-all duration-300 cursor-pointer border border-border hover:shadow-lg',
                    isActive ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'
                  )}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div
                      className={cn(
                        'mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl',
                        meta.bg,
                        meta.color,
                        isActive && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[#0A2540]">{renderTitle(role)}</h3>
                      <p className="text-sm text-muted-foreground">{renderDescription(role)}</p>
                    </div>

                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

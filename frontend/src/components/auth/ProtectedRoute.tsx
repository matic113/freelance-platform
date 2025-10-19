import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/api';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserType | UserType[];
  redirectTo?: string;
}

const resolveDashboardPath = (role: UserType | null): string => {
  switch (role) {
    case UserType.ADMIN:
      return '/admin-dashboard';
    case UserType.FREELANCER:
      return '/freelancer-dashboard';
    case UserType.CLIENT:
      return '/client-dashboard';
    default:
      return '/';
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo = '/',
}) => {
  const { isAuthenticated, isLoading, activeRole, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${redirectTo}?login=true&from=${encodeURIComponent(location.pathname)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredRoles) {
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const hasRole = user?.roles?.some((role) => rolesArray.includes(role));

    if (!hasRole) {
      const fallback = resolveDashboardPath(activeRole ?? null);
      return <Navigate to={fallback} replace />;
    }

    if (rolesArray.includes(UserType.CLIENT) && activeRole !== UserType.CLIENT) {
      return <Navigate to={resolveDashboardPath(activeRole ?? UserType.FREELANCER)} replace />;
    }

    if (rolesArray.includes(UserType.FREELANCER) && activeRole !== UserType.FREELANCER) {
      return <Navigate to={resolveDashboardPath(activeRole ?? UserType.CLIENT)} replace />;
    }

    if (rolesArray.includes(UserType.ADMIN) && activeRole !== UserType.ADMIN) {
      return <Navigate to={resolveDashboardPath(activeRole ?? UserType.CLIENT)} replace />;
    }
  }

  return <>{children}</>;
};

export const ClientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={UserType.CLIENT}>{children}</ProtectedRoute>
);

export const FreelancerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={UserType.FREELANCER}>{children}</ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={UserType.ADMIN}>{children}</ProtectedRoute>
);

export const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

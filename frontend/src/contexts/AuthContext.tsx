import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { UserResponse, UserType, LoginRequest, RegisterRequest, AuthResponse, GoogleAuthResponse } from '@/types/api';
import { authService, LoginResult, OtpChallengeResponse, RegisterResult } from '@/services/auth.service';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: UserType | null;
  login: (credentials: LoginRequest) => Promise<LoginResult>;
  register: (userData: RegisterRequest) => Promise<RegisterResult>;
  loginWithGoogle: (idToken: string) => Promise<GoogleAuthResponse>;
  completeGoogleRoleSelection: (userId: string, role: UserType) => Promise<GoogleAuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setActiveRole: (newRole: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState<UserType | null>(null);

  const isAuthenticated = !!user;
  const availableRoles = useMemo(() => user?.roles ?? [], [user?.roles]);

  useEffect(() => {
    initializeAuth();

    const handleLogoutEvent = () => {
      setUser(null);
      setActiveRoleState(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      if (accessToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          handleUserLoaded(currentUser);
        } catch (error: any) {
          if (error?.status === 401 || error?.response?.status === 401) {
            if (refreshToken) {
              try {
                const newAuthResponse = await authService.refreshToken(refreshToken);
                authService.storeAuthData(newAuthResponse);
                const currentUser = await authService.getCurrentUser();
                handleUserLoaded(currentUser);
              } catch {
                authService.clearAuthData();
                setUser(null);
                setActiveRoleState(null);
              }
            } else {
              authService.clearAuthData();
              setUser(null);
              setActiveRoleState(null);
            }
          } else {
            const storedUser = authService.getStoredUser();
            if (storedUser) {
              handleUserLoaded(storedUser);
            } else {
              setUser(null);
              setActiveRoleState(null);
            }
          }
        }
      } else if (refreshToken) {
        try {
          const newAuthResponse = await authService.refreshToken(refreshToken);
          authService.storeAuthData(newAuthResponse);
          const currentUser = await authService.getCurrentUser();
          handleUserLoaded(currentUser);
        } catch {
          authService.clearAuthData();
          setUser(null);
          setActiveRoleState(null);
        }
      } else {
        setUser(null);
        setActiveRoleState(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
      setActiveRoleState(null);
    } finally {
      setIsLoading(false);
    }
  };

   const handleUserLoaded = (currentUser: UserResponse) => {
     setUser(currentUser);
     const storedActiveRole = authService.getStoredActiveRole();
     const resolvedRole = resolveActiveRole(currentUser, storedActiveRole ?? currentUser.activeRole ?? null);
     setActiveRoleState(resolvedRole);
     authService.storeUser(currentUser, resolvedRole);
   };

    const resolveActiveRole = (currentUser: UserResponse, preferredRole: UserType | null): UserType | null => {
      if (!currentUser?.roles || currentUser.roles.length === 0) {
        return null;
      }

      if (preferredRole && currentUser.roles.includes(preferredRole)) {
        return preferredRole;
      }

      if (currentUser.activeRole && currentUser.roles.includes(currentUser.activeRole)) {
        return currentUser.activeRole;
      }

      if (currentUser.roles.includes(UserType.ADMIN)) return UserType.ADMIN;
      if (currentUser.roles.includes(UserType.CLIENT)) return UserType.CLIENT;
      if (currentUser.roles.includes(UserType.FREELANCER)) return UserType.FREELANCER;

      return currentUser.roles[0] ?? null;
    };

  const login = async (credentials: LoginRequest): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      const result = await authService.login(credentials);

      if ('otpSent' in result) {
        // OTP challenge; do not store tokens or fetch user yet
        return result;
      }

      if (!result || !result.email) {
        throw new Error('Invalid login response: missing user data');
      }

      authService.storeAuthData(result);
      const currentUser = await authService.getCurrentUser();
      handleUserLoaded(currentUser);
      return result;
    } catch (error: any) {
      console.error('Login error:', error);

      if (error?.response?.data?.includes('deleted') || error?.message?.includes('deleted')) {
        throw new Error('Your account has been deleted. Please contact support for assistance.');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<RegisterResult> => {
    try {
      setIsLoading(true);
      const result = await authService.register(userData);

      if (!result || !('otpSent' in result)) {
        throw new Error('Invalid registration response');
      }

      // Registration successful, OTP sent for email verification
      // Return OtpChallengeResponse; tokens will be stored after email verification
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setActiveRoleState(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      handleUserLoaded(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      await logout();
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<GoogleAuthResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.loginWithGoogle(idToken);

      if (!response.requiresRoleSelection && response.auth.accessToken) {
        authService.storeAuthData(response.auth);
        const currentUser = await authService.getCurrentUser();
        handleUserLoaded(currentUser);
      }

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const completeGoogleRoleSelection = async (userId: string, role: UserType): Promise<GoogleAuthResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.completeGoogleRoleSelection(userId, role);

      authService.storeAuthData(response.auth);
      const currentUser = await authService.getCurrentUser();
      handleUserLoaded(currentUser);

      return response;
    } finally {
      setIsLoading(false);
    }
  };

   const setActiveRole = (newRole: UserType) => {
     if (!availableRoles.includes(newRole)) {
       return;
     }

     setIsLoading(true);
     authService.switchRole(newRole)
       .then((updatedUser) => {
         setUser(updatedUser);
         setActiveRoleState(newRole);
         authService.storeUser(updatedUser, newRole);
       })
       .catch((error) => {
         console.error('Failed to switch role:', error);
       })
       .finally(() => {
         setIsLoading(false);
       });
   };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    activeRole,
    login,
    register,
    loginWithGoogle,
    completeGoogleRoleSelection,
    logout,
    refreshUser,
    setActiveRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useIsClient = (): boolean => {
  const { user, activeRole } = useAuth();
  return user?.roles.includes(UserType.CLIENT) || activeRole === UserType.CLIENT || false;
};

export const useIsFreelancer = (): boolean => {
  const { user, activeRole } = useAuth();
  return user?.roles.includes(UserType.FREELANCER) || activeRole === UserType.FREELANCER || false;
};

export const useIsAdmin = (): boolean => {
  const { user, activeRole } = useAuth();
  if (!user?.roles && activeRole !== UserType.ADMIN) {
    return false;
  }

  return user?.roles.includes(UserType.ADMIN) || activeRole === UserType.ADMIN || false;
};

export const useActiveRole = (): UserType | null => {
  const { activeRole } = useAuth();
  return activeRole;
};

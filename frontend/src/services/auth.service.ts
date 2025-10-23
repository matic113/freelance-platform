import { apiService } from './api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  UserType,
  GoogleAuthResponse,
} from '@/types/api';

const ACTIVE_ROLE_KEY = 'activeRole';

const normalizeRole = (role: string | null | undefined): UserType | null => {
  if (!role) {
    return null;
  }

  const cleaned = role;
  if ((Object.values(UserType) as string[]).includes(cleaned)) {
    return cleaned as UserType;
  }

  return null;
};

const normalizeRoles = (roles: Array<string> | undefined | null): UserType[] => {
  if (!roles || roles.length === 0) {
    return [];
  }

  return roles
    .map((role) => normalizeRole(role))
    .filter((role): role is UserType => Boolean(role));
};

const normalizeUser = (user: UserResponse): UserResponse => {
  const normalizedRoles = normalizeRoles(user.roles as unknown as string[]);
  const normalizedActiveRole = normalizeRole(user.activeRole as unknown as string);

  return {
    ...user,
    roles: normalizedRoles,
    activeRole: normalizedActiveRole,
  };
};

export interface OtpChallengeResponse {
  otpSent: true;
  email: string;
  message?: string;
}

export type LoginResult = AuthResponse | OtpChallengeResponse;
export type RegisterResult = OtpChallengeResponse;

export const authService = {
  // Register new user (requires email verification via OTP)
  register: async (data: RegisterRequest): Promise<OtpChallengeResponse> => {
    return apiService.post<OtpChallengeResponse>('/auth/register', data);
  },

  // Login user (may require OTP challenge)
  login: async (data: LoginRequest): Promise<LoginResult> => {
    return apiService.post<LoginResult>('/auth/login', data);
  },

  // Request OTP after validating email+password (alias)
  requestOtp: async (data: LoginRequest): Promise<OtpChallengeResponse> => {
    return apiService.post<OtpChallengeResponse>('/auth/login', data);
  },

  // Verify OTP and receive full AuthResponse (for login)
  verifyOtp: async (payload: { email: string; otp: string }): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/verify-otp', payload);
  },

  // Verify email during registration and receive full AuthResponse
  verifyEmailRegistration: async (payload: { email: string; otp: string }): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/verify-email-register', payload);
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.warn('Logout request failed, but clearing local storage');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/refresh', null, {
      params: { refreshToken },
      headers: { 'Content-Type': 'application/json' },
    } as any);
  },

  loginWithGoogle: async (idToken: string): Promise<GoogleAuthResponse> => {
    return apiService.post<GoogleAuthResponse>('/auth/google', { idToken });
  },

  completeGoogleRoleSelection: async (userId: string, role: UserType): Promise<GoogleAuthResponse> => {
    return apiService.post<GoogleAuthResponse>('/auth/google/role', { userId, role });
  },

  // Get current user
  getCurrentUser: async (): Promise<UserResponse> => {
    const user = await apiService.get<UserResponse>('/auth/me');
    return normalizeUser(user);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: (): UserResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr) as UserResponse;
        const normalized = normalizeUser(parsed);
        const storedActiveRole = authService.getStoredActiveRole();
        return {
          ...normalized,
          activeRole: storedActiveRole ?? normalized.activeRole ?? null,
        };
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  },

  // Store authentication data
  storeAuthData: (authResponse: AuthResponse): void => {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);

    const roles = normalizeRoles(authResponse.roles as unknown as string[]);
    const activeRole = normalizeRole(authResponse.activeRole as unknown as string);

    const user: UserResponse = {
      id: authResponse.userId,
      email: authResponse.email,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      roles,
      activeRole,
      isVerified: authResponse.isVerified,
      isActive: true,
      profileCompleted: authResponse.profileCompleted,
      createdAt: authResponse.createdAt,
      updatedAt: authResponse.createdAt,
      avatarUrl: undefined,
      bio: undefined,
      skills: undefined,
      hourlyRate: undefined,
    };

    authService.storeUser(user, activeRole ?? null);
  },

  storeUser: (user: UserResponse, activeRole: UserType | null): void => {
    const normalized = normalizeUser(user);
    const userToStore = {
      ...normalized,
      activeRole: activeRole ?? normalized.activeRole ?? null,
    };
    localStorage.setItem('user', JSON.stringify(userToStore));
    if (userToStore.activeRole) {
      localStorage.setItem(ACTIVE_ROLE_KEY, userToStore.activeRole);
    } else {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    }
  },

  getStoredActiveRole: (): UserType | null => {
    const stored = localStorage.getItem(ACTIVE_ROLE_KEY);
    return normalizeRole(stored);
  },

  // Clear authentication data
  clearAuthData: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem(ACTIVE_ROLE_KEY);
  },

  // Get access token
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  // Check if token is expired (basic check without parsing JWT)
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem('accessToken');
    if (!token) return true;

    try {
      return false;
    } catch (error) {
      return true;
    }
  },

  // Switch active role
  switchRole: async (newRole: UserType): Promise<UserResponse> => {
    const user = await apiService.put<UserResponse>('/users/profile/switch-role', null, {
      params: { newRole },
    });
    return normalizeUser(user);
  },
};

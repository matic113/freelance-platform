import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '@/types/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'}/auth/refresh`,
            null,
            {
              params: { refreshToken },
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data but don't redirect immediately
        // Let the AuthContext handle the logout flow
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Dispatch a custom event to notify AuthContext
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'token_refresh_failed' } 
        }));
        
        return Promise.reject(refreshError);
      }
    }

    // Transform error to ApiError format
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      timestamp: new Date().toISOString(),
      path: error.config?.url || '',
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

// Generic API methods
export const apiService = {
  get: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> =>
    api.get(url, config).then(response => response.data),

  post: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> =>
    api.post(url, data, config).then(response => response.data),

  put: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> =>
    api.put(url, data, config).then(response => response.data),

  patch: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config).then(response => response.data),

  delete: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> =>
    api.delete(url, { ...config, data }).then(response => response.data),

  // File upload method
  upload: <T>(url: string, formData: FormData, config?: InternalAxiosRequestConfig): Promise<T> =>
    api.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data),
};

export default api;

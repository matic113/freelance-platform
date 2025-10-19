// Environment configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8081/ws',
  otpResendCooldown: Number(import.meta.env.VITE_OTP_RESEND_COOLDOWN || 60),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { UserType, GoogleAuthResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { config } from '@/config/env';

interface AuthDialogsProps {
  isRTL?: boolean;
}

export const AuthDialogs: React.FC<AuthDialogsProps> = ({ isRTL = false }) => {
  const { login, register, refreshUser, loginWithGoogle, completeGoogleRoleSelection } = useAuth();
  const navigate = useNavigate();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [pendingGoogleUserId, setPendingGoogleUserId] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
   const [registerForm, setRegisterForm] = useState({
     firstName: '',
     lastName: '',
     email: '',
     password: '',
     confirmPassword: '',
     activeRole: UserType.CLIENT,
     agreeToTerms: false,
   });

  const [isLoading, setIsLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
   const [cooldownSeconds, setCooldownSeconds] = useState(0);
   const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);
   const [otpFlowType, setOtpFlowType] = useState<'login' | 'register' | null>(null);
   const googleScriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!isOtpDialogOpen || cooldownSeconds <= 0) return;
    const timer = setInterval(() => setCooldownSeconds((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isOtpDialogOpen, cooldownSeconds]);

  // Listen to global custom events so other components (like Header) can open dialogs
  useEffect(() => {
    const onOpenLogin = () => setIsLoginDialogOpen(true);
    const onOpenRegister = () => setIsRegisterDialogOpen(true);
    const onOpenOtp = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as { email?: string } | undefined;
      if (detail?.email) setOtpEmail(detail.email);
      setIsOtpDialogOpen(true);
    };

    window.addEventListener('auth:open-login', onOpenLogin as EventListener);
    window.addEventListener('auth:open-register', onOpenRegister as EventListener);
    window.addEventListener('auth:open-otp', onOpenOtp as EventListener);

    return () => {
      window.removeEventListener('auth:open-login', onOpenLogin as EventListener);
      window.removeEventListener('auth:open-register', onOpenRegister as EventListener);
      window.removeEventListener('auth:open-otp', onOpenOtp as EventListener);
    };
  }, []);

   const googleButtonContainerRef = useRef<HTMLDivElement | null>(null);

   const initializeGoogleAuth = useCallback(() => {
     const googleAccounts = (window as any).google?.accounts;
     if (!googleAccounts || googleScriptLoadedRef.current) return;

     googleScriptLoadedRef.current = true;
     googleAccounts.id.initialize({
       client_id: config.googleClientId,
       callback: async (response: any) => {
         if (!response.credential) return;
         try {
           setIsGoogleLoading(true);
           const result = await loginWithGoogle(response.credential);
           if (result.requiresRoleSelection) {
             setPendingGoogleUserId(result.auth.userId);
             setIsRoleDialogOpen(true);
           } else {
             toast.success(isRTL ? 'تم تسجيل الدخول باستخدام Google' : 'Signed in with Google');
             setIsLoginDialogOpen(false);
           }
         } catch (error: any) {
           console.error('Google login error:', error);
           const msg = error?.response?.data?.message || error?.message || (isRTL ? 'فشل تسجيل الدخول عبر Google' : 'Google sign-in failed');
           toast.error(msg);
         } finally {
           setIsGoogleLoading(false);
         }
       },
     });
   }, [isRTL, loginWithGoogle]);

   const renderGoogleButton = useCallback(() => {
     if (!googleButtonContainerRef.current) return;
     const googleAccounts = (window as any).google?.accounts;
     if (!googleAccounts) return;

     try {
       googleAccounts.id.renderButton(googleButtonContainerRef.current, {
         type: 'standard',
         theme: 'outline',
         size: 'large',
         text: 'signin_with',
         width: '100%',
       });
     } catch (error) {
       console.error('Error rendering Google button:', error);
     }
   }, []);

   const handleGoogleClick = () => {
     renderGoogleButton();
   };

   useEffect(() => {
     if (!config.googleClientId) return;

     if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
       const timer = setTimeout(() => {
         if ((window as any).google) {
           initializeGoogleAuth();
         }
       }, 100);
       return () => clearTimeout(timer);
     }

     const script = document.createElement('script');
     script.src = 'https://accounts.google.com/gsi/client';
     script.async = true;
     script.defer = true;
     script.onload = () => {
       setTimeout(() => {
         initializeGoogleAuth();
       }, 100);
     };
     script.onerror = () => {
       console.error('Failed to load Google Sign-In script');
     };
     document.body.appendChild(script);

     return () => {
     };
   }, [initializeGoogleAuth]);

   useEffect(() => {
     if (isLoginDialogOpen && googleScriptLoadedRef.current && (window as any).google?.accounts) {
       const timer = setTimeout(() => {
         renderGoogleButton();
       }, 100);
       return () => clearTimeout(timer);
     }
   }, [isLoginDialogOpen, renderGoogleButton]);


  const handleGoogleRoleSelection = async (role: UserType) => {
    if (!pendingGoogleUserId) return;
    try {
      setIsGoogleLoading(true);
      const result = await completeGoogleRoleSelection(pendingGoogleUserId, role);
      if (!result.requiresRoleSelection) {
        toast.success(isRTL ? 'تم تسجيل الدخول باستخدام Google' : 'Signed in with Google');
        setIsRoleDialogOpen(false);
        setIsLoginDialogOpen(false);
        setPendingGoogleUserId(null);
      }
    } catch (error: any) {
      console.error('Role selection error:', error);
      const msg = error?.response?.data?.message || error?.message || (isRTL ? 'فشل حفظ الدور' : 'Failed to save role');
      toast.error(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({ email: loginForm.email, password: loginForm.password });

      if ('otpSent' in result) {
        toast.success(isRTL ? 'تم إرسال رمز التحقق' : 'Verification code sent');
        setIsLoginDialogOpen(false);
        setOtpEmail(result.email);
        setOtpValue('');
        setOtpError('');
        setOtpFlowType('login');
        setIsOtpDialogOpen(true);
        setIsLoading(false);
        setPendingCredentials({ email: loginForm.email, password: loginForm.password });
        // set cooldown if provided from config on frontend env
        setCooldownSeconds(60);
        return;
      }

      // Successful login (shouldn't normally happen if backend enforces OTP)
      setIsLoginDialogOpen(false);
      setLoginForm({ email: '', password: '' });
      toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      const msg = error?.response?.data?.message || error?.message || (isRTL ? 'فشل في تسجيل الدخول' : 'Login failed');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

   const handleRegister = async (e?: React.FormEvent) => {
     e?.preventDefault();
     if (!registerForm.firstName?.trim() || !registerForm.lastName?.trim() || !registerForm.email?.trim()) {
       toast.error(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
       return;
     }
     if (registerForm.password !== registerForm.confirmPassword) {
       toast.error(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
       return;
     }

     setIsLoading(true);
     try {
       const result = await register({
         firstName: registerForm.firstName,
         lastName: registerForm.lastName,
         email: registerForm.email,
         password: registerForm.password,
         activeRole: registerForm.activeRole,
       } as any);

       if (result && 'otpSent' in result) {
         toast.success(isRTL ? 'تم إرسال رمز التحقق' : 'Verification code sent');
         setIsRegisterDialogOpen(false);
         setOtpEmail(result.email);
         setOtpValue('');
         setOtpError('');
         setOtpFlowType('register');
         setIsOtpDialogOpen(true);
         setCooldownSeconds(60);
         setIsLoading(false);
         return;
       }

       toast.success(isRTL ? 'تم إنشاء الحساب بنجاح' : 'Registration successful');
       setIsRegisterDialogOpen(false);
       setRegisterForm(prev => ({
         ...prev,
         firstName: '',
         lastName: '',
         email: '',
         password: '',
         confirmPassword: '',
         activeRole: UserType.CLIENT,
         agreeToTerms: false,
       }));
     } catch (error: any) {
       console.error('Register error:', error);
       const msg = error?.response?.data?.message || error?.message || (isRTL ? 'فشل في إنشاء الحساب' : 'Registration failed');
       toast.error(msg.includes('Email') ? msg : msg);
     } finally {
       setIsLoading(false);
     }
   };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!otpValue.trim()) {
      setOtpError(isRTL ? 'يرجى إدخال الرمز' : 'Please enter the code');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      
      // Use the appropriate endpoint based on the flow type
      if (otpFlowType === 'register') {
        const authResponse = await authService.verifyEmailRegistration({ email: otpEmail, otp: otpValue });
        authService.storeAuthData(authResponse);
        await refreshUser();
        
        toast.success(isRTL ? 'تم التحقق بنجاح' : 'Verification successful');
        setIsOtpDialogOpen(false);
        setOtpValue('');
        setOtpError('');
        setPendingCredentials(null);
        setOtpFlowType(null);
        
        navigate('/onboarding');
       } else if (otpFlowType === 'login') {
         const authResponse = await authService.verifyOtp({ email: otpEmail, otp: otpValue });
         authService.storeAuthData(authResponse);
         await refreshUser();
         
         toast.success(isRTL ? 'تم التحقق بنجاح' : 'Verification successful');
         setIsOtpDialogOpen(false);
         setOtpValue('');
         setOtpError('');
         setPendingCredentials(null);
         setOtpFlowType(null);
         
         setTimeout(() => {
           const currentUser = authService.getStoredUser();
           if (currentUser?.profileCompleted) {
             const activeRole = currentUser.activeRole;
             if (activeRole === UserType.FREELANCER) {
               navigate('/freelancer-dashboard');
             } else if (activeRole === UserType.CLIENT) {
               navigate('/client-dashboard');
             } else if (activeRole === UserType.ADMIN) {
               navigate('/admin-dashboard');
             } else {
               navigate('/');
             }
           } else {
             navigate('/onboarding');
           }
         }, 100);
      } else {
        throw new Error('Invalid OTP flow type');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setOtpError(error?.response?.data?.message || error?.message || (isRTL ? 'فشل التحقق من الرمز' : 'OTP verification failed'));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingCredentials) return;
    if (cooldownSeconds > 0) return;

    try {
      setIsResendingOtp(true);
      await authService.requestOtp(pendingCredentials);
      toast.success(isRTL ? 'تم إعادة إرسال الرمز' : 'Verification code resent');
      setCooldownSeconds(60);
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast.error(error?.response?.data?.message || error?.message || (isRTL ? 'فشل إرسال الرمز' : 'Failed to resend code'));
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <>
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsLoginDialogOpen(true)} className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" onInteractOutside={(event) => event.preventDefault()} onEscapeKeyDown={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</DialogTitle>
            <DialogDescription>{isRTL ? 'أدخل بياناتك للدخول إلى حسابك' : 'Enter your credentials to sign in to your account'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input id="email" type="email" value={loginForm.email} onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{isRTL ? 'كلمة المرور' : 'Password'}</Label>
              <Input id="password" type="password" value={loginForm.password} onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))} required />
            </div>
            <Button type="submit" className="w-full bg-[#0A2540] hover:bg-[#142b52]" disabled={isLoading}>
              {isLoading ? (isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...') : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
            </Button>
             {config.googleClientId && (
               <div className="relative py-2">
                 <div className="my-4 flex items-center gap-3">
                   <span className="h-px flex-1 bg-border" />
                   <span className="text-xs uppercase text-muted-foreground">{isRTL ? 'أو' : 'OR'}</span>
                   <span className="h-px flex-1 bg-border" />
                 </div>
                 <div ref={googleButtonContainerRef} className="w-full" />
               </div>
             )}
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsRegisterDialogOpen(true)} className="hidden" />
        </DialogTrigger>
  <DialogContent className="sm:max-w-md" onInteractOutside={(event) => event.preventDefault()} onEscapeKeyDown={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'إنشاء حساب' : 'Sign Up'}</DialogTitle>
            <DialogDescription>{isRTL ? 'أنشئ حسابك الجديد للبدء' : 'Create your new account to get started'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{isRTL ? 'الاسم الأول' : 'First Name'}</Label>
                <Input id="firstName" value={registerForm.firstName} onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="lastName">{isRTL ? 'الاسم الأخير' : 'Last Name'}</Label>
                <Input id="lastName" value={registerForm.lastName} onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))} required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input id="email" type="email" value={registerForm.email} onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="password">{isRTL ? 'كلمة المرور' : 'Password'}</Label>
              <Input id="password" type="password" value={registerForm.password} onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="confirmPassword">{isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
              <Input id="confirmPassword" type="password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))} required />
            </div>
             <div>
               <span className="block text-sm font-medium mb-2">{isRTL ? 'اختر الدور' : 'Select your role'}</span>
               <div className="grid gap-2 sm:grid-cols-2">
                 {[UserType.CLIENT, UserType.FREELANCER].map((role) => {
                   const isSelected = registerForm.activeRole === role;
                   const label = role === UserType.CLIENT ? (isRTL ? 'عميل' : 'Client') : (isRTL ? 'مستقل' : 'Freelancer');
                   return (
                     <label
                       key={role}
                       className={`flex items-center gap-2 rounded-md border p-3 text-sm transition-colors cursor-pointer ${isSelected ? 'border-[#0A2540] bg-[#0A2540]/5' : 'border-border hover:border-[#0A2540]'}`}
                     >
                       <input
                         type="radio"
                         name="role"
                         value={role}
                         checked={isSelected}
                         onChange={() => setRegisterForm(prev => ({ ...prev, activeRole: role }))}
                       />
                       <span>{label}</span>
                     </label>
                   );
                 })}
               </div>
               <p className="mt-1 text-xs text-muted-foreground">{isRTL ? 'تم تعيين كلا الدورين. اختر الدور الذي تريد البدء به.' : 'Both roles have been assigned. Choose the role you want to start with.'}</p>
             </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="agreeToTerms" checked={registerForm.agreeToTerms} onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, agreeToTerms: checked as boolean }))} />
              <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">{isRTL ? 'أوافق على الشروط والأحكام' : 'I agree to the terms and conditions'}</Label>
            </div>
            <Button type="submit" className="w-full bg-[#0A2540] hover:bg-[#142b52]" disabled={isLoading}>
              {isLoading ? (isRTL ? 'جاري إنشاء الحساب...' : 'Creating account...') : (isRTL ? 'إنشاء حساب' : 'Sign Up')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isOtpDialogOpen} onOpenChange={(open) => {
        setIsOtpDialogOpen(open);
        if (!open) {
          setOtpFlowType(null);
          setOtpValue('');
          setOtpError('');
          setPendingCredentials(null);
        }
      }}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOtpDialogOpen(true)} className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" onInteractOutside={(event) => event.preventDefault()} onEscapeKeyDown={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'تحقق بخطوتين' : 'Two-step verification'}</DialogTitle>
            <DialogDescription>{isRTL ? `أدخل الرمز المكون من 6 أرقام المرسل إلى ${otpEmail}` : `Enter the 6-digit code sent to ${otpEmail}`}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-3">
              <InputOTP maxLength={6} value={otpValue} onChange={(v) => { setOtpValue(v); if (otpError) setOtpError(''); }} containerClassName="justify-center">
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} className="h-12 w-12 text-lg font-semibold" />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {otpError && (
                <Alert variant="destructive"><AlertDescription>{otpError}</AlertDescription></Alert>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-[#0A2540] hover:bg-[#142b52]" disabled={isVerifyingOtp}>{isVerifyingOtp ? (isRTL ? 'جاري التحقق...' : 'Verifying...') : (isRTL ? 'تحقق' : 'Verify')}</Button>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <button type="button" className="text-[#0A2540] hover:underline" onClick={() => { setIsOtpDialogOpen(false); setIsLoginDialogOpen(true); setOtpValue(''); setOtpError(''); }}>{isRTL ? 'رجوع لتسجيل الدخول' : 'Back to sign in'}</button>
                <button type="button" className="text-[#0A2540] hover:underline disabled:opacity-50" onClick={handleResendOtp} disabled={isResendingOtp || cooldownSeconds > 0}>
                  {cooldownSeconds > 0 ? (isRTL ? `إعادة الإرسال خلال ${cooldownSeconds}s` : `Resend in ${cooldownSeconds}s`) : isResendingOtp ? (isRTL ? 'جاري الإرسال...' : 'Resending...') : (isRTL ? 'إعادة إرسال الرمز' : 'Resend code')}
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleDialogOpen} onOpenChange={(open) => { if (!open) { setIsRoleDialogOpen(false); setPendingGoogleUserId(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'اختر دورك' : 'Choose your role'}</DialogTitle>
            <DialogDescription>{isRTL ? 'بعد تسجيل الدخول باستخدام Google، اختر كيف ترغب في استخدام المنصة.' : 'After signing in with Google, choose how you want to use the platform.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {[UserType.CLIENT, UserType.FREELANCER].map((role) => (
              <Button
                key={role}
                variant="outline"
                className="h-12 justify-start gap-3 text-left"
                disabled={isGoogleLoading}
                onClick={() => handleGoogleRoleSelection(role)}
              >
                <span className="flex flex-col text-sm">
                  <span className="font-semibold">{role === UserType.CLIENT ? (isRTL ? 'عميل' : 'Client') : (isRTL ? 'مستقل' : 'Freelancer')}</span>
                  <span className="text-xs text-muted-foreground">
                    {role === UserType.CLIENT
                      ? (isRTL ? 'أنشئ المشاريع وابحث عن المواهب المناسبة.' : 'Post projects and hire the right talent.')
                      : (isRTL ? 'اكتشف فرص العمل وقدم الخدمات.' : 'Find opportunities and offer your services.')}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthDialogs;

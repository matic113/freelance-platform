import { useState, useEffect } from "react";

export type Language = "en" | "ar";

export interface Translations {
  resetPassword: string;
  signUpSubtitle: string;
  // Common
  email: string;
  password: string;
  signIn: string;
  signUp: string;
  forgotPassword: string;
  rememberMe: string;
  or: string;

  // Sign In
  welcomeTitle: string;
  welcomeSubtitle: string;
  signInButton: string;
  newToPlatform: string;
  createAccount: string;
  loginWithFacebook: string;
  loginWithGmail: string;

  // Sign Up
  adventureStartsTitle: string;
  adventureStartsSubtitle: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  confirmPassword: string;
  agreeToTerms: string;
  termsAndConditions: string;
  privacyPolicy: string;
  signUpButton: string;
  alreadyHaveAccount: string;
  signInInstead: string;
  signUpWithFacebook: string;
  signUpWithGmail: string;

  // Forgot Password
  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  sendResetLink: string;
  backToSignIn: string;
  checkYourEmail: string;
  emailSentMessage: string;
  emailSentSuccessfully: string;
  checkInboxAndSpam: string;
  didntReceiveEmail: string;
  tryAgain: string;

  // Validation messages
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  firstNameRequired: string;
  lastNameRequired: string;
  phoneRequired: string;
  passwordMinLength: string;
  passwordsDoNotMatch: string;
  agreeToTermsRequired: string;
  confirmPasswordRequired: string;

  // Placeholders
  enterYourEmail: string;
  enterYourPassword: string;
  johnPlaceholder: string;
  doePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  confirmPasswordPlaceholder: string;

  // OTP Verification
  verifyYourEmail: string;
  otpSentMessage: string;
  enterOTPCode: string;
  verifyOTP: string;
  didntReceiveOTP: string;
  resendOTP: string;
  resending: string;
  resendIn: string;
  otpRequired: string;
  otpInvalid: string;
  otpVerifiedSuccessfully: string;
  otpVerifiedMessage: string;
  emailVerified: string;

  // Reset password
  resetPasswordTitle: string;
  resetPasswordSubtitle: string;
  resetPasswordButton: string;
  passwordResetSuccess: string;
  passwordResetMessage: string;
  goToSignIn: string;
  invalidResetLink: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Sign Up",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",
    or: "or",

    // Sign In
    welcomeTitle: "Welcome to Sneat! 👋",
    welcomeSubtitle: "Please sign-in to your account and start the adventure",
    signInButton: "SIGN IN",
    newToPlatform: "New on our platform?",
    createAccount: "Create an account",
    loginWithFacebook: "Login with Facebook",
    loginWithGmail: "Login with Gmail",

    // Sign Up
    adventureStartsTitle: "Adventure starts here 🚀",
    adventureStartsSubtitle: "Make your app management easy and fun!",
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number",
    confirmPassword: "Confirm Password",
    agreeToTerms: "I agree to the",
    termsAndConditions: "Terms and Conditions",
    privacyPolicy: "Privacy Policy",
    signUpButton: "SIGN UP",
    alreadyHaveAccount: "Already have an account?",
    signInInstead: "Sign in instead",
    signUpWithFacebook: "Sign up with Facebook",
    signUpWithGmail: "Sign up with Gmail",

    // Forgot Password
    forgotPasswordTitle: "Forgot your password?",
    forgotPasswordSubtitle: "No worries, we'll send you reset instructions.",
    sendResetLink: "Send Reset Link",
    backToSignIn: "Back to sign in",
    checkYourEmail: "Check your email!",
    emailSentMessage: "We've sent a password reset link to",
    emailSentSuccessfully: "Email sent successfully!",
    checkInboxAndSpam: "Please check your inbox and spam folder.",
    didntReceiveEmail: "Didn't receive the email? Check your spam folder or",
    tryAgain: "try again",

    // Validation messages
    emailRequired: "Email is required",
    emailInvalid: "Email is invalid",
    passwordRequired: "Password is required",
    firstNameRequired: "First name is required",
    lastNameRequired: "Last name is required",
    phoneRequired: "Phone number is required",
    passwordMinLength: "Password must be at least 8 characters",
    passwordsDoNotMatch: "Passwords do not match",
    agreeToTermsRequired: "You must agree to the terms and conditions",
    confirmPasswordRequired: "Please confirm your password",

    // Placeholders
    enterYourEmail: "Enter your email",
    enterYourPassword: "Enter your password",
    johnPlaceholder: "John",
    doePlaceholder: "Doe",
    emailPlaceholder: "john@example.com",
    phonePlaceholder: "+1 (555) 123-4567",
    confirmPasswordPlaceholder: "Confirm your password",

    // OTP Verification
    verifyYourEmail: "Verify your email",
    otpSentMessage: "We've sent a 6-digit code to",
    enterOTPCode: "Enter OTP Code",
    verifyOTP: "Verify OTP",
    didntReceiveOTP: "Didn't receive the code?",
    resendOTP: "Resend OTP",
    resending: "Resending...",
    resendIn: "Resend in",
    otpRequired: "Please enter the complete OTP code",
    otpInvalid: "Invalid OTP code. Please try again",
    otpVerifiedSuccessfully: "Email verified successfully!",
    otpVerifiedMessage: "Your email has been verified. You can now access your account.",
    emailVerified: "Email verified successfully!",

    // Reset password
    resetPasswordTitle: "Reset Your Password",
    resetPasswordSubtitle: "Enter your new password below",
    resetPasswordButton: "Reset Password",
    passwordResetSuccess: "Password Reset Successfully!",
    passwordResetMessage: "Your password has been changed successfully. You can now sign in with your account.",
    goToSignIn: "Go to Sign In",
    invalidResetLink: "Invalid or expired reset link",

    // Extra
    signUpSubtitle: "Create your account in a few steps",
    resetPassword: undefined
  },
  ar: {
    // Common
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    forgotPassword: "نسيت كلمة المرور؟",
    rememberMe: "تذكرني",
    or: "أو",

    // Sign In
    welcomeTitle: "مرحباً بك في سنيت! 👋",
    welcomeSubtitle: "يرجى تسجيل الدخول إلى حسابك وبدء المغامرة",
    signInButton: "تسجيل الدخول",
    newToPlatform: "جديد على منصتنا؟",
    createAccount: "إنشاء حساب",
    loginWithFacebook: "تسجيل الدخول عبر فيسبوك",
    loginWithGmail: "تسجيل الدخول عبر جيميل",

    // Sign Up
    adventureStartsTitle: "تبدأ المغامرة هنا 🚀",
    adventureStartsSubtitle: "اجعل إدارة التطبيق سهلة وممتعة!",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    phoneNumber: "رقم الهاتف",
    confirmPassword: "تأكيد كلمة المرور",
    agreeToTerms: "أوافق على",
    termsAndConditions: "الشروط والأحكام",
    privacyPolicy: "سياسة الخصوصية",
    signUpButton: "إنشاء حساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signInInstead: "تسجيل الدخول بدلاً من ذلك",
    signUpWithFacebook: "إنشاء حساب عبر فيسبوك",
    signUpWithGmail: "إنشاء حساب عبر جيميل",

    // Forgot Password
    forgotPasswordTitle: "نسيت كلمة المرور؟ 🔒",
    forgotPasswordSubtitle: "لا تقلق، سنرسل لك تعليمات إعادة التعيين.",
    sendResetLink: "إرسال رابط إعادة التعيين",
    backToSignIn: "العودة لتسجيل الدخول",
    checkYourEmail: "تحقق من بريدك الإلكتروني!",
    emailSentMessage: "لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى",
    emailSentSuccessfully: "تم إرسال البريد الإلكتروني بنجاح!",
    checkInboxAndSpam: "يرجى التحقق من صندوق الوارد والمجلد المهمل.",
    didntReceiveEmail: "لم تستلم البريد الإلكتروني؟ تحقق من مجلد الرسائل المهملة أو",
    tryAgain: "حاول مرة أخرى",

    // Validation messages
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "البريد الإلكتروني غير صحيح",
    passwordRequired: "كلمة المرور مطلوبة",
    firstNameRequired: "الاسم الأول مطلوب",
    lastNameRequired: "اسم العائلة مطلوب",
    phoneRequired: "رقم الهاتف مطلوب",
    passwordMinLength: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    passwordsDoNotMatch: "كلمات المرور غير متطابقة",
    agreeToTermsRequired: "يجب أن توافق على الشروط والأحكام",
    confirmPasswordRequired: "يرجى تأكيد كلمة المرور",

    // Placeholders
    enterYourEmail: "أدخل بريدك الإلكتروني",
    enterYourPassword: "أدخل كلمة المرور",
    johnPlaceholder: "أحمد",
    doePlaceholder: "محمد",
    emailPlaceholder: "ahmed@example.com",
    phonePlaceholder: "+966 50 123 4567",
    confirmPasswordPlaceholder: "أكد كلمة المرور",

    // OTP Verification
    verifyYourEmail: "تحقق من بريدك الإلكتروني 📧",
    otpSentMessage: "لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى",
    enterOTPCode: "أدخل رمز التحقق",
    verifyOTP: "تحقق من الرمز",
    didntReceiveOTP: "لم تستلم الرمز؟",
    resendOTP: "إعادة إرسال الرمز",
    resending: "جاري الإرسال...",
    resendIn: "إعادة إرسال خلال",
    otpRequired: "يرجى إدخال رمز التحقق الكامل",
    otpInvalid: "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى",
    otpVerifiedSuccessfully: "تم التحقق من البريد الإلكتروني بنجاح!",
    otpVerifiedMessage: "تم التحقق من بريدك الإلكتروني. يمكنك الآن الوصول إلى حسابك.",
    emailVerified: "تم التحقق من البريد الإلكتروني بنجاح!",

    // Reset password
    resetPasswordTitle: "إعادة تعيين كلمة المرور",
    resetPasswordSubtitle: "أدخل كلمة المرور الجديدة أدناه",
    resetPasswordButton: "إعادة تعيين كلمة المرور",
    passwordResetSuccess: "تم إعادة تعيين كلمة المرور بنجاح!",
    passwordResetMessage: "تم تغيير كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول بحسابك.",
    goToSignIn: "الذهاب لتسجيل الدخول",
    invalidResetLink: "رابط إعادة التعيين غير صحيح أو منتهي الصلاحية",

    // Extra
    signUpSubtitle: "قم بإنشاء حسابك بخطوات بسيطة",
    resetPassword: undefined
  },
};

export const useLocalization = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored =
      typeof window !== "undefined"
        ? (window.localStorage.getItem("language") as Language | null)
        : null;
    return stored === "en" || stored === "ar" ? stored : "ar";
  });

  const t = translations[language];
  const isRTL = language === "ar";

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem("language", language);
    } catch {}
  }, [language, isRTL]);

  return {
    t,
    language,
    isRTL,
    toggleLanguage,
    setLanguage,
  };
};

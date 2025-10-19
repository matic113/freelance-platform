import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { useProfile, ProfileFormData } from "@/hooks/useProfile";
import { useFreelancerProfileSettings, FreelancerProfileFormData } from "@/hooks/useFreelancerProfileSettings";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useBillingSettings } from "@/hooks/useBillingSettings";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useIsFreelancer } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { UpdateNotificationSettingsRequest, UpdateBillingSettingsRequest, AddPaymentMethodRequest } from "@/types/api";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Settings as SettingsIcon, 
  Bell,
  Briefcase, 
  Globe,
  Menu, 
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  User,
  Lock,
  Smartphone,
  Mail,
  CreditCard,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Edit,
  Camera,
  X,
  Plus,
  Minus,
  RefreshCw,
  Key,
  Phone,
  MapPin,
  Clock,
  Languages,
  Heart,
  Star,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  HardDrive,
  Server,
  Cpu,
  MemoryStick,
  Battery,
  Power,
  PowerOff,
  Plug,
  Signal,
  Bluetooth,
  Radio,
  Thermometer,
  Gauge,
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Flame,
  Droplet,
  Snowflake,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Diamond,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Cross,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Scissors,
  Brush,
  Eraser,
  Pen,
  Pencil,
  Highlighter,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Unlink,
  List,
  ListOrdered,
  Quote,
  Table,
  Grid,
  Layout,
  Columns,
  Rows,
  Maximize,
  Minimize,
  Fullscreen,
} from "lucide-react";

export default function Settings() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const isFreelancer = useIsFreelancer();
  const {
    profile, 
    loading: profileLoading, 
    error: profileError, 
    saving: profileSaving,
    updateProfile,
    uploadAvatar,
    getFormData,
    getUpdateRequest
  } = useProfile();
  
  const {
    profile: freelancerProfile,
    loading: freelancerProfileLoading,
    error: freelancerProfileError,
    saving: freelancerProfileSaving,
    updateProfile: updateFreelancerProfile,
    getFormData: getFreelancerFormData,
    getUpdateRequest: getFreelancerUpdateRequest
  } = useFreelancerProfileSettings();
  
  const {
    settings: notificationSettings,
    loading: notificationLoading,
    saving: notificationSaving,
    updateSettings: updateNotificationSettings
  } = useNotificationSettings();
  
  const {
    billingSettings,
    paymentMethods,
    loading: billingLoading,
    saving: billingSaving,
    updateBillingSettings,
    addPaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod
  } = useBillingSettings();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  // Handle tab switching from URL parameters
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showExportDataDialog, setShowExportDataDialog] = useState(false);
  const [showAddPaymentMethodDialog, setShowAddPaymentMethodDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileFormData>(() => getFormData());
  const [freelancerProfileForm, setFreelancerProfileForm] = useState<FreelancerProfileFormData>(() => getFreelancerFormData());

  // Update profile form when profile data changes
  useEffect(() => {
    if (profile) {
      setProfileForm(getFormData());
    }
  }, [profile]);

  // Update freelancer profile form when freelancer profile data changes
  useEffect(() => {
    if (freelancerProfile) {
      setFreelancerProfileForm(getFreelancerFormData());
    }
  }, [freelancerProfile]);


  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: {
        enabled: true,
        proposals: true,
        messages: true,
        payments: true,
        reviews: true,
        system: true,
        marketing: false
      },
      push: {
        enabled: true,
        proposals: true,
        messages: true,
        payments: true,
        reviews: true,
        system: true
      },
      inApp: {
        enabled: true,
        proposals: true,
        messages: true,
        payments: true,
        reviews: true,
        system: true
      },
      frequency: {
        emailDigest: 'daily',
        pushFrequency: 'immediate',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        }
      }
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      trustedDevices: [],
      loginHistory: []
    },
    billing: {
      paymentMethod: 'credit_card',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      taxId: '',
      invoiceEmail: '',
      autoRenewal: true
    }
  });

  // Profile form handlers
  const handleProfileFormChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const updateRequest = getUpdateRequest(profileForm);
      await updateProfile(updateRequest);
      toast({
        title: isRTL ? "تم الحفظ بنجاح" : "Success",
        description: isRTL ? "تم حفظ الملف الشخصي بنجاح" : "Profile saved successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في الحفظ" : "Error",
        description: isRTL ? "فشل في حفظ الملف الشخصي" : "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatar(file);
      // Refresh user data in AuthContext to update header avatar
      await refreshUser();
      toast({
        title: isRTL ? "تم التحديث بنجاح" : "Success",
        description: isRTL ? "تم تحديث الصورة الشخصية بنجاح" : "Avatar updated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Error",
        description: isRTL ? "فشل في تحديث الصورة الشخصية" : "Failed to update avatar",
        variant: "destructive",
      });
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Freelancer profile form handlers
  const handleFreelancerProfileFormChange = (field: keyof FreelancerProfileFormData, value: any) => {
    setFreelancerProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveFreelancerProfile = async () => {
    try {
      const updateRequest = getFreelancerUpdateRequest(freelancerProfileForm);
      await updateFreelancerProfile(updateRequest);
      toast({
        title: isRTL ? "تم الحفظ بنجاح" : "Success",
        description: isRTL ? "تم حفظ إعدادات المستقل بنجاح" : "Freelancer profile saved successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في الحفظ" : "Error",
        description: isRTL ? "فشل في حفظ إعدادات المستقل" : "Failed to save freelancer profile",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (category: string, subcategory: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [subcategory]: {
          ...(prev[category as keyof typeof prev] as any)[subcategory],
          [key]: value
        }
      }
    }));
  };


  const handleChangePassword = async () => {
    try {
      const currentPassword = (document.getElementById('currentPassword') as HTMLInputElement)?.value;
      const newPassword = (document.getElementById('newPassword') as HTMLInputElement)?.value;
      const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement)?.value;

      if (!currentPassword || !newPassword || !confirmPassword) {
        toast({
          title: isRTL ? "خطأ في الإدخال" : "Input Error",
          description: isRTL ? "يرجى ملء جميع الحقول" : "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        toast({
          title: isRTL ? "خطأ في كلمة المرور" : "Password Error",
          description: isRTL ? "كلمة المرور الجديدة غير متطابقة" : "New passwords do not match",
          variant: "destructive",
        });
        return;
      }

      await userService.changePassword(currentPassword, newPassword);
      toast({
        title: isRTL ? "تم التغيير بنجاح" : "Success",
        description: isRTL ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully",
        variant: "default",
      });
      setShowChangePasswordDialog(false);
      
      // Clear form
      (document.getElementById('currentPassword') as HTMLInputElement).value = '';
      (document.getElementById('newPassword') as HTMLInputElement).value = '';
      (document.getElementById('confirmPassword') as HTMLInputElement).value = '';
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في التغيير" : "Error",
        description: error.response?.data || (isRTL ? "فشل في تغيير كلمة المرور" : "Failed to change password"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const password = (document.getElementById('deletePassword') as HTMLInputElement)?.value;

      if (!password) {
        toast({
          title: isRTL ? "خطأ في الإدخال" : "Input Error",
          description: isRTL ? "يرجى إدخال كلمة المرور للتأكيد" : "Please enter password for confirmation",
          variant: "destructive",
        });
        return;
      }

      await userService.deleteAccount(password);
      toast({
        title: isRTL ? "تم الحذف بنجاح" : "Success",
        description: isRTL ? "تم حذف الحساب بنجاح. تم تسجيل خروجك" : "Account deleted successfully. You have been logged out",
        variant: "default",
      });
      setShowDeleteAccountDialog(false);
      
      // Logout user and redirect to login page
      await authService.logout();
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في الحذف" : "Error",
        description: error.response?.data || (isRTL ? "فشل في حذف الحساب" : "Failed to delete account"),
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    toast({
      title: isRTL ? "تم التصدير بنجاح" : "Success",
      description: isRTL ? "تم تصدير البيانات بنجاح" : "Data exported successfully",
      variant: "default",
    });
    setShowExportDataDialog(false);
  };

  const handleNotificationSettingChange = async (key: keyof UpdateNotificationSettingsRequest, value: any) => {
    if (!notificationSettings) return;
    
    try {
      const updateRequest: UpdateNotificationSettingsRequest = {
        [key]: value
      };
      
      await updateNotificationSettings(updateRequest);
      toast({
        title: isRTL ? "تم التحديث بنجاح" : "Success",
        description: isRTL ? "تم تحديث إعدادات الإشعارات بنجاح" : "Notification settings updated successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Error",
        description: error?.response?.data?.message || (isRTL ? "فشل في تحديث إعدادات الإشعارات" : "Failed to update notification settings"),
        variant: "destructive",
      });
    }
  };

  const handleBillingSettingChange = async (key: keyof UpdateBillingSettingsRequest, value: any) => {
    if (!billingSettings) return;
    
    try {
      const updateRequest: UpdateBillingSettingsRequest = {
        [key]: value
      };
      
      await updateBillingSettings(updateRequest);
      toast({
        title: isRTL ? "تم التحديث بنجاح" : "Success",
        description: isRTL ? "تم تحديث إعدادات الفوترة بنجاح" : "Billing settings updated successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Error",
        description: error?.response?.data?.message || (isRTL ? "فشل في تحديث إعدادات الفوترة" : "Failed to update billing settings"),
        variant: "destructive",
      });
    }
  };

  const handleAddPaymentMethod = async (paymentMethod: AddPaymentMethodRequest) => {
    try {
      await addPaymentMethod(paymentMethod);
      toast({
        title: isRTL ? "تم الإضافة بنجاح" : "Success",
        description: isRTL ? "تم إضافة طريقة الدفع بنجاح" : "Payment method added successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في الإضافة" : "Error",
        description: error?.response?.data?.message || (isRTL ? "فشل في إضافة طريقة الدفع" : "Failed to add payment method"),
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId);
      toast({
        title: isRTL ? "تم التحديث بنجاح" : "Success",
        description: isRTL ? "تم تعيين طريقة الدفع الافتراضية بنجاح" : "Default payment method set successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Error",
        description: error?.response?.data?.message || (isRTL ? "فشل في تعيين طريقة الدفع الافتراضية" : "Failed to set default payment method"),
        variant: "destructive",
      });
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deletePaymentMethod(paymentMethodId);
      toast({
        title: isRTL ? "تم الحذف بنجاح" : "Success",
        description: isRTL ? "تم حذف طريقة الدفع بنجاح" : "Payment method deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في الحذف" : "Error",
        description: error?.response?.data?.message || (isRTL ? "فشل في حذف طريقة الدفع" : "Failed to delete payment method"),
        variant: "destructive",
      });
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeText = (theme: string) => {
    switch (theme) {
      case 'light':
        return isRTL ? 'فاتح' : 'Light';
      case 'dark':
        return isRTL ? 'داكن' : 'Dark';
      case 'system':
        return isRTL ? 'النظام' : 'System';
      default:
        return theme;
    }
  };

  const getTabDisplayName = (tabValue: string) => {
    switch (tabValue) {
      case 'profile':
        return isRTL ? 'الملف الشخصي' : 'Profile';
      case 'freelancer-profile':
        return isRTL ? 'إعدادات المستقل' : 'Freelancer Profile';
      case 'notifications':
        return isRTL ? 'الإشعارات' : 'Notifications';
      case 'security':
        return isRTL ? 'الأمان' : 'Security';
      case 'billing':
        return isRTL ? 'الفوترة' : 'Billing';
      default:
        return tabValue;
    }
  };

  const getTabIcon = (tabValue: string) => {
    switch (tabValue) {
      case 'profile':
        return <User className="h-4 w-4" />;
      case 'freelancer-profile':
        return <Briefcase className="h-4 w-4" />;
      case 'notifications':
        return <Bell className="h-4 w-4" />;
      case 'security':
        return <Lock className="h-4 w-4" />;
      case 'billing':
        return <CreditCard className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "الإعدادات" : "Settings"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "إدارة إعدادات حسابك وتفضيلاتك الشخصية" 
              : "Manage your account settings and personal preferences"
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-first responsive tabs */}
          <div className="mb-8">
            {/* Desktop/Tablet Layout */}
            <TabsList className="hidden sm:flex w-full gap-1 p-1 bg-muted rounded-lg">
              <TabsTrigger 
                value="profile" 
                className="flex-1 text-sm px-3 py-2"
              >
                <User className="h-4 w-4 mr-2" />
                {isRTL ? "الملف الشخصي" : "Profile"}
              </TabsTrigger>
              {isFreelancer && (
                <TabsTrigger 
                  value="freelancer-profile" 
                  className="flex-1 text-sm px-3 py-2"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  {isRTL ? "إعدادات المستقل" : "Freelancer Profile"}
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="notifications" 
                className="flex-1 text-sm px-3 py-2"
              >
                <Bell className="h-4 w-4 mr-2" />
                {isRTL ? "الإشعارات" : "Notifications"}
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex-1 text-sm px-3 py-2"
              >
                <Lock className="h-4 w-4 mr-2" />
                {isRTL ? "الأمان" : "Security"}
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="flex-1 text-sm px-3 py-2"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isRTL ? "الفوترة" : "Billing"}
              </TabsTrigger>
            </TabsList>

            {/* Mobile Layout - Dropdown Menu */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-muted hover:bg-muted/80"
                  >
                    <div className="flex items-center gap-2">
                      {getTabIcon(activeTab)}
                      <span className="font-medium">{getTabDisplayName(activeTab)}</span>
                    </div>
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[200px]" align="start">
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    {isRTL ? "الملف الشخصي" : "Profile"}
                  </DropdownMenuItem>
                  {isFreelancer && (
                    <DropdownMenuItem 
                      onClick={() => setActiveTab('freelancer-profile')}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Briefcase className="h-4 w-4" />
                      {isRTL ? "إعدادات المستقل" : "Freelancer Profile"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('notifications')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Bell className="h-4 w-4" />
                    {isRTL ? "الإشعارات" : "Notifications"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('security')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="h-4 w-4" />
                    {isRTL ? "الأمان" : "Security"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('billing')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    {isRTL ? "الفوترة" : "Billing"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {isRTL ? "معلومات الملف الشخصي" : "Profile Information"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "إدارة معلوماتك الشخصية الأساسية" : "Manage your basic personal information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileForm.avatar || undefined} />
                      <AvatarFallback className="bg-[#0A2540] text-white text-xl">
                        {profileForm.firstName.charAt(0)}{profileForm.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full"
                      variant="outline"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {profileForm.firstName} {profileForm.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{profileForm.email}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleChangePhotoClick}
                      disabled={profileSaving}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isRTL ? "تغيير الصورة" : "Change Photo"}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{isRTL ? "الاسم الأول" : "First Name"}</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => handleProfileFormChange('firstName', e.target.value)}
                      disabled={profileSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{isRTL ? "الاسم الأخير" : "Last Name"}</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => handleProfileFormChange('lastName', e.target.value)}
                      disabled={profileSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">{isRTL ? "لا يمكن تغيير البريد الإلكتروني" : "Email cannot be changed"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{isRTL ? "رقم الهاتف" : "Phone Number"}</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => handleProfileFormChange('phone', e.target.value)}
                      disabled={profileSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{isRTL ? "البلد" : "Country"}</Label>
                    <Input
                      id="country"
                      value={profileForm.country}
                      onChange={(e) => handleProfileFormChange('country', e.target.value)}
                      disabled={profileSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{isRTL ? "المدينة" : "City"}</Label>
                    <Input
                      id="city"
                      value={profileForm.city}
                      onChange={(e) => handleProfileFormChange('city', e.target.value)}
                      disabled={profileSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">{isRTL ? "المنطقة الزمنية" : "Timezone"}</Label>
                    <Select 
                      value={profileForm.timezone} 
                      onValueChange={(value) => handleProfileFormChange('timezone', value)}
                      disabled={profileSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GMT+3">GMT+3 (Riyadh)</SelectItem>
                        <SelectItem value="GMT+0">GMT+0 (London)</SelectItem>
                        <SelectItem value="GMT-5">GMT-5 (New York)</SelectItem>
                        <SelectItem value="GMT+8">GMT+8 (Tokyo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">{isRTL ? "اللغة" : "Language"}</Label>
                    <Select 
                      value={profileForm.language} 
                      onValueChange={(value) => handleProfileFormChange('language', value)}
                      disabled={profileSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bio field - Only for freelancers */}
                {isFreelancer && (
                  <div className="space-y-2">
                    <Label htmlFor="bio">{isRTL ? "نبذة شخصية" : "Bio"}</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => handleProfileFormChange('bio', e.target.value)}
                      rows={4}
                      placeholder={isRTL ? "اكتب نبذة شخصية عنك..." : "Write a brief description about yourself..."}
                      disabled={profileSaving}
                    />
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    className="bg-[#0A2540] hover:bg-[#142b52]"
                  >
                    {profileSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {isRTL ? "جاري الحفظ..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isRTL ? "حفظ الإعدادات" : "Save Settings"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Freelancer Profile Tab */}
          {isFreelancer && (
            <TabsContent value="freelancer-profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {isRTL ? "إعدادات المستقل" : "Freelancer Profile Settings"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "إدارة إعداداتك كمستقل" : "Manage your freelancer profile settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {freelancerProfileError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{freelancerProfileError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Freelancer Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="freelancer-bio">{isRTL ? "نبذة شخصية" : "Professional Bio"}</Label>
                    <Textarea
                      id="freelancer-bio"
                      value={freelancerProfileForm.bio}
                      onChange={(e) => handleFreelancerProfileFormChange('bio', e.target.value)}
                      rows={4}
                      placeholder={isRTL ? "اكتب نبذة شخصية عن خبراتك ومهاراتك..." : "Write about your experience and skills..."}
                      disabled={freelancerProfileSaving}
                    />
                  </div>

                  {/* Hourly Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="hourly-rate">{isRTL ? "السعر بالساعة" : "Hourly Rate"}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">$</span>
                      <Input
                        id="hourly-rate"
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={freelancerProfileForm.hourlyRate}
                        onChange={(e) => handleFreelancerProfileFormChange('hourlyRate', Number(e.target.value))}
                        placeholder="25"
                        disabled={freelancerProfileSaving}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">/hr</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {isRTL ? "أدخل سعرك بالساعة بالدولار الأمريكي" : "Enter your hourly rate in USD"}
                    </p>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <Label htmlFor="experience-level">{isRTL ? "مستوى الخبرة" : "Experience Level"}</Label>
                    <Select
                      value={freelancerProfileForm.experienceLevel}
                      onValueChange={(value) => handleFreelancerProfileFormChange('experienceLevel', value)}
                      disabled={freelancerProfileSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENTRY">{isRTL ? "مبتدئ" : "Entry Level"}</SelectItem>
                        <SelectItem value="INTERMEDIATE">{isRTL ? "متوسط" : "Intermediate"}</SelectItem>
                        <SelectItem value="SENIOR">{isRTL ? "خبير" : "Senior"}</SelectItem>
                        <SelectItem value="EXPERT">{isRTL ? "خبير جداً" : "Expert"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <Label htmlFor="availability">{isRTL ? "حالة التوفر" : "Availability"}</Label>
                    <Select
                      value={freelancerProfileForm.availability}
                      onValueChange={(value) => handleFreelancerProfileFormChange('availability', value)}
                      disabled={freelancerProfileSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">{isRTL ? "متاح" : "Available"}</SelectItem>
                        <SelectItem value="BUSY">{isRTL ? "مشغول" : "Busy"}</SelectItem>
                        <SelectItem value="UNAVAILABLE">{isRTL ? "غير متاح" : "Unavailable"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{isRTL ? "الروابط الاجتماعية" : "Social Links"}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin-url">{isRTL ? "رابط LinkedIn" : "LinkedIn URL"}</Label>
                        <Input
                          id="linkedin-url"
                          type="url"
                          value={freelancerProfileForm.linkedinUrl}
                          onChange={(e) => handleFreelancerProfileFormChange('linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                          disabled={freelancerProfileSaving}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="github-url">{isRTL ? "رابط GitHub" : "GitHub URL"}</Label>
                        <Input
                          id="github-url"
                          type="url"
                          value={freelancerProfileForm.githubUrl}
                          onChange={(e) => handleFreelancerProfileFormChange('githubUrl', e.target.value)}
                          placeholder="https://github.com/yourusername"
                          disabled={freelancerProfileSaving}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website-url">{isRTL ? "الموقع الشخصي" : "Personal Website"}</Label>
                        <Input
                          id="website-url"
                          type="url"
                          value={freelancerProfileForm.websiteUrl}
                          onChange={(e) => handleFreelancerProfileFormChange('websiteUrl', e.target.value)}
                          placeholder="https://yourwebsite.com"
                          disabled={freelancerProfileSaving}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="portfolio-url">{isRTL ? "رابط المعرض" : "Portfolio URL"}</Label>
                        <Input
                          id="portfolio-url"
                          type="url"
                          value={freelancerProfileForm.portfolioUrl}
                          onChange={(e) => handleFreelancerProfileFormChange('portfolioUrl', e.target.value)}
                          placeholder="https://yourportfolio.com"
                          disabled={freelancerProfileSaving}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveFreelancerProfile}
                      disabled={freelancerProfileSaving}
                      className="bg-[#0A2540] hover:bg-[#142b52]"
                    >
                      {freelancerProfileSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          {isRTL ? "جاري الحفظ..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {isRTL ? "حفظ إعدادات المستقل" : "Save Freelancer Settings"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {isRTL ? "إعدادات الإشعارات" : "Notification Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "تحكم في كيفية تلقي الإشعارات" : "Control how you receive notifications"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2540]"></div>
                  </div>
                ) : notificationSettings ? (
                  <>
                    {/* Email Notifications */}
                    <div className="space-y-4">
                      <h4 className="font-medium">{isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}</h4>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "تلقي الإشعارات المهمة عبر البريد الإلكتروني" : "Receive important notifications via email"}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "عروض جديدة" : "New Proposals"}</Label>
                            <Switch
                              checked={notificationSettings.emailNewProposals}
                              onCheckedChange={(checked) => handleNotificationSettingChange('emailNewProposals', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "رسائل جديدة" : "New Messages"}</Label>
                            <Switch
                              checked={notificationSettings.emailNewMessages}
                              onCheckedChange={(checked) => handleNotificationSettingChange('emailNewMessages', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "مدفوعات" : "Payments"}</Label>
                            <Switch
                              checked={notificationSettings.emailPayments}
                              onCheckedChange={(checked) => handleNotificationSettingChange('emailPayments', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "تقييمات جديدة" : "New Reviews"}</Label>
                            <Switch
                              checked={notificationSettings.emailNewReviews}
                              onCheckedChange={(checked) => handleNotificationSettingChange('emailNewReviews', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "إشعارات النظام" : "System Notifications"}</Label>
                            <Switch
                              checked={notificationSettings.emailSystemNotifications}
                              onCheckedChange={(checked) => handleNotificationSettingChange('emailSystemNotifications', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "رسائل تسويقية" : "Marketing Emails"}</Label>
                            <Switch
                              checked={notificationSettings.emailMarketingEmails}
                              onCheckedChange={(checked) => handleNotificationSettingChange('emailMarketingEmails', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Push Notifications */}
                    <div className="space-y-4">
                      <h4 className="font-medium">{isRTL ? "إشعارات الدفع" : "Push Notifications"}</h4>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "إشعارات فورية على جهازك المحمول" : "Instant notifications on your mobile device"}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "عروض جديدة" : "New Proposals"}</Label>
                            <Switch
                              checked={notificationSettings.pushNewProposals}
                              onCheckedChange={(checked) => handleNotificationSettingChange('pushNewProposals', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "رسائل جديدة" : "New Messages"}</Label>
                            <Switch
                              checked={notificationSettings.pushNewMessages}
                              onCheckedChange={(checked) => handleNotificationSettingChange('pushNewMessages', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "مدفوعات" : "Payments"}</Label>
                            <Switch
                              checked={notificationSettings.pushPayments}
                              onCheckedChange={(checked) => handleNotificationSettingChange('pushPayments', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "تقييمات جديدة" : "New Reviews"}</Label>
                            <Switch
                              checked={notificationSettings.pushNewReviews}
                              onCheckedChange={(checked) => handleNotificationSettingChange('pushNewReviews', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{isRTL ? "إشعارات النظام" : "System Notifications"}</Label>
                            <Switch
                              checked={notificationSettings.pushSystemNotifications}
                              onCheckedChange={(checked) => handleNotificationSettingChange('pushSystemNotifications', checked)}
                              disabled={notificationSaving}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Frequency Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium">{isRTL ? "إعدادات التكرار" : "Frequency Settings"}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{isRTL ? "تكرار البريد الإلكتروني" : "Email Frequency"}</Label>
                          <Select
                            value={notificationSettings.emailFrequency}
                            onValueChange={(value) => handleNotificationSettingChange('emailFrequency', value)}
                            disabled={notificationSaving}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IMMEDIATE">{isRTL ? "فوري" : "Immediate"}</SelectItem>
                              <SelectItem value="DAILY">{isRTL ? "يومي" : "Daily"}</SelectItem>
                              <SelectItem value="WEEKLY">{isRTL ? "أسبوعي" : "Weekly"}</SelectItem>
                              <SelectItem value="NEVER">{isRTL ? "أبداً" : "Never"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? "تكرار إشعارات الدفع" : "Push Frequency"}</Label>
                          <Select
                            value={notificationSettings.pushFrequency}
                            onValueChange={(value) => handleNotificationSettingChange('pushFrequency', value)}
                            disabled={notificationSaving}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IMMEDIATE">{isRTL ? "فوري" : "Immediate"}</SelectItem>
                              <SelectItem value="DAILY">{isRTL ? "يومي" : "Daily"}</SelectItem>
                              <SelectItem value="WEEKLY">{isRTL ? "أسبوعي" : "Weekly"}</SelectItem>
                              <SelectItem value="NEVER">{isRTL ? "أبداً" : "Never"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isRTL ? "فشل في تحميل إعدادات الإشعارات" : "Failed to load notification settings"}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {isRTL ? "إعدادات الأمان" : "Security Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "إدارة أمان حسابك وكلمة المرور" : "Manage your account security and password"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">

                  <div className="space-y-4">
                    <h4 className="font-medium">{isRTL ? "إدارة كلمة المرور" : "Password Management"}</h4>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => setShowChangePasswordDialog(true)}
                        className="bg-[#0A2540] hover:bg-[#142b52]"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        {isRTL ? "تغيير كلمة المرور" : "Change Password"}
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {isRTL ? "إعادة تعيين" : "Reset"}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">{isRTL ? "إدارة الحساب" : "Account Management"}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-red-600">
                            {isRTL ? "حذف الحساب" : "Delete Account"}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {isRTL ? "حذف حسابك نهائياً" : "Permanently delete your account"}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowDeleteAccountDialog(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isRTL ? "حذف" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {isRTL ? "إعدادات الفوترة" : "Billing Settings"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "إدارة طرق الدفع والفواتير" : "Manage payment methods and billing"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {billingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2540]"></div>
                  </div>
                ) : (
                  <>
                    {/* Payment Methods */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">
                            {isRTL ? "طرق الدفع" : "Payment Methods"}
                          </Label>
                          <p className="text-sm text-gray-600">
                            {isRTL ? "إدارة طرق الدفع الخاصة بك" : "Manage your payment methods"}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAddPaymentMethodDialog(true)}
                          disabled={billingSaving}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {isRTL ? "إضافة طريقة دفع" : "Add Payment Method"}
                        </Button>
                      </div>

                      {paymentMethods.length > 0 ? (
                        <div className="space-y-3">
                          {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-gray-500" />
                                <div>
                                  <p className="font-medium">
                                    {method.cardBrand} •••• {method.cardLastFour}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {method.cardType} {method.isDefault && (isRTL ? "(افتراضي)" : "(Default)")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {!method.isDefault && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                    disabled={billingSaving}
                                  >
                                    {isRTL ? "تعيين افتراضي" : "Set Default"}
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeletePaymentMethod(method.id)}
                                  disabled={billingSaving}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {isRTL ? "لا توجد طرق دفع مضافة" : "No payment methods added"}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Billing Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium">{isRTL ? "معلومات الفوترة" : "Billing Information"}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="street">{isRTL ? "العنوان" : "Street Address"}</Label>
                          <Input
                            id="street"
                            value={billingSettings?.streetAddress || ''}
                            onChange={(e) => handleBillingSettingChange('streetAddress', e.target.value)}
                            disabled={billingSaving}
                            placeholder={isRTL ? "أدخل العنوان" : "Enter street address"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">{isRTL ? "المدينة" : "City"}</Label>
                          <Input
                            id="city"
                            value={billingSettings?.city || ''}
                            onChange={(e) => handleBillingSettingChange('city', e.target.value)}
                            disabled={billingSaving}
                            placeholder={isRTL ? "أدخل المدينة" : "Enter city"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">{isRTL ? "الولاية/المحافظة" : "State/Province"}</Label>
                          <Input
                            id="state"
                            value={billingSettings?.stateProvince || ''}
                            onChange={(e) => handleBillingSettingChange('stateProvince', e.target.value)}
                            disabled={billingSaving}
                            placeholder={isRTL ? "أدخل الولاية" : "Enter state/province"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">{isRTL ? "الرمز البريدي" : "ZIP Code"}</Label>
                          <Input
                            id="zip"
                            value={billingSettings?.zipCode || ''}
                            onChange={(e) => handleBillingSettingChange('zipCode', e.target.value)}
                            disabled={billingSaving}
                            placeholder={isRTL ? "أدخل الرمز البريدي" : "Enter ZIP code"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">{isRTL ? "البلد" : "Country"}</Label>
                          <Input
                            id="country"
                            value={billingSettings?.country || ''}
                            onChange={(e) => handleBillingSettingChange('country', e.target.value)}
                            disabled={billingSaving}
                            placeholder={isRTL ? "أدخل البلد" : "Enter country"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingEmail">{isRTL ? "بريد الفوترة" : "Billing Email"}</Label>
                          <Input
                            id="billingEmail"
                            type="email"
                            value={billingSettings?.billingEmail || ''}
                            onChange={(e) => handleBillingSettingChange('billingEmail', e.target.value)}
                            disabled={billingSaving}
                            placeholder={isRTL ? "أدخل بريد الفوترة" : "Enter billing email"}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Billing Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium">{isRTL ? "إعدادات الفوترة" : "Billing Settings"}</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">
                            {isRTL ? "التجديد التلقائي" : "Auto Renewal"}
                          </Label>
                          <p className="text-sm text-gray-600">
                            {isRTL ? "تجديد الاشتراك تلقائياً" : "Automatically renew subscription"}
                          </p>
                        </div>
                        <Switch
                          checked={billingSettings?.autoRenewal || false}
                          onCheckedChange={(checked) => handleBillingSettingChange('autoRenewal', checked)}
                          disabled={billingSaving}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>


        {/* Change Password Dialog */}
        <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isRTL ? "تغيير كلمة المرور" : "Change Password"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{isRTL ? "كلمة المرور الحالية" : "Current Password"}</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{isRTL ? "كلمة المرور الجديدة" : "New Password"}</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowChangePasswordDialog(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleChangePassword}>
                  {isRTL ? "تغيير" : "Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">{isRTL ? "حذف الحساب" : "Delete Account"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {isRTL 
                    ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائياً."
                    : "This action cannot be undone. All your data will be permanently deleted."
                  }
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="deletePassword">{isRTL ? "كلمة المرور للتأكيد" : "Password for confirmation"}</Label>
                <Input id="deletePassword" type="password" placeholder={isRTL ? "أدخل كلمة المرور" : "Enter your password"} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteAccountDialog(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  {isRTL ? "حذف الحساب" : "Delete Account"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Export Data Dialog */}
        <Dialog open={showExportDataDialog} onOpenChange={setShowExportDataDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isRTL ? "تصدير البيانات" : "Export Data"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                {isRTL 
                  ? "سيتم إرسال رابط تحميل البيانات إلى بريدك الإلكتروني خلال 24 ساعة."
                  : "A download link will be sent to your email within 24 hours."
                }
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowExportDataDialog(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  {isRTL ? "تصدير" : "Export"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Payment Method Dialog */}
        <Dialog open={showAddPaymentMethodDialog} onOpenChange={setShowAddPaymentMethodDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isRTL ? "إضافة طريقة دفع" : "Add Payment Method"}</DialogTitle>
              <DialogDescription>
                {isRTL ? "أدخل تفاصيل بطاقة الدفع الخاصة بك" : "Enter your payment card details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const paymentMethod: AddPaymentMethodRequest = {
                cardNumber: formData.get('cardNumber') as string,
                cardHolderName: formData.get('cardHolderName') as string,
                expiryMonth: formData.get('expiryMonth') as string,
                expiryYear: formData.get('expiryYear') as string,
                cvv: formData.get('cvv') as string,
                isDefault: paymentMethods.length === 0 || formData.get('isDefault') === 'on'
              };
              handleAddPaymentMethod(paymentMethod);
              setShowAddPaymentMethodDialog(false);
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">{isRTL ? "رقم البطاقة" : "Card Number"}</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                    disabled={billingSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolderName">{isRTL ? "اسم حامل البطاقة" : "Card Holder Name"}</Label>
                  <Input
                    id="cardHolderName"
                    name="cardHolderName"
                    placeholder={isRTL ? "أدخل اسم حامل البطاقة" : "Enter card holder name"}
                    required
                    disabled={billingSaving}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">{isRTL ? "الشهر" : "Month"}</Label>
                    <Input
                      id="expiryMonth"
                      name="expiryMonth"
                      placeholder="MM"
                      maxLength={2}
                      required
                      disabled={billingSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">{isRTL ? "السنة" : "Year"}</Label>
                    <Input
                      id="expiryYear"
                      name="expiryYear"
                      placeholder="YYYY"
                      maxLength={4}
                      required
                      disabled={billingSaving}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">{isRTL ? "رمز الأمان" : "CVV"}</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxLength={4}
                    required
                    disabled={billingSaving}
                  />
                </div>
                {paymentMethods.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      className="rounded border-gray-300"
                      disabled={billingSaving}
                    />
                    <Label htmlFor="isDefault" className="text-sm">
                      {isRTL ? "تعيين كطريقة دفع افتراضية" : "Set as default payment method"}
                    </Label>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddPaymentMethodDialog(false)}
                  disabled={billingSaving}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" disabled={billingSaving}>
                  {billingSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isRTL ? "جاري الإضافة..." : "Adding..."}
                    </div>
                  ) : (
                    isRTL ? "إضافة" : "Add"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
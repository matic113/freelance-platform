import React, { useState, useRef } from "react";
import { useLocalization } from "../hooks/useLocalization";
import { useAuth, useIsFreelancer } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useToast } from "../hooks/use-toast";
import { cn, getUserTypeString } from "../lib/utils";
import { config } from "../config/env";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/sections/Footer";
import { SkillsManager } from "../components/skills/SkillsManager";
import { PortfolioManager } from "../components/portfolio/PortfolioManager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  User,
  Mail,
  Calendar,
  Camera,
  Globe,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function Profile() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { profile: userProfile, uploadAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFreelancer = useIsFreelancer();

  // Helper function to get full avatar URL
  const getAvatarUrl = (avatarUrl: string | undefined): string => {
    if (!avatarUrl) return '';
    
    if (avatarUrl.startsWith('http')) {
      return avatarUrl;
    }
    
    // Remove /api from the base URL since avatar URLs are served directly
    const baseUrl = config.apiBaseUrl.replace('/api', '');
    return `${baseUrl}${avatarUrl}`;
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
      toast({
        title: isRTL ? "تم تحديث الصورة بنجاح" : "Avatar updated successfully",
        description: isRTL ? "تم حفظ صورة الملف الشخصي الجديدة" : "Your new profile picture has been saved",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في تحديث الصورة" : "Failed to update avatar",
        description: isRTL ? "حدث خطأ أثناء تحديث صورة الملف الشخصي" : "An error occurred while updating your profile picture",
        variant: "destructive",
      });
    }
  };

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <CheckCircle className="h-4 w-4 text-gray-400" />
    );
  };

  // Loading state
  if (authLoading) {
    return (
      <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
        <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2540] mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {isRTL ? "جاري تحميل الملف الشخصي..." : "Loading profile..."}
              </p>
            </div>
          </div>
        </main>
        <Footer isRTL={isRTL} />
      </div>
    );
  }

  // Show profile for all authenticated users
  if (!user) {
    return (
      <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
        <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#0A2540] mb-4">
              {isRTL ? "الملف الشخصي غير متاح" : "Profile Not Available"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? "يرجى تسجيل الدخول لعرض الملف الشخصي" : "Please log in to view your profile"}
            </p>
          </div>
        </main>
        <Footer isRTL={isRTL} />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "الملف الشخصي" : "Profile"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL
              ? "إدارة معلوماتك الشخصية وإعدادات الحساب"
              : "Manage your personal information and account settings"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative inline-block">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={getAvatarUrl(userProfile?.avatarUrl)} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-[#0A2540] text-white text-2xl">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <CardTitle className="text-xl">{user?.firstName} {user?.lastName}</CardTitle>
                <CardDescription className="text-base">
                  {getUserTypeString(user) === 'freelancer' 
                    ? ""
                    : (isRTL ? "عميل" : "Client")
                  }
                </CardDescription>
                
                {/* Verification Status */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {getVerificationIcon(user?.isVerified || false)}
                    <span className={user?.isVerified ? "text-green-600" : "text-gray-500"}>
                      {isRTL ? "البريد الإلكتروني" : "Email"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {getVerificationIcon(user?.isActive || false)}
                    <span className={user?.isActive ? "text-green-600" : "text-gray-500"}>
                      {isRTL ? "الحساب" : "Account"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{isRTL ? "عضو منذ" : "Member since"} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{getUserTypeString(user) === 'freelancer' ? (isRTL ? "مطور" : "Freelancer") : (isRTL ? "عميل" : "Client")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            {/* Basic Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {isRTL ? "المعلومات الأساسية" : "Basic Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{isRTL ? "الاسم الكامل" : "Full Name"}</Label>
                    <Input
                      id="name"
                      value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                {/* Bio field - Only for freelancers */}
                {isFreelancer && (
                  <div className="space-y-2">
                    <Label htmlFor="bio">{isRTL ? "نبذة شخصية" : "Bio"}</Label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm min-h-[100px]">
                      {userProfile?.bio || 'No bio provided'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {isRTL ? "معلومات الحساب" : "Account Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{isRTL ? "تاريخ الانضمام" : "Join Date"}</p>
                      <p className="text-sm text-gray-500">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{isRTL ? "الموقع" : "Location"}</p>
                      <p className="text-sm text-gray-500">{userProfile?.city && userProfile?.country ? `${userProfile.city}, ${userProfile.country}` : 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{isRTL ? "المنطقة الزمنية" : "Timezone"}</p>
                      <p className="text-sm text-gray-500">{userProfile?.timezone || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills and Portfolio Section - Only for Freelancers */}
        {getUserTypeString(user) === 'freelancer' && (
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              {/* Skills Section */}
              <SkillsManager />
              
              {/* Portfolio Section */}
              <PortfolioManager />
            </div>
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
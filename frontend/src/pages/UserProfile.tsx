import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocalization } from "../hooks/useLocalization";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { cn, getUserTypeString } from "../lib/utils";
import { config } from "../config/env";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/sections/Footer";
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
import { Badge } from "../components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Globe,
  Clock,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Star,
  MapPin,
  DollarSign,
  Award,
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  Loader2,
} from "lucide-react";
import { userService } from "../services/user.service";
import { freelancerProfileService } from "../services/freelancerProfile.service";
import { UserResponse, UserType } from "../types/api";

// Import types from the service
type FreelancerProfileResponse = import("../services/freelancerProfile.service").FreelancerProfileResponse;
type PortfolioItem = import("../services/freelancerProfile.service").PortfolioItem;

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLocalization();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <CheckCircle className="h-4 w-4 text-gray-400" />
    );
  };

  // Load user profile and freelancer data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Load basic user data
        const userData = await userService.getUser(userId);
        setUser(userData);
        
        // If user is a freelancer, load detailed freelancer profile
        const userTypeString = getUserTypeString(userData);
        if (userTypeString === 'freelancer') {
          try {
            const freelancerData = await freelancerProfileService.getFreelancerProfile(userId);
            setFreelancerProfile(freelancerData);
          } catch (freelancerError: any) {
            console.warn('Could not load freelancer profile:', freelancerError);
            // Don't show error for freelancer profile, just continue without it
          }
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        setError(error?.message || "Failed to load user profile");
        toast({
          title: isRTL ? "خطأ في التحميل" : "Error",
          description: isRTL ? "فشل في تحميل الملف الشخصي" : "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, isRTL, toast]);

  const handleContact = () => {
    if (!isAuthenticated) {
      toast({
        title: isRTL ? "تسجيل الدخول مطلوب" : "Login Required",
        description: isRTL ? "يرجى تسجيل الدخول للتواصل مع المستقل" : "Please log in to contact this freelancer",
        variant: "destructive",
      });
      return;
    }
    navigate(`/messages?userId=${userId}`);
  };

  // Loading state
  if (loading) {
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

  // Error state
  if (error || !user) {
    return (
      <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
        <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#0A2540] mb-4">
              {isRTL ? "الملف الشخصي غير متاح" : "Profile Not Available"}
            </h1>
            <p className="text-muted-foreground mb-4">
              {error || (isRTL ? "لم يتم العثور على الملف الشخصي" : "Profile not found")}
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isRTL ? "العودة" : "Go Back"}
            </Button>
          </div>
        </main>
        <Footer isRTL={isRTL} />
      </div>
    );
  }

  // Don't show profile if it's the current user (redirect to own profile)
  if (currentUser && currentUser.id === user.id) {
    navigate('/profile');
    return null;
  }

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-[#0A2540] hover:bg-[#0A2540]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isRTL ? "العودة" : "Back"}
          </Button>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "الملف الشخصي" : "Profile"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL
              ? "عرض معلومات المستقل"
              : "View freelancer information"
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
                    <AvatarImage src={getAvatarUrl(user.avatarUrl)} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="bg-[#0A2540] text-white text-2xl">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.firstName} {user.lastName}</CardTitle>
                <CardDescription className="text-base">
                  {getUserTypeString(user) === 'freelancer' 
                    ? (isRTL ? "مستقل" : "Freelancer")
                    : (isRTL ? "عميل" : "Client")
                  }
                </CardDescription>
                
                {/* Freelancer Stats */}
                {freelancerProfile && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{freelancerProfile.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-gray-500">({freelancerProfile.totalReviews || 0})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span>{freelancerProfile.totalProjects || 0} {isRTL ? "مشاريع" : "projects"}</span>
                      </div>
                    </div>
                    {freelancerProfile.hourlyRate && (
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">${freelancerProfile.hourlyRate}/hr</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Verification Status */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {getVerificationIcon(user.isVerified || false)}
                    <span className={user.isVerified ? "text-green-600" : "text-gray-500"}>
                      {isRTL ? "البريد الإلكتروني" : "Email"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {getVerificationIcon(user.isActive || false)}
                    <span className={user.isActive ? "text-green-600" : "text-gray-500"}>
                      {isRTL ? "الحساب" : "Account"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{isRTL ? "عضو منذ" : "Member since"} {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{getUserTypeString(user) === 'freelancer' ? (isRTL ? "مطور" : "Freelancer") : (isRTL ? "عميل" : "Client")}</span>
                </div>
                
                {/* Contact Button */}
                {isAuthenticated && getUserTypeString(user) === 'freelancer' && (
                  <Button 
                    onClick={handleContact}
                    className="w-full bg-[#0A2540] hover:bg-[#142b52]"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isRTL ? "تواصل معه" : "Contact"}
                  </Button>
                )}
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
                      value={`${user.firstName || ''} ${user.lastName || ''}`}
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>
                  {user.phone && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">{isRTL ? "رقم الهاتف" : "Phone Number"}</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        disabled={true}
                        className="bg-gray-50"
                      />
                    </div>
                  )}
                </div>
                {/* Bio field - Only for freelancers */}
                {getUserTypeString(user) === 'freelancer' && (
                  <div className="space-y-2">
                    <Label htmlFor="bio">{isRTL ? "نبذة شخصية" : "Bio"}</Label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm min-h-[100px]">
                      {freelancerProfile?.bio || user.bio || 'No bio provided'}
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
                      <p className="text-sm text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{isRTL ? "الموقع" : "Location"}</p>
                      <p className="text-sm text-gray-500">
                        {user.city && user.country 
                          ? `${user.city}, ${user.country}`
                          : user.city || user.country || 'Not specified'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{isRTL ? "المنطقة الزمنية" : "Timezone"}</p>
                      <p className="text-sm text-gray-500">{user.timezone || 'Not specified'}</p>
                    </div>
                  </div>
                  {getUserTypeString(user) === 'freelancer' && freelancerProfile?.hourlyRate && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{isRTL ? "السعر بالساعة" : "Hourly Rate"}</p>
                        <p className="text-sm text-gray-500">${freelancerProfile.hourlyRate}/hr</p>
                      </div>
                    </div>
                  )}
                  {getUserTypeString(user) === 'freelancer' && freelancerProfile?.experienceLevel && (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{isRTL ? "مستوى الخبرة" : "Experience Level"}</p>
                        <p className="text-sm text-gray-500">
                          {freelancerProfile.experienceLevel === 'ENTRY' && (isRTL ? 'مبتدئ' : 'Entry Level')}
                          {freelancerProfile.experienceLevel === 'INTERMEDIATE' && (isRTL ? 'متوسط' : 'Intermediate')}
                          {freelancerProfile.experienceLevel === 'SENIOR' && (isRTL ? 'خبير' : 'Senior')}
                          {freelancerProfile.experienceLevel === 'EXPERT' && (isRTL ? 'خبير جداً' : 'Expert')}
                        </p>
                      </div>
                    </div>
                  )}
                  {getUserTypeString(user) === 'freelancer' && freelancerProfile?.availability && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{isRTL ? "التوفر" : "Availability"}</p>
                        <p className="text-sm text-gray-500">
                          {freelancerProfile.availability === 'AVAILABLE' && (isRTL ? 'متاح' : 'Available')}
                          {freelancerProfile.availability === 'BUSY' && (isRTL ? 'مشغول' : 'Busy')}
                          {freelancerProfile.availability === 'UNAVAILABLE' && (isRTL ? 'غير متاح' : 'Unavailable')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills and Portfolio Section - Only for Freelancers */}
        {getUserTypeString(user) === 'freelancer' && (
          <div className="space-y-8">
            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {isRTL ? "المهارات" : "Skills"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {freelancerProfile?.skills && freelancerProfile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {freelancerProfile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm border-[#0A2540] text-[#0A2540] bg-[#0A2540]/10"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRTL ? "لا توجد مهارات" : "No Skills Added"}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? "لم يتم إضافة أي مهارات بعد" 
                        : "This freelancer hasn't added any skills yet"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {isRTL ? "معرض الأعمال" : "Portfolio"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {freelancerProfile?.portfolios && freelancerProfile.portfolios.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {freelancerProfile.portfolios.map((portfolio) => (
                      <div key={portfolio.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        {portfolio.imageUrl && (
                          <img
                            src={portfolio.imageUrl}
                            alt={portfolio.title}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-[#0A2540] mb-2">{portfolio.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{portfolio.description}</p>
                        
                        {portfolio.projectType && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {portfolio.projectType}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {portfolio.projectUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(portfolio.projectUrl, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {isRTL ? "المشروع" : "Project"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRTL ? "لا يوجد معرض أعمال" : "No Portfolio Items"}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? "لم يتم إضافة أي مشاريع إلى المعرض بعد" 
                        : "This freelancer hasn't added any portfolio items yet"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {freelancerProfile && (freelancerProfile.linkedinUrl || freelancerProfile.githubUrl || freelancerProfile.websiteUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {isRTL ? "الروابط الاجتماعية" : "Social Links"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {freelancerProfile.linkedinUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(freelancerProfile.linkedinUrl, '_blank')}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                    {freelancerProfile.githubUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(freelancerProfile.githubUrl, '_blank')}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    )}
                    {freelancerProfile.websiteUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(freelancerProfile.websiteUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {isRTL ? "الموقع الشخصي" : "Website"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  User,
  MessageCircle,
  ThumbsUp,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  TrendingUp,
  Users,
  FileText,
  Edit,
  Trash2,
  Flag,
  Shield,
  Check,
  X,
  Send,
  Reply,
  Heart,
  ThumbsDown,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileBarChart
} from 'lucide-react';
import { ReviewCard, ReviewForm, ReviewsSummary } from '@/components/reviews/ReviewCard';
import { Review } from '@/types/contract';
import { useReviews, useUserReviewStatistics, useSearchReviews, useTestReviewsApi, useMyReviews } from '@/hooks/useReviews';
import { ReviewResponse } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function ReviewsPageContent() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // Get current user ID from auth context
  const currentUserId = user?.id;

  // Backend API calls with error handling
  const { data: myReviewsData, isLoading: myReviewsLoading, error: myReviewsError } = useMyReviews(0, 20);

  const { data: statisticsData, isLoading: statsLoading, error: statsError } = useUserReviewStatistics(currentUserId?.toString() || '');

  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchReviews(searchTerm, 0, 20);

  // Test API endpoint
  const { data: testData, isLoading: testLoading, error: testError } = useTestReviewsApi();

  // Convert backend data to frontend format
  const convertBackendReview = (backendReview: ReviewResponse): Review => ({
    id: backendReview.id,
    contractId: backendReview.contractId,
    reviewerId: backendReview.reviewerId,
    revieweeId: backendReview.revieweeId,
    rating: backendReview.rating,
    comment: backendReview.comment,
    type: backendReview.reviewerId === currentUserId?.toString() ? 'freelancer_to_client' : 'client_to_freelancer', // Map to correct types
    createdAt: backendReview.createdAt
  });

  // Always use backend data (even if empty)
  const backendReviews = myReviewsData?.content?.map(convertBackendReview) || [];
  const searchResults = searchData?.content?.map(convertBackendReview) || [];

  // Debug logging
  console.log('Reviews Debug:', {
    myReviewsData,
    backendReviews,
    myReviewsLoading,
    myReviewsError,
    currentUserId,
    isAuthenticated
  });

  // Use backend data (no fallback to mock data)
  const reviews = backendReviews;
  const currentReviews = searchTerm ? searchResults : reviews;

  // Filter reviews by type (sent/received)
  const receivedReviews = currentReviews.filter(review => review.type === 'client_to_freelancer');
  const sentReviews = currentReviews.filter(review => review.type === 'freelancer_to_client');

  const contracts = [
    {
      id: 'c1',
      title: isRTL ? 'تطوير موقع إلكتروني' : 'E-commerce Website Development',
      clientName: isRTL ? 'شركة التقنية المتقدمة' : 'Advanced Technology Company',
      freelancerName: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      status: 'completed',
      completedAt: '2025-01-15',
      amount: 5000,
      currency: 'USD',
      duration: '2 months'
    },
    {
      id: 'c2',
      title: isRTL ? 'تصميم هوية بصرية' : 'Brand Identity Design',
      clientName: isRTL ? 'مؤسسة الإبداع' : 'Innovation Foundation',
      freelancerName: isRTL ? 'فاطمة الزهراء' : 'Fatima Al-Zahra',
      status: 'completed',
      completedAt: '2025-01-10',
      amount: 2500,
      currency: 'USD',
      duration: '3 weeks'
    },
    {
      id: 'c3',
      title: isRTL ? 'كتابة محتوى تسويقي' : 'Marketing Content Writing',
      clientName: isRTL ? 'شركة التسويق الرقمي' : 'Digital Marketing Company',
      freelancerName: isRTL ? 'علي الكاتب' : 'Ali Writer',
      status: 'completed',
      completedAt: '2025-01-08',
      amount: 1500,
      currency: 'USD',
      duration: '1 month'
    }
  ];

  const getContractById = (id: string) => contracts.find(c => c.id === id);

  const filteredReviews = currentReviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    receivedReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const getAverageRating = () => {
    if (receivedReviews.length === 0) return 0;
    const sum = receivedReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / receivedReviews.length).toFixed(1);
  };

  const handleSubmitReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      id: Date.now().toString(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    // Review will be added to backend via API call
    alert(isRTL ? 'تم إرسال التقييم بنجاح' : 'Review submitted successfully');
    setShowReviewForm(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleUpdateReview = (updatedData: Omit<Review, 'id' | 'createdAt'>) => {
    if (editingReview) {
      // Review will be updated via API call
      alert(isRTL ? 'تم تحديث التقييم بنجاح' : 'Review updated successfully');
      setEditingReview(null);
      setShowReviewForm(false);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    // Review will be deleted via API call
    setShowDeleteDialog(false);
    setReviewToDelete(null);
    alert(isRTL ? 'تم حذف التقييم' : 'Review deleted');
  };

  const handleMarkHelpful = (reviewId: string) => {
    // Helpful action will be handled via API call
  };

  const handleReportReview = (reviewId: string) => {
    alert(isRTL ? 'تم الإبلاغ عن التقييم' : 'Review reported');
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "التقييمات والمراجعات" : "Reviews & Ratings"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "إدارة التقييمات التي تلقيتها وأرسلتها للعملاء والمستقلين" 
              : "Manage reviews you've received and sent to clients and freelancers"
            }
          </p>
        </div>

        {/* Reviews Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "متوسط التقييم" : "Average Rating"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl font-bold text-[#0A2540]">{averageRating}</span>
                    {renderStars(Math.round(parseFloat(averageRating.toString())), 'lg')}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    +0.2 {isRTL ? "من الشهر الماضي" : "from last month"}
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي التقييمات" : "Total Reviews"}
                  </p>
                  <p className="text-3xl font-bold text-[#0A2540]">{receivedReviews.length}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    +3 {isRTL ? "هذا الشهر" : "this month"}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "تقييمات إيجابية" : "Positive Reviews"}
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {receivedReviews.filter(r => r.rating >= 4).length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {receivedReviews.length > 0 
                      ? Math.round((receivedReviews.filter(r => r.rating >= 4).length / receivedReviews.length) * 100)
                      : 0}% {isRTL ? "من الإجمالي" : "of total"}
                  </p>
                </div>
                <ThumbsUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "معدل الاستجابة" : "Response Rate"}
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {receivedReviews.length > 0 
                      ? 0
                      : 0}%
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    0 {isRTL ? "رد" : "responses"}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {isRTL ? "توزيع التقييمات" : "Rating Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating as keyof typeof distribution];
                const percentage = receivedReviews.length > 0 ? (count / receivedReviews.length) * 100 : 0;
                const isEmpty = count === 0;
                
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isEmpty 
                              ? 'bg-gray-300' 
                              : rating >= 4 
                                ? 'bg-green-500' 
                                : rating >= 3 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                          }`}
                          style={{ width: isEmpty ? '0%' : `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Test API Status */}
        {testData && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">
                {isRTL ? "واجهة برمجة التطبيقات تعمل بنجاح" : "API is working successfully"}
              </span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              {isRTL ? "تم الاتصال بالخادم بنجاح" : "Successfully connected to server"}
            </p>
          </div>
        )}

        {/* Loading State */}
        {(myReviewsLoading || statsLoading || testLoading) && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            <span className="ml-3 text-gray-600">
              {isRTL ? "جاري تحميل التقييمات..." : "Loading reviews..."}
            </span>
          </div>
        )}

        {/* Error State */}
        {(myReviewsError || statsError || searchError || testError) && (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <div className="ml-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? "خطأ في التحميل" : "Error Loading Reviews"}
              </h3>
              <p className="text-gray-500">
                {isRTL 
                  ? "حدث خطأ أثناء جلب التقييمات. سيتم عرض البيانات الافتراضية."
                  : "An error occurred while fetching reviews. Showing default data."
                }
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {isRTL 
                  ? "قد يكون الخادم غير متاح أو هناك مشكلة في الاتصال."
                  : "Server may be unavailable or there's a connection issue."
                }
              </p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-first responsive tabs */}
          <div className="space-y-4 mb-6">
            {/* Tabs */}
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="received" className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm text-center">
                <span className="hidden sm:inline">
                  {isRTL ? "التقييمات المستلمة" : "Received Reviews"}
                </span>
                <span className="sm:hidden">
                  {isRTL ? "مستلمة" : "Received"}
                </span>
                <Badge variant="secondary" className="mt-1 text-xs px-1.5 py-0.5">
                  {receivedReviews.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm text-center">
                <span className="hidden sm:inline">
                  {isRTL ? "التقييمات المرسلة" : "Sent Reviews"}
                </span>
                <span className="sm:hidden">
                  {isRTL ? "مرسلة" : "Sent"}
                </span>
                <Badge variant="secondary" className="mt-1 text-xs px-1.5 py-0.5">
                  {sentReviews.length}
                </Badge>
              </TabsTrigger>
               <TabsTrigger value="statistics" className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm text-center h-full">
                 <div className="flex flex-col items-center justify-center h-full">
                   <span className="hidden sm:inline">
                     {isRTL ? "الإحصائيات" : "Statistics"}
                   </span>
                   <span className="sm:hidden">
                     {isRTL ? "إحصائيات" : "Stats"}
                   </span>
                 </div>
               </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "البحث في التقييمات..." : "Search reviews..."}
                  className={cn("pl-9 h-10", isRTL && "pr-9 text-right")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "تصفية حسب التقييم" : "Filter by Rating"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="5">5 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                  <SelectItem value="4">4 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                  <SelectItem value="3">3 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                  <SelectItem value="2">2 {isRTL ? "نجوم" : "Stars"}</SelectItem>
                  <SelectItem value="1">1 {isRTL ? "نجمة" : "Star"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Received Reviews Tab */}
          <TabsContent value="received" className="space-y-6">
            {receivedReviews.length > 0 ? (
              receivedReviews.map((review) => {
                const contract = getContractById(review.contractId);
                if (!contract) return null;

                return (
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=100&h=100&fit=crop&crop=face`} />
                            <AvatarFallback>
                              {review.type === 'client_to_freelancer' ? contract.clientName.charAt(0) : contract.freelancerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {review.type === 'client_to_freelancer' ? contract.clientName : contract.freelancerName}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                              <Badge variant="outline">
                                {contract.title}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                            

                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkHelpful(review.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            0
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportReview(review.id)}
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد تقييمات مستلمة" : "No Received Reviews"}
                  </h3>
                  <p className="text-gray-500">
                    {isRTL 
                      ? "ستظهر التقييمات التي تلقيتها من العملاء أو المستقلين هنا"
                      : "Reviews you receive from clients or freelancers will appear here"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Sent Reviews Tab */}
          <TabsContent value="sent" className="space-y-6">
            {sentReviews.length > 0 ? (
              sentReviews.map((review) => {
                const contract = getContractById(review.contractId);
                if (!contract) return null;

                return (
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=100&h=100&fit=crop&crop=face`} />
                            <AvatarFallback>
                              {review.type === 'client_to_freelancer' ? contract.freelancerName.charAt(0) : contract.clientName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {review.type === 'client_to_freelancer' ? contract.freelancerName : contract.clientName}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                              <Badge variant="outline">
                                {contract.title}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                            

                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditReview(review)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReviewToDelete(review.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد تقييمات مرسلة" : "No Sent Reviews"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم ترسل أي تقييمات بعد. ابدأ بتقييم المشاريع المكتملة"
                      : "You haven't sent any reviews yet. Start by reviewing completed projects"
                    }
                  </p>
                  <Button onClick={() => setShowReviewForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "كتابة تقييم جديد" : "Write New Review"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

           {/* Statistics Tab */}
           <TabsContent value="statistics" className="space-y-6">
             {statsLoading ? (
               <div className="flex items-center justify-center py-12">
                 <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                 <span className="ml-3 text-gray-600">
                   {isRTL ? "جاري تحميل الإحصائيات..." : "Loading statistics..."}
                 </span>
               </div>
             ) : statsError ? (
               <Card>
                 <CardContent className="p-8 text-center">
                   <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 mb-2">
                     {isRTL ? "خطأ في تحميل الإحصائيات" : "Error Loading Statistics"}
                   </h3>
                   <p className="text-gray-500">
                     {isRTL 
                       ? "حدث خطأ أثناء جلب إحصائيات التقييمات"
                       : "An error occurred while fetching review statistics"
                     }
                   </p>
                 </CardContent>
               </Card>
             ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Review Statistics Summary */}
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <BarChart3 className="h-5 w-5" />
                       {isRTL ? "ملخص الإحصائيات" : "Statistics Summary"}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div className="text-center p-4 bg-gray-50 rounded-lg">
                           <p className="text-sm text-gray-600">{isRTL ? "متوسط التقييم" : "Average Rating"}</p>
                           <p className="text-2xl font-bold text-[#0A2540]">{averageRating}</p>
                           {renderStars(Math.round(parseFloat(averageRating.toString())), 'sm')}
                         </div>
                         <div className="text-center p-4 bg-gray-50 rounded-lg">
                           <p className="text-sm text-gray-600">{isRTL ? "إجمالي التقييمات" : "Total Reviews"}</p>
                           <p className="text-2xl font-bold text-[#0A2540]">{receivedReviews.length}</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="text-center p-4 bg-gray-50 rounded-lg">
                           <p className="text-sm text-gray-600">{isRTL ? "تقييمات إيجابية" : "Positive Reviews"}</p>
                           <p className="text-2xl font-bold text-green-600">
                             {receivedReviews.filter(r => r.rating >= 4).length}
                           </p>
                           <p className="text-xs text-gray-500">
                             {receivedReviews.length > 0 
                               ? Math.round((receivedReviews.filter(r => r.rating >= 4).length / receivedReviews.length) * 100)
                               : 0}%
                           </p>
                         </div>
                         <div className="text-center p-4 bg-gray-50 rounded-lg">
                           <p className="text-sm text-gray-600">{isRTL ? "أعلى تقييم" : "Highest Rating"}</p>
                           <p className="text-2xl font-bold text-yellow-600">
                             {receivedReviews.length > 0 ? Math.max(...receivedReviews.map(r => r.rating)) : 0}
                           </p>
                         </div>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 {/* Rating Distribution */}
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <TrendingUp className="h-5 w-5" />
                       {isRTL ? "توزيع التقييمات" : "Rating Distribution"}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
                       {[5, 4, 3, 2, 1].map((rating) => {
                         const count = distribution[rating as keyof typeof distribution];
                         const percentage = receivedReviews.length > 0 ? (count / receivedReviews.length) * 100 : 0;
                         const isEmpty = count === 0;
                         
                         return (
                           <div key={rating} className="flex items-center gap-4">
                             <div className="flex items-center gap-2 w-20">
                               <span className="text-sm font-medium">{rating}</span>
                               <Star className="h-4 w-4 text-yellow-400 fill-current" />
                             </div>
                             <div className="flex-1">
                               <div className="w-full bg-gray-200 rounded-full h-2">
                                 <div 
                                   className={`h-2 rounded-full transition-all duration-300 ${
                                     isEmpty 
                                       ? 'bg-gray-300' 
                                       : rating >= 4 
                                         ? 'bg-green-500' 
                                         : rating >= 3 
                                           ? 'bg-yellow-500' 
                                           : 'bg-red-500'
                                   }`}
                                   style={{ width: isEmpty ? '0%' : `${percentage}%` }}
                                 />
                               </div>
                             </div>
                             <span className="text-sm text-gray-600 w-12 text-right">
                               {count}
                             </span>
                           </div>
                         );
                       })}
                     </div>
                   </CardContent>
                 </Card>

                 {/* Recent Reviews */}
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Clock className="h-5 w-5" />
                       {isRTL ? "أحدث التقييمات" : "Recent Reviews"}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     {receivedReviews.length > 0 ? (
                       <div className="space-y-4">
                         {receivedReviews.slice(0, 5).map((review) => {
                           const contract = getContractById(review.contractId);
                           if (!contract) return null;
                           
                           return (
                             <div key={review.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                               <Avatar className="h-10 w-10">
                                 <AvatarImage src={`https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=100&h=100&fit=crop&crop=face`} />
                                 <AvatarFallback>
                                   {contract.clientName.charAt(0)}
                                 </AvatarFallback>
                               </Avatar>
                               <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-1">
                                   <h4 className="font-medium text-sm">{contract.clientName}</h4>
                                   {renderStars(review.rating, 'sm')}
                                 </div>
                                 <p className="text-sm text-gray-600 mb-1">{contract.title}</p>
                                 <p className="text-xs text-gray-500">
                                   {new Date(review.createdAt).toLocaleDateString()}
                                 </p>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     ) : (
                       <div className="text-center py-8">
                         <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                         <p className="text-gray-500">
                           {isRTL ? "لا توجد تقييمات للعرض" : "No reviews to display"}
                         </p>
                       </div>
                     )}
                   </CardContent>
                 </Card>
               </div>
             )}
           </TabsContent>
        </Tabs>

        {/* Review Form Dialog */}
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReview 
                  ? (isRTL ? "تعديل التقييم" : "Edit Review")
                  : (isRTL ? "كتابة تقييم جديد" : "Write New Review")
                }
              </DialogTitle>
            </DialogHeader>
            <ReviewForm
              contractId={selectedContractId}
              reviewerId={user?.id?.toString() || 'c1'}
              revieweeId={user?.id?.toString() || 'f1'}
              reviewType="client_to_freelancer"
              revieweeName="User"
              isRTL={isRTL}
              onSubmit={editingReview ? handleUpdateReview : handleSubmitReview}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                {isRTL
                  ? "هل أنت متأكد من أنك تريد حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء."
                  : "Are you sure you want to delete this review? This action cannot be undone."
                }
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => reviewToDelete && handleDeleteReview(reviewToDelete)}
                >
                  {isRTL ? "حذف" : "Delete"}
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

// Export the page wrapped with ProtectedRoute
export default function ReviewsPage() {
  return (
    <ProtectedRoute>
      <ReviewsPageContent />
    </ProtectedRoute>
  );
}
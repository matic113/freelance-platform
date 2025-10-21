import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle,
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  Flag,
  Edit,
  Trash2,
  Clock,
  Award,
  TrendingUp,
  FileText,
  BarChart3,
  Loader2
} from 'lucide-react';
import { ReviewForm } from '@/components/reviews/ReviewCard';
import { useUserReviewStatistics, useSearchReviews, useMyReviews, useCreateReview, useUpdateReview, useDeleteReview } from '@/hooks/useReviews';
import type { ReviewResponse } from '@/types/api';
import { UserType } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { reviewService } from '@/services/review.service';
import { contractService } from '@/services/contract.service';
import { projectService } from '@/services/project.service';
import type { ContractResponse } from '@/types/contract';
import { useToast } from '@/hooks/use-toast';

// Local UI type derived from backend
type UIReview = ReviewResponse & { type: 'client_to_freelancer' | 'freelancer_to_client' };

function ReviewsPageContent() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { user, activeRole } = useAuth();
  const navigate = useNavigate();
  const { contractId, projectId } = useParams<{ contractId?: string; projectId?: string }>();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('received');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [contractData, setContractData] = useState<Record<string, any> | null>(null);
  const [revieweeData, setRevieweeData] = useState<{ id: string; name: string } | null>(null);
  const [loadingContractData, setLoadingContractData] = useState(false);
  const [editingReview, setEditingReview] = useState<UIReview | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
   const [reviewType, setReviewType] = useState<'client_to_freelancer' | 'freelancer_to_client'>('client_to_freelancer');

  // Get current user ID from auth context
  const currentUserId = user?.id || '';

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (contractId) {
        const c = await fetchContractById(contractId);
        if (!cancelled && c) {
          setShowReviewForm(true);
        }
      } else if (projectId) {
        const c = await resolveContractByProject(projectId);
        if (!cancelled && c) {
          setShowReviewForm(true);
        }
      }
    };
    init();
    return () => { cancelled = true; };
  }, [contractId, projectId, activeRole, currentUserId]);

  const fetchContractById = async (id: string) => {
    setLoadingContractData(true);
    try {
      const contract = await contractService.getContract(id);
      setSelectedContractId(contract.id);
      setContractData(contract as unknown as Record<string, any>);
      if (currentUserId) {
        if (contract.clientId === currentUserId) {
          setRevieweeData({ id: contract.freelancerId, name: contract.freelancerName || 'Freelancer' });
          setReviewType('client_to_freelancer');
        } else if (contract.freelancerId === currentUserId) {
          setRevieweeData({ id: contract.clientId, name: contract.clientName || 'Client' });
          setReviewType('freelancer_to_client');
        }
      }
      return contract;
    } catch (error) {
      console.error('Error fetching contract by id:', error);
      return null;
    } finally {
      setLoadingContractData(false);
    }
  };

  const resolveContractByProject = async (pid: string) => {
    setLoadingContractData(true);
    try {
      const project = await projectService.getProject(pid);
      // Try to fetch contracts list for current role and find matching project
      const pageSize = 50;
      const list = activeRole === UserType.CLIENT
        ? await contractService.getMyContracts(0, pageSize)
        : await contractService.getFreelancerContracts(0, pageSize);
      const match = list.content.find(c => c.projectId === project.id);
      if (match) {
        setSelectedContractId(match.id);
        setContractData(match as unknown as Record<string, any>);
        if (currentUserId) {
          if (match.clientId === currentUserId) {
            setRevieweeData({ id: match.freelancerId, name: (match as any).freelancerName || 'Freelancer' });
            setReviewType('client_to_freelancer');
          } else if (match.freelancerId === currentUserId) {
            setRevieweeData({ id: match.clientId, name: (match as any).clientName || 'Client' });
            setReviewType('freelancer_to_client');
          }
        }
        return match;
      } else {
        toast({ title: isRTL ? 'لم يتم العثور على عقد لهذا المشروع' : 'No contract found for this project' });
        return null;
      }
    } catch (error) {
      console.error('Error resolving contract by project:', error);
      return null;
    } finally {
      setLoadingContractData(false);
    }
  };

   // Backend API calls with error handling
   const { data: myReviewsData, isLoading: myReviewsLoading, error: myReviewsError } = useMyReviews(0, 20);
   const { data: statisticsData, isLoading: statsLoading, error: statsError } = useUserReviewStatistics(currentUserId);
   const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchReviews(searchTerm, 0, 20);



   const deriveType = (review: ReviewResponse): 'client_to_freelancer' | 'freelancer_to_client' => {
     if (review.reviewerId === currentUserId) {
       if (activeRole === UserType.CLIENT) return 'client_to_freelancer';
       if (activeRole === UserType.FREELANCER) return 'freelancer_to_client';
       return 'client_to_freelancer';
     }

     if (review.revieweeId === currentUserId) {
       if (activeRole === UserType.CLIENT) return 'freelancer_to_client';
       if (activeRole === UserType.FREELANCER) return 'client_to_freelancer';
       return 'client_to_freelancer';
     }

     return 'client_to_freelancer';
   };

  const mapToUIReview = (review: ReviewResponse): UIReview => ({ ...review, type: deriveType(review) });

   // Current list (search or mine), mapped to UIReview with derived type
   const allMine = myReviewsData?.content || [];
   const allSearch = searchData?.content || [];
   const currentBase: ReviewResponse[] = searchTerm ? allSearch : allMine;
   const currentReviews: UIReview[] = useMemo(() => currentBase.map(mapToUIReview), [currentBase, currentUserId, activeRole]);

  // Filter by search term and rating
  const filteredReviews = currentReviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  // Grouping by direction relative to current user
  const receivedReviews = filteredReviews.filter(r => r.revieweeId === currentUserId);
  const sentReviews = filteredReviews.filter(r => r.reviewerId === currentUserId);

  const getRatingDistribution = () => {
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    receivedReviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const getAverageRating = () => {
    if (receivedReviews.length === 0) return 0;
    const sum = receivedReviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / receivedReviews.length).toFixed(1));
  };

  // Mutations
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const handleSubmitReview = async (reviewData: { contractId: string; rating: number; comment: string }) => {
    setSubmittingReview(true);
    try {
      const realContractId = selectedContractId || reviewData.contractId;
      if (!realContractId) {
        toast({ title: isRTL ? 'يرجى اختيار عقد صالح' : 'Please select a valid contract' });
        return;
      }

      const createRequest = {
        contractId: realContractId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        additionalFeedback: ''
      };

      await createReview.mutateAsync(createRequest);

      setShowReviewForm(false);
      toast({ title: isRTL ? 'تم إرسال التقييم بنجاح' : 'Review submitted successfully' });

      if (contractId || projectId) {
        setTimeout(() => navigate('/reviews'), 800);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({ title: isRTL ? 'فشل في إرسال التقييم' : 'Failed to submit review' });
    } finally {
      setSubmittingReview(false);
    }
  };

   const handleEditReview = (review: UIReview) => {
     setEditingReview(review);
     setSelectedContractId(review.contractId);
     if (currentUserId) {
       if (review.reviewerId === currentUserId) {
         setRevieweeData({ id: review.revieweeId, name: review.revieweeName || 'User' });
         setReviewType(review.type === 'freelancer_to_client' ? 'freelancer_to_client' : 'client_to_freelancer');
       } else {
         setRevieweeData({ id: review.reviewerId, name: review.reviewerName || 'User' });
         setReviewType(review.type);
       }
     }
     setShowReviewForm(true);
   };

  const handleUpdateReview = async (updatedData: { contractId: string; rating: number; comment: string }) => {
    if (editingReview) {
      setSubmittingReview(true);
      try {
        const updateRequest = {
          contractId: updatedData.contractId,
          rating: updatedData.rating,
          comment: updatedData.comment,
          additionalFeedback: ''
        };

        await updateReview.mutateAsync({ id: editingReview.id, data: updateRequest });

        setEditingReview(null);
        setShowReviewForm(false);
        toast({ title: isRTL ? 'تم تحديث التقييم بنجاح' : 'Review updated successfully' });
      } catch (error) {
        console.error('Error updating review:', error);
        toast({ title: isRTL ? 'فشل في تحديث التقييم' : 'Failed to update review' });
      } finally {
        setSubmittingReview(false);
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setSubmittingReview(true);
    try {
      await deleteReview.mutateAsync(reviewId);
      setShowDeleteDialog(false);
      setReviewToDelete(null);
      toast({ title: isRTL ? 'تم حذف التقييم' : 'Review deleted' });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({ title: isRTL ? 'فشل في حذف التقييم' : 'Failed to delete review' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkHelpful = (reviewId: string) => {
    // Helpful action will be handled via API call later
  };

  const handleReportReview = async (reviewId: string) => {
    try {
      await reviewService.reportReview(reviewId, { reason: 'INAPPROPRIATE' });
      toast({ title: isRTL ? 'تم الإبلاغ عن التقييم' : 'Review reported' });
    } catch (e) {
      toast({ title: isRTL ? 'فشل الإبلاغ' : 'Report failed' });
    }
  };

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div className={cn('min-h-screen bg-muted/30', isRTL && 'rtl')} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? 'إدارة التقييمات التي تلقيتها وأرسلتها للعملاء والمستقلين' 
              : "Manage reviews you've received and sent to clients and freelancers"
            }
          </p>
        </div>

         {/* Reviews Summary & Distribution - Left Column */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Left Column: Cards and Distribution */}
           <div className="lg:col-span-1 space-y-6">
             {/* Top Cards Grid (2x2) */}
             <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {isRTL ? 'متوسط التقييم' : 'Avg Rating'}
                      </p>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-2xl font-bold text-[#0A2540]">{averageRating}</span>
                      </div>
                      {(() => {
                        const stars = Math.round(Number(averageRating));
                        return (
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={cn('h-3 w-3', star <= stars ? 'text-yellow-400 fill-current' : 'text-gray-300')} />
                            ))}
                          </div>
                        );
                      })()}
                      <Award className="h-5 w-5 text-yellow-500 mt-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {isRTL ? 'إجمالي' : 'Total'}
                      </p>
                      <p className="text-2xl font-bold text-[#0A2540] mb-2">{receivedReviews.length}</p>
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {isRTL ? 'إيجابية' : 'Positive'}
                      </p>
                      <p className="text-2xl font-bold text-green-600 mb-1">
                        {receivedReviews.filter(r => r.rating >= 4).length}
                      </p>
                      <p className="text-xs text-green-600">
                        {receivedReviews.length > 0 
                          ? Math.round((receivedReviews.filter(r => r.rating >= 4).length / receivedReviews.length) * 100)
                          : 0}%
                      </p>
                      <ThumbsUp className="h-5 w-5 text-green-500 mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {isRTL ? 'أعلى تقييم' : 'Highest'}
                      </p>
                      <p className="text-2xl font-bold text-yellow-600 mb-2">
                        {receivedReviews.length > 0 ? Math.max(...receivedReviews.map(r => r.rating)) : 0}
                      </p>
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

             {/* Rating Distribution */}
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  {isRTL ? 'توزيع التقييمات' : 'Rating Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = distribution[rating as keyof typeof distribution];
                    const percentage = receivedReviews.length > 0 ? (count / receivedReviews.length) * 100 : 0;
                    const isEmpty = count === 0;
                    
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-xs font-medium">{rating}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
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
                        <span className="text-xs text-gray-600 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
           </div>

           {/* Right Column: Reviews - starts at top */}
           <div className="lg:col-span-2">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               {/* Mobile-first responsive tabs */}
               <div className="space-y-4 mb-6">
                 {/* Tabs */}
                  <TabsList className="grid w-full grid-cols-2 h-auto p-1">
                    <TabsTrigger value="received" className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm text-center">
                      <span className="hidden sm:inline">
                        {isRTL ? 'التقييمات المستلمة' : 'Received Reviews'}
                      </span>
                      <span className="sm:hidden">
                        {isRTL ? 'مستلمة' : 'Received'}
                      </span>
                      <Badge variant="secondary" className="mt-1 text-xs px-1.5 py-0.5">
                        {receivedReviews.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="flex flex-col items-center justify-center py-3 px-2 text-xs sm:text-sm text-center">
                      <span className="hidden sm:inline">
                        {isRTL ? 'التقييمات المرسلة' : 'Sent Reviews'}
                      </span>
                      <span className="sm:hidden">
                        {isRTL ? 'مرسلة' : 'Sent'}
                      </span>
                      <Badge variant="secondary" className="mt-1 text-xs px-1.5 py-0.5">
                        {sentReviews.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                 {/* Search and Filter */}
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       placeholder={isRTL ? 'البحث في التقييمات...' : 'Search reviews...'}
                       className={cn('pl-9 h-10', isRTL && 'pr-9 text-right')}
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                   </div>
                   <Select value={ratingFilter} onValueChange={setRatingFilter}>
                     <SelectTrigger className="w-full sm:w-[180px] h-10">
                       <Filter className="h-4 w-4 mr-2" />
                       <SelectValue placeholder={isRTL ? 'تصفية حسب التقييم' : 'Filter by Rating'} />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                       <SelectItem value="5">5 {isRTL ? 'نجوم' : 'Stars'}</SelectItem>
                       <SelectItem value="4">4 {isRTL ? 'نجوم' : 'Stars'}</SelectItem>
                       <SelectItem value="3">3 {isRTL ? 'نجوم' : 'Stars'}</SelectItem>
                       <SelectItem value="2">2 {isRTL ? 'نجوم' : 'Stars'}</SelectItem>
                       <SelectItem value="1">1 {isRTL ? 'نجمة' : 'Star'}</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>

                 {/* Received Reviews Tab */}
                 <TabsContent value="received" className="space-y-6">
               {receivedReviews.length > 0 ? (
                 receivedReviews.map((review) => {
                   const otherPartyName = review.reviewerName || (isRTL ? 'مستخدم' : 'User');

                   return (
                     <Card key={review.id} className="hover:shadow-md transition-shadow">
                       <CardContent className="p-6">
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex items-start gap-4">
                             <Avatar className="h-12 w-12">
                               <AvatarImage src={review.reviewerProfilePicture || undefined} />
                               <AvatarFallback>
                                 {otherPartyName.charAt(0)}
                               </AvatarFallback>
                             </Avatar>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                 <span className="text-sm text-gray-500 font-medium">
                                   {isRTL ? 'من' : 'From'}
                                 </span>
                                 <h3 className="font-semibold text-lg">
                                   {otherPartyName}
                                 </h3>
                               </div>
                              <div className="flex items-center gap-4 mb-3">
                                {(() => (
                                  <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map((s) => (
                                      <Star key={s} className={cn('h-4 w-4', s <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300')} />
                                    ))}
                                  </div>
                                ))()}
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                                <Badge variant="outline">
                                  {review.projectName || (isRTL ? 'مشروع' : 'Project')}
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-4">{review.comment}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
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
                      {isRTL ? 'لا توجد تقييمات مستلمة' : 'No Received Reviews'}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? 'ستظهر التقييمات التي تلقيتها من العملاء أو المستقلين هنا'
                        : 'Reviews you receive from clients or freelancers will appear here'
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
                   const otherPartyName = review.revieweeName || (isRTL ? 'مستخدم' : 'User');

                   return (
                     <Card key={review.id} className="hover:shadow-md transition-shadow">
                       <CardContent className="p-6">
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex items-start gap-4">
                             <Avatar className="h-12 w-12">
                               <AvatarImage src={review.revieweeProfilePicture || undefined} />
                               <AvatarFallback>
                                 {otherPartyName.charAt(0)}
                               </AvatarFallback>
                             </Avatar>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                 <span className="text-sm text-gray-500 font-medium">
                                   {isRTL ? 'إلى' : 'To'}
                                 </span>
                                 <h3 className="font-semibold text-lg">
                                   {otherPartyName}
                                 </h3>
                               </div>
                              <div className="flex items-center gap-4 mb-3">
                                {(() => (
                                  <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map((s) => (
                                      <Star key={s} className={cn('h-4 w-4', s <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300')} />
                                    ))}
                                  </div>
                                ))()}
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                                <Badge variant="outline">
                                  {review.projectName || (isRTL ? 'مشروع' : 'Project')}
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
                      {isRTL ? 'لا توجد تقييمات مرسلة' : 'No Sent Reviews'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {isRTL 
                        ? 'لم ترسل أي تقييمات بعد. ابدأ بتقييم المشاريع المكتملة'
                        : "You haven't sent any reviews yet. Start by reviewing completed projects"
                      }
                    </p>
                    <Button onClick={() => setShowReviewForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {isRTL ? 'كتابة تقييم جديد' : 'Write New Review'}
                    </Button>
                  </CardContent>
                </Card>
              )}
                </TabsContent>
             </Tabs>

             {/* Loading State */}
             {(myReviewsLoading || statsLoading) && (
               <div className="flex items-center justify-center py-12">
                 <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
                 <span className="ml-3 text-gray-600">
                   {isRTL ? 'جاري تحميل التقييمات...' : 'Loading reviews...'}
                 </span>
               </div>
             )}

             {/* Error State */}
             {(myReviewsError || statsError || searchError) && !myReviewsLoading && (
              <div className="flex items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <div className="ml-3 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? 'خطأ في التحميل' : 'Error Loading Reviews'}
                  </h3>
                  <p className="text-gray-500">
                    {isRTL 
                      ? 'حدث خطأ أثناء جلب التقييمات. سيتم عرض البيانات الافتراضية.'
                      : "An error occurred while fetching reviews. Showing default data."
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {isRTL 
                      ? 'قد يكون الخادم غير متاح أو هناك مشكلة في الاتصال.'
                      : "Server may be unavailable or there's a connection issue."
                    }
                  </p>
                </div>
              </div>
            )}
           </div>
         </div>

        {/* Review Form Dialog */}
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReview 
                  ? (isRTL ? 'تعديل التقييم' : 'Edit Review')
                  : (isRTL ? 'كتابة تقييم جديد' : 'Write New Review')
                }
              </DialogTitle>
            </DialogHeader>
            {!selectedContractId ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                {isRTL
                  ? 'لا يمكن إنشاء تقييم بدون عقد مرتبط. يرجى فتح هذه الصفحة من عقد مكتمل أو من مشروع له عقد، أو اختر عقدًا صالحًا.'
                  : 'Cannot create a review without a linked contract. Please open this page from a completed contract or from a project with an associated contract, or select a valid contract.'}
              </div>
            ) : (
              <ReviewForm
                contractId={selectedContractId}
                reviewerId={currentUserId || 'c1'}
                revieweeId={revieweeData?.id || currentUserId || 'f1'}
                reviewType={reviewType}
                revieweeName={revieweeData?.name || (contractData as any)?.freelancerName || (contractData as any)?.clientName || 'User'}
                isRTL={isRTL}
                onSubmit={editingReview ? handleUpdateReview : handleSubmitReview}
                onCancel={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? 'تأكيد الحذف' : 'Confirm Deletion'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                {isRTL
                  ? 'هل أنت متأكد من أنك تريد حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.'
                  : 'Are you sure you want to delete this review? This action cannot be undone.'
                }
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => reviewToDelete && handleDeleteReview(reviewToDelete)}
                >
                  {isRTL ? 'حذف' : 'Delete'}
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
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

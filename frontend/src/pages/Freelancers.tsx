import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { FreelancerCard } from "@/components/cards/FreelancerCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearchUsers, useFreelancerCards } from "@/hooks/useUsers";
import { getUserInitials } from "@/services/user.service";
import { Search, Loader2, Filter, MapPin, Star, Clock, X, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Convert FreelancerCardResponse to FreelancerCard format
const convertToFreelancerCard = (data: any) => {
  return {
    id: data.id,
    name: `${data.firstName} ${data.lastName}`,
    title: data.bio || "Freelancer",
    avatar: data.avatarUrl,
    rating: data.rating || 0,
    reviewsCount: data.totalReviews || 0,
    hourlyRate: { 
      min: data.hourlyRate || 20, 
      max: (data.hourlyRate || 20) + 10, 
      currency: "$" 
    },
    location: data.city && data.country 
      ? `${data.city}, ${data.country}` 
      : data.city 
        ? data.city 
        : data.country 
          ? data.country 
          : "Remote",
    skills: data.skills || [],
    completedJobs: data.totalProjects || 0,
    successRate: data.totalProjects > 0 ? Math.round((data.totalProjects / Math.max(data.totalProjects, 1)) * 100) : 0,
    isOnline: data.isActive,
    isVerified: data.isVerified,
    lastSeen: data.isActive ? "now" : "offline",
    description: data.bio || "Professional freelancer",
  };
};


export default function Freelancers() {
  const { isRTL, toggleLanguage } = useLocalization();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [paginationMode, setPaginationMode] = useState<'pages' | 'load-more'>('pages');
  
  // Filter states
  const [filters, setFilters] = useState({
    skills: [] as string[],
    hourlyRateRange: [0, 200] as [number, number],
    experienceLevel: 'all' as string,
    availability: 'all' as string,
    location: '' as string,
    rating: 0 as number,
    verified: false as boolean,
  });

  // Use real API data - get freelancer cards or search results
  const { data: freelancerCardsData, isLoading: isLoadingCards, error: errorCards } = useFreelancerCards(page, pageSize);
  const { data: searchData, isLoading: isLoadingSearch, error: errorSearch } = useSearchUsers(searchTerm, page, pageSize);
  
  // Use search results if there's a search term, otherwise use freelancer cards
  const usersData = searchTerm ? searchData : freelancerCardsData;
  const isLoading = searchTerm ? isLoadingSearch : isLoadingCards;
  const error = searchTerm ? errorSearch : errorCards;
  
  // Convert to freelancer card format
  const allFreelancers = usersData?.content?.map(convertToFreelancerCard) || [];

  // Get pagination info from API data
  const total = usersData?.totalElements || 0;
  const totalPages = usersData?.totalPages || 0;
  const filteredCount = allFreelancers.length;

  const freelancers = allFreelancers.filter(freelancer => {
    // Skills filter
    if (filters.skills.length > 0) {
      const hasMatchingSkill = filters.skills.some(skill => 
        freelancer.skills.some(freelancerSkill => 
          freelancerSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasMatchingSkill) return false;
    }

    // Hourly rate filter - check if the freelancer's rate range overlaps with the filter range
    const freelancerMinRate = freelancer.hourlyRate.min;
    const freelancerMaxRate = freelancer.hourlyRate.max;
    const filterMinRate = filters.hourlyRateRange[0];
    const filterMaxRate = filters.hourlyRateRange[1];
    
    // Check if there's any overlap between the ranges
    if (freelancerMinRate > filterMaxRate || freelancerMaxRate < filterMinRate) {
      return false;
    }

    // Location filter
    if (filters.location && !freelancer.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && freelancer.rating < filters.rating) {
      return false;
    }

    // Verified filter
    if (filters.verified && !freelancer.isVerified) {
      return false;
    }

    return true;
  });

  // Calculate pagination info
  const currentPage = page;
  const itemsPerPage = pageSize;
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, total);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  // Filter functions
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      hourlyRateRange: [0, 200],
      experienceLevel: 'all',
      availability: 'all',
      location: '',
      rating: 0,
      verified: false,
    });
    setPage(0);
  };

  const hasActiveFilters = () => {
    return filters.skills.length > 0 ||
           filters.hourlyRateRange[0] > 0 ||
           filters.hourlyRateRange[1] < 200 ||
           filters.experienceLevel !== 'all' ||
           filters.availability !== 'all' ||
           filters.location !== '' ||
           filters.rating > 0 ||
           filters.verified;
  };

   // Stats for the page - calculate from real data
  const activeFreelancers = usersData?.content?.filter((f: any) => f.isActive) || [];
  const verifiedFreelancers = usersData?.content?.filter((f: any) => f.isVerified) || [];
  
  const allRatings = usersData?.content
    ?.filter((f: any) => f.rating && f.rating > 0)
    .map((f: any) => f.rating) || [];
  const avgRating = allRatings.length > 0 
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
    : 0;
  
  const stats = {
    total: usersData?.totalElements || 0,
    online: activeFreelancers.length,
    verified: verifiedFreelancers.length,
    avgRating
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? "المستقلون" : "Freelancers"}
          </h1>
          <p className="text-gray-600">
            {isRTL 
              ? "اكتشف أفضل المستقلين الموهوبين لتنفيذ مشروعك"
              : "Discover talented freelancers to bring your project to life"
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي المستقلين" : "Total Freelancers"}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "متصل الآن" : "Online Now"}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{stats.online}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "موثق" : "Verified"}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">{stats.verified}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "متوسط التقييم" : "Avg Rating"}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">{stats.avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={isRTL ? "ابحث عن مستقل..." : "Search for freelancers..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                {isRTL ? "بحث" : "Search"}
              </Button>
              <Button
                type="button"
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {isRTL ? "فلاتر" : "Filters"}
                {hasActiveFilters() && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {isRTL ? "فلاتر البحث" : "Search Filters"}
                </h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {isRTL ? "مسح الفلاتر" : "Clear Filters"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Skills Filter */}
                <div className="space-y-2">
                  <Label>{isRTL ? "المهارات" : "Skills"}</Label>
                  <Input
                    placeholder={isRTL ? "أدخل المهارات..." : "Enter skills..."}
                    value={filters.skills.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      updateFilter('skills', skills);
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    {isRTL ? "افصل بين المهارات بفاصلة" : "Separate skills with commas"}
                  </p>
                  {filters.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filters.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              const newSkills = filters.skills.filter((_, i) => i !== index);
                              updateFilter('skills', newSkills);
                            }}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hourly Rate Filter */}
                <div className="space-y-2">
                  <Label>
                    {isRTL ? "السعر بالساعة" : "Hourly Rate"} 
                    <span className="text-sm text-gray-500 ml-1">
                      ${filters.hourlyRateRange[0]} - ${filters.hourlyRateRange[1]}
                    </span>
                  </Label>
                  <Slider
                    value={filters.hourlyRateRange}
                    onValueChange={(value) => updateFilter('hourlyRateRange', value)}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full [&>*:first-child]:bg-gray-200 [&>*:first-child>*]:bg-blue-500 [&>*:last-child]:border-blue-500 [&>*:last-child]:bg-white"
                  />
                </div>

                {/* Experience Level Filter */}
                <div className="space-y-2">
                  <Label>{isRTL ? "مستوى الخبرة" : "Experience Level"}</Label>
                  <Select
                    value={filters.experienceLevel}
                    onValueChange={(value) => updateFilter('experienceLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "اختر مستوى الخبرة" : "Select experience level"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isRTL ? "جميع المستويات" : "All Levels"}</SelectItem>
                      <SelectItem value="ENTRY">{isRTL ? "مبتدئ" : "Entry Level"}</SelectItem>
                      <SelectItem value="INTERMEDIATE">{isRTL ? "متوسط" : "Intermediate"}</SelectItem>
                      <SelectItem value="SENIOR">{isRTL ? "خبير" : "Senior"}</SelectItem>
                      <SelectItem value="EXPERT">{isRTL ? "خبير جداً" : "Expert"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400">
                    {isRTL ? "سيتم تفعيل هذا الفلتر قريباً" : "Coming soon"}
                  </p>
                </div>

                {/* Availability Filter */}
                <div className="space-y-2">
                  <Label>{isRTL ? "التوفر" : "Availability"}</Label>
                  <Select
                    value={filters.availability}
                    onValueChange={(value) => updateFilter('availability', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "اختر حالة التوفر" : "Select availability"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isRTL ? "جميع الحالات" : "All Status"}</SelectItem>
                      <SelectItem value="AVAILABLE">{isRTL ? "متاح" : "Available"}</SelectItem>
                      <SelectItem value="BUSY">{isRTL ? "مشغول" : "Busy"}</SelectItem>
                      <SelectItem value="UNAVAILABLE">{isRTL ? "غير متاح" : "Unavailable"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400">
                    {isRTL ? "سيتم تفعيل هذا الفلتر قريباً" : "Coming soon"}
                  </p>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label>{isRTL ? "الموقع" : "Location"}</Label>
                  <Input
                    placeholder={isRTL ? "أدخل الموقع..." : "Enter location..."}
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                  />
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <Label>
                    {isRTL ? "التقييم الأدنى" : "Minimum Rating"} 
                    <span className="text-sm text-gray-500 ml-1">
                      {filters.rating > 0 ? `${filters.rating}+ ⭐` : "Any"}
                    </span>
                  </Label>
                  <Slider
                    value={[filters.rating]}
                    onValueChange={(value) => updateFilter('rating', value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full [&>*:first-child]:bg-gray-200 [&>*:first-child>*]:bg-blue-500 [&>*:last-child]:border-blue-500 [&>*:last-child]:bg-white"
                  />
                </div>

                {/* Verified Filter */}
                <div className="space-y-2">
                  <Label>{isRTL ? "التحقق" : "Verification"}</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={filters.verified}
                      onChange={(e) => updateFilter('verified', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="verified" className="text-sm">
                      {isRTL ? "المستقلون الموثقون فقط" : "Verified freelancers only"}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-600">
                      {isRTL ? "الفلاتر النشطة:" : "Active filters:"}
                    </span>
                    {filters.skills.length > 0 && (
                      <Badge variant="secondary">
                        {isRTL ? "المهارات" : "Skills"}: {filters.skills.length}
                      </Badge>
                    )}
                    {(filters.hourlyRateRange[0] > 0 || filters.hourlyRateRange[1] < 200) && (
                      <Badge variant="secondary">
                        ${filters.hourlyRateRange[0]}-${filters.hourlyRateRange[1]}/hr
                      </Badge>
                    )}
                    {filters.experienceLevel !== 'all' && (
                      <Badge variant="secondary">
                        {filters.experienceLevel}
                      </Badge>
                    )}
                    {filters.availability !== 'all' && (
                      <Badge variant="secondary">
                        {filters.availability}
                      </Badge>
                    )}
                    {filters.location && (
                      <Badge variant="secondary">
                        {filters.location}
                      </Badge>
                    )}
                    {filters.rating > 0 && (
                      <Badge variant="secondary">
                        {filters.rating}+ ⭐
                      </Badge>
                    )}
                    {filters.verified && (
                      <Badge variant="secondary">
                        {isRTL ? "موثق" : "Verified"}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              {isRTL ? "شبكة" : "Grid"}
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              {isRTL ? "قائمة" : "List"}
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            {hasActiveFilters() ? (
              isRTL 
                ? `عرض ${filteredCount} من ${total} مستقل (مفلتر)`
                : `Showing ${filteredCount} of ${total} freelancers (filtered)`
            ) : (
              isRTL 
                ? `عرض ${filteredCount} من ${total} مستقل`
                : `Showing ${filteredCount} of ${total} freelancers`
            )}
          </div>
        </div>

        {/* Freelancers Grid/List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? "جاري التحميل..." : "Loading Freelancers..."}
              </h3>
              <p className="text-gray-500">
                {isRTL ? "يرجى الانتظار بينما نجلب المستقلين" : "Please wait while we fetch freelancers"}
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? "خطأ في التحميل" : "Error Loading Freelancers"}
              </h3>
              <p className="text-gray-500 mb-4">
                {isRTL 
                  ? "حدث خطأ أثناء جلب المستقلين. يرجى المحاولة مرة أخرى."
                  : "An error occurred while fetching freelancers. Please try again."
                }
              </p>
              <Button onClick={() => window.location.reload()}>
                {isRTL ? "إعادة المحاولة" : "Retry"}
              </Button>
            </CardContent>
          </Card>
        ) : freelancers.length > 0 ? (
          <div className={cn(
            "space-y-4",
            viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          )}>
            {freelancers.map((freelancer) => (
              <FreelancerCard
                key={freelancer.id}
                freelancer={freelancer}
                isRTL={isRTL}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? "لا يوجد مستقلون" : "No Freelancers Found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {isRTL 
                  ? "لم نجد أي مستقلين يطابقون معايير البحث المحددة"
                  : "No freelancers match your search criteria"
                }
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setPage(0);
              }}>
                {isRTL ? "مسح البحث" : "Clear Search"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {isRTL ? "طريقة التنقل:" : "Navigation:"}
              </span>
              <Button
                variant={paginationMode === 'pages' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaginationMode('pages')}
              >
                {isRTL ? "صفحات" : "Pages"}
              </Button>
              <Button
                variant={paginationMode === 'load-more' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaginationMode('load-more')}
              >
                {isRTL ? "تحميل المزيد" : "Load More"}
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && paginationMode === 'pages' && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(Math.max(0, page - 1))}
                    className={cn(
                      "cursor-pointer",
                      page === 0 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                
                {/* First page */}
                {page > 2 && (
                  <>
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setPage(0)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                
                {/* Current page range */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(0, Math.min(totalPages - 5, page - 2));
                  const pageNum = startPage + i;
                  if (pageNum >= totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        onClick={() => setPage(pageNum)}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {/* Last page */}
                {page < totalPages - 3 && (
                  <>
                    {page < totalPages - 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setPage(totalPages - 1)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    className={cn(
                      "cursor-pointer",
                      page === totalPages - 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            {/* Results info */}
            <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
              {isRTL ? (
                <>
                  عرض {startItem}-{endItem} من {total} مستقل
                </>
              ) : (
                <>
                  Showing {startItem}-{endItem} of {total} freelancers
                </>
              )}
            </div>
          </div>
        )}

        {/* Load More */}
        {totalPages > 1 && paginationMode === 'load-more' && page < totalPages - 1 && (
          <div className="flex items-center justify-center mt-8">
            <Button
              onClick={() => setPage(page + 1)}
              disabled={isLoading}
              className="px-8 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isRTL ? "جاري التحميل..." : "Loading..."}
                </>
              ) : (
                <>
                  {isRTL ? "تحميل المزيد" : "Load More"}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Load More Results Info */}
        {totalPages > 1 && paginationMode === 'load-more' && (
          <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
            {isRTL ? (
              <>
                عرض {Math.min((page + 1) * pageSize, total)} من {total} مستقل
              </>
            ) : (
              <>
                Showing {Math.min((page + 1) * pageSize, total)} of {total} freelancers
              </>
            )}
          </div>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Grid,
  List,
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { ProjectBrowsingCard } from '@/components/proposals/ProjectBrowsingCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { ProjectResponse, ProjectSearchRequest } from '@/types/api';
import { proposalService } from '@/services/proposal.service';
import { useToast } from '@/hooks/use-toast';
import AdvancedSearch, { SearchFilters, SavedSearch } from '@/components/ui/AdvancedSearch';
import { usePublishedProjects, useSearchProjects, useAllProjects } from '@/hooks/useProjects';

export default function AvailableProjectsPage() {
  const navigate = useNavigate();
  const { isRTL, toggleLanguage } = useLocalization();
  const { toast } = useToast();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    skills: [],
    location: "all",
    budgetRange: [0, 10000],
    ratingRange: [0, 5],
    experienceLevel: "all",
    availability: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    datePosted: "all",
    projectType: "all",
    clientType: "all",
    language: [],
    timezone: "all",
    verifiedOnly: false,
    onlineOnly: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    { value: 'web', label: isRTL ? 'تطوير الويب' : 'Web Development' },
    { value: 'mobile', label: isRTL ? 'تطوير التطبيقات' : 'Mobile Development' },
    { value: 'design', label: isRTL ? 'التصميم' : 'Design' },
    { value: 'writing', label: isRTL ? 'الكتابة' : 'Writing' },
    { value: 'marketing', label: isRTL ? 'التسويق' : 'Marketing' },
    { value: 'other', label: isRTL ? 'أخرى' : 'Other' }
  ];

  const allSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Java',
    'Vue.js', 'Angular', 'GraphQL', 'MongoDB', 'PostgreSQL',
    'AWS', 'Docker', 'Kubernetes', 'UI/UX', 'Figma'
  ];

  const fetchProjects = useCallback(async (page: number = 0) => {
    setIsLoading(true);
    try {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const min = minBudget ? parseInt(minBudget) : undefined;
      const max = maxBudget ? parseInt(maxBudget) : undefined;
      const skills = selectedSkills.length > 0 ? selectedSkills : undefined;

      const response = await proposalService.searchAvailableProjects(
        searchTerm || undefined,
        category,
        min,
        max,
        skills,
        page,
        pageSize,
        `${filters.sortBy},${filters.sortOrder}`
      );

      setProjects(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل تحميل المشاريع' : 'Failed to load projects',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
   }, [selectedCategory, minBudget, maxBudget, selectedSkills, searchTerm, pageSize, filters.sortBy, filters.sortOrder, isRTL, toast]);

  useEffect(() => {
    fetchProjects(0);
  }, [fetchProjects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchProjects(0);
  };

  const handleAdvancedSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setSearchTerm(searchFilters.query);
    setSelectedCategory(searchFilters.category !== 'all' ? searchFilters.category : 'all');
    setSelectedSkills(searchFilters.skills);
    setMinBudget(searchFilters.budgetRange[0] > 0 ? searchFilters.budgetRange[0].toString() : '');
    setMaxBudget(searchFilters.budgetRange[1] < 10000 ? searchFilters.budgetRange[1].toString() : '');
    setCurrentPage(0);
  };

  const handleSaveSearch = (search: SavedSearch) => {
    setSavedSearches(prev => [...prev, search]);
    toast({
      title: isRTL ? 'تم الحفظ' : 'Saved',
      description: isRTL ? 'تم حفظ البحث بنجاح' : 'Search saved successfully',
    });
  };

  const handleLoadSavedSearch = (search: SavedSearch) => {
    handleAdvancedSearch(search.filters);
  };

  const handleDeleteSavedSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
    toast({
      title: isRTL ? 'تم الحذف' : 'Deleted',
      description: isRTL ? 'تم حذف البحث المحفوظ' : 'Saved search deleted',
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const getProjectStats = () => {
    return {
      total: projects.length,
      avgBudget: Math.round(projects.reduce((sum, p) => sum + (p.budgetMin || 0), 0) / Math.max(projects.length, 1)) || 0
    };
  };

  const stats = getProjectStats();

  const handleProjectBrowse = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "المشاريع المتاحة" : "Available Projects"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "ابحث عن المشاريع المناسبة لمهاراتك وقدم عروضك الآن" 
              : "Find projects that match your skills and submit your proposals"
            }
          </p>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي المشاريع" : "Total Projects"}
                  </p>
                  <p className="text-2xl font-bold text-[#0A2540]">{stats.total}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "متوسط الميزانية" : "Avg Budget"}
                  </p>
                  <p className="text-2xl font-bold text-green-600">${stats.avgBudget.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "يتم التحديث" : "Updating"}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">{isRTL ? 'دائماً' : 'Live'}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Search */}
        <AdvancedSearch
          isRTL={isRTL}
          onSearch={handleAdvancedSearch}
          onSaveSearch={handleSaveSearch}
          savedSearches={savedSearches}
          onLoadSavedSearch={handleLoadSavedSearch}
          onDeleteSavedSearch={handleDeleteSavedSearch}
          categories={categories.map(c => c.value) as string[]}
          skills={allSkills}
          locations={[isRTL ? 'بعيد' : 'Remote']}
          languages={['Arabic', 'English', 'French', 'Spanish']}
          timezones={['GMT+3', 'GMT+0', 'GMT-5', 'GMT+8']}
          className="mb-8"
        />

        {/* Simple Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <Input
              type="text"
              placeholder={isRTL ? 'ابحث عن المشاريع...' : 'Quick search projects...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#0A2540] hover:bg-[#142b52]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4" />
              {isRTL ? 'خيارات' : 'More'}
            </Button>
          </div>
        </form>

        {/* Quick Filters Section */}
        {showAdvancedFilters && (
          <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
            <h3 className={cn("font-semibold text-lg mb-4", isRTL && "text-right")}>
              {isRTL ? 'خيارات البحث' : 'Search Options'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Category Filter */}
              <div>
                <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
                  {isRTL ? 'الفئة' : 'Category'}
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Budget */}
              <div>
                <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
                  {isRTL ? 'الحد الأدنى للميزانية' : 'Min Budget'}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
              </div>

              {/* Max Budget */}
              <div>
                <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
                  {isRTL ? 'الحد الأقصى للميزانية' : 'Max Budget'}
                </label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
                  {isRTL ? 'ترتيب حسب' : 'Sort By'}
                </label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
                    <SelectItem value="title">{isRTL ? 'الاسم' : 'Title'}</SelectItem>
                    <SelectItem value="budgetMin">{isRTL ? 'الميزانية' : 'Budget'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-2", isRTL && "text-right")}>
                  {isRTL ? 'الترتيب' : 'Order'}
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.sortOrder === 'asc' ? 'default' : 'outline'}
                    onClick={() => setFilters({...filters, sortOrder: 'asc'})}
                    className={filters.sortOrder === 'asc' ? 'bg-[#0A2540]' : ''}
                  >
                    <SortAsc className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={filters.sortOrder === 'desc' ? 'default' : 'outline'}
                    onClick={() => setFilters({...filters, sortOrder: 'desc'})}
                    className={filters.sortOrder === 'desc' ? 'bg-[#0A2540]' : ''}
                  >
                    <SortDesc className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <label className={cn("block text-sm font-medium mb-3", isRTL && "text-right")}>
                {isRTL ? 'المهارات المطلوبة' : 'Required Skills'}
              </label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                    className={cn("cursor-pointer", selectedSkills.includes(skill) && 'bg-[#0A2540]')}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className={cn("mt-6 flex gap-3", isRTL && "flex-row-reverse")}>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setMinBudget('');
                  setMaxBudget('');
                  setSelectedSkills([]);
                  setSearchTerm('');
                  setFilters({
                    query: "",
                    category: "all",
                    skills: [],
                    location: "all",
                    budgetRange: [0, 10000],
                    ratingRange: [0, 5],
                    experienceLevel: "all",
                    availability: "all",
                    sortBy: "createdAt",
                    sortOrder: "desc",
                    datePosted: "all",
                    projectType: "all",
                    clientType: "all",
                    language: [],
                    timezone: "all",
                    verifiedOnly: false,
                    onlineOnly: false
                  });
                }}
              >
                {isRTL ? 'إعادة تعيين' : 'Reset'}
              </Button>
              <Button
                onClick={() => setShowAdvancedFilters(false)}
                className="bg-[#0A2540] hover:bg-[#142b52]"
              >
                {isRTL ? 'تطبيق' : 'Apply'}
              </Button>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#0A2540]">
              {isRTL ? "النتائج" : "Results"}
            </h2>
            <Badge variant="outline" className="text-sm">
              {projects.length} {isRTL ? "مشروع" : "projects"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {isLoading && currentPage === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? "جاري التحميل..." : "Loading Projects..."}
              </h3>
              <p className="text-gray-500">
                {isRTL ? "يرجى الانتظار بينما نجلب المشاريع" : "Please wait while we fetch projects"}
              </p>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? 'لم يتم العثور على مشاريع' : 'No Projects Found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {isRTL ? 'جرب تعديل معايير البحث' : 'Try adjusting your search criteria'}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setMinBudget('');
                  setMaxBudget('');
                  setSelectedSkills([]);
                  setSearchTerm('');
                  fetchProjects(0);
                }}
              >
                {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={cn(
              "space-y-4",
              viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            )}>
              {projects.map((project) => {
                if (viewMode === 'list') {
                  const mappedProject = {
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    budget: project.budgetMin === project.budgetMax 
                      ? project.budgetMin 
                      : { min: project.budgetMin, max: project.budgetMax, currency: project.currency },
                    currency: project.currency,
                    deadline: project.deadline || 'Not specified',
                    location: 'Remote',
                    skills: project.skillsRequired || [],
                    proposals: 0,
                    rating: 0,
                    category: project.category,
                    status: project.status.toLowerCase(),
                    clientId: project.clientId,
                    clientName: project.clientName,
                    clientAvatar: undefined,
                    isUrgent: false,
                    isFixed: project.projectType === 'FIXED',
                    createdAt: project.createdAt,
                    views: 0,
                    featured: project.isFeatured
                  };

                  return (
                    <ProjectCard
                      key={project.id}
                      project={mappedProject}
                      isRTL={isRTL}
                      viewMode="list"
                    />
                  );
                }

                return (
                  <ProjectBrowsingCard
                    key={project.id}
                    project={project}
                    isRTL={isRTL}
                    onBrowse={handleProjectBrowse}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={cn("flex items-center justify-between mt-8", isRTL && "flex-row-reverse")}>
                <Button
                  variant="outline"
                  onClick={() => fetchProjects(currentPage - 1)}
                  disabled={currentPage === 0 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {isRTL ? 'السابق' : 'Previous'}
                </Button>

                <div className="text-sm text-gray-600">
                  {isRTL ? `صفحة ${currentPage + 1} من ${totalPages}` : `Page ${currentPage + 1} of ${totalPages}`}
                </div>

                <Button
                  variant="outline"
                  onClick={() => fetchProjects(currentPage + 1)}
                  disabled={currentPage === totalPages - 1 || isLoading}
                >
                  {isRTL ? 'التالي' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

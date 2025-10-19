import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X, 
  Save, 
  Bookmark, 
  BookmarkCheck,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Clock,
  Users,
  Briefcase,
  Award,
  Tag,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

export interface SearchFilters {
  query: string;
  category: string;
  skills: string[];
  location: string;
  budgetRange: [number, number];
  ratingRange: [number, number];
  experienceLevel: string;
  availability: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  datePosted: string;
  projectType: string;
  clientType: string;
  language: string[];
  timezone: string;
  verifiedOnly: boolean;
  onlineOnly: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  isActive: boolean;
}

interface AdvancedSearchProps {
  isRTL?: boolean;
  onSearch: (filters: SearchFilters) => void;
  onSaveSearch?: (search: SavedSearch) => void;
  savedSearches?: SavedSearch[];
  onLoadSavedSearch?: (search: SavedSearch) => void;
  onDeleteSavedSearch?: (searchId: string) => void;
  categories?: string[];
  skills?: string[];
  locations?: string[];
  languages?: string[];
  timezones?: string[];
  className?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isRTL = false,
  onSearch,
  onSaveSearch,
  savedSearches = [],
  onLoadSavedSearch,
  onDeleteSavedSearch,
  categories = [],
  skills = [],
  locations = [],
  languages = [],
  timezones = [],
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    skills: [],
    location: 'all',
    budgetRange: [0, 50000],
    ratingRange: [0, 5],
    experienceLevel: 'all',
    availability: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    datePosted: 'all',
    projectType: 'all',
    clientType: 'all',
    language: [],
    timezone: 'all',
    verifiedOnly: false,
    onlineOnly: false
  });

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
    
    // Add to recent searches
    if (filters.query.trim()) {
      const newRecent = [filters.query, ...recentSearches.filter(s => s !== filters.query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    }
  };

  const handleSaveSearch = () => {
    if (searchName.trim() && onSaveSearch) {
      const savedSearch: SavedSearch = {
        id: Date.now().toString(),
        name: searchName.trim(),
        filters: { ...filters },
        createdAt: new Date().toISOString(),
        isActive: false
      };
      onSaveSearch(savedSearch);
      setSearchName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    if (onLoadSavedSearch) {
      onLoadSavedSearch(search);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      category: '',
      skills: [],
      location: '',
      budgetRange: [0, 50000],
      ratingRange: [0, 5],
      experienceLevel: '',
      availability: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      datePosted: '',
      projectType: '',
      clientType: '',
      language: [],
      timezone: '',
      verifiedOnly: false,
      onlineOnly: false
    });
  };

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFilters(prev => ({
      ...prev,
      language: prev.language.includes(language)
        ? prev.language.filter(l => l !== language)
        : [...prev.language, language]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category) count++;
    if (filters.skills.length > 0) count++;
    if (filters.location) count++;
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 50000) count++;
    if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5) count++;
    if (filters.experienceLevel) count++;
    if (filters.availability) count++;
    if (filters.datePosted) count++;
    if (filters.projectType) count++;
    if (filters.clientType) count++;
    if (filters.language.length > 0) count++;
    if (filters.timezone) count++;
    if (filters.verifiedOnly) count++;
    if (filters.onlineOnly) count++;
    return count;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Basic Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className={cn(
                "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                placeholder={isRTL ? "ابحث عن مشاريع أو مستقلين..." : "Search for projects or freelancers..."}
                className={cn(
                  "h-10",
                  isRTL ? "pr-10 pl-3 text-right" : "pl-10 pr-3"
                )}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="h-10">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-10"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isRTL ? "تصفية" : "Filter"}
              {getActiveFiltersCount() > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">
                  {isRTL ? "البحث الأخير:" : "Recent:"}
                </span>
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange('query', search)}
                    className="h-6 text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {isRTL ? "البحث المتقدم" : "Advanced Search"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isRTL ? "حفظ البحث" : "Save Search"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  {isRTL ? "مسح الكل" : "Clear All"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">
                  {isRTL ? "أساسي" : "Basic"}
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  {isRTL ? "متقدم" : "Advanced"}
                </TabsTrigger>
                <TabsTrigger value="saved">
                  {isRTL ? "محفوظ" : "Saved"}
                </TabsTrigger>
              </TabsList>

              {/* Basic Filters */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{isRTL ? "الفئة" : "Category"}</Label>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر الفئة..." : "Select category..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "الموقع" : "Location"}</Label>
                    <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر الموقع..." : "Select location..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "نطاق الميزانية" : "Budget Range"}</Label>
                    <div className="px-3">
                      <Slider
                        value={filters.budgetRange}
                        onValueChange={(value) => handleFilterChange('budgetRange', value)}
                        max={50000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>${filters.budgetRange[0]}</span>
                        <span>${filters.budgetRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "نطاق التقييم" : "Rating Range"}</Label>
                    <div className="px-3">
                      <Slider
                        value={filters.ratingRange}
                        onValueChange={(value) => handleFilterChange('ratingRange', value)}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{filters.ratingRange[0]} ⭐</span>
                        <span>{filters.ratingRange[1]} ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label>{isRTL ? "المهارات" : "Skills"}</Label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={filters.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Filters */}
              <TabsContent value="advanced" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{isRTL ? "مستوى الخبرة" : "Experience Level"}</Label>
                    <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر مستوى الخبرة..." : "Select experience level..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        <SelectItem value="entry">{isRTL ? "مبتدئ" : "Entry Level"}</SelectItem>
                        <SelectItem value="intermediate">{isRTL ? "متوسط" : "Intermediate"}</SelectItem>
                        <SelectItem value="expert">{isRTL ? "خبير" : "Expert"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "التوفر" : "Availability"}</Label>
                    <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر التوفر..." : "Select availability..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        <SelectItem value="available">{isRTL ? "متاح" : "Available"}</SelectItem>
                        <SelectItem value="busy">{isRTL ? "مشغول" : "Busy"}</SelectItem>
                        <SelectItem value="unavailable">{isRTL ? "غير متاح" : "Unavailable"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "تاريخ النشر" : "Date Posted"}</Label>
                    <Select value={filters.datePosted} onValueChange={(value) => handleFilterChange('datePosted', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر التاريخ..." : "Select date..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        <SelectItem value="today">{isRTL ? "اليوم" : "Today"}</SelectItem>
                        <SelectItem value="week">{isRTL ? "هذا الأسبوع" : "This Week"}</SelectItem>
                        <SelectItem value="month">{isRTL ? "هذا الشهر" : "This Month"}</SelectItem>
                        <SelectItem value="quarter">{isRTL ? "هذا الربع" : "This Quarter"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "نوع المشروع" : "Project Type"}</Label>
                    <Select value={filters.projectType} onValueChange={(value) => handleFilterChange('projectType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر نوع المشروع..." : "Select project type..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        <SelectItem value="fixed">{isRTL ? "مشروع محدد" : "Fixed Project"}</SelectItem>
                        <SelectItem value="hourly">{isRTL ? "بالساعة" : "Hourly"}</SelectItem>
                        <SelectItem value="milestone">{isRTL ? "بالمراحل" : "Milestone-based"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "نوع العميل" : "Client Type"}</Label>
                    <Select value={filters.clientType} onValueChange={(value) => handleFilterChange('clientType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر نوع العميل..." : "Select client type..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        <SelectItem value="individual">{isRTL ? "فرد" : "Individual"}</SelectItem>
                        <SelectItem value="startup">{isRTL ? "شركة ناشئة" : "Startup"}</SelectItem>
                        <SelectItem value="enterprise">{isRTL ? "شركة كبيرة" : "Enterprise"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{isRTL ? "المنطقة الزمنية" : "Timezone"}</Label>
                    <Select value={filters.timezone} onValueChange={(value) => handleFilterChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر المنطقة الزمنية..." : "Select timezone..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone} value={timezone}>
                            {timezone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <Label>{isRTL ? "اللغات" : "Languages"}</Label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Badge
                        key={language}
                        variant={filters.language.includes(language) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleLanguageToggle(language)}
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <Label>{isRTL ? "خيارات إضافية" : "Additional Options"}</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verifiedOnly"
                        checked={filters.verifiedOnly}
                        onCheckedChange={(checked) => handleFilterChange('verifiedOnly', checked)}
                      />
                      <Label htmlFor="verifiedOnly" className="text-sm">
                        {isRTL ? "المستخدمون المتحققون فقط" : "Verified users only"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onlineOnly"
                        checked={filters.onlineOnly}
                        onCheckedChange={(checked) => handleFilterChange('onlineOnly', checked)}
                      />
                      <Label htmlFor="onlineOnly" className="text-sm">
                        {isRTL ? "المستخدمون المتصلون فقط" : "Online users only"}
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Saved Searches */}
              <TabsContent value="saved" className="space-y-6 mt-6">
                {savedSearches.length > 0 ? (
                  <div className="space-y-4">
                    {savedSearches.map((search) => (
                      <Card key={search.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{search.name}</h3>
                              <p className="text-sm text-gray-500">
                                {isRTL ? "تم الحفظ في" : "Saved on"} {new Date(search.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {search.filters.query && (
                                  <Badge variant="outline" className="text-xs">
                                    "{search.filters.query}"
                                  </Badge>
                                )}
                                {search.filters.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {search.filters.category}
                                  </Badge>
                                )}
                                {search.filters.skills.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {search.filters.skills.length} {isRTL ? "مهارة" : "skills"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleLoadSavedSearch(search)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              {onDeleteSavedSearch && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onDeleteSavedSearch(search.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRTL ? "لا توجد عمليات بحث محفوظة" : "No Saved Searches"}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? "احفظ عمليات البحث المفضلة لديك للوصول السريع إليها لاحقاً"
                        : "Save your favorite searches for quick access later"
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Sort Options */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Label className="text-sm">{isRTL ? "ترتيب حسب:" : "Sort by:"}</Label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">{isRTL ? "الأحدث" : "Newest"}</SelectItem>
                    <SelectItem value="title">{isRTL ? "الاسم" : "Title"}</SelectItem>
                    <SelectItem value="budgetMin">{isRTL ? "الميزانية" : "Budget"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Search Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? "حفظ البحث" : "Save Search"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchName">
                {isRTL ? "اسم البحث" : "Search Name"}
              </Label>
              <Input
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder={isRTL ? "أدخل اسم البحث..." : "Enter search name..."}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button onClick={handleSaveSearch} disabled={!searchName.trim()}>
                <Save className="h-4 w-4 mr-2" />
                {isRTL ? "حفظ" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedSearch;

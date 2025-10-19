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
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Share2, 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Calendar,
  User,
  Award,
  TrendingUp,
  Users,
  Globe,
  Shield,
  Scale,
  BookOpen,
  Newspaper,
  Megaphone,
  Heart,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Clock,
  Tag,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Play,
  Image,
  Video,
  FilePdf,
  FileSpreadsheet,
  FileArchive,
  Lock,
  Unlock
} from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  description: string;
  type: 'terms' | 'privacy' | 'cookies' | 'refund' | 'disclaimer';
  version: string;
  lastUpdated: Date;
  isActive: boolean;
  content: string;
  tags: string[];
}

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  category: 'freelancer' | 'client' | 'business';
  industry: string;
  projectValue: number;
  duration: string;
  rating: number;
  tags: string[];
  createdAt: Date;
  isFeatured: boolean;
  likes: number;
  comments: number;
  images: string[];
  videoUrl?: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'update' | 'feature' | 'maintenance' | 'event' | 'news';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  author: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  attachments: string[];
}

export default function ContentPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('legal');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock legal documents data
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>([
    {
      id: '1',
      title: isRTL ? 'شروط الخدمة' : 'Terms of Service',
      description: isRTL ? 'الشروط والأحكام العامة لاستخدام المنصة' : 'General terms and conditions for platform usage',
      type: 'terms',
      version: '2.1',
      lastUpdated: new Date('2025-01-15'),
      isActive: true,
      content: isRTL ? 'محتوى شروط الخدمة...' : 'Terms of service content...',
      tags: [isRTL ? 'شروط' : 'Terms', isRTL ? 'خدمة' : 'Service']
    },
    {
      id: '2',
      title: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy',
      description: isRTL ? 'كيفية جمع واستخدام البيانات الشخصية' : 'How personal data is collected and used',
      type: 'privacy',
      version: '1.8',
      lastUpdated: new Date('2025-01-10'),
      isActive: true,
      content: isRTL ? 'محتوى سياسة الخصوصية...' : 'Privacy policy content...',
      tags: [isRTL ? 'خصوصية' : 'Privacy', isRTL ? 'بيانات' : 'Data']
    },
    {
      id: '3',
      title: isRTL ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy',
      description: isRTL ? 'استخدام ملفات تعريف الارتباط في المنصة' : 'Use of cookies on the platform',
      type: 'cookies',
      version: '1.2',
      lastUpdated: new Date('2025-01-08'),
      isActive: true,
      content: isRTL ? 'محتوى سياسة ملفات تعريف الارتباط...' : 'Cookie policy content...',
      tags: [isRTL ? 'ملفات تعريف الارتباط' : 'Cookies', isRTL ? 'تتبع' : 'Tracking']
    }
  ]);

  // Mock success stories data
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([
    {
      id: '1',
      title: isRTL ? 'من صفر إلى مليون: قصة نجاح مطور تطبيقات' : 'From Zero to Million: App Developer Success Story',
      description: isRTL ? 'كيف بدأ أحمد رحلته كمطور تطبيقات وحقق نجاحاً كبيراً' : 'How Ahmed started his journey as an app developer and achieved great success',
      author: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      authorRole: isRTL ? 'مطور تطبيقات' : 'App Developer',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      category: 'freelancer',
      industry: isRTL ? 'تطوير التطبيقات' : 'App Development',
      projectValue: 50000,
      duration: isRTL ? '6 أشهر' : '6 months',
      rating: 4.9,
      tags: [isRTL ? 'نجاح' : 'Success', isRTL ? 'تطوير' : 'Development'],
      createdAt: new Date('2025-01-12'),
      isFeatured: true,
      likes: 156,
      comments: 23,
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop']
    },
    {
      id: '2',
      title: isRTL ? 'شركة ناشئة تحقق حلمها بمساعدة المستقلين' : 'Startup Achieves Dream with Freelancer Help',
      description: isRTL ? 'كيف ساعدت المنصة شركة ناشئة في بناء منتجها الأول' : 'How the platform helped a startup build their first product',
      author: isRTL ? 'سارة أحمد' : 'Sara Ahmed',
      authorRole: isRTL ? 'مؤسسة شركة' : 'Company Founder',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      category: 'client',
      industry: isRTL ? 'التكنولوجيا' : 'Technology',
      projectValue: 75000,
      duration: isRTL ? '4 أشهر' : '4 months',
      rating: 4.8,
      tags: [isRTL ? 'شركة ناشئة' : 'Startup', isRTL ? 'تكنولوجيا' : 'Technology'],
      createdAt: new Date('2025-01-08'),
      isFeatured: false,
      likes: 89,
      comments: 15,
      images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop']
    }
  ]);

  // Mock announcements data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: isRTL ? 'تحديث جديد للمنصة - إصدار 2.5' : 'New Platform Update - Version 2.5',
      description: isRTL ? 'إصدار جديد يتضمن ميزات محسنة وأداء أفضل' : 'New release with enhanced features and better performance',
      content: isRTL ? 'محتوى الإعلان...' : 'Announcement content...',
      type: 'update',
      priority: 'high',
      isPublished: true,
      publishedAt: new Date('2025-01-15'),
      expiresAt: new Date('2025-02-15'),
      author: isRTL ? 'فريق التطوير' : 'Development Team',
      tags: [isRTL ? 'تحديث' : 'Update', isRTL ? 'ميزات' : 'Features'],
      views: 1250,
      likes: 89,
      comments: 23,
      attachments: []
    },
    {
      id: '2',
      title: isRTL ? 'صيانة مجدولة للمنصة' : 'Scheduled Platform Maintenance',
      description: isRTL ? 'ستكون المنصة غير متاحة لفترة قصيرة للصيانة' : 'Platform will be unavailable for a short period for maintenance',
      content: isRTL ? 'محتوى الإعلان...' : 'Announcement content...',
      type: 'maintenance',
      priority: 'urgent',
      isPublished: true,
      publishedAt: new Date('2025-01-14'),
      expiresAt: new Date('2025-01-16'),
      author: isRTL ? 'فريق التقنية' : 'Technical Team',
      tags: [isRTL ? 'صيانة' : 'Maintenance', isRTL ? 'تقنية' : 'Technical'],
      views: 890,
      likes: 12,
      comments: 8,
      attachments: []
    }
  ]);

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'terms':
        return <Scale className="h-5 w-5 text-blue-500" />;
      case 'privacy':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'cookies':
        return <Globe className="h-5 w-5 text-purple-500" />;
      case 'refund':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'disclaimer':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'terms':
        return isRTL ? 'شروط الخدمة' : 'Terms of Service';
      case 'privacy':
        return isRTL ? 'سياسة الخصوصية' : 'Privacy Policy';
      case 'cookies':
        return isRTL ? 'ملفات تعريف الارتباط' : 'Cookies';
      case 'refund':
        return isRTL ? 'سياسة الاسترداد' : 'Refund Policy';
      case 'disclaimer':
        return isRTL ? 'إخلاء المسؤولية' : 'Disclaimer';
      default:
        return type;
    }
  };

  const getStoryCategoryIcon = (category: string) => {
    switch (category) {
      case 'freelancer':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'client':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'business':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <Star className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStoryCategoryLabel = (category: string) => {
    switch (category) {
      case 'freelancer':
        return isRTL ? 'مستقل' : 'Freelancer';
      case 'client':
        return isRTL ? 'عميل' : 'Client';
      case 'business':
        return isRTL ? 'شركة' : 'Business';
      default:
        return category;
    }
  };

  const getAnnouncementTypeIcon = (type: string) => {
    switch (type) {
      case 'update':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'feature':
        return <Star className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'news':
        return <Newspaper className="h-5 w-5 text-red-500" />;
      default:
        return <Megaphone className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAnnouncementTypeLabel = (type: string) => {
    switch (type) {
      case 'update':
        return isRTL ? 'تحديث' : 'Update';
      case 'feature':
        return isRTL ? 'ميزة' : 'Feature';
      case 'maintenance':
        return isRTL ? 'صيانة' : 'Maintenance';
      case 'event':
        return isRTL ? 'حدث' : 'Event';
      case 'news':
        return isRTL ? 'أخبار' : 'News';
      default:
        return type;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">{isRTL ? 'عاجل' : 'Urgent'}</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-red-100 text-red-800">{isRTL ? 'عالي' : 'High'}</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700">{isRTL ? 'متوسط' : 'Medium'}</Badge>;
      case 'low':
        return <Badge variant="secondary">{isRTL ? 'منخفض' : 'Low'}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  };

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "المحتوى" : "Content"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "إدارة المستندات القانونية، قصص النجاح، والإعلانات" 
              : "Manage legal documents, success stories, and announcements"
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="legal">
                <Scale className="h-4 w-4 mr-2" />
                {isRTL ? "المستندات القانونية" : "Legal Documents"}
              </TabsTrigger>
              <TabsTrigger value="stories">
                <Star className="h-4 w-4 mr-2" />
                {isRTL ? "قصص النجاح" : "Success Stories"}
              </TabsTrigger>
              <TabsTrigger value="announcements">
                <Megaphone className="h-4 w-4 mr-2" />
                {isRTL ? "الإعلانات" : "Announcements"}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "البحث في المحتوى..." : "Search content..."}
                  className={cn("pl-9 w-64", isRTL && "pr-9 text-right")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "الفئة" : "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="terms">{isRTL ? "شروط" : "Terms"}</SelectItem>
                  <SelectItem value="privacy">{isRTL ? "خصوصية" : "Privacy"}</SelectItem>
                  <SelectItem value="cookies">{isRTL ? "ملفات تعريف الارتباط" : "Cookies"}</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إضافة محتوى" : "Add Content"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{isRTL ? "إضافة محتوى جديد" : "Add New Content"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">{isRTL ? "العنوان" : "Title"}</Label>
                      <Input
                        id="title"
                        placeholder={isRTL ? "أدخل العنوان" : "Enter title"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">{isRTL ? "الوصف" : "Description"}</Label>
                      <Textarea
                        id="description"
                        placeholder={isRTL ? "أدخل الوصف" : "Enter description"}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        {isRTL ? "إلغاء" : "Cancel"}
                      </Button>
                      <Button className="bg-[#0A2540] hover:bg-[#142b52]">
                        {isRTL ? "إضافة" : "Add"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Legal Documents Tab */}
          <TabsContent value="legal" className="space-y-6">
            {legalDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {legalDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getDocumentTypeIcon(doc.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-sm truncate">
                              {doc.title}
                            </h3>
                            {doc.isActive && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                            {doc.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <span>{getDocumentTypeLabel(doc.type)}</span>
                            <span>•</span>
                            <span>{isRTL ? 'الإصدار' : 'Version'} {doc.version}</span>
                            <span>•</span>
                            <span>{formatDate(doc.lastUpdated)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-3">
                            {doc.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-3 border-t">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد مستندات" : "No Documents Found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم نجد أي مستندات قانونية"
                      : "No legal documents found"
                    }
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إضافة مستند" : "Add Document"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Success Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            {successStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {successStories.map((story) => (
                  <Card key={story.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={story.authorAvatar}
                            alt={story.author}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-sm truncate">
                                {story.author}
                              </h3>
                              {story.isFeatured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                              {story.authorRole} • {story.industry}
                            </p>
                            <div className="flex items-center gap-2">
                              {getStoryCategoryIcon(story.category)}
                              <span className="text-xs text-gray-500">
                                {getStoryCategoryLabel(story.category)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-lg mb-2">
                            {story.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {story.description}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">{isRTL ? 'قيمة المشروع' : 'Project Value'}</p>
                            <p className="font-semibold text-green-600">
                              {formatCurrency(story.projectValue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">{isRTL ? 'المدة' : 'Duration'}</p>
                            <p className="font-semibold">{story.duration}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="font-medium">{story.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-blue-500" />
                            <span>{story.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4 text-gray-500" />
                            <span>{story.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{formatDate(story.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {story.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            {isRTL ? "قراءة" : "Read"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4 mr-1" />
                            {isRTL ? "مشاركة" : "Share"}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد قصص نجاح" : "No Success Stories Found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم نجد أي قصص نجاح"
                      : "No success stories found"
                    }
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إضافة قصة نجاح" : "Add Success Story"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getAnnouncementTypeIcon(announcement.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-lg">
                              {announcement.title}
                            </h3>
                            {getPriorityBadge(announcement.priority)}
                            {announcement.isPublished && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {announcement.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              {getAnnouncementTypeIcon(announcement.type)}
                              <span>{getAnnouncementTypeLabel(announcement.type)}</span>
                            </div>
                            <span>•</span>
                            <span>{announcement.author}</span>
                            <span>•</span>
                            <span>{formatDate(announcement.publishedAt!)}</span>
                            {announcement.expiresAt && (
                              <>
                                <span>•</span>
                                <span>{isRTL ? 'ينتهي' : 'Expires'} {formatDate(announcement.expiresAt)}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-blue-500" />
                              <span>{announcement.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4 text-green-500" />
                              <span>{announcement.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-gray-500" />
                              <span>{announcement.comments}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-4">
                            {announcement.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              {isRTL ? "قراءة" : "Read"}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-1" />
                              {isRTL ? "مشاركة" : "Share"}
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد إعلانات" : "No Announcements Found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم نجد أي إعلانات"
                      : "No announcements found"
                    }
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إضافة إعلان" : "Add Announcement"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

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
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  Calendar,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileBarChart,
  Settings,
  RefreshCw,
  Send,
  Archive,
  Star,
  Tag,
  Globe,
  Lock,
  Unlock
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'performance' | 'project' | 'client' | 'custom';
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
  isPublic: boolean;
  isStarred: boolean;
  views: number;
  downloads: number;
  data: any;
}

export default function ReportsPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: isRTL ? 'تقرير الأداء الشهري' : 'Monthly Performance Report',
      description: isRTL ? 'تقرير شامل عن الأداء الشهري للمشاريع والإنجازات' : 'Comprehensive monthly performance report for projects and achievements',
      type: 'performance',
      status: 'published',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
      author: isRTL ? 'محمد المستقل' : 'Mohamed Freelancer',
      tags: [isRTL ? 'أداء' : 'Performance', isRTL ? 'شهري' : 'Monthly'],
      isPublic: true,
      isStarred: true,
      views: 45,
      downloads: 12,
      data: { projects: 8, earnings: 2500, rating: 4.8 }
    },
    {
      id: '2',
      title: isRTL ? 'تقرير المبيعات الربعي' : 'Quarterly Sales Report',
      description: isRTL ? 'تحليل مفصل لمبيعات الربع الأول' : 'Detailed analysis of Q1 sales performance',
      type: 'financial',
      status: 'published',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-12'),
      author: isRTL ? 'محمد المستقل' : 'Mohamed Freelancer',
      tags: [isRTL ? 'مبيعات' : 'Sales', isRTL ? 'ربعي' : 'Quarterly'],
      isPublic: false,
      isStarred: false,
      views: 23,
      downloads: 8,
      data: { revenue: 15000, clients: 12, growth: 15 }
    },
    {
      id: '3',
      title: isRTL ? 'تقرير رضا العملاء' : 'Client Satisfaction Report',
      description: isRTL ? 'تقييم مستوى رضا العملاء عن الخدمات المقدمة' : 'Assessment of client satisfaction with provided services',
      type: 'client',
      status: 'draft',
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2025-01-14'),
      author: isRTL ? 'محمد المستقل' : 'Mohamed Freelancer',
      tags: [isRTL ? 'عملاء' : 'Clients', isRTL ? 'رضا' : 'Satisfaction'],
      isPublic: false,
      isStarred: false,
      views: 5,
      downloads: 0,
      data: { satisfaction: 94, reviews: 28, responseRate: 89 }
    }
  ]);

  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    type: 'custom' as const,
    tags: [] as string[],
    isPublic: false
  });

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'performance':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'project':
        return <BarChart3 className="h-5 w-5 text-purple-500" />;
      case 'client':
        return <Users className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'financial':
        return isRTL ? 'مالي' : 'Financial';
      case 'performance':
        return isRTL ? 'أداء' : 'Performance';
      case 'project':
        return isRTL ? 'مشروع' : 'Project';
      case 'client':
        return isRTL ? 'عميل' : 'Client';
      default:
        return isRTL ? 'مخصص' : 'Custom';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-800">{isRTL ? 'منشور' : 'Published'}</Badge>;
      case 'draft':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700">{isRTL ? 'مسودة' : 'Draft'}</Badge>;
      case 'archived':
        return <Badge variant="secondary">{isRTL ? 'مؤرشف' : 'Archived'}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateReport = () => {
    const report: Report = {
      id: Date.now().toString(),
      ...newReport,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: isRTL ? 'محمد المستقل' : 'Mohamed Freelancer',
      isStarred: false,
      views: 0,
      downloads: 0,
      data: {}
    };
    setReports(prev => [report, ...prev]);
    setNewReport({ title: '', description: '', type: 'custom', tags: [], isPublic: false });
    setShowCreateDialog(false);
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    setShowEditDialog(true);
  };

  const handleUpdateReport = () => {
    if (editingReport) {
      setReports(prev => prev.map(r => 
        r.id === editingReport.id 
          ? { ...r, updatedAt: new Date() }
          : r
      ));
      setShowEditDialog(false);
      setEditingReport(null);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleToggleStar = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, isStarred: !r.isStarred }
        : r
    ));
  };

  const handleTogglePublic = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, isPublic: !r.isPublic }
        : r
    ));
  };

  const getReportStats = () => {
    const totalReports = reports.length;
    const publishedReports = reports.filter(r => r.status === 'published').length;
    const draftReports = reports.filter(r => r.status === 'draft').length;
    const totalViews = reports.reduce((sum, r) => sum + r.views, 0);
    const totalDownloads = reports.reduce((sum, r) => sum + r.downloads, 0);
    
    return {
      totalReports,
      publishedReports,
      draftReports,
      totalViews,
      totalDownloads
    };
  };

  const stats = getReportStats();

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "التقارير" : "Reports"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "إنشاء وإدارة التقارير الشاملة لمشاريعك وأدائك" 
              : "Create and manage comprehensive reports for your projects and performance"
            }
          </p>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي التقارير" : "Total Reports"}
                  </p>
                  <p className="text-2xl font-bold text-[#0A2540]">{stats.totalReports}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "منشورة" : "Published"}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{stats.publishedReports}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "مسودات" : "Drafts"}
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.draftReports}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "المشاهدات" : "Views"}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "التحميلات" : "Downloads"}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalDownloads}</p>
                </div>
                <Download className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="overview">
                {isRTL ? "نظرة عامة" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="reports">
                {isRTL ? "التقارير" : "Reports"}
              </TabsTrigger>
              <TabsTrigger value="templates">
                {isRTL ? "القوالب" : "Templates"}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "البحث في التقارير..." : "Search reports..."}
                  className={cn("pl-9 w-64", isRTL && "pr-9 text-right")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "النوع" : "Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="financial">{isRTL ? "مالي" : "Financial"}</SelectItem>
                  <SelectItem value="performance">{isRTL ? "أداء" : "Performance"}</SelectItem>
                  <SelectItem value="project">{isRTL ? "مشروع" : "Project"}</SelectItem>
                  <SelectItem value="client">{isRTL ? "عميل" : "Client"}</SelectItem>
                  <SelectItem value="custom">{isRTL ? "مخصص" : "Custom"}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="published">{isRTL ? "منشور" : "Published"}</SelectItem>
                  <SelectItem value="draft">{isRTL ? "مسودة" : "Draft"}</SelectItem>
                  <SelectItem value="archived">{isRTL ? "مؤرشف" : "Archived"}</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "تقرير جديد" : "New Report"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{isRTL ? "إنشاء تقرير جديد" : "Create New Report"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">{isRTL ? "عنوان التقرير" : "Report Title"}</Label>
                      <Input
                        id="title"
                        value={newReport.title}
                        onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={isRTL ? "أدخل عنوان التقرير" : "Enter report title"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">{isRTL ? "وصف التقرير" : "Report Description"}</Label>
                      <Textarea
                        id="description"
                        value={newReport.description}
                        onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={isRTL ? "أدخل وصف التقرير" : "Enter report description"}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">{isRTL ? "نوع التقرير" : "Report Type"}</Label>
                      <Select value={newReport.type} onValueChange={(value: any) => setNewReport(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial">{isRTL ? "مالي" : "Financial"}</SelectItem>
                          <SelectItem value="performance">{isRTL ? "أداء" : "Performance"}</SelectItem>
                          <SelectItem value="project">{isRTL ? "مشروع" : "Project"}</SelectItem>
                          <SelectItem value="client">{isRTL ? "عميل" : "Client"}</SelectItem>
                          <SelectItem value="custom">{isRTL ? "مخصص" : "Custom"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newReport.isPublic}
                        onChange={(e) => setNewReport(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isPublic">{isRTL ? "تقرير عام" : "Public Report"}</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        {isRTL ? "إلغاء" : "Cancel"}
                      </Button>
                      <Button onClick={handleCreateReport} className="bg-[#0A2540] hover:bg-[#142b52]">
                        {isRTL ? "إنشاء" : "Create"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {isRTL ? "التقارير الأخيرة" : "Recent Reports"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getReportTypeIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{report.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{getReportTypeLabel(report.type)}</span>
                            <span>•</span>
                            <span>{report.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusBadge(report.status)}
                          {report.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Report Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {isRTL ? "تحليلات التقارير" : "Report Analytics"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">73</div>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "إجمالي المشاهدات هذا الشهر" : "Total views this month"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-semibold text-green-600">12</div>
                        <p className="text-gray-600">{isRTL ? "تحميلات" : "Downloads"}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-purple-600">8</div>
                        <p className="text-gray-600">{isRTL ? "مشاركات" : "Shares"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    {isRTL ? "توزيع أنواع التقارير" : "Report Types Distribution"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: isRTL ? "أداء" : "Performance", count: 8, percentage: 40, color: "bg-blue-500" },
                      { type: isRTL ? "مالي" : "Financial", count: 5, percentage: 25, color: "bg-green-500" },
                      { type: isRTL ? "عميل" : "Client", count: 4, percentage: 20, color: "bg-purple-500" },
                      { type: isRTL ? "مشروع" : "Project", count: 2, percentage: 10, color: "bg-orange-500" },
                      { type: isRTL ? "مخصص" : "Custom", count: 1, percentage: 5, color: "bg-gray-500" }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.type}</span>
                          <span className="font-medium">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {isRTL ? "إجراءات سريعة" : "Quick Actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      {isRTL ? "تصدير Excel" : "Export Excel"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileBarChart className="h-4 w-4" />
                      {isRTL ? "تصدير PDF" : "Export PDF"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      {isRTL ? "تحديث البيانات" : "Refresh Data"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {isRTL ? "إرسال تقرير" : "Send Report"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getReportTypeIcon(report.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-sm truncate">
                              {report.title}
                            </h3>
                            {report.isStarred && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                            {report.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <span>{getReportTypeLabel(report.type)}</span>
                            <span>•</span>
                            <span>{report.createdAt.toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{report.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{report.downloads}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {report.isPublic ? (
                                <Globe className="h-3 w-3 text-green-500" />
                              ) : (
                                <Lock className="h-3 w-3 text-gray-500" />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            {getStatusBadge(report.status)}
                            {report.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 pt-3 border-t">
                        <Button size="sm" variant="ghost" onClick={() => handleEditReport(report)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleToggleStar(report.id)}>
                          <Star className={cn("h-4 w-4", report.isStarred && "fill-current text-yellow-500")} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleTogglePublic(report.id)}>
                          {report.isPublic ? (
                            <Globe className="h-4 w-4 text-green-500" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteReport(report.id)}>
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
                    {isRTL ? "لا توجد تقارير" : "No Reports Found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم نجد أي تقارير تطابق معايير البحث المحددة"
                      : "No reports match your search criteria"
                    }
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إنشاء تقرير جديد" : "Create New Report"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: isRTL ? "قالب التقرير المالي" : "Financial Report Template",
                  description: isRTL ? "قالب شامل للتقارير المالية مع الرسوم البيانية" : "Comprehensive financial report template with charts",
                  type: "financial",
                  icon: <DollarSign className="h-8 w-8 text-green-500" />
                },
                {
                  title: isRTL ? "قالب تقرير الأداء" : "Performance Report Template",
                  description: isRTL ? "قالب لتقارير الأداء مع مقاييس KPI" : "Performance report template with KPI metrics",
                  type: "performance",
                  icon: <TrendingUp className="h-8 w-8 text-blue-500" />
                },
                {
                  title: isRTL ? "قالب تقرير المشروع" : "Project Report Template",
                  description: isRTL ? "قالب لتقارير حالة المشاريع والتقدم" : "Project status and progress report template",
                  type: "project",
                  icon: <BarChart3 className="h-8 w-8 text-purple-500" />
                },
                {
                  title: isRTL ? "قالب تقرير العميل" : "Client Report Template",
                  description: isRTL ? "قالب لتقارير رضا العملاء والتفاعل" : "Client satisfaction and interaction report template",
                  type: "client",
                  icon: <Users className="h-8 w-8 text-orange-500" />
                },
                {
                  title: isRTL ? "قالب التقرير المخصص" : "Custom Report Template",
                  description: isRTL ? "قالب مرن للتقارير المخصصة" : "Flexible template for custom reports",
                  type: "custom",
                  icon: <FileText className="h-8 w-8 text-gray-500" />
                },
                {
                  title: isRTL ? "قالب التقرير الشهري" : "Monthly Report Template",
                  description: isRTL ? "قالب للتقارير الشهرية الشاملة" : "Comprehensive monthly report template",
                  type: "performance",
                  icon: <Calendar className="h-8 w-8 text-indigo-500" />
                }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {template.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-2">
                          {template.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            {isRTL ? "استخدام" : "Use"}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

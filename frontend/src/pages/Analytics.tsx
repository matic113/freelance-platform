import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Clock, 
  Award, 
  Target,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Search,
  Settings,
  Share2,
  Bookmark,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  UserCheck,
  UserX,
  Timer,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  DollarSign as DollarIcon,
  Percent,
  Hash,
  Globe,
  MapPin,
  Flag,
  Building,
  Briefcase,
  GraduationCap,
  Code,
  Palette,
  PenTool,
  Camera,
  Music,
  Video,
  Image,
  File,
  Folder,
  Database,
  Server,
  Cloud,
  Wifi,
  Smartphone,
  Monitor,
  Laptop,
  Tablet,
  Headphones,
  Mic,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Mail,
  Phone,
  MessageSquare as MessageSquareIcon,
  Send,
  Inbox,
  Outbox,
  Archive,
  Trash2,
  Edit,
  Copy,
  Link,
  ExternalLink,
  Maximize,
  Minimize,
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
  Link as LinkIcon,
  Unlink,
  List,
  ListOrdered,
  Quote,
  Code as CodeIcon,
  Table,
  Grid,
  Layout,
  Columns,
  Rows,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Fullscreen,
  FullscreenExit
} from 'lucide-react';

interface AnalyticsData {
  dashboard: {
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
    totalEarnings: number;
    monthlyEarnings: number;
    averageRating: number;
    totalReviews: number;
    responseRate: number;
    completionRate: number;
    onTimeDelivery: number;
  };
  earnings: {
    monthly: Array<{ month: string; amount: number; projects: number }>;
    yearly: Array<{ year: string; amount: number; projects: number }>;
    byCategory: Array<{ category: string; amount: number; percentage: number }>;
    trends: Array<{ date: string; earnings: number; projects: number }>;
  };
  performance: {
    ratings: Array<{ rating: number; count: number; percentage: number }>;
    skills: Array<{ skill: string; rating: number; projects: number }>;
    timeline: Array<{ date: string; rating: number; projects: number }>;
    milestones: Array<{ milestone: string; completed: number; total: number }>;
  };
  trends: {
    projectTypes: Array<{ type: string; count: number; trend: 'up' | 'down' | 'stable' }>;
    clientSatisfaction: Array<{ month: string; rating: number; reviews: number }>;
    marketDemand: Array<{ skill: string; demand: number; supply: number }>;
    seasonal: Array<{ month: string; projects: number; earnings: number }>;
  };
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    sources: Array<{ source: string; amount: number; percentage: number }>;
    forecast: Array<{ month: string; predicted: number; actual?: number }>;
  };
}

export default function AnalyticsPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    dashboard: {
      totalProjects: 45,
      completedProjects: 38,
      activeProjects: 7,
      totalEarnings: 125000,
      monthlyEarnings: 8500,
      averageRating: 4.8,
      totalReviews: 42,
      responseRate: 95,
      completionRate: 92,
      onTimeDelivery: 88
    },
    earnings: {
      monthly: [
        { month: 'Jan', amount: 7500, projects: 5 },
        { month: 'Feb', amount: 8200, projects: 6 },
        { month: 'Mar', amount: 9100, projects: 7 },
        { month: 'Apr', amount: 7800, projects: 5 },
        { month: 'May', amount: 9500, projects: 8 },
        { month: 'Jun', amount: 8800, projects: 6 }
      ],
      yearly: [
        { year: '2020', amount: 45000, projects: 25 },
        { year: '2021', amount: 68000, projects: 35 },
        { year: '2022', amount: 92000, projects: 42 },
        { year: '2023', amount: 110000, projects: 48 },
        { year: '2024', amount: 125000, projects: 45 }
      ],
      byCategory: [
        { category: 'Web Development', amount: 45000, percentage: 36 },
        { category: 'Mobile Apps', amount: 32000, percentage: 26 },
        { category: 'UI/UX Design', amount: 28000, percentage: 22 },
        { category: 'Consulting', amount: 20000, percentage: 16 }
      ],
      trends: [
        { date: '2024-01', earnings: 7500, projects: 5 },
        { date: '2024-02', earnings: 8200, projects: 6 },
        { date: '2024-03', earnings: 9100, projects: 7 },
        { date: '2024-04', earnings: 7800, projects: 5 },
        { date: '2024-05', earnings: 9500, projects: 8 },
        { date: '2024-06', earnings: 8800, projects: 6 }
      ]
    },
    performance: {
      ratings: [
        { rating: 5, count: 32, percentage: 76 },
        { rating: 4, count: 8, percentage: 19 },
        { rating: 3, count: 2, percentage: 5 },
        { rating: 2, count: 0, percentage: 0 },
        { rating: 1, count: 0, percentage: 0 }
      ],
      skills: [
        { skill: 'React', rating: 4.9, projects: 15 },
        { skill: 'Node.js', rating: 4.8, projects: 12 },
        { skill: 'TypeScript', rating: 4.7, projects: 10 },
        { skill: 'MongoDB', rating: 4.6, projects: 8 },
        { skill: 'AWS', rating: 4.5, projects: 6 }
      ],
      timeline: [
        { date: '2024-01', rating: 4.7, projects: 5 },
        { date: '2024-02', rating: 4.8, projects: 6 },
        { date: '2024-03', rating: 4.9, projects: 7 },
        { date: '2024-04', rating: 4.6, projects: 5 },
        { date: '2024-05', rating: 4.8, projects: 8 },
        { date: '2024-06', rating: 4.9, projects: 6 }
      ],
      milestones: [
        { milestone: 'On-time Delivery', completed: 35, total: 40 },
        { milestone: 'Client Satisfaction', completed: 38, total: 40 },
        { milestone: 'Quality Standards', completed: 40, total: 40 },
        { milestone: 'Communication', completed: 37, total: 40 }
      ]
    },
    trends: {
      projectTypes: [
        { type: 'E-commerce', count: 15, trend: 'up' },
        { type: 'SaaS Platforms', count: 12, trend: 'up' },
        { type: 'Mobile Apps', count: 10, trend: 'stable' },
        { type: 'Landing Pages', count: 8, trend: 'down' }
      ],
      clientSatisfaction: [
        { month: 'Jan', rating: 4.7, reviews: 8 },
        { month: 'Feb', rating: 4.8, reviews: 12 },
        { month: 'Mar', rating: 4.9, reviews: 15 },
        { month: 'Apr', rating: 4.6, reviews: 10 },
        { month: 'May', rating: 4.8, reviews: 18 },
        { month: 'Jun', rating: 4.9, reviews: 14 }
      ],
      marketDemand: [
        { skill: 'React', demand: 85, supply: 60 },
        { skill: 'Node.js', demand: 78, supply: 45 },
        { skill: 'TypeScript', demand: 72, supply: 40 },
        { skill: 'AWS', demand: 68, supply: 35 },
        { skill: 'Docker', demand: 65, supply: 30 }
      ],
      seasonal: [
        { month: 'Jan', projects: 5, earnings: 7500 },
        { month: 'Feb', projects: 6, earnings: 8200 },
        { month: 'Mar', projects: 7, earnings: 9100 },
        { month: 'Apr', projects: 5, earnings: 7800 },
        { month: 'May', projects: 8, earnings: 9500 },
        { month: 'Jun', projects: 6, earnings: 8800 }
      ]
    },
    revenue: {
      total: 125000,
      monthly: 8500,
      growth: 15.2,
      sources: [
        { source: 'Fixed Price', amount: 75000, percentage: 60 },
        { source: 'Hourly Rate', amount: 35000, percentage: 28 },
        { source: 'Retainers', amount: 15000, percentage: 12 }
      ],
      forecast: [
        { month: 'Jul', predicted: 9200 },
        { month: 'Aug', predicted: 9800 },
        { month: 'Sep', predicted: 10500 },
        { month: 'Oct', predicted: 11000 },
        { month: 'Nov', predicted: 9500 },
        { month: 'Dec', predicted: 12000 }
      ]
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, fetch from /api/analytics/dashboard/:userId
      console.log('Fetching analytics data...');
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
                {isRTL ? "التحليلات والإحصائيات" : "Analytics & Statistics"}
              </h1>
              <p className="text-muted-foreground">
                {isRTL 
                  ? "تتبع أداءك وإحصائياتك المالية مع رؤى مفصلة" 
                  : "Track your performance and financial statistics with detailed insights"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">{isRTL ? "3 أشهر" : "3 Months"}</SelectItem>
                  <SelectItem value="6months">{isRTL ? "6 أشهر" : "6 Months"}</SelectItem>
                  <SelectItem value="1year">{isRTL ? "سنة واحدة" : "1 Year"}</SelectItem>
                  <SelectItem value="2years">{isRTL ? "سنتان" : "2 Years"}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchAnalyticsData} disabled={loading}>
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                {isRTL ? "تحديث" : "Refresh"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {isRTL ? "تصدير" : "Export"}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              {isRTL ? "لوحة التحكم" : "Dashboard"}
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <DollarSign className="h-4 w-4 mr-2" />
              {isRTL ? "الأرباح" : "Earnings"}
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Target className="h-4 w-4 mr-2" />
              {isRTL ? "الأداء" : "Performance"}
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              {isRTL ? "الاتجاهات" : "Trends"}
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <Activity className="h-4 w-4 mr-2" />
              {isRTL ? "الإيرادات" : "Revenue"}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "إجمالي المشاريع" : "Total Projects"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {analyticsData.dashboard.totalProjects}
                      </p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +12% {isRTL ? "من الشهر الماضي" : "from last month"}
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
                        {isRTL ? "إجمالي الأرباح" : "Total Earnings"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {formatCurrency(analyticsData.dashboard.totalEarnings)}
                      </p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +8.5% {isRTL ? "من الشهر الماضي" : "from last month"}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "متوسط التقييم" : "Average Rating"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {analyticsData.dashboard.averageRating}
                      </p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +0.2 {isRTL ? "من الشهر الماضي" : "from last month"}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "معدل الإنجاز" : "Completion Rate"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {formatPercentage(analyticsData.dashboard.completionRate)}
                      </p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +3% {isRTL ? "من الشهر الماضي" : "from last month"}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {isRTL ? "نظرة عامة على الأداء" : "Performance Overview"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{isRTL ? "معدل الاستجابة" : "Response Rate"}</span>
                      <span className="text-sm font-bold">{formatPercentage(analyticsData.dashboard.responseRate)}</span>
                    </div>
                    <Progress value={analyticsData.dashboard.responseRate} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{isRTL ? "التسليم في الوقت المحدد" : "On-time Delivery"}</span>
                      <span className="text-sm font-bold">{formatPercentage(analyticsData.dashboard.onTimeDelivery)}</span>
                    </div>
                    <Progress value={analyticsData.dashboard.onTimeDelivery} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{isRTL ? "معدل الإنجاز" : "Completion Rate"}</span>
                      <span className="text-sm font-bold">{formatPercentage(analyticsData.dashboard.completionRate)}</span>
                    </div>
                    <Progress value={analyticsData.dashboard.completionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {isRTL ? "اتجاهات المشاريع" : "Project Trends"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={analyticsData.earnings.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="projects" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            {/* Earnings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "الأرباح الشهرية" : "Monthly Earnings"}
                      </p>
                      <p className="text-2xl font-bold text-[#0A2540]">
                        {formatCurrency(analyticsData.dashboard.monthlyEarnings)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "إجمالي الأرباح" : "Total Earnings"}
                      </p>
                      <p className="text-2xl font-bold text-[#0A2540]">
                        {formatCurrency(analyticsData.dashboard.totalEarnings)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "متوسط المشروع" : "Avg per Project"}
                      </p>
                      <p className="text-2xl font-bold text-[#0A2540]">
                        {formatCurrency(analyticsData.dashboard.totalEarnings / analyticsData.dashboard.totalProjects)}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Earnings Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {isRTL ? "الأرباح الشهرية" : "Monthly Earnings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.earnings.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), isRTL ? "الأرباح" : "Earnings"]} />
                      <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    {isRTL ? "الأرباح حسب الفئة" : "Earnings by Category"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.earnings.byCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {analyticsData.earnings.byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), isRTL ? "المبلغ" : "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Earnings Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  {isRTL ? "اتجاهات الأرباح" : "Earnings Trends"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.earnings.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), isRTL ? "الأرباح" : "Earnings"]} />
                    <Line type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "متوسط التقييم" : "Average Rating"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {analyticsData.dashboard.averageRating}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
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
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {analyticsData.dashboard.totalReviews}
                      </p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-blue-500" />
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
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {formatPercentage(analyticsData.dashboard.responseRate)}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "التسليم في الوقت" : "On-time Delivery"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {formatPercentage(analyticsData.dashboard.onTimeDelivery)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isRTL ? "توزيع التقييمات" : "Rating Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.ratings.map((rating) => (
                    <div key={rating.rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-20">
                        <span className="text-sm font-medium">{rating.rating}</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1">
                        <Progress value={rating.percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {rating.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {isRTL ? "أداء المهارات" : "Skills Performance"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.performance.skills.map((skill) => (
                      <div key={skill.skill} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{skill.skill}</p>
                          <p className="text-sm text-gray-500">{skill.projects} {isRTL ? "مشروع" : "projects"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{skill.rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5" />
                    {isRTL ? "اتجاهات الأداء" : "Performance Trends"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.performance.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[4, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            {/* Market Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.trends.projectTypes.map((trend) => (
                <Card key={trend.type}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{trend.type}</p>
                        <p className="text-2xl font-bold text-[#0A2540]">{trend.count}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {getTrendIcon(trend.trend)}
                          <span className="text-xs text-gray-500">
                            {trend.trend === 'up' ? (isRTL ? "في ارتفاع" : "Growing") :
                             trend.trend === 'down' ? (isRTL ? "في انخفاض" : "Declining") :
                             (isRTL ? "مستقر" : "Stable")}
                          </span>
                        </div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Client Satisfaction Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {isRTL ? "اتجاهات رضا العملاء" : "Client Satisfaction Trends"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.trends.clientSatisfaction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[4, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Demand */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isRTL ? "الطلب في السوق" : "Market Demand"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.trends.marketDemand}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="demand" fill="#8884d8" name={isRTL ? "الطلب" : "Demand"} />
                    <Bar dataKey="supply" fill="#82ca9d" name={isRTL ? "العرض" : "Supply"} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "إجمالي الإيرادات" : "Total Revenue"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {formatCurrency(analyticsData.revenue.total)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "الإيرادات الشهرية" : "Monthly Revenue"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {formatCurrency(analyticsData.revenue.monthly)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "معدل النمو" : "Growth Rate"}
                      </p>
                      <p className="text-3xl font-bold text-[#0A2540]">
                        {formatPercentage(analyticsData.revenue.growth)}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  {isRTL ? "مصادر الإيرادات" : "Revenue Sources"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={analyticsData.revenue.sources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percentage }) => `${source} ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {analyticsData.revenue.sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), isRTL ? "المبلغ" : "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  {isRTL ? "توقعات الإيرادات" : "Revenue Forecast"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.revenue.forecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), isRTL ? "الإيرادات المتوقعة" : "Predicted Revenue"]} />
                    <Line type="monotone" dataKey="predicted" stroke="#8884d8" strokeWidth={2} />
                    {analyticsData.revenue.forecast.some(item => item.actual) && (
                      <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

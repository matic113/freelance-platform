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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Flag, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  User,
  MessageCircle,
  FileText,
  Image,
  Video,
  Shield,
  AlertTriangle,
  Ban,
  UserX,
  MessageSquare,
  FileImage,
  FileVideo,
  FileAudio,
  FilePdf,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Calendar,
  MoreVertical,
  Send,
  Edit,
  Trash2,
  Archive,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Unlock,
  Settings,
  Bell,
  BellOff,
  Mail,
  Phone,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Database,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Scissors,
  Palette,
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
  Link,
  Unlink,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Grid,
  Layout,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Diamond,
  Heart,
  Star,
  Zap,
  Flame,
  Droplet,
  Snowflake,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Gauge,
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Pulse,
  Heartbeat,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryHigh,
  BatteryFull,
  Plug,
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Radio,
  RadioOff,
  Signal,
  SignalLow,
  SignalMedium,
  SignalHigh,
  SignalFull,
  SignalZero,
  SignalOne,
  SignalTwo,
  SignalThree,
  SignalFour,
  SignalFive,
  SignalSix,
  SignalSeven,
  SignalEight,
  SignalNine,
  SignalTen,
  SignalEleven,
  SignalTwelve,
  SignalThirteen,
  SignalFourteen,
  SignalFifteen,
  SignalSixteen,
  SignalSeventeen,
  SignalEighteen,
  SignalNineteen,
  SignalTwenty,
  SignalTwentyOne,
  SignalTwentyTwo,
  SignalTwentyThree,
  SignalTwentyFour,
  SignalTwentyFive,
  SignalTwentySix,
  SignalTwentySeven,
  SignalTwentyEight,
  SignalTwentyNine,
  SignalThirty,
  SignalThirtyOne,
  SignalThirtyTwo,
  SignalThirtyThree,
  SignalThirtyFour,
  SignalThirtyFive,
  SignalThirtySix,
  SignalThirtySeven,
  SignalThirtyEight,
  SignalThirtyNine,
  SignalForty,
  SignalFortyOne,
  SignalFortyTwo,
  SignalFortyThree,
  SignalFortyFour,
  SignalFortyFive,
  SignalFortySix,
  SignalFortySeven,
  SignalFortyEight,
  SignalFortyNine,
  SignalFifty,
  SignalFiftyOne,
  SignalFiftyTwo,
  SignalFiftyThree,
  SignalFiftyFour,
  SignalFiftyFive,
  SignalFiftySix,
  SignalFiftySeven,
  SignalFiftyEight,
  SignalFiftyNine,
  SignalSixty,
  SignalSixtyOne,
  SignalSixtyTwo,
  SignalSixtyThree,
  SignalSixtyFour,
  SignalSixtyFive,
  SignalSixtySix,
  SignalSixtySeven,
  SignalSixtyEight,
  SignalSixtyNine,
  SignalSeventy,
  SignalSeventyOne,
  SignalSeventyTwo,
  SignalSeventyThree,
  SignalSeventyFour,
  SignalSeventyFive,
  SignalSeventySix,
  SignalSeventySeven,
  SignalSeventyEight,
  SignalSeventyNine,
  SignalEighty,
  SignalEightyOne,
  SignalEightyTwo,
  SignalEightyThree,
  SignalEightyFour,
  SignalEightyFive,
  SignalEightySix,
  SignalEightySeven,
  SignalEightyEight,
  SignalEightyNine,
  SignalNinety,
  SignalNinetyOne,
  SignalNinetyTwo,
  SignalNinetyThree,
  SignalNinetyFour,
  SignalNinetyFive,
  SignalNinetySix,
  SignalNinetySeven,
  SignalNinetyEight,
  SignalNinetyNine,
  SignalHundred
} from 'lucide-react';

export default function ReportingPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('report');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');

  // Report form state
  const [reportForm, setReportForm] = useState({
    type: '',
    category: '',
    targetType: '',
    targetId: '',
    title: '',
    description: '',
    evidence: [] as File[],
    priority: 'medium',
    anonymous: false,
    contactEmail: '',
    contactPhone: ''
  });

  // Mock reports data
  const [reports, setReports] = useState([
    {
      id: '1',
      type: 'user',
      category: 'harassment',
      targetType: 'user',
      targetId: 'user123',
      targetName: 'John Doe',
      title: isRTL ? 'مضايقة مستخدم' : 'User Harassment',
      description: isRTL ? 'المستخدم يرسل رسائل مسيئة ومضايقة' : 'User is sending offensive and harassing messages',
      status: 'pending',
      priority: 'high',
      submittedAt: '2025-01-15T10:30:00Z',
      submittedBy: 'current_user',
      evidence: ['screenshot1.png', 'message_log.txt'],
      adminNotes: '',
      resolution: '',
      resolvedAt: null
    },
    {
      id: '2',
      type: 'project',
      category: 'scam',
      targetType: 'project',
      targetId: 'project456',
      targetName: isRTL ? 'مشروع وهمي' : 'Fake Project',
      title: isRTL ? 'مشروع احتيالي' : 'Scam Project',
      description: isRTL ? 'المشروع يطلب دفع مقدم دون تقديم خدمة' : 'Project requests upfront payment without providing service',
      status: 'investigating',
      priority: 'high',
      submittedAt: '2025-01-14T15:20:00Z',
      submittedBy: 'current_user',
      evidence: ['payment_screenshot.png', 'conversation.pdf'],
      adminNotes: isRTL ? 'قيد التحقيق من قبل فريق الأمان' : 'Under investigation by security team',
      resolution: '',
      resolvedAt: null
    },
    {
      id: '3',
      type: 'content',
      category: 'inappropriate',
      targetType: 'proposal',
      targetId: 'proposal789',
      targetName: isRTL ? 'عرض غير مناسب' : 'Inappropriate Proposal',
      title: isRTL ? 'محتوى غير لائق' : 'Inappropriate Content',
      description: isRTL ? 'العرض يحتوي على محتوى غير لائق' : 'Proposal contains inappropriate content',
      status: 'resolved',
      priority: 'medium',
      submittedAt: '2025-01-13T09:15:00Z',
      submittedBy: 'current_user',
      evidence: ['content_screenshot.png'],
      adminNotes: isRTL ? 'تم حذف المحتوى غير اللائق' : 'Inappropriate content has been removed',
      resolution: isRTL ? 'تم حذف المحتوى وتم تحذير المستخدم' : 'Content removed and user warned',
      resolvedAt: '2025-01-13T14:30:00Z'
    }
  ]);

  const reportTypes = [
    { value: 'user', label: isRTL ? 'مستخدم' : 'User', icon: User },
    { value: 'project', label: isRTL ? 'مشروع' : 'Project', icon: FileText },
    { value: 'proposal', label: isRTL ? 'عرض' : 'Proposal', icon: MessageCircle },
    { value: 'message', label: isRTL ? 'رسالة' : 'Message', icon: MessageSquare },
    { value: 'content', label: isRTL ? 'محتوى' : 'Content', icon: FileText },
    { value: 'payment', label: isRTL ? 'دفع' : 'Payment', icon: Shield },
    { value: 'other', label: isRTL ? 'أخرى' : 'Other', icon: Flag }
  ];

  const reportCategories = {
    user: [
      { value: 'harassment', label: isRTL ? 'مضايقة' : 'Harassment' },
      { value: 'spam', label: isRTL ? 'رسائل مزعجة' : 'Spam' },
      { value: 'fake_profile', label: isRTL ? 'ملف شخصي وهمي' : 'Fake Profile' },
      { value: 'inappropriate_behavior', label: isRTL ? 'سلوك غير مناسب' : 'Inappropriate Behavior' },
      { value: 'scam', label: isRTL ? 'احتيال' : 'Scam' },
      { value: 'violence', label: isRTL ? 'عنف' : 'Violence' },
      { value: 'hate_speech', label: isRTL ? 'خطاب كراهية' : 'Hate Speech' }
    ],
    project: [
      { value: 'scam', label: isRTL ? 'احتيال' : 'Scam' },
      { value: 'fake_project', label: isRTL ? 'مشروع وهمي' : 'Fake Project' },
      { value: 'inappropriate_content', label: isRTL ? 'محتوى غير مناسب' : 'Inappropriate Content' },
      { value: 'copyright_violation', label: isRTL ? 'انتهاك حقوق الطبع' : 'Copyright Violation' },
      { value: 'spam', label: isRTL ? 'رسائل مزعجة' : 'Spam' },
      { value: 'duplicate', label: isRTL ? 'مكرر' : 'Duplicate' }
    ],
    proposal: [
      { value: 'inappropriate', label: isRTL ? 'غير مناسب' : 'Inappropriate' },
      { value: 'spam', label: isRTL ? 'رسائل مزعجة' : 'Spam' },
      { value: 'fake', label: isRTL ? 'وهمي' : 'Fake' },
      { value: 'copyright_violation', label: isRTL ? 'انتهاك حقوق الطبع' : 'Copyright Violation' },
      { value: 'low_quality', label: isRTL ? 'جودة منخفضة' : 'Low Quality' }
    ],
    message: [
      { value: 'harassment', label: isRTL ? 'مضايقة' : 'Harassment' },
      { value: 'spam', label: isRTL ? 'رسائل مزعجة' : 'Spam' },
      { value: 'inappropriate', label: isRTL ? 'غير مناسب' : 'Inappropriate' },
      { value: 'threats', label: isRTL ? 'تهديدات' : 'Threats' },
      { value: 'hate_speech', label: isRTL ? 'خطاب كراهية' : 'Hate Speech' }
    ],
    content: [
      { value: 'inappropriate', label: isRTL ? 'غير مناسب' : 'Inappropriate' },
      { value: 'copyright_violation', label: isRTL ? 'انتهاك حقوق الطبع' : 'Copyright Violation' },
      { value: 'spam', label: isRTL ? 'رسائل مزعجة' : 'Spam' },
      { value: 'fake', label: isRTL ? 'وهمي' : 'Fake' },
      { value: 'misleading', label: isRTL ? 'مضلل' : 'Misleading' }
    ],
    payment: [
      { value: 'scam', label: isRTL ? 'احتيال' : 'Scam' },
      { value: 'fraud', label: isRTL ? 'احتيال' : 'Fraud' },
      { value: 'unauthorized', label: isRTL ? 'غير مصرح' : 'Unauthorized' },
      { value: 'refund_issue', label: isRTL ? 'مشكلة استرداد' : 'Refund Issue' },
      { value: 'payment_dispute', label: isRTL ? 'نزاع دفع' : 'Payment Dispute' }
    ],
    other: [
      { value: 'technical_issue', label: isRTL ? 'مشكلة تقنية' : 'Technical Issue' },
      { value: 'bug_report', label: isRTL ? 'تقرير خطأ' : 'Bug Report' },
      { value: 'feature_request', label: isRTL ? 'طلب ميزة' : 'Feature Request' },
      { value: 'general_inquiry', label: isRTL ? 'استفسار عام' : 'General Inquiry' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return isRTL ? 'في الانتظار' : 'Pending';
      case 'investigating':
        return isRTL ? 'قيد التحقيق' : 'Investigating';
      case 'resolved':
        return isRTL ? 'تم الحل' : 'Resolved';
      case 'dismissed':
        return isRTL ? 'مرفوض' : 'Dismissed';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'investigating':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'dismissed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return isRTL ? 'منخفض' : 'Low';
      case 'medium':
        return isRTL ? 'متوسط' : 'Medium';
      case 'high':
        return isRTL ? 'عالي' : 'High';
      default:
        return priority;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.targetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReportTypeChange = (type: string) => {
    setReportForm(prev => ({
      ...prev,
      type,
      category: '',
      targetType: '',
      targetId: ''
    }));
  };

  const handleSubmitReport = () => {
    if (!reportForm.type || !reportForm.category || !reportForm.title || !reportForm.description) {
      alert(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      type: reportForm.type,
      category: reportForm.category,
      targetType: reportForm.targetType,
      targetId: reportForm.targetId,
      targetName: reportForm.title,
      title: reportForm.title,
      description: reportForm.description,
      status: 'pending',
      priority: reportForm.priority,
      submittedAt: new Date().toISOString(),
      submittedBy: 'current_user',
      evidence: reportForm.evidence.map(file => file.name),
      adminNotes: '',
      resolution: '',
      resolvedAt: null
    };

    setReports(prev => [newReport, ...prev]);
    setShowReportDialog(false);
    setReportForm({
      type: '',
      category: '',
      targetType: '',
      targetId: '',
      title: '',
      description: '',
      evidence: [],
      priority: 'medium',
      anonymous: false,
      contactEmail: '',
      contactPhone: ''
    });

    alert(isRTL ? 'تم إرسال التقرير بنجاح' : 'Report submitted successfully');
  };

  const getReportStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const investigating = reports.filter(r => r.status === 'investigating').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    
    return { total, pending, investigating, resolved };
  };

  const stats = getReportStats();

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "نظام الإبلاغ" : "Reporting System"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "أبلغ عن المحتوى أو السلوك غير المناسب لضمان بيئة آمنة للجميع" 
              : "Report inappropriate content or behavior to ensure a safe environment for everyone"
            }
          </p>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي التقارير" : "Total Reports"}
                  </p>
                  <p className="text-2xl font-bold text-[#0A2540]">{stats.total}</p>
                </div>
                <Flag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "في الانتظار" : "Pending"}
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "قيد التحقيق" : "Investigating"}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{stats.investigating}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "تم الحل" : "Resolved"}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="report">
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? "إرسال تقرير" : "Submit Report"}
              </TabsTrigger>
              <TabsTrigger value="history">
                <Eye className="h-4 w-4 mr-2" />
                {isRTL ? "تاريخ التقارير" : "Report History"}
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="pending">{isRTL ? "في الانتظار" : "Pending"}</SelectItem>
                  <SelectItem value="investigating">{isRTL ? "قيد التحقيق" : "Investigating"}</SelectItem>
                  <SelectItem value="resolved">{isRTL ? "تم الحل" : "Resolved"}</SelectItem>
                  <SelectItem value="dismissed">{isRTL ? "مرفوض" : "Dismissed"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Report Tab */}
          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  {isRTL ? "إرسال تقرير جديد" : "Submit New Report"}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? "اختر نوع التقرير واملأ التفاصيل المطلوبة"
                    : "Select the report type and fill in the required details"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    {isRTL ? "نوع التقرير" : "Report Type"} *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {reportTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Button
                          key={type.value}
                          variant={reportForm.type === type.value ? "default" : "outline"}
                          className="h-20 flex flex-col items-center gap-2"
                          onClick={() => handleReportTypeChange(type.value)}
                        >
                          <IconComponent className="h-6 w-6" />
                          <span className="text-sm">{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Report Category */}
                {reportForm.type && (
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {isRTL ? "فئة التقرير" : "Report Category"} *
                    </Label>
                    <Select value={reportForm.category} onValueChange={(value) => setReportForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? "اختر الفئة..." : "Select category..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {reportCategories[reportForm.type as keyof typeof reportCategories]?.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Report Details */}
                {reportForm.category && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        {isRTL ? "عنوان التقرير" : "Report Title"} *
                      </Label>
                      <Input
                        id="title"
                        value={reportForm.title}
                        onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={isRTL ? "أدخل عنوان التقرير..." : "Enter report title..."}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        {isRTL ? "وصف التقرير" : "Report Description"} *
                      </Label>
                      <Textarea
                        id="description"
                        value={reportForm.description}
                        onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={isRTL ? "اشرح المشكلة بالتفصيل..." : "Explain the issue in detail..."}
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">
                          {isRTL ? "الأولوية" : "Priority"}
                        </Label>
                        <Select value={reportForm.priority} onValueChange={(value) => setReportForm(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {isRTL ? "منخفض" : "Low"}
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                {isRTL ? "متوسط" : "Medium"}
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {isRTL ? "عالي" : "High"}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">
                          {isRTL ? "البريد الإلكتروني للتواصل" : "Contact Email"}
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={reportForm.contactEmail}
                          onChange={(e) => setReportForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                          placeholder={isRTL ? "البريد الإلكتروني..." : "Email address..."}
                        />
                      </div>
                    </div>

                    {/* Evidence Upload */}
                    <div className="space-y-2">
                      <Label>
                        {isRTL ? "الأدلة والملفات" : "Evidence & Files"}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          {isRTL ? "اسحب الملفات هنا أو انقر للاختيار" : "Drag files here or click to select"}
                        </p>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          {isRTL ? "اختيار الملفات" : "Choose Files"}
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitReport}
                        className="bg-[#0A2540] hover:bg-[#142b52]"
                        disabled={!reportForm.type || !reportForm.category || !reportForm.title || !reportForm.description}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isRTL ? "إرسال التقرير" : "Submit Report"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report History Tab */}
          <TabsContent value="history" className="space-y-6">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#0A2540]">
                            {report.title}
                          </h3>
                          <Badge className={getStatusColor(report.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(report.status)}
                              {getStatusText(report.status)}
                            </div>
                          </Badge>
                          <Badge className={getPriorityColor(report.priority)}>
                            {getPriorityText(report.priority)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {report.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Flag className="h-4 w-4" />
                            <span>{reportTypes.find(t => t.value === report.type)?.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{report.targetName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(report.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    {report.adminNotes && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700">
                            {isRTL ? "ملاحظات الإدارة" : "Admin Notes"}
                          </span>
                        </div>
                        <p className="text-sm text-blue-600">{report.adminNotes}</p>
                      </div>
                    )}

                    {/* Resolution */}
                    {report.resolution && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-700">
                            {isRTL ? "الحل" : "Resolution"}
                          </span>
                        </div>
                        <p className="text-sm text-green-600">{report.resolution}</p>
                        {report.resolvedAt && (
                          <p className="text-xs text-green-500 mt-1">
                            {isRTL ? "تم الحل في" : "Resolved on"} {new Date(report.resolvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Evidence */}
                    {report.evidence.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {isRTL ? "الأدلة" : "Evidence"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {report.evidence.map((file, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد تقارير" : "No Reports Found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم نجد أي تقارير تطابق معايير البحث المحددة"
                      : "No reports match your search criteria"
                    }
                  </p>
                  <Button onClick={() => setActiveTab('report')}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إرسال تقرير جديد" : "Submit New Report"}
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

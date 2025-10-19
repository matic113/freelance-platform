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
  DollarSign,
  User,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  Square,
  MoreVertical,
  Copy,
  Send,
  Archive,
  Star,
  Tag,
  FilePdf,
  FileSpreadsheet,
  FileArchive,
  Lock,
  Unlock,
  Shield,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  MapPin,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  Target,
  Zap,
  Heart,
  ThumbsUp,
  MessageSquare,
  Bell,
  Settings,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Upload,
  Download as DownloadIcon,
  Save,
  SaveAs
} from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  description: string;
  type: 'fixed-price' | 'hourly' | 'milestone' | 'retainer';
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  clientId: string;
  clientName: string;
  clientEmail: string;
  freelancerId: string;
  freelancerName: string;
  freelancerEmail: string;
  projectId: string;
  projectTitle: string;
  startDate: string;
  endDate: string;
  budget: {
    amount: number;
    currency: string;
    type: 'fixed' | 'hourly';
    hourlyRate?: number;
    totalHours?: number;
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'completed' | 'paid';
    completedAt?: string;
    paidAt?: string;
  }>;
  terms: {
    paymentSchedule: 'milestone' | 'weekly' | 'monthly' | 'end';
    lateFee: number;
    cancellationPolicy: string;
    intellectualProperty: string;
    confidentiality: boolean;
    nonDisclosure: boolean;
  };
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  completedAt?: string;
  totalPaid: number;
  remainingAmount: number;
  isPublic: boolean;
  isStarred: boolean;
  tags: string[];
  notes: string;
  communication: Array<{
    id: string;
    type: 'message' | 'file' | 'milestone' | 'payment';
    content: string;
    author: string;
    timestamp: string;
    attachments?: string[];
  }>;
}

export default function ContractManagementPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // Mock contracts data
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      title: isRTL ? 'عقد تطوير موقع إلكتروني' : 'Website Development Contract',
      description: isRTL ? 'عقد تطوير موقع إلكتروني للتجارة الإلكترونية' : 'E-commerce website development contract',
      type: 'fixed-price',
      status: 'active',
      clientId: 'client-1',
      clientName: isRTL ? 'شركة التقنية المتقدمة' : 'Advanced Tech Company',
      clientEmail: 'client@tech.com',
      freelancerId: 'freelancer-1',
      freelancerName: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      freelancerEmail: 'ahmed@freelancer.com',
      projectId: 'project-1',
      projectTitle: isRTL ? 'تطوير موقع إلكتروني' : 'Website Development',
      startDate: '2025-01-01',
      endDate: '2025-03-01',
      budget: {
        amount: 5000,
        currency: 'USD',
        type: 'fixed'
      },
      milestones: [
        {
          id: 'milestone-1',
          title: isRTL ? 'التصميم الأولي' : 'Initial Design',
          description: isRTL ? 'تصميم واجهة المستخدم' : 'User interface design',
          amount: 1500,
          dueDate: '2025-01-15',
          status: 'completed',
          completedAt: '2025-01-14',
          paidAt: '2025-01-16'
        },
        {
          id: 'milestone-2',
          title: isRTL ? 'التطوير الأساسي' : 'Core Development',
          description: isRTL ? 'تطوير الوظائف الأساسية' : 'Core functionality development',
          amount: 2000,
          dueDate: '2025-02-15',
          status: 'completed',
          completedAt: '2025-02-12',
          paidAt: '2025-02-14'
        },
        {
          id: 'milestone-3',
          title: isRTL ? 'الاختبار والتسليم' : 'Testing & Delivery',
          description: isRTL ? 'اختبار الموقع وتسليمه' : 'Website testing and delivery',
          amount: 1500,
          dueDate: '2025-03-01',
          status: 'pending'
        }
      ],
      terms: {
        paymentSchedule: 'milestone',
        lateFee: 50,
        cancellationPolicy: isRTL ? 'يمكن الإلغاء قبل بداية العمل' : 'Can be cancelled before work starts',
        intellectualProperty: isRTL ? 'الملكية الفكرية للعميل' : 'Intellectual property belongs to client',
        confidentiality: true,
        nonDisclosure: true
      },
      attachments: ['contract.pdf', 'requirements.docx'],
      createdAt: '2024-12-20',
      updatedAt: '2025-01-16',
      signedAt: '2024-12-22',
      totalPaid: 3500,
      remainingAmount: 1500,
      isPublic: false,
      isStarred: true,
      tags: [isRTL ? 'تطوير' : 'Development', isRTL ? 'موقع' : 'Website'],
      notes: isRTL ? 'عقد مهم مع عميل مميز' : 'Important contract with premium client',
      communication: [
        {
          id: 'comm-1',
          type: 'message',
          content: isRTL ? 'تم بدء العمل على المشروع' : 'Work started on the project',
          author: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
          timestamp: '2025-01-01T10:00:00Z'
        },
        {
          id: 'comm-2',
          type: 'milestone',
          content: isRTL ? 'تم إكمال المرحلة الأولى' : 'First milestone completed',
          author: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
          timestamp: '2025-01-14T15:30:00Z'
        }
      ]
    },
    {
      id: '2',
      title: isRTL ? 'عقد تصميم هوية بصرية' : 'Brand Identity Design Contract',
      description: isRTL ? 'عقد تصميم هوية بصرية كاملة للشركة' : 'Complete brand identity design contract',
      type: 'milestone',
      status: 'pending',
      clientId: 'client-2',
      clientName: isRTL ? 'شركة الإبداع' : 'Creativity Company',
      clientEmail: 'client@creativity.com',
      freelancerId: 'freelancer-2',
      freelancerName: isRTL ? 'سارة أحمد' : 'Sara Ahmed',
      freelancerEmail: 'sara@freelancer.com',
      projectId: 'project-2',
      projectTitle: isRTL ? 'تصميم هوية بصرية' : 'Brand Identity Design',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      budget: {
        amount: 2500,
        currency: 'USD',
        type: 'fixed'
      },
      milestones: [
        {
          id: 'milestone-1',
          title: isRTL ? 'البحث والتحليل' : 'Research & Analysis',
          description: isRTL ? 'بحث السوق وتحليل المنافسين' : 'Market research and competitor analysis',
          amount: 500,
          dueDate: '2025-01-25',
          status: 'pending'
        },
        {
          id: 'milestone-2',
          title: isRTL ? 'تصميم الشعار' : 'Logo Design',
          description: isRTL ? 'تصميم شعار الشركة' : 'Company logo design',
          amount: 1000,
          dueDate: '2025-02-05',
          status: 'pending'
        },
        {
          id: 'milestone-3',
          title: isRTL ? 'الهوية البصرية' : 'Visual Identity',
          description: isRTL ? 'تطوير الهوية البصرية الكاملة' : 'Complete visual identity development',
          amount: 1000,
          dueDate: '2025-02-15',
          status: 'pending'
        }
      ],
      terms: {
        paymentSchedule: 'milestone',
        lateFee: 25,
        cancellationPolicy: isRTL ? 'يمكن الإلغاء مع رسوم' : 'Can be cancelled with fees',
        intellectualProperty: isRTL ? 'الملكية الفكرية للعميل' : 'Intellectual property belongs to client',
        confidentiality: true,
        nonDisclosure: false
      },
      attachments: ['brand-guidelines.pdf'],
      createdAt: '2025-01-10',
      updatedAt: '2025-01-10',
      totalPaid: 0,
      remainingAmount: 2500,
      isPublic: false,
      isStarred: false,
      tags: [isRTL ? 'تصميم' : 'Design', isRTL ? 'هوية' : 'Identity'],
      notes: isRTL ? 'عقد جديد يحتاج مراجعة' : 'New contract needs review',
      communication: []
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: isRTL ? 'مسودة' : 'Draft',
      pending: isRTL ? 'في الانتظار' : 'Pending',
      active: isRTL ? 'نشط' : 'Active',
      completed: isRTL ? 'مكتمل' : 'Completed',
      cancelled: isRTL ? 'ملغي' : 'Cancelled',
      disputed: isRTL ? 'متنازع عليه' : 'Disputed'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <Square className="h-4 w-4" />;
      case 'disputed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    const texts = {
      'fixed-price': isRTL ? 'سعر ثابت' : 'Fixed Price',
      'hourly': isRTL ? 'بالساعة' : 'Hourly',
      'milestone': isRTL ? 'مراحل' : 'Milestone',
      'retainer': isRTL ? 'احتفاظ' : 'Retainer'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  };

  const handleCreateContract = () => {
    console.log('Creating new contract...');
    setShowCreateDialog(false);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setShowEditDialog(true);
  };

  const handleUpdateContract = () => {
    if (editingContract) {
      setContracts(prev => prev.map(c => 
        c.id === editingContract.id 
          ? { ...c, updatedAt: new Date().toISOString().split('T')[0] }
          : c
      ));
      setShowEditDialog(false);
      setEditingContract(null);
    }
  };

  const handleDeleteContract = (contractId: string) => {
    setContracts(prev => prev.filter(c => c.id !== contractId));
  };

  const handleToggleStar = (contractId: string) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId 
        ? { ...c, isStarred: !c.isStarred }
        : c
    ));
  };

  const handleTogglePublic = (contractId: string) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId 
        ? { ...c, isPublic: !c.isPublic }
        : c
    ));
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.freelancerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getContractStats = () => {
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const completedContracts = contracts.filter(c => c.status === 'completed').length;
    const totalValue = contracts.reduce((sum, c) => sum + c.budget.amount, 0);
    const totalPaid = contracts.reduce((sum, c) => sum + c.totalPaid, 0);
    
    return {
      totalContracts,
      activeContracts,
      completedContracts,
      totalValue,
      totalPaid
    };
  };

  const stats = getContractStats();

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "إدارة العقود" : "Contract Management"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "إدارة العقود والمشاريع مع العملاء والمستقلين" 
              : "Manage contracts and projects with clients and freelancers"
            }
          </p>
        </div>

        {/* Contract Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي العقود" : "Total Contracts"}
                  </p>
                  <p className="text-2xl font-bold text-[#0A2540]">{stats.totalContracts}</p>
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
                    {isRTL ? "عقود نشطة" : "Active Contracts"}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeContracts}</p>
                </div>
                <Play className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "عقود مكتملة" : "Completed Contracts"}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completedContracts}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي القيمة" : "Total Value"}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(stats.totalValue, 'USD')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "المدفوع" : "Paid"}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(stats.totalPaid, 'USD')}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-orange-500" />
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
              <TabsTrigger value="contracts">
                {isRTL ? "العقود" : "Contracts"}
              </TabsTrigger>
              <TabsTrigger value="templates">
                {isRTL ? "القوالب" : "Templates"}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "البحث في العقود..." : "Search contracts..."}
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
                  <SelectItem value="draft">{isRTL ? "مسودة" : "Draft"}</SelectItem>
                  <SelectItem value="pending">{isRTL ? "في الانتظار" : "Pending"}</SelectItem>
                  <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                  <SelectItem value="completed">{isRTL ? "مكتمل" : "Completed"}</SelectItem>
                  <SelectItem value="cancelled">{isRTL ? "ملغي" : "Cancelled"}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "النوع" : "Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="fixed-price">{isRTL ? "سعر ثابت" : "Fixed Price"}</SelectItem>
                  <SelectItem value="hourly">{isRTL ? "بالساعة" : "Hourly"}</SelectItem>
                  <SelectItem value="milestone">{isRTL ? "مراحل" : "Milestone"}</SelectItem>
                  <SelectItem value="retainer">{isRTL ? "احتفاظ" : "Retainer"}</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "عقد جديد" : "New Contract"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{isRTL ? "إنشاء عقد جديد" : "Create New Contract"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">{isRTL ? "عنوان العقد" : "Contract Title"}</Label>
                      <Input
                        id="title"
                        placeholder={isRTL ? "أدخل عنوان العقد" : "Enter contract title"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">{isRTL ? "وصف العقد" : "Contract Description"}</Label>
                      <Textarea
                        id="description"
                        placeholder={isRTL ? "أدخل وصف العقد" : "Enter contract description"}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">{isRTL ? "نوع العقد" : "Contract Type"}</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? "اختر النوع" : "Select type"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed-price">{isRTL ? "سعر ثابت" : "Fixed Price"}</SelectItem>
                            <SelectItem value="hourly">{isRTL ? "بالساعة" : "Hourly"}</SelectItem>
                            <SelectItem value="milestone">{isRTL ? "مراحل" : "Milestone"}</SelectItem>
                            <SelectItem value="retainer">{isRTL ? "احتفاظ" : "Retainer"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="budget">{isRTL ? "الميزانية" : "Budget"}</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder={isRTL ? "أدخل الميزانية" : "Enter budget"}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        {isRTL ? "إلغاء" : "Cancel"}
                      </Button>
                      <Button onClick={handleCreateContract} className="bg-[#0A2540] hover:bg-[#142b52]">
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
              {/* Recent Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {isRTL ? "العقود الأخيرة" : "Recent Contracts"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contracts.slice(0, 5).map((contract) => (
                      <div key={contract.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getStatusIcon(contract.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{contract.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{contract.clientName}</span>
                            <span>•</span>
                            <span>{formatCurrency(contract.budget.amount, contract.budget.currency)}</span>
                            <span>•</span>
                            <span>{formatDate(contract.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(contract.status)}>
                            {getStatusText(contract.status)}
                          </Badge>
                          {contract.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contract Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {isRTL ? "تحليلات العقود" : "Contract Analytics"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "معدل إكمال العقود" : "Contract completion rate"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-semibold text-green-600">92%</div>
                        <p className="text-gray-600">{isRTL ? "رضا العملاء" : "Client Satisfaction"}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-purple-600">78%</div>
                        <p className="text-gray-600">{isRTL ? "التسليم في الوقت" : "On-time Delivery"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    {isRTL ? "توزيع أنواع العقود" : "Contract Types Distribution"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: isRTL ? "سعر ثابت" : "Fixed Price", count: 8, percentage: 40, color: "bg-blue-500" },
                      { type: isRTL ? "مراحل" : "Milestone", count: 6, percentage: 30, color: "bg-green-500" },
                      { type: isRTL ? "بالساعة" : "Hourly", count: 4, percentage: 20, color: "bg-purple-500" },
                      { type: isRTL ? "احتفاظ" : "Retainer", count: 2, percentage: 10, color: "bg-orange-500" }
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
                    <Zap className="h-5 w-5" />
                    {isRTL ? "إجراءات سريعة" : "Quick Actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FilePdf className="h-4 w-4" />
                      {isRTL ? "تصدير PDF" : "Export PDF"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      {isRTL ? "تصدير Excel" : "Export Excel"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {isRTL ? "إرسال عقد" : "Send Contract"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      {isRTL ? "تحديث البيانات" : "Refresh Data"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            {filteredContracts.length > 0 ? (
              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <Card key={contract.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-lg">
                              {contract.title}
                            </h3>
                            <Badge className={getStatusColor(contract.status)}>
                              {getStatusText(contract.status)}
                            </Badge>
                            {contract.isStarred && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {contract.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-500">{isRTL ? "العميل" : "Client"}</p>
                              <p className="font-medium">{contract.clientName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">{isRTL ? "المستقل" : "Freelancer"}</p>
                              <p className="font-medium">{contract.freelancerName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">{isRTL ? "الميزانية" : "Budget"}</p>
                              <p className="font-medium">
                                {formatCurrency(contract.budget.amount, contract.budget.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">{isRTL ? "النوع" : "Type"}</p>
                              <p className="font-medium">{getTypeText(contract.type)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span>{isRTL ? "مدفوع" : "Paid"}: {formatCurrency(contract.totalPaid, contract.budget.currency)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span>{isRTL ? "متبقي" : "Remaining"}: {formatCurrency(contract.remainingAmount, contract.budget.currency)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-4">
                            {contract.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              {isRTL ? "عرض" : "View"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditContract(contract)}>
                              <Edit className="h-4 w-4 mr-1" />
                              {isRTL ? "تعديل" : "Edit"}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              {isRTL ? "تحميل" : "Download"}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-1" />
                              {isRTL ? "مشاركة" : "Share"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleToggleStar(contract.id)}>
                              <Star className={cn("h-4 w-4", contract.isStarred && "fill-current text-yellow-500")} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleTogglePublic(contract.id)}>
                              {contract.isPublic ? (
                                <Globe className="h-4 w-4 text-green-500" />
                              ) : (
                                <Lock className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteContract(contract.id)}>
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
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد عقود" : "No Contracts Found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم نجد أي عقود تطابق معايير البحث المحددة"
                      : "No contracts match your search criteria"
                    }
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? "إنشاء عقد جديد" : "Create New Contract"}
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
                  title: isRTL ? "قالب عقد سعر ثابت" : "Fixed Price Contract Template",
                  description: isRTL ? "قالب عقد للمشاريع بسعر ثابت" : "Contract template for fixed price projects",
                  type: "fixed-price",
                  icon: <DollarSign className="h-8 w-8 text-green-500" />
                },
                {
                  title: isRTL ? "قالب عقد بالساعة" : "Hourly Contract Template",
                  description: isRTL ? "قالب عقد للمشاريع بالساعة" : "Contract template for hourly projects",
                  type: "hourly",
                  icon: <Clock className="h-8 w-8 text-blue-500" />
                },
                {
                  title: isRTL ? "قالب عقد المراحل" : "Milestone Contract Template",
                  description: isRTL ? "قالب عقد للمشاريع المرحلية" : "Contract template for milestone projects",
                  type: "milestone",
                  icon: <Target className="h-8 w-8 text-purple-500" />
                },
                {
                  title: isRTL ? "قالب عقد الاحتفاظ" : "Retainer Contract Template",
                  description: isRTL ? "قالب عقد للخدمات المستمرة" : "Contract template for ongoing services",
                  type: "retainer",
                  icon: <Users className="h-8 w-8 text-orange-500" />
                },
                {
                  title: isRTL ? "قالب عقد التصميم" : "Design Contract Template",
                  description: isRTL ? "قالب عقد لمشاريع التصميم" : "Contract template for design projects",
                  type: "design",
                  icon: <Award className="h-8 w-8 text-pink-500" />
                },
                {
                  title: isRTL ? "قالب عقد التطوير" : "Development Contract Template",
                  description: isRTL ? "قالب عقد لمشاريع التطوير" : "Contract template for development projects",
                  type: "development",
                  icon: <TrendingUp className="h-8 w-8 text-indigo-500" />
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

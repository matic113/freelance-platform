import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { cn, isClient } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  DollarSign,
  MessageCircle,
  FileText,
  Star,
  AlertCircle,
  Clock,
  Settings,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Trash2,
  Archive,
  MarkAsRead,
  MoreVertical,
  BellOff,
  BellRing,
  Calendar,
  Users,
  Briefcase,
  Award,
  Shield,
  Globe,
  Wifi,
  WifiOff,
  Check,
  X,
  Plus,
  Edit,
  Save,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NotificationCenter, NotificationBell } from '@/components/notifications/NotificationCard';
import { NotificationResponse } from '@/types/api';

export default function NotificationsPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    notifications, 
    stats, 
    loading, 
    saving, 
    totalPages, 
    currentPage, 
    loadNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);

  // Enhanced notification preferences state
  const [preferences, setPreferences] = useState({
    email: {
      enabled: true,
      proposalReceived: true,
      proposalAccepted: true,
      proposalRejected: true,
      contractCreated: true,
      milestoneCompleted: true,
      paymentRequested: true,
      paymentApproved: true,
      paymentRejected: true,
      messageReceived: true,
      reviewReceived: true,
      projectDeadline: true,
      weeklyDigest: true,
      marketingEmails: false
    },
    push: {
      enabled: true,
      proposalReceived: true,
      proposalAccepted: true,
      proposalRejected: true,
      contractCreated: true,
      milestoneCompleted: true,
      paymentRequested: true,
      paymentApproved: true,
      paymentRejected: true,
      messageReceived: true,
      reviewReceived: true,
      projectDeadline: true
    },
    inApp: {
      enabled: true,
      proposalReceived: true,
      proposalAccepted: true,
      proposalRejected: true,
      contractCreated: true,
      milestoneCompleted: true,
      paymentRequested: true,
      paymentApproved: true,
      paymentRejected: true,
      messageReceived: true,
      reviewReceived: true,
      projectDeadline: true
    },
    frequency: {
      emailDigest: 'daily', // daily, weekly, monthly, never
      pushFrequency: 'immediate', // immediate, hourly, daily, never
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    }
  });

  // Handle settings redirect to notifications tab
  const handleSettingsClick = () => {
    navigate('/settings?tab=notifications');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal_received':
      case 'proposal_accepted':
      case 'proposal_rejected':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'payment_requested':
      case 'payment_approved':
      case 'payment_rejected':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'milestone_completed':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'contract_created':
        return <Briefcase className="h-5 w-5 text-orange-500" />;
      case 'message_received':
        return <MessageCircle className="h-5 w-5 text-indigo-500" />;
      case 'review_received':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return isRTL ? 'عالي' : 'High';
      case 'medium':
        return isRTL ? 'متوسط' : 'Medium';
      case 'low':
        return isRTL ? 'منخفض' : 'Low';
      default:
        return priority;
    }
  };

  // Load notifications when filters change
  useEffect(() => {
    const isReadFilter = statusFilter === 'all' ? undefined : statusFilter === 'read';
    loadNotifications(0, 20, typeFilter === 'all' ? undefined : typeFilter, undefined, isReadFilter, searchTerm || undefined);
  }, [typeFilter, statusFilter, searchTerm]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    const isReadFilter = statusFilter === 'all' ? undefined : statusFilter === 'read';
    loadNotifications(page, 20, typeFilter === 'all' ? undefined : typeFilter, undefined, isReadFilter, searchTerm || undefined);
  };

  const handleUpdatePreferences = (category: string, key: string, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSavePreferences = () => {
    // In a real app, this would save to the backend
    alert(isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Preferences saved successfully');
    setShowPreferences(false);
  };

    const handleTestNotification = () => {
      alert(isRTL ? 'سيتم إرسال إشعار تجريبي إلى بريدك الإلكتروني' : 'A test notification will be sent to your email');
    };

   const handleNotificationClick = (notification: NotificationResponse) => {
      if (!notification.isRead) {
        markAsRead(notification.id);
      }

      if (!notification.data) return;

      try {
        const data = JSON.parse(notification.data);
        const userIsClient = isClient(user);
        
        if (notification.type.includes('PROPOSAL')) {
          if (data.projectId) {
            if (userIsClient) {
              navigate(`/client/project/${data.projectId}`);
            } else {
              navigate(`/projects`);
            }
          }
        } else if (notification.type.includes('CONTRACT')) {
          if (notification.type.includes('ACCEPTED')) {
            navigate(`/contracts`);
          } else if (notification.type.includes('REJECTED')) {
            if (userIsClient) {
              navigate(`/my-projects`);
            } else {
              navigate(`/projects`);
            }
          } else if (data.contractId) {
            navigate(`/contracts`);
          }
        } else if (notification.type.includes('MILESTONE')) {
          if (data.contractId) {
            navigate(`/contracts`);
          }
        } else if (notification.type.includes('MESSAGE')) {
          if (data.conversationId) {
            navigate(`/messages?conversationId=${data.conversationId}`);
          } else {
            navigate(`/messages`);
          }
        } else if (notification.type.includes('PROJECT')) {
          if (data.projectId) {
            if (userIsClient) {
              navigate(`/client/project/${data.projectId}`);
            } else {
              navigate(`/project/${data.projectId}`);
            }
          }
        } else if (notification.type.includes('REVIEW')) {
          if (data.projectId) {
            navigate(`/reviews/project/${data.projectId}`);
          } else {
            navigate(`/profile`);
          }
        } else if (notification.type.includes('PAYMENT')) {
          navigate(`/payments`);
        }
      } catch (e) {
        console.error('Error parsing notification data:', e);
      }
    };

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
                {isRTL ? "الإشعارات" : "Notifications"}
              </h1>
              <p className="text-muted-foreground">
                {isRTL 
                  ? "إدارة الإشعارات وتفضيلات الاستلام" 
                  : "Manage notifications and delivery preferences"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSettingsClick}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isRTL ? "الإعدادات" : "Settings"}
              </Button>
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={!stats || stats.unreadNotifications === 0 || saving}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isRTL ? "تعيين الكل كمقروء" : "Mark All Read"}
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي الإشعارات" : "Total Notifications"}
                  </p>
                  <p className="text-2xl font-bold text-[#0A2540]">
                    {loading ? '...' : (stats?.totalNotifications || 0)}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "غير مقروء" : "Unread"}
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {loading ? '...' : (stats?.unreadNotifications || 0)}
                  </p>
                </div>
                <BellRing className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "عالي الأولوية" : "High Priority"}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {loading ? '...' : (stats?.highPriorityNotifications || 0)}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "اليوم" : "Today"}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {loading ? '...' : (stats?.todayNotifications || 0)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? "البحث في الإشعارات..." : "Search notifications..."}
              className={cn("pl-9", isRTL && "pr-9 text-right")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={isRTL ? "نوع الإشعار" : "Notification Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
              <SelectItem value="proposal_received">{isRTL ? "عروض مستلمة" : "Proposals Received"}</SelectItem>
              <SelectItem value="proposal_accepted">{isRTL ? "عروض مقبولة" : "Proposals Accepted"}</SelectItem>
              <SelectItem value="payment_requested">{isRTL ? "طلبات دفع" : "Payment Requests"}</SelectItem>
              <SelectItem value="message_received">{isRTL ? "رسائل" : "Messages"}</SelectItem>
              <SelectItem value="review_received">{isRTL ? "تقييمات" : "Reviews"}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Eye className="h-4 w-4 mr-2" />
              <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
              <SelectItem value="unread">{isRTL ? "غير مقروء" : "Unread"}</SelectItem>
              <SelectItem value="read">{isRTL ? "مقروء" : "Read"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2540]"></div>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
               <Card 
                 key={notification.id} 
                 onClick={() => handleNotificationClick(notification)}
                 className={cn(
                   "hover:shadow-md transition-shadow border-l-4 cursor-pointer",
                   !notification.isRead && "bg-blue-50",
                   getPriorityColor(notification.priority)
                 )}
               >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={cn(
                            "font-semibold text-lg",
                            !notification.isRead && "font-bold"
                          )}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              {isRTL ? "جديد" : "New"}
                            </Badge>
                          )}
                          {notification.groupCount && notification.groupCount > 1 && (
                            <Badge className="bg-indigo-500 text-white text-xs">
                              {notification.groupCount} {isRTL ? "رسائل" : "messages"}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getPriorityText(notification.priority)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Bell className="h-4 w-4" />
                            {notification.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          disabled={saving}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isRTL ? "لا توجد إشعارات" : "No Notifications"}
                </h3>
                <p className="text-gray-500">
                  {isRTL 
                    ? "لا توجد إشعارات تطابق معايير البحث المحددة"
                    : "No notifications match the specified search criteria"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              {isRTL ? "السابق" : "Previous"}
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                if (pageNumber >= totalPages) return null;
                
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={loading}
                  >
                    {pageNumber + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || loading}
            >
              {isRTL ? "التالي" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Notification Preferences Dialog */}
        <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {isRTL ? "إعدادات الإشعارات" : "Notification Settings"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-8">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "اختر متى تريد تلقي إشعارات البريد الإلكتروني" : "Choose when you want to receive email notifications"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        {isRTL ? "تفعيل إشعارات البريد الإلكتروني" : "Enable Email Notifications"}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "تلقي الإشعارات المهمة عبر البريد الإلكتروني" : "Receive important notifications via email"}
                      </p>
                    </div>
                    <Switch
                      checked={preferences.email.enabled}
                      onCheckedChange={(checked) => handleUpdatePreferences('email', 'enabled', checked)}
                    />
                  </div>
                  
                  {preferences.email.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "عروض مستلمة" : "Proposals Received"}</Label>
                          <Switch
                            checked={preferences.email.proposalReceived}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'proposalReceived', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "عروض مقبولة" : "Proposals Accepted"}</Label>
                          <Switch
                            checked={preferences.email.proposalAccepted}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'proposalAccepted', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "طلبات دفع" : "Payment Requests"}</Label>
                          <Switch
                            checked={preferences.email.paymentRequested}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'paymentRequested', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "رسائل جديدة" : "New Messages"}</Label>
                          <Switch
                            checked={preferences.email.messageReceived}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'messageReceived', checked)}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "تقييمات جديدة" : "New Reviews"}</Label>
                          <Switch
                            checked={preferences.email.reviewReceived}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'reviewReceived', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "مواعيد نهائية" : "Project Deadlines"}</Label>
                          <Switch
                            checked={preferences.email.projectDeadline}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'projectDeadline', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "ملخص أسبوعي" : "Weekly Digest"}</Label>
                          <Switch
                            checked={preferences.email.weeklyDigest}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'weeklyDigest', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "رسائل تسويقية" : "Marketing Emails"}</Label>
                          <Switch
                            checked={preferences.email.marketingEmails}
                            onCheckedChange={(checked) => handleUpdatePreferences('email', 'marketingEmails', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Push Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    {isRTL ? "إشعارات الدفع" : "Push Notifications"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "إشعارات فورية على جهازك المحمول" : "Instant notifications on your mobile device"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        {isRTL ? "تفعيل إشعارات الدفع" : "Enable Push Notifications"}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "تلقي إشعارات فورية على جهازك" : "Receive instant notifications on your device"}
                      </p>
                    </div>
                    <Switch
                      checked={preferences.push.enabled}
                      onCheckedChange={(checked) => handleUpdatePreferences('push', 'enabled', checked)}
                    />
                  </div>
                  
                  {preferences.push.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "عروض مستلمة" : "Proposals Received"}</Label>
                          <Switch
                            checked={preferences.push.proposalReceived}
                            onCheckedChange={(checked) => handleUpdatePreferences('push', 'proposalReceived', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "عروض مقبولة" : "Proposals Accepted"}</Label>
                          <Switch
                            checked={preferences.push.proposalAccepted}
                            onCheckedChange={(checked) => handleUpdatePreferences('push', 'proposalAccepted', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "طلبات دفع" : "Payment Requests"}</Label>
                          <Switch
                            checked={preferences.push.paymentRequested}
                            onCheckedChange={(checked) => handleUpdatePreferences('push', 'paymentRequested', checked)}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "رسائل جديدة" : "New Messages"}</Label>
                          <Switch
                            checked={preferences.push.messageReceived}
                            onCheckedChange={(checked) => handleUpdatePreferences('push', 'messageReceived', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "تقييمات جديدة" : "New Reviews"}</Label>
                          <Switch
                            checked={preferences.push.reviewReceived}
                            onCheckedChange={(checked) => handleUpdatePreferences('push', 'reviewReceived', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">{isRTL ? "مواعيد نهائية" : "Project Deadlines"}</Label>
                          <Switch
                            checked={preferences.push.projectDeadline}
                            onCheckedChange={(checked) => handleUpdatePreferences('push', 'projectDeadline', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Frequency Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {isRTL ? "إعدادات التكرار" : "Frequency Settings"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "تحكم في تكرار الإشعارات" : "Control notification frequency"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{isRTL ? "تكرار البريد الإلكتروني" : "Email Frequency"}</Label>
                      <Select
                        value={preferences.frequency.emailDigest}
                        onValueChange={(value) => handleUpdatePreferences('frequency', 'emailDigest', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">{isRTL ? "فوري" : "Immediate"}</SelectItem>
                          <SelectItem value="daily">{isRTL ? "يومي" : "Daily"}</SelectItem>
                          <SelectItem value="weekly">{isRTL ? "أسبوعي" : "Weekly"}</SelectItem>
                          <SelectItem value="monthly">{isRTL ? "شهري" : "Monthly"}</SelectItem>
                          <SelectItem value="never">{isRTL ? "أبداً" : "Never"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{isRTL ? "تكرار إشعارات الدفع" : "Push Notification Frequency"}</Label>
                      <Select
                        value={preferences.frequency.pushFrequency}
                        onValueChange={(value) => handleUpdatePreferences('frequency', 'pushFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">{isRTL ? "فوري" : "Immediate"}</SelectItem>
                          <SelectItem value="hourly">{isRTL ? "كل ساعة" : "Hourly"}</SelectItem>
                          <SelectItem value="daily">{isRTL ? "يومي" : "Daily"}</SelectItem>
                          <SelectItem value="never">{isRTL ? "أبداً" : "Never"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">
                          {isRTL ? "ساعات الهدوء" : "Quiet Hours"}
                        </Label>
                        <p className="text-sm text-gray-600">
                          {isRTL ? "عدم تلقي إشعارات خلال ساعات معينة" : "Don't receive notifications during certain hours"}
                        </p>
                      </div>
                      <Switch
                        checked={preferences.frequency.quietHours.enabled}
                        onCheckedChange={(checked) => handleUpdatePreferences('frequency', 'quietHours', { ...preferences.frequency.quietHours, enabled: checked })}
                      />
                    </div>
                    
                    {preferences.frequency.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4 ml-4">
                        <div className="space-y-2">
                          <Label>{isRTL ? "من" : "From"}</Label>
                          <Input
                            type="time"
                            value={preferences.frequency.quietHours.start}
                            onChange={(e) => handleUpdatePreferences('frequency', 'quietHours', { ...preferences.frequency.quietHours, start: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? "إلى" : "To"}</Label>
                          <Input
                            type="time"
                            value={preferences.frequency.quietHours.end}
                            onChange={(e) => handleUpdatePreferences('frequency', 'quietHours', { ...preferences.frequency.quietHours, end: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Test Notification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    {isRTL ? "اختبار الإشعارات" : "Test Notifications"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "اختبر إعدادات الإشعارات الخاصة بك" : "Test your notification settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleTestNotification} variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    {isRTL ? "إرسال إشعار تجريبي" : "Send Test Notification"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowPreferences(false)}>
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button onClick={handleSavePreferences}>
                <Save className="h-4 w-4 mr-2" />
                {isRTL ? "حفظ الإعدادات" : "Save Settings"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
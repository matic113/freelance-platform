import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { useFAQs, useSearchFAQs, useSubmitContactForm } from '@/hooks/useContent';
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
  HelpCircle, 
  Search, 
  Filter, 
  MessageCircle, 
  Phone, 
  Mail, 
  Send, 
  ChevronDown, 
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Users,
  User,
  Settings,
  CreditCard,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Zap,
  Heart,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  isExpanded: boolean;
}


interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

export default function HelpPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showContactForm, setShowContactForm] = useState(false);
  const submitContactForm = useSubmitContactForm();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });

  // Fetch FAQs from backend
  const { data: faqsData, isLoading: faqsLoading, error: faqsError } = useFAQs();
  const { data: searchData, isLoading: searchLoading } = useSearchFAQs(searchTerm);

  // Process FAQ data from backend
  const processFAQs = () => {
    if (searchTerm && searchData?.success && searchData.faqs) {
      return searchData.faqs.map((faq: any) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category.toLowerCase(),
        tags: [],
        helpful: 0,
        notHelpful: 0,
        isExpanded: false
      }));
    }
    
    if (faqsData?.success && faqsData.faqs) {
      const allFAQs: FAQ[] = [];
      Object.entries(faqsData.faqs).forEach(([category, faqs]: [string, any]) => {
        faqs.forEach((faq: any) => {
          allFAQs.push({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: category.toLowerCase(),
            tags: [],
            helpful: 0,
            notHelpful: 0,
            isExpanded: false
          });
        });
      });
      return allFAQs;
    }
    
    return [];
  };

  const faqs = processFAQs();
  
  // Local state for FAQ interactions
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [faqHelpfulness, setFaqHelpfulness] = useState<Record<string, { helpful: number; notHelpful: number }>>({});


  const categories = [
    { id: 'all', name: isRTL ? 'الكل' : 'All', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'general', name: isRTL ? 'عام' : 'General', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'account', name: isRTL ? 'الحساب' : 'Account', icon: <User className="h-4 w-4" /> },
    { id: 'projects', name: isRTL ? 'المشاريع' : 'Projects', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'payments', name: isRTL ? 'المدفوعات' : 'Payments', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'technical', name: isRTL ? 'تقني' : 'Technical', icon: <Settings className="h-4 w-4" /> },
    { id: 'billing', name: isRTL ? 'الفواتير' : 'Billing', icon: <FileText className="h-4 w-4" /> },
    { id: 'security', name: isRTL ? 'الأمان' : 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'features', name: isRTL ? 'المميزات' : 'Features', icon: <Star className="h-4 w-4" /> }
  ];

  const contactCategories = isRTL ? [
    { value: "general", label: "استفسار عام" },
    { value: "support", label: "دعم فني" },
    { value: "business", label: "شراكة تجارية" },
    { value: "complaint", label: "شكوى" },
    { value: "suggestion", label: "اقتراح" },
    { value: "other", label: "أخرى" }
  ] : [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "business", label: "Business Partnership" },
    { value: "complaint", label: "Complaint" },
    { value: "suggestion", label: "Suggestion" },
    { value: "other", label: "Other" }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleHelpful = (id: string, isHelpful: boolean) => {
    setFaqHelpfulness(prev => ({
      ...prev,
      [id]: {
        helpful: isHelpful ? (prev[id]?.helpful || 0) + 1 : (prev[id]?.helpful || 0),
        notHelpful: !isHelpful ? (prev[id]?.notHelpful || 0) + 1 : (prev[id]?.notHelpful || 0)
      }
    }));
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await submitContactForm.mutateAsync({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        subject: formData.subject,
        category: formData.category,
        message: formData.message
      });
      
      if (response.success) {
        toast.success(isRTL ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!");
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          subject: "",
          category: "",
          message: ""
        });
      } else {
        toast.error(response.message || (isRTL ? "حدث خطأ في إرسال الرسالة" : "Error sending message"));
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(isRTL ? "حدث خطأ في إرسال الرسالة" : "Error sending message");
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });



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

  const getPriorityLabel = (priority: string) => {
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

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "مركز المساعدة" : "Help Center"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "ابحث عن الإجابات، تعلم من الأدلة، واحصل على الدعم الذي تحتاجه" 
              : "Find answers, learn from guides, and get the support you need"
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? "ابحث في الأسئلة الشائعة والأدلة..." : "Search in FAQs and guides..."}
              className={cn("pl-9 text-lg py-6", isRTL && "pr-9 text-right")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Phone className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-sm mb-1">
                {isRTL ? "اتصل بنا" : "Call Us"}
              </h3>
              <p className="text-xs text-gray-500">
                {isRTL ? "+966 50 123 4567" : "+966 50 123 4567"}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-medium text-sm mb-1">
                {isRTL ? "راسلنا" : "Email Us"}
              </h3>
              <p className="text-xs text-gray-500">
                {isRTL ? "support@freelance.com" : "support@freelance.com"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                {isRTL ? "الأسئلة الشائعة" : "FAQ"}
              </TabsTrigger>
              <TabsTrigger value="contact">
                <MessageCircle className="h-4 w-4 mr-2" />
                {isRTL ? "اتصل بنا" : "Contact"}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "الفئة" : "Category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {faqsLoading || searchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2540] mx-auto mb-4"></div>
                <p className="text-gray-500">
                  {isRTL ? "جاري تحميل الأسئلة..." : "Loading FAQs..."}
                </p>
              </div>
            ) : faqsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  {isRTL ? "حدث خطأ في تحميل الأسئلة" : "Error loading FAQs"}
                </p>
                <Button onClick={() => window.location.reload()}>
                  {isRTL ? "إعادة المحاولة" : "Retry"}
                </Button>
              </div>
            ) : filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div 
                        className="cursor-pointer"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg pr-4">
                            {faq.question}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.id === faq.category)?.name}
                            </Badge>
                            {expandedFAQs.has(faq.id) ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        
                        {expandedFAQs.has(faq.id) && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-gray-600 mb-4">
                              {faq.answer}
                            </p>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleHelpful(faq.id, true);
                                  }}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {faqHelpfulness[faq.id]?.helpful || 0}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleHelpful(faq.id, false);
                                  }}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  {faqHelpfulness[faq.id]?.notHelpful || 0}
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {faq.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faqs.length === 0 
                      ? (isRTL ? "لا توجد أسئلة متاحة" : "No FAQs Available")
                      : (isRTL ? "لا توجد أسئلة" : "No Questions Found")
                    }
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {faqs.length === 0
                      ? (isRTL 
                          ? "لم يتم إضافة أي أسئلة بعد. يرجى المحاولة لاحقاً أو التواصل معنا."
                          : "No FAQs have been added yet. Please try again later or contact us."
                        )
                      : (isRTL 
                          ? "لم نجد أي أسئلة تطابق معايير البحث المحددة"
                          : "No questions match your search criteria"
                        )
                    }
                  </p>
                  <Button onClick={() => setShowContactForm(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    {isRTL ? "اطرح سؤالاً" : "Ask a Question"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>


          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {isRTL ? "معلومات الاتصال" : "Contact Information"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">{isRTL ? "الهاتف" : "Phone"}</p>
                      <p className="text-sm text-gray-600">+966 50 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{isRTL ? "البريد الإلكتروني" : "Email"}</p>
                      <p className="text-sm text-gray-600">support@freelance.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{isRTL ? "ساعات العمل" : "Working Hours"}</p>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "الأحد - الخميس: 9:00 - 18:00" : "Sunday - Thursday: 9:00 - 18:00"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">{isRTL ? "الموقع" : "Location"}</p>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2", isRTL && "text-right")}>
                    <Send className="h-5 w-5" />
                    {isRTL ? "أرسل لنا رسالة" : "Send us a Message"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className={cn("flex items-center gap-2", isRTL && "text-right")}>
                          <User className="h-4 w-4" />
                          {isRTL ? "الاسم الكامل *" : "Full Name *"}
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                          required
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className={cn("flex items-center gap-2", isRTL && "text-right")}>
                          <Mail className="h-4 w-4" />
                          {isRTL ? "البريد الإلكتروني *" : "Email Address *"}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                          required
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company" className={cn("flex items-center gap-2", isRTL && "text-right")}>
                          <Building className="h-4 w-4" />
                          {isRTL ? "الشركة" : "Company"}
                        </Label>
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder={isRTL ? "اسم الشركة (اختياري)" : "Company name (optional)"}
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className={cn("flex items-center gap-2", isRTL && "text-right")}>
                          <Phone className="h-4 w-4" />
                          {isRTL ? "رقم الهاتف" : "Phone Number"}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder={isRTL ? "رقم الهاتف (اختياري)" : "Phone number (optional)"}
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                    </div>

                    {/* Subject and Category */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject" className={cn("flex items-center gap-2", isRTL && "text-right")}>
                          <MessageCircle className="h-4 w-4" />
                          {isRTL ? "الموضوع *" : "Subject *"}
                        </Label>
                        <Input
                          id="subject"
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          placeholder={isRTL ? "موضوع الرسالة" : "Message subject"}
                          required
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category" className={cn("flex items-center gap-2", isRTL && "text-right")}>
                          <AlertCircle className="h-4 w-4" />
                          {isRTL ? "الفئة *" : "Category *"}
                        </Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger className={cn(isRTL && "text-right")}>
                            <SelectValue placeholder={isRTL ? "اختر الفئة" : "Select category"} />
                          </SelectTrigger>
                          <SelectContent>
                            {contactCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className={cn("flex items-center gap-2", isRTL && "text-right")}>
                        <MessageCircle className="h-4 w-4" />
                        {isRTL ? "الرسالة *" : "Message *"}
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder={isRTL ? "اكتب رسالتك هنا..." : "Write your message here..."}
                        required
                        rows={6}
                        className={cn(isRTL && "text-right")}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={submitContactForm.isPending}
                      className="w-full bg-[#0A2540] hover:bg-[#0c315c] text-white py-3 text-lg"
                    >
                      {submitContactForm.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isRTL ? "جاري الإرسال..." : "Sending..."}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          {isRTL ? "إرسال الرسالة" : "Send Message"}
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
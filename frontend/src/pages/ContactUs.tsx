import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  User,
  Building
} from "lucide-react";
import { toast } from "sonner";
import { useSubmitContactForm } from "@/hooks/useContent";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

export default function ContactUs() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitContactForm = useSubmitContactForm();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  });

  const categories = isRTL ? [
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

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        setIsSubmitted(true);
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

  const contactInfo = [
    {
      icon: Mail,
      title: isRTL ? "البريد الإلكتروني" : "Email",
      value: "info@ahmedma.com",
      description: isRTL ? "راسلنا على مدار الساعة" : "Email us anytime"
    },
    {
      icon: Phone,
      title: isRTL ? "الهاتف" : "Phone",
      value: "+966 50 123 4567",
      description: isRTL ? "اتصل بنا من 9 صباحاً إلى 6 مساءً" : "Call us from 9 AM to 6 PM"
    },
    {
      icon: MapPin,
      title: isRTL ? "العنوان" : "Address",
      value: isRTL ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
      description: isRTL ? "مكتبنا الرئيسي" : "Our main office"
    },
    {
      icon: Clock,
      title: isRTL ? "ساعات العمل" : "Working Hours",
      value: isRTL ? "الأحد - الخميس: 9 ص - 6 م" : "Sunday - Thursday: 9 AM - 6 PM",
      description: isRTL ? "بتوقيت السعودية" : "Saudi Arabia Time"
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className={cn("text-3xl font-bold text-[#0A2540] mb-4", isRTL && "text-right")}>
                  {isRTL ? "شكراً لك!" : "Thank You!"}
                </h1>
                <p className={cn("text-lg text-gray-600", isRTL && "text-right")}>
                  {isRTL 
                    ? "تم إرسال رسالتك بنجاح. سنتواصل معك في أقرب وقت ممكن." 
                    : "Your message has been sent successfully. We'll get back to you as soon as possible."
                  }
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-[#0A2540] hover:bg-[#0c315c] text-white"
                >
                  {isRTL ? "إرسال رسالة أخرى" : "Send Another Message"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  {isRTL ? "العودة للصفحة الرئيسية" : "Back to Homepage"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
        
        <Footer isRTL={isRTL} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={cn("text-4xl font-bold text-[#0A2540] mb-4", isRTL && "text-right")}>
            {isRTL ? "تواصل معنا" : "Contact Us"}
          </h1>
          <p className={cn("text-xl text-gray-600 max-w-2xl mx-auto", isRTL && "text-right")}>
            {isRTL 
              ? "نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو طلب دعم فني." 
              : "We're here to help. Contact us for any inquiries or technical support requests."
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isRTL && "text-right")}>
                  <MessageCircle className="h-5 w-5" />
                  {isRTL ? "معلومات التواصل" : "Contact Information"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "طرق مختلفة للتواصل معنا" : "Different ways to reach us"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className={cn("flex items-start gap-3", isRTL && "text-right")}>
                    <div className="p-2 bg-[#0A2540]/10 rounded-lg">
                      <info.icon className="h-5 w-5 text-[#0A2540]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0A2540]">{info.title}</h3>
                      <p className="text-gray-700 font-medium">{info.value}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isRTL && "text-right")}>
                  <Send className="h-5 w-5" />
                  {isRTL ? "أرسل لنا رسالة" : "Send us a Message"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "املأ النموذج أدناه وسنرد عليك في أقرب وقت" : "Fill out the form below and we'll get back to you soon"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                          {categories.map((category) => (
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
        </div>
      </main>
      
      <Footer isRTL={isRTL} />
    </div>
  );
}

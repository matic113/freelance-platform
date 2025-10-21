import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Database, Users, Mail, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  const { isRTL, toggleLanguage } = useLocalization();

  const sections = isRTL ? [
    {
      title: "مقدمة",
      icon: Eye,
      content: "نحن في منصة أحمد نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا."
    },
    {
      title: "المعلومات التي نجمعها",
      icon: Database,
      content: "نجمع المعلومات التي تقدمها لنا مباشرة مثل اسمك وعنوان بريدك الإلكتروني ورقم هاتفك ومعلومات ملفك الشخصي. كما نجمع معلومات حول استخدامك للمنصة لتحسين خدماتنا."
    },
    {
      title: "كيف نستخدم معلوماتك",
      icon: Users,
      content: "نستخدم معلوماتك لتوفير خدماتنا وتحسين تجربة المستخدم والتواصل معك حول المشاريع والخدمات. نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة."
    },
    {
      title: "حماية معلوماتك",
      icon: Lock,
      content: "نستخدم أحدث تقنيات التشفير لحماية معلوماتك الشخصية والمالية. جميع البيانات محمية وفقاً لأعلى معايير الأمان الدولية."
    },
    {
      title: "ملفات تعريف الارتباط",
      icon: Shield,
      content: "نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتذكر تفضيلاتك. يمكنك إدارة إعدادات ملفات تعريف الارتباط في متصفحك."
    },
    {
      title: "حقوقك",
      icon: Users,
      content: "لديك الحق في الوصول إلى معلوماتك الشخصية وتعديلها أو حذفها. يمكنك أيضاً سحب موافقتك على معالجة بياناتك في أي وقت."
    }
  ] : [
    {
      title: "Introduction",
      icon: Eye,
      content: "At Freint platform, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and protect your information when using our platform."
    },
    {
      title: "Information We Collect",
      icon: Database,
      content: "We collect information you provide directly to us such as your name, email address, phone number, and profile information. We also collect information about your use of the platform to improve our services."
    },
    {
      title: "How We Use Your Information",
      icon: Users,
      content: "We use your information to provide our services, improve user experience, and communicate with you about projects and services. We do not sell or rent your personal information to third parties."
    },
    {
      title: "Protecting Your Information",
      icon: Lock,
      content: "We use the latest encryption technologies to protect your personal and financial information. All data is protected according to the highest international security standards."
    },
    {
      title: "Cookies",
      icon: Shield,
      content: "We use cookies to improve user experience and remember your preferences. You can manage your cookie settings in your browser."
    },
    {
      title: "Your Rights",
      icon: Users,
      content: "You have the right to access, modify, or delete your personal information. You can also withdraw your consent to data processing at any time."
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: isRTL ? "البريد الإلكتروني" : "Email",
      value: "privacy@freint.com"
    },
    {
      icon: Phone,
      title: isRTL ? "الهاتف" : "Phone",
      value: "+966 50 123 4567"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#0A2540]" />
            <h1 className={cn("text-4xl font-bold text-[#0A2540]", isRTL && "text-right")}>
              {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
          </div>
          <p className={cn("text-xl text-gray-600 max-w-3xl mx-auto", isRTL && "text-right")}>
            {isRTL 
              ? "نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية" 
              : "We are committed to protecting your privacy and ensuring the security of your personal information"
            }
          </p>
          <Badge variant="outline" className="mt-4">
            {isRTL ? "آخر تحديث: أكتوبر 2025" : "Last Updated: October 2025"}
          </Badge>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={cn("flex items-center gap-3", isRTL && "text-right")}>
                  <div className="p-2 bg-[#0A2540]/10 rounded-lg">
                    <section.icon className="w-5 h-5 text-[#0A2540]" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-gray-700 leading-relaxed", isRTL && "text-right")}>
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-[#0A2540] to-[#142b52] text-white">
            <CardHeader>
              <CardTitle className={cn("text-white", isRTL && "text-right")}>
                {isRTL ? "تواصل معنا" : "Contact Us"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("mb-6 opacity-90", isRTL && "text-right")}>
                {isRTL 
                  ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا"
                  : "If you have any questions about our privacy policy, please contact us"
                }
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {contactInfo.map((contact, index) => (
                  <div key={index} className={cn("flex items-center gap-3", isRTL && "text-right")}>
                    <contact.icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{contact.title}</p>
                      <p className="opacity-90">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer isRTL={isRTL} />
    </div>
  );
}

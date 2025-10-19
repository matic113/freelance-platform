import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie, Settings, Shield, Eye, Database, Mail, Phone } from "lucide-react";

export default function CookiePolicy() {
  const { isRTL, toggleLanguage } = useLocalization();

  const sections = isRTL ? [
    {
      title: "ما هي ملفات تعريف الارتباط؟",
      icon: Cookie,
      content: "ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. تساعدنا هذه الملفات في تحسين تجربة المستخدم وتذكر تفضيلاتك."
    },
    {
      title: "أنواع ملفات تعريف الارتباط",
      icon: Settings,
      content: "نستخدم ملفات تعريف الارتباط الأساسية اللازمة لتشغيل الموقع، وملفات تعريف الارتباط الوظيفية لتحسين الأداء، وملفات تعريف الارتباط التحليلية لفهم كيفية استخدام الموقع."
    },
    {
      title: "كيف نستخدم ملفات تعريف الارتباط",
      icon: Eye,
      content: "نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك مثل اللغة والإعدادات، وتحسين أداء الموقع، وتحليل كيفية استخدامك للمنصة لتطوير خدماتنا."
    },
    {
      title: "إدارة ملفات تعريف الارتباط",
      icon: Shield,
      content: "يمكنك إدارة ملفات تعريف الارتباط من خلال إعدادات متصفحك. يمكنك حذف ملفات تعريف الارتباط الموجودة أو منع إنشاء ملفات جديدة، لكن هذا قد يؤثر على وظائف الموقع."
    },
    {
      title: "ملفات تعريف الارتباط من أطراف ثالثة",
      icon: Database,
      content: "قد نستخدم خدمات من أطراف ثالثة مثل Google Analytics التي تضع ملفات تعريف الارتباط الخاصة بها. هذه الخدمات لها سياسات خصوصية منفصلة."
    },
    {
      title: "تحديثات السياسة",
      icon: Settings,
      content: "قد نقوم بتحديث سياسة ملفات تعريف الارتباط من وقت لآخر. سنقوم بإشعارك بأي تغييرات مهمة عبر الموقع أو البريد الإلكتروني."
    }
  ] : [
    {
      title: "What are Cookies?",
      icon: Cookie,
      content: "Cookies are small text files that are stored on your device when you visit our website. These files help us improve user experience and remember your preferences."
    },
    {
      title: "Types of Cookies",
      icon: Settings,
      content: "We use essential cookies necessary for website operation, functional cookies to improve performance, and analytical cookies to understand how the site is used."
    },
    {
      title: "How We Use Cookies",
      icon: Eye,
      content: "We use cookies to remember your preferences like language and settings, improve website performance, and analyze how you use the platform to develop our services."
    },
    {
      title: "Managing Cookies",
      icon: Shield,
      content: "You can manage cookies through your browser settings. You can delete existing cookies or prevent new ones from being created, but this may affect website functionality."
    },
    {
      title: "Third-Party Cookies",
      icon: Database,
      content: "We may use third-party services like Google Analytics that place their own cookies. These services have separate privacy policies."
    },
    {
      title: "Policy Updates",
      icon: Settings,
      content: "We may update our cookie policy from time to time. We will notify you of any significant changes through the website or email."
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: isRTL ? "البريد الإلكتروني" : "Email",
      value: "cookies@ahmedma.com"
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
            <Cookie className="w-8 h-8 text-[#0A2540]" />
            <h1 className={cn("text-4xl font-bold text-[#0A2540]", isRTL && "text-right")}>
              {isRTL ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy"}
            </h1>
          </div>
          <p className={cn("text-xl text-gray-600 max-w-3xl mx-auto", isRTL && "text-right")}>
            {isRTL 
              ? "نوضح لك كيفية استخدامنا لملفات تعريف الارتباط وكيفية إدارتها" 
              : "We explain how we use cookies and how you can manage them"
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
                  ? "إذا كان لديك أي أسئلة حول سياسة ملفات تعريف الارتباط، يرجى التواصل معنا"
                  : "If you have any questions about our cookie policy, please contact us"
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

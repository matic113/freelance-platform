import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Shield, AlertTriangle, CheckCircle, Mail, Phone } from "lucide-react";

export default function TermsOfUse() {
  const { isRTL, toggleLanguage } = useLocalization();

  const sections = isRTL ? [
    {
      title: "قبول الشروط",
      icon: CheckCircle,
      content: "باستخدام منصة أحمد، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام منصتنا."
    },
    {
      title: "وصف الخدمة",
      icon: FileText,
      content: "منصة أحمد هي منصة ربط المواهب بالمشاريع تتيح للعملاء نشر المشاريع وللمستقلين تقديم خدماتهم. نحن نسهل التواصل بين الطرفين ولكننا لسنا طرفاً في العقود المباشرة."
    },
    {
      title: "مسؤوليات المستخدمين",
      icon: Users,
      content: "المستخدمون مسؤولون عن دقة المعلومات المقدمة ومراعاة القوانين المحلية والدولية. يجب على المستقلين تقديم خدمات عالية الجودة وعلى العملاء دفع المبالغ المتفق عليها في الوقت المحدد."
    },
    {
      title: "الملكية الفكرية",
      icon: Shield,
      content: "جميع المحتويات المنشورة على المنصة محمية بحقوق الطبع والنشر. المستقلون يحتفظون بحقوقهم الفكرية في أعمالهم، والعملاء يحصلون على حقوق الاستخدام المتفق عليها."
    },
    {
      title: "القيود والمنع",
      icon: AlertTriangle,
      content: "يحظر استخدام المنصة لأي أنشطة غير قانونية أو ضارة. لا يجوز نشر محتوى مسيء أو مخالف للقوانين أو انتهاك حقوق الآخرين."
    },
    {
      title: "إنهاء الخدمة",
      icon: AlertTriangle,
      content: "نحتفظ بالحق في إنهاء أو تعليق حسابات المستخدمين الذين ينتهكون هذه الشروط. يمكن للمستخدمين أيضاً إنهاء حساباتهم في أي وقت."
    }
  ] : [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: "By using AhmedMA platform, you agree to be bound by these terms of use. If you do not agree to these terms, please do not use our platform."
    },
    {
      title: "Service Description",
      icon: FileText,
      content: "AhmedMA is a talent-to-project platform that allows clients to post projects and freelancers to offer their services. We facilitate communication between parties but are not a party to direct contracts."
    },
    {
      title: "User Responsibilities",
      icon: Users,
      content: "Users are responsible for the accuracy of information provided and compliance with local and international laws. Freelancers must provide high-quality services and clients must pay agreed amounts on time."
    },
    {
      title: "Intellectual Property",
      icon: Shield,
      content: "All content published on the platform is protected by copyright. Freelancers retain intellectual property rights to their work, and clients receive usage rights as agreed."
    },
    {
      title: "Restrictions and Prohibitions",
      icon: AlertTriangle,
      content: "Using the platform for illegal or harmful activities is prohibited. Publishing offensive content, violating laws, or infringing on others' rights is not allowed."
    },
    {
      title: "Service Termination",
      icon: AlertTriangle,
      content: "We reserve the right to terminate or suspend user accounts that violate these terms. Users can also terminate their accounts at any time."
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: isRTL ? "البريد الإلكتروني" : "Email",
      value: "legal@ahmedma.com"
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
            <FileText className="w-8 h-8 text-[#0A2540]" />
            <h1 className={cn("text-4xl font-bold text-[#0A2540]", isRTL && "text-right")}>
              {isRTL ? "شروط الاستخدام" : "Terms of Use"}
            </h1>
          </div>
          <p className={cn("text-xl text-gray-600 max-w-3xl mx-auto", isRTL && "text-right")}>
            {isRTL 
              ? "يرجى قراءة شروط الاستخدام بعناية قبل استخدام منصتنا" 
              : "Please read these terms of use carefully before using our platform"
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
                  ? "إذا كان لديك أي أسئلة حول شروط الاستخدام، يرجى التواصل معنا"
                  : "If you have any questions about our terms of use, please contact us"
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

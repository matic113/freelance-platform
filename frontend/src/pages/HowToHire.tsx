import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MessageCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Award,
  Star,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";

export default function HowToHire() {
  const { isRTL, toggleLanguage } = useLocalization();

  const steps = [
    {
      step: 1,
      title_en: "Define Your Project",
      title_ar: "حدد مشروعك",
      description_en: "Clearly outline your project requirements, goals, timeline, and budget.",
      description_ar: "حدد بوضوح متطلبات مشروعك وأهدافه والجدول الزمني والميزانية.",
      icon: FileText,
      details_en: [
        "Project scope and objectives",
        "Technical requirements",
        "Design preferences",
        "Timeline expectations",
        "Budget range"
      ],
      details_ar: [
        "نطاق المشروع والأهداف",
        "المتطلبات التقنية",
        "تفضيلات التصميم",
        "توقعات الجدول الزمني",
        "نطاق الميزانية"
      ]
    },
    {
      step: 2,
      title_en: "Browse Our Services",
      title_ar: "تصفح خدماتنا",
      description_en: "Explore our comprehensive range of services and find the perfect match for your needs.",
      description_ar: "استكشف مجموعة خدماتنا الشاملة واعثر على المطابقة المثالية لاحتياجاتك.",
      icon: Search,
      details_en: [
        "Web Development",
        "Mobile App Development",
        "UI/UX Design",
        "E-commerce Solutions",
        "Digital Marketing",
        "AI & Machine Learning"
      ],
      details_ar: [
        "تطوير المواقع",
        "تطوير التطبيقات المحمولة",
        "تصميم واجهة المستخدم",
        "حلول التجارة الإلكترونية",
        "التسويق الرقمي",
        "الذكاء الاصطناعي والتعلم الآلي"
      ]
    },
    {
      step: 3,
      title_en: "Get Free Consultation",
      title_ar: "احصل على استشارة مجانية",
      description_en: "Schedule a free consultation to discuss your project in detail with our experts.",
      description_ar: "احجز استشارة مجانية لمناقشة مشروعك بالتفصيل مع خبرائنا.",
      icon: MessageCircle,
      details_en: [
        "30-minute free consultation",
        "Expert project analysis",
        "Custom solution recommendations",
        "Timeline and cost estimation",
        "No obligation to proceed"
      ],
      details_ar: [
        "استشارة مجانية لمدة 30 دقيقة",
        "تحليل خبير للمشروع",
        "توصيات حلول مخصصة",
        "تقدير الجدول الزمني والتكلفة",
        "لا يوجد التزام للمتابعة"
      ]
    },
    {
      step: 4,
      title_en: "Review Proposal",
      title_ar: "راجع العرض",
      description_en: "We'll provide a detailed proposal with timeline, cost, and deliverables.",
      description_ar: "سنقدم عرضاً مفصلاً مع الجدول الزمني والتكلفة والمخرجات.",
      icon: FileText,
      details_en: [
        "Detailed project breakdown",
        "Clear timeline with milestones",
        "Transparent pricing",
        "Deliverables list",
        "Terms and conditions"
      ],
      details_ar: [
        "تفصيل المشروع المفصل",
        "جدول زمني واضح مع المعالم",
        "تسعير شفاف",
        "قائمة المخرجات",
        "الشروط والأحكام"
      ]
    },
    {
      step: 5,
      title_en: "Start Your Project",
      title_ar: "ابدأ مشروعك",
      description_en: "Once approved, we begin development with regular updates and communication.",
      description_ar: "بمجرد الموافقة، نبدأ التطوير مع تحديثات منتظمة وتواصل مستمر.",
      icon: Zap,
      details_en: [
        "Project kickoff meeting",
        "Regular progress updates",
        "Quality assurance testing",
        "Client feedback integration",
        "Timely delivery"
      ],
      details_ar: [
        "اجتماع بدء المشروع",
        "تحديثات التقدم المنتظمة",
        "اختبار ضمان الجودة",
        "دمج ملاحظات العميل",
        "التسليم في الوقت المحدد"
      ]
    }
  ];

  const services = [
    {
      title_en: "Web Development",
      title_ar: "تطوير المواقع",
      description_en: "Custom websites and web applications built with modern technologies.",
      description_ar: "مواقع وتطبيقات ويب مخصصة مبنية بأحدث التقنيات.",
      icon: FileText,
      features_en: ["Responsive Design", "SEO Optimized", "Fast Loading", "Secure"],
      features_ar: ["تصميم متجاوب", "محسن لمحركات البحث", "تحميل سريع", "آمن"],
      price_range: "$2,000 - $50,000",
      timeline: "2-12 weeks"
    },
    {
      title_en: "Mobile App Development",
      title_ar: "تطوير التطبيقات المحمولة",
      description_en: "Native and cross-platform mobile applications for iOS and Android.",
      description_ar: "تطبيقات محمولة أصلية ومتعددة المنصات لنظامي iOS و Android.",
      icon: Users,
      features_en: ["Native Performance", "Cross-platform", "App Store Ready", "Push Notifications"],
      features_ar: ["أداء أصلي", "متعدد المنصات", "جاهز لمتجر التطبيقات", "إشعارات فورية"],
      price_range: "$5,000 - $100,000",
      timeline: "4-16 weeks"
    },
    {
      title_en: "UI/UX Design",
      title_ar: "تصميم واجهة المستخدم",
      description_en: "Beautiful, intuitive designs that enhance user experience and engagement.",
      description_ar: "تصاميم جميلة وبديهية تعزز تجربة المستخدم والتفاعل.",
      icon: Award,
      features_en: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      features_ar: ["بحث المستخدم", "الأسلاك", "النماذج الأولية", "أنظمة التصميم"],
      price_range: "$1,500 - $25,000",
      timeline: "2-8 weeks"
    },
    {
      title_en: "E-commerce Solutions",
      title_ar: "حلول التجارة الإلكترونية",
      description_en: "Complete e-commerce platforms with payment integration and inventory management.",
      description_ar: "منصات تجارة إلكترونية كاملة مع تكامل الدفع وإدارة المخزون.",
      icon: DollarSign,
      features_en: ["Payment Gateway", "Inventory Management", "Order Tracking", "Analytics"],
      features_ar: ["بوابة الدفع", "إدارة المخزون", "تتبع الطلبات", "التحليلات"],
      price_range: "$3,000 - $75,000",
      timeline: "6-20 weeks"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title_en: "Quality Guarantee",
      title_ar: "ضمان الجودة",
      description_en: "We guarantee high-quality deliverables that meet your expectations.",
      description_ar: "نضمن مخرجات عالية الجودة تلبي توقعاتك."
    },
    {
      icon: Clock,
      title_en: "On-Time Delivery",
      title_ar: "التسليم في الوقت المحدد",
      description_en: "We respect deadlines and deliver projects on time, every time.",
      description_ar: "نحترم المواعيد النهائية ونقدم المشاريع في الوقت المحدد، في كل مرة."
    },
    {
      icon: MessageCircle,
      title_en: "24/7 Support",
      title_ar: "دعم على مدار الساعة",
      description_en: "Round-the-clock support to ensure your project runs smoothly.",
      description_ar: "دعم على مدار الساعة لضمان سير مشروعك بسلاسة."
    },
    {
      icon: Star,
      title_en: "Expert Team",
      title_ar: "فريق خبير",
      description_en: "Work with experienced professionals who understand your needs.",
      description_ar: "اعمل مع محترفين ذوي خبرة يفهمون احتياجاتك."
    }
  ];

  return (
    <div
      className={cn("min-h-screen bg-muted/30", isRTL && "rtl")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2540] mb-6">
            {isRTL ? "كيفية التوظيف" : "How to Hire"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? "اكتشف العملية البسيطة لتوظيف أفضل المواهب التقنية وتحويل أفكارك إلى واقع ملموس."
              : "Discover the simple process of hiring the best tech talent and turning your ideas into reality."
            }
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">
            {isRTL ? "عملية التوظيف" : "Our Hiring Process"}
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={step.step} className="p-8 bg-white shadow-lg border-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <Badge className="bg-[#0A2540] text-white mr-3">
                        {isRTL ? "الخطوة" : "Step"} {step.step}
                      </Badge>
                      <h3 className="text-2xl font-bold text-[#0A2540]">
                        {isRTL ? step.title_ar : step.title_en}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-4 text-lg">
                      {isRTL ? step.description_ar : step.description_en}
                    </p>
                    <ul className="space-y-2">
                      {step.details_en.map((detail, i) => (
                        <li key={i} className="flex items-center text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {isRTL ? step.details_ar[i] : detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">
            {isRTL ? "خدماتنا" : "Our Services"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-6 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mr-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                      {isRTL ? service.title_ar : service.title_en}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isRTL ? service.description_ar : service.description_en}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-[#0A2540] mb-2">
                    {isRTL ? "المميزات:" : "Features:"}
                  </h4>
                  <ul className="space-y-1">
                    {service.features_en.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {isRTL ? service.features_ar[i] : feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "السعر:" : "Price:"}
                    </div>
                    <div className="font-semibold text-[#0A2540]">{service.price_range}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "المدة:" : "Timeline:"}
                    </div>
                    <div className="font-semibold text-[#0A2540]">{service.timeline}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">
            {isRTL ? "لماذا تختارنا؟" : "Why Choose Us?"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center bg-white shadow-lg border-0">
                <benefit.icon className="w-12 h-12 text-[#0A2540] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#0A2540] mb-3">
                  {isRTL ? benefit.title_ar : benefit.title_en}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? benefit.description_ar : benefit.description_en}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#0A2540] to-[#142b52] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {isRTL ? "جاهز لبدء مشروعك؟" : "Ready to Start Your Project?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isRTL 
              ? "احجز استشارة مجانية اليوم واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك."
              : "Book a free consultation today and discover how we can help you achieve your goals."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0A2540] hover:bg-gray-100">
              {isRTL ? "احجز استشارة مجانية" : "Book Free Consultation"}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A2540] bg-transparent">
              {isRTL ? "تصفح خدماتنا" : "Browse Our Services"}
            </Button>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  FileText, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Award,
  Users,
  Briefcase,
  Target,
  Zap
} from "lucide-react";

export default function HowToFindWork() {
  const { isRTL, toggleLanguage } = useLocalization();

  const steps = [
    {
      step: 1,
      title_en: "Create Your Profile",
      title_ar: "أنشئ ملفك الشخصي",
      description_en: "Build a compelling profile that showcases your skills, experience, and portfolio.",
      description_ar: "أنشئ ملفاً شخصياً مقنعاً يعرض مهاراتك وخبرتك ومحفظة أعمالك.",
      icon: UserPlus,
      details_en: [
        "Professional photo and bio",
        "Skills and expertise areas",
        "Portfolio of previous work",
        "Education and certifications",
        "Availability and rates"
      ],
      details_ar: [
        "صورة مهنية وسيرة ذاتية",
        "المهارات ومجالات الخبرة",
        "محفظة الأعمال السابقة",
        "التعليم والشهادات",
        "التوفر والأسعار"
      ]
    },
    {
      step: 2,
      title_en: "Browse Available Projects",
      title_ar: "تصفح المشاريع المتاحة",
      description_en: "Explore our extensive database of projects and find opportunities that match your skills.",
      description_ar: "استكشف قاعدة بياناتنا الواسعة من المشاريع واعثر على الفرص التي تناسب مهاراتك.",
      icon: Briefcase,
      details_en: [
        "Filter by skill and category",
        "View project requirements",
        "Check budget and timeline",
        "Read client reviews",
        "Save interesting projects"
      ],
      details_ar: [
        "تصفية حسب المهارة والفئة",
        "عرض متطلبات المشروع",
        "فحص الميزانية والجدول الزمني",
        "قراءة تقييمات العملاء",
        "حفظ المشاريع المثيرة للاهتمام"
      ]
    },
    {
      step: 3,
      title_en: "Submit Your Proposal",
      title_ar: "قدم اقتراحك",
      description_en: "Write a compelling proposal that demonstrates your understanding and value proposition.",
      description_ar: "اكتب اقتراحاً مقنعاً يوضح فهمك وقيمة عرضك.",
      icon: FileText,
      details_en: [
        "Customized project approach",
        "Clear timeline and milestones",
        "Competitive pricing",
        "Relevant portfolio samples",
        "Professional communication"
      ],
      details_ar: [
        "نهج مشروع مخصص",
        "جدول زمني ومعالم واضحة",
        "تسعير تنافسي",
        "عينات محفظة ذات صلة",
        "تواصل مهني"
      ]
    },
    {
      step: 4,
      title_en: "Interview & Negotiate",
      title_ar: "مقابلة وتفاوض",
      description_en: "Participate in interviews and negotiate terms that work for both parties.",
      description_ar: "شارك في المقابلات وتفاوض على الشروط التي تناسب الطرفين.",
      icon: Users,
      details_en: [
        "Video or phone interviews",
        "Technical skill assessment",
        "Project scope discussion",
        "Timeline and budget negotiation",
        "Contract finalization"
      ],
      details_ar: [
        "مقابلات فيديو أو هاتفية",
        "تقييم المهارات التقنية",
        "مناقشة نطاق المشروع",
        "تفاوض الجدول الزمني والميزانية",
        "إنهاء العقد"
      ]
    },
    {
      step: 5,
      title_en: "Start Working",
      title_ar: "ابدأ العمل",
      description_en: "Begin your project with clear communication and regular updates.",
      description_ar: "ابدأ مشروعك مع تواصل واضح وتحديثات منتظمة.",
      icon: Zap,
      details_en: [
        "Project kickoff meeting",
        "Regular progress updates",
        "Quality deliverables",
        "Client feedback integration",
        "Timely project completion"
      ],
      details_ar: [
        "اجتماع بدء المشروع",
        "تحديثات التقدم المنتظمة",
        "مخرجات عالية الجودة",
        "دمج ملاحظات العميل",
        "إكمال المشروع في الوقت المحدد"
      ]
    }
  ];

  const categories = [
    {
      title_en: "Web Development",
      title_ar: "تطوير المواقع",
      description_en: "Build websites and web applications using modern technologies.",
      description_ar: "بناء المواقع وتطبيقات الويب باستخدام التقنيات الحديثة.",
      icon: FileText,
      skills_en: ["React", "Vue.js", "Node.js", "Python", "PHP"],
      skills_ar: ["React", "Vue.js", "Node.js", "Python", "PHP"],
      avg_rate: "$25-75/hour",
      projects_count: "500+"
    },
    {
      title_en: "Mobile Development",
      title_ar: "تطوير التطبيقات المحمولة",
      description_en: "Create mobile applications for iOS and Android platforms.",
      description_ar: "إنشاء تطبيقات محمولة لمنصات iOS و Android.",
      icon: Briefcase,
      skills_en: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
      skills_ar: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
      avg_rate: "$30-80/hour",
      projects_count: "300+"
    },
    {
      title_en: "UI/UX Design",
      title_ar: "تصميم واجهة المستخدم",
      description_en: "Design beautiful and intuitive user interfaces and experiences.",
      description_ar: "تصميم واجهات وتجارب مستخدم جميلة وبديهية.",
      icon: Award,
      skills_en: ["Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator"],
      skills_ar: ["Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator"],
      avg_rate: "$20-60/hour",
      projects_count: "400+"
    },
    {
      title_en: "Digital Marketing",
      title_ar: "التسويق الرقمي",
      description_en: "Promote businesses through digital channels and strategies.",
      description_ar: "ترويج الأعمال من خلال القنوات والاستراتيجيات الرقمية.",
      icon: Target,
      skills_en: ["SEO", "Social Media", "Google Ads", "Content Marketing", "Analytics"],
      skills_ar: ["SEO", "وسائل التواصل الاجتماعي", "إعلانات جوجل", "تسويق المحتوى", "التحليلات"],
      avg_rate: "$15-50/hour",
      projects_count: "250+"
    }
  ];

  const tips = [
    {
      icon: Star,
      title_en: "Build a Strong Portfolio",
      title_ar: "أنشئ محفظة قوية",
      description_en: "Showcase your best work with detailed case studies and results.",
      description_ar: "اعرض أفضل أعمالك مع دراسات حالة مفصلة ونتائج."
    },
    {
      icon: TrendingUp,
      title_en: "Set Competitive Rates",
      title_ar: "حدد أسعاراً تنافسية",
      description_en: "Research market rates and price your services competitively.",
      description_ar: "ابحث عن أسعار السوق وقيم خدماتك بشكل تنافسي."
    },
    {
      icon: Clock,
      title_en: "Meet Deadlines",
      title_ar: "التزم بالمواعيد النهائية",
      description_en: "Always deliver on time to build trust and get repeat clients.",
      description_ar: "اسلم دائماً في الوقت المحدد لبناء الثقة والحصول على عملاء متكررين."
    },
    {
      icon: CheckCircle,
      title_en: "Communicate Clearly",
      title_ar: "تواصل بوضوح",
      description_en: "Maintain clear and professional communication throughout projects.",
      description_ar: "حافظ على تواصل واضح ومهني طوال المشاريع."
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
            {isRTL ? "كيفية العثور على عمل" : "How to Find Work"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? "اكتشف كيفية العثور على أفضل الفرص المهنية وبناء مسيرة مهنية ناجحة في عالم العمل الحر."
              : "Discover how to find the best professional opportunities and build a successful freelance career."
            }
          </p>
        </div>


        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">
            {isRTL ? "خطوات العثور على العمل" : "Steps to Find Work"}
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

        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">
            {isRTL ? "فئات العمل" : "Work Categories"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="p-6 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-[#0A2540] rounded-lg flex items-center justify-center mr-4">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                      {isRTL ? category.title_ar : category.title_en}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isRTL ? category.description_ar : category.description_en}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-[#0A2540] mb-2">
                    {isRTL ? "المهارات المطلوبة:" : "Required Skills:"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills_en.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "متوسط السعر:" : "Avg. Rate:"}
                    </div>
                    <div className="font-semibold text-[#0A2540]">{category.avg_rate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "المشاريع:" : "Projects:"}
                    </div>
                    <div className="font-semibold text-[#0A2540]">{category.projects_count}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">
            {isRTL ? "نصائح للنجاح" : "Success Tips"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="p-6 text-center bg-white shadow-lg border-0">
                <tip.icon className="w-12 h-12 text-[#0A2540] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#0A2540] mb-3">
                  {isRTL ? tip.title_ar : tip.title_en}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? tip.description_ar : tip.description_en}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#0A2540] to-[#142b52] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {isRTL ? "ابدأ رحلتك المهنية اليوم" : "Start Your Professional Journey Today"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isRTL 
              ? "انضم إلى آلاف المستقلين الناجحين وابدأ في بناء مسيرتك المهنية معنا."
              : "Join thousands of successful freelancers and start building your career with us."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0A2540] hover:bg-gray-100">
              {isRTL ? "أنشئ ملفك الشخصي" : "Create Your Profile"}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A2540] bg-transparent">
              {isRTL ? "تصفح المشاريع" : "Browse Projects"}
            </Button>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

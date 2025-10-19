import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Star, Calendar, Clock, CheckCircle, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { useClientExperiences } from "@/hooks/useContent";
import { ClientExperience } from "@/services/content.service";

export default function ClientExperiences() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { data: clientExperiencesData, isLoading, error } = useClientExperiences();

  // Fallback data in case API fails or returns empty
  const fallbackExperiences: ClientExperience[] = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      clientTitle: "CEO, TechStart",
      rating: 5,
      comment: "Working with AhmedMA was a game-changer for our startup. They delivered a stunning website that perfectly represents our brand and helped us secure our first major client.",
      project: "Web Development",
      date: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      clientName: "Ahmed Al-Rashid",
      clientTitle: "Founder, E-commerce Plus",
      rating: 5,
      comment: "AhmedMA transformed our traditional business into a modern e-commerce powerhouse. Sales increased by 400% in the first quarter after launch.",
      project: "E-commerce Platform",
      date: "2024-02-10T14:20:00Z"
    },
    {
      id: "3",
      clientName: "Maria Rodriguez",
      clientTitle: "Marketing Director, Creative Agency",
      rating: 5,
      comment: "The brand identity AhmedMA created for us is absolutely perfect. It captures our essence and has helped us stand out in a competitive market.",
      project: "Brand Design",
      date: "2024-03-05T09:15:00Z"
    }
  ];

  // Use API data if available, otherwise fallback to static data
  const experiences = clientExperiencesData?.testimonials?.length > 0 
    ? clientExperiencesData.testimonials 
    : fallbackExperiences;

  const processSteps = [
    {
      step: 1,
      title_en: "Initial Consultation",
      title_ar: "الاستشارة الأولية",
      description_en: "We discuss your vision, goals, and requirements in detail.",
      description_ar: "نناقش رؤيتك وأهدافك ومتطلباتك بالتفصيل.",
      icon: MessageCircle
    },
    {
      step: 2,
      title_en: "Project Planning",
      title_ar: "تخطيط المشروع",
      description_en: "We create a detailed project plan with timelines and milestones.",
      description_ar: "ننشئ خطة مشروع مفصلة مع الجداول الزمنية والمعالم.",
      icon: Calendar
    },
    {
      step: 3,
      title_en: "Development & Design",
      title_ar: "التطوير والتصميم",
      description_en: "Our team brings your vision to life with cutting-edge technology.",
      description_ar: "فريقنا يحقق رؤيتك باستخدام أحدث التقنيات.",
      icon: Clock
    },
    {
      step: 4,
      title_en: "Testing & Launch",
      title_ar: "الاختبار والإطلاق",
      description_en: "We thoroughly test everything and launch your project successfully.",
      description_ar: "نختبر كل شيء بدقة ونطلق مشروعك بنجاح.",
      icon: CheckCircle
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
            {isRTL ? "تجارب العملاء" : "Client Experiences"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? "استمع إلى قصص عملائنا الحقيقية واكتشف كيف ساعدناهم على تحقيق أهدافهم وتحويل أحلامهم إلى واقع."
              : "Hear from our real clients and discover how we've helped them achieve their goals and turn their dreams into reality."
            }
          </p>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">
            {isRTL ? "عملية العمل معنا" : "Our Working Process"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <Card key={step.step} className="p-6 text-center bg-white shadow-lg border-0">
                <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-[#0A2540] mb-2">{step.step}</div>
                <h3 className="text-lg font-semibold text-[#0A2540] mb-3">
                  {isRTL ? step.title_ar : step.title_en}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? step.description_ar : step.description_en}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            <span className="ml-3 text-gray-600">
              {isRTL ? "جاري تحميل تجارب العملاء..." : "Loading client experiences..."}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <div className="ml-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? "خطأ في التحميل" : "Error Loading Experiences"}
              </h3>
              <p className="text-gray-500">
                {isRTL 
                  ? "حدث خطأ أثناء جلب تجارب العملاء. سيتم عرض البيانات الافتراضية."
                  : "An error occurred while fetching client experiences. Showing default data."
                }
              </p>
            </div>
          </div>
        )}

        {/* Client Experiences Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                  alt={experience.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#0A2540] text-white">
                    {experience.project}
                  </Badge>
                </div>
                {experience.rating && (
                  <div className="absolute top-4 right-4 flex">
                    {[...Array(experience.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {/* Client Info */}
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-3">
                    <div className="w-full h-full bg-[#0A2540] flex items-center justify-center text-white font-semibold">
                      {experience.clientName.charAt(0)}
                    </div>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-[#0A2540]">{experience.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{experience.clientTitle}</p>
                  </div>
                </div>

                {/* Testimonial */}
                <blockquote className="text-muted-foreground mb-4 italic leading-relaxed bg-muted/50 p-4 rounded-lg">
                  "{experience.comment}"
                </blockquote>

                {/* Project Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? "المشروع:" : "Project:"}</span>
                    <span className="font-medium">{experience.project}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? "التقييم:" : "Rating:"}</span>
                    <span className="font-medium">{experience.rating}/5</span>
                  </div>
                  {experience.date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? "التاريخ:" : "Date:"}</span>
                      <span className="font-medium">{new Date(experience.date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-[#0A2540] to-[#142b52] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {isRTL ? "كن التالي في قصص نجاحنا" : "Be Next in Our Success Stories"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isRTL 
              ? "انضم إلى مئات العملاء الراضين الذين حققوا أهدافهم معنا. ابدأ رحلتك نحو النجاح اليوم!"
              : "Join hundreds of satisfied clients who have achieved their goals with us. Start your journey to success today!"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0A2540] hover:bg-gray-100">
              {isRTL ? "ابدأ مشروعك" : "Start Your Project"}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A2540] bg-transparent">
              {isRTL ? "احجز استشارة مجانية" : "Book Free Consultation"}
            </Button>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

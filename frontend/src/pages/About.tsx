import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function About() {
  const { isRTL, toggleLanguage } = useLocalization();

  // Frontend data for sections
  const sections = [
    {
      title_en: "Our Vision",
      title_ar: "رؤيتنا",
      text_en:
        "To become the leading platform that empowers freelancers and companies to achieve success together.",
      text_ar:
        "أن نصبح المنصة الرائدة التي تمكّن المستقلين والشركات من تحقيق النجاح معًا.",
    },
    {
      title_en: "Our Mission",
      title_ar: "مهمتنا",
      text_en:
        "Providing innovative digital solutions that simplify project outsourcing and management.",
      text_ar:
        "تقديم حلول رقمية مبتكرة تسهّل عملية الاستعانة بالمستقلين وإدارة المشاريع.",
    },
    {
      title_en: "Our Values",
      title_ar: "قيمنا",
      text_en:
        "Transparency, professionalism, collaboration, and continuous growth.",
      text_ar: "الشفافية، الاحترافية، التعاون، والنمو المستمر.",
    },
  ];

  // Frontend data for features
  const features = [
    {
      en: "Seamless collaboration between companies and freelancers",
      ar: "تعاون سلس بين الشركات والمستقلين",
    },
    {
      en: "Secure and reliable payment system",
      ar: "نظام دفع آمن وموثوق",
    },
    {
      en: "Multi-language support (Arabic & English)",
      ar: "دعم متعدد اللغات (العربية والإنجليزية)",
    },
    {
      en: "Advanced project tracking and management",
      ar: "إدارة وتتبع المشاريع بشكل متقدم",
    },
  ];

  return (
    <div
      className={cn("min-h-screen bg-muted/30", isRTL && "rtl")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/90 via-[#0A2540]/80 via-[#0A2540]/70 to-[#0A2540]/50" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {isRTL ? "منصة ربط المواهب بالمشاريع" : "Connecting Talent with Projects"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {isRTL 
                ? "نحن نؤمن بقوة التعاون والابتكار. منصتنا تجمع بين أفضل المواهب وأكبر الفرص لتحقيق النجاح المشترك" 
                : "We believe in the power of collaboration and innovation. Our platform brings together the best talents and biggest opportunities for mutual success"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-[#0A2540] hover:bg-white/90 px-8 py-3 text-lg font-semibold"
              >
                {isRTL ? "اكتشف المزيد" : "Discover More"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#0A2540] px-8 py-3 text-lg font-semibold bg-transparent"
              >
                {isRTL ? "تواصل معنا" : "Contact Us"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-10 w-16 h-16 border border-white/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-white/20 rounded-full animate-pulse delay-500" />
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A2540]">
            {isRTL ? "حول المنصة" : "About the Platform"}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            {isRTL
              ? "منصة مبتكرة تربط الشركات بأفضل المستقلين لإنجاز المشاريع بكفاءة واحترافية."
              : "An innovative platform that connects companies with top freelancers to deliver projects efficiently and professionally."}
          </p>
        </div>

        {/* Sections */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {sections.map((section, index) => (
            <Card
              key={index}
              className="p-6 bg-white rounded-2xl shadow-md border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-[#0A2540] mb-3">
                {isRTL ? section.title_ar : section.title_en}
              </h2>
              <p
                className={cn(
                  "text-muted-foreground leading-relaxed",
                  isRTL && "text-right"
                )}
              >
                {isRTL ? section.text_ar : section.text_en}
              </p>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-md border p-8">
          <h2 className="text-2xl font-bold text-[#0A2540] mb-6 text-center">
            {isRTL ? "مميزات المنصة" : "Platform Features"}
          </h2>
          <ul
            className={cn(
              "grid gap-4 sm:grid-cols-2",
              isRTL && "text-right"
            )}
          >
            {features.map((f, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#0A2540] mt-1 flex-shrink-0" />
                <span className="text-foreground">
                  {isRTL ? f.ar : f.en}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

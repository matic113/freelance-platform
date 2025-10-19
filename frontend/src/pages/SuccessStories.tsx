import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, TrendingUp, Award, Quote, Loader2, AlertCircle } from "lucide-react";
import { useSuccessStories } from "@/hooks/useContent";
import { SuccessStory } from "@/services/content.service";

export default function SuccessStories() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { data: successStoriesData, isLoading, error } = useSuccessStories();

  // Fallback data in case API fails or returns empty
  const fallbackStories: SuccessStory[] = [
    {
      id: "1",
      title: "E-commerce Platform Revolution",
      description: "Built a complete e-commerce solution that increased client sales by 300% in just 6 months.",
      client: "TechCorp Solutions",
      freelancer: "AhmedMA",
      project: "Web Development",
      duration: "6 months",
      budget: "$15,000",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      rating: 5,
      testimonial: "AhmedMA delivered beyond our expectations. The platform is robust, scalable, and user-friendly.",
      results: ["300% increase in sales", "50% reduction in cart abandonment", "99.9% uptime achieved"]
    },
    {
      id: "2",
      title: "Mobile App Success Story",
      description: "Developed a mobile app that reached 100K downloads in the first month of launch.",
      client: "StartupXYZ",
      freelancer: "AhmedMA",
      project: "Mobile Development",
      duration: "4 months",
      budget: "$25,000",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      rating: 5,
      testimonial: "The app exceeded all our KPIs. AhmedMA's attention to detail is remarkable.",
      results: ["100K downloads in 30 days", "4.8 app store rating", "95% user retention"]
    },
    {
      id: "3",
      title: "Digital Transformation Journey",
      description: "Transformed a traditional business into a digital-first company with modern solutions.",
      client: "Legacy Industries",
      freelancer: "AhmedMA",
      project: "Digital Transformation",
      duration: "8 months",
      budget: "$50,000",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      rating: 5,
      testimonial: "AhmedMA guided us through our digital transformation with expertise and patience.",
      results: ["40% increase in efficiency", "60% cost reduction", "Complete digital workflow"]
    }
  ];

  // Use API data if available, otherwise fallback to static data
  const successStories = successStoriesData?.stories?.length > 0 
    ? successStoriesData.stories 
    : fallbackStories;


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
            {isRTL ? "قصص النجاح" : "Success Stories"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? "اكتشف كيف ساعدنا عملاءنا على تحقيق أهدافهم وتحويل أحلامهم إلى واقع ملموس من خلال حلول مبتكرة ومخصصة."
              : "Discover how we've helped our clients achieve their goals and transform their dreams into reality through innovative and tailored solutions."
            }
          </p>
        </div>


        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            <span className="ml-3 text-gray-600">
              {isRTL ? "جاري تحميل قصص النجاح..." : "Loading success stories..."}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <div className="ml-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? "خطأ في التحميل" : "Error Loading Stories"}
              </h3>
              <p className="text-gray-500">
                {isRTL 
                  ? "حدث خطأ أثناء جلب قصص النجاح. سيتم عرض البيانات الافتراضية."
                  : "An error occurred while fetching success stories. Showing default data."
                }
              </p>
            </div>
          </div>
        )}

        {/* Success Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <Card key={story.id} className="overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={story.image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#0A2540] text-white">
                    {story.project}
                  </Badge>
                </div>
                {story.rating && (
                  <div className="absolute top-4 right-4 flex">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0A2540] mb-3">
                  {story.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {story.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? "العميل:" : "Client:"}</span>
                    <span className="font-medium">{story.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? "المستقل:" : "Freelancer:"}</span>
                    <span className="font-medium">{story.freelancer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? "المدة:" : "Duration:"}</span>
                    <span className="font-medium">{story.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? "الميزانية:" : "Budget:"}</span>
                    <span className="font-medium">{story.budget}</span>
                  </div>
                </div>

                {story.results && story.results.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#0A2540] mb-2">
                      {isRTL ? "النتائج الرئيسية:" : "Key Results:"}
                    </h4>
                    <ul className="space-y-1">
                      {story.results.map((result, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-2 h-2 bg-[#0A2540] rounded-full mr-2"></div>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {story.testimonial && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <Quote className="w-5 h-5 text-[#0A2540] mb-2" />
                    <p className="text-sm italic text-muted-foreground">
                      "{story.testimonial}"
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-[#0A2540] to-[#142b52] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {isRTL ? "جاهز لكتابة قصتك الناجحة؟" : "Ready to Write Your Success Story?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isRTL 
              ? "انضم إلى مئات العملاء الذين حققوا أهدافهم معنا. ابدأ مشروعك اليوم!"
              : "Join hundreds of clients who have achieved their goals with us. Start your project today!"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0A2540] hover:bg-gray-100">
              {isRTL ? "ابدأ مشروعك" : "Start Your Project"}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A2540] bg-transparent">
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </Button>
          </div>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}

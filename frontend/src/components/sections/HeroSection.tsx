import { Button } from "@/components/ui/button";
import { Search, Star, Users, Briefcase, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-image.jpg";

interface HeroSectionProps {
  isRTL?: boolean;
}

export const HeroSection = ({ isRTL = false }: HeroSectionProps) => {
  const primaryColor = "#0A2540";

  return (
    <section className="relative min-h-[70vh] lg:min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: primaryColor }}>
      {/* Background Gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${primaryColor}CC, ${primaryColor}AA)` }} />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left Content */}
          <div className={cn("space-y-8 animate-fade-in", isRTL && "text-right")}>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight">
                {isRTL ? (
                  <>
                    ابحث عن أفضل
                    <br />
                    <span className="text-white">المستقلين</span>
                    <br />
                    لمشروعك
                  </>
                ) : (
                  <>
                    Find the Best
                    <br />
                    <span className="text-white">Freelancers</span>
                    <br />
                    for Your Project
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-lg">
                {isRTL
                  ? "تواصل مع مئات المستقلين المحترفين في جميع المجالات واحصل على مشروعك بأعلى جودة وأفضل سعر"
                  : "Connect with hundreds of professional freelancers across all fields and get your project done with the highest quality at the best price"}
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg">
              <div className="space-y-4">
                <div className="relative">
                  <Search
                    className={cn(
                      "absolute top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5",
                      isRTL ? "right-4" : "left-4"
                    )}
                  />
                  <input
                    type="text"
                    placeholder={isRTL ? "ما المشروع الذي تريد إنجازه؟" : "What project do you need done?"}
                    className={cn(
                      "w-full h-14 rounded-xl bg-white/80 text-gray-800 text-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#0A2540]",
                      isRTL ? "pr-12 pl-4 text-right" : "pl-12 pr-4"
                    )}
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {(isRTL
                    ? ["تطوير مواقع", "تصميم جرافيك", "كتابة محتوى", "ترجمة", "تسويق رقمي"]
                    : ["Web Development", "Graphic Design", "Content Writing", "Translation", "Digital Marketing"]
                  ).map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 text-sm bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  variant="default"
                  size="lg"
                  className="w-full text-base sm:text-lg font-semibold h-12 sm:h-14 bg-[#0A2540] text-white hover:bg-[#0C2B55]"
                >
                  {isRTL ? "ابدأ البحث الآن" : "Start Searching Now"}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/80 text-sm">
                  {isRTL ? "مستقل محترف" : "Professional Freelancers"}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-white/80 text-sm">
                  {isRTL ? "مشروع مكتمل" : "Completed Projects"}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-white/80 text-sm">
                  {isRTL ? "تقييم العملاء" : "Client Rating"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative animate-slide-up lg:animate-float hidden md:block">
            <img
              src={heroImage}
              alt={isRTL ? "فريق العمل المحترف" : "Professional team working"}
              className="w-full h-auto rounded-2xl shadow-lg"
            />

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-md animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-sm">4.9/5</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{isRTL ? "تقييم ممتاز" : "Excellent Rating"}</div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-md animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-sm">500+</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{isRTL ? "عميل راضي" : "Happy Clients"}</div>
            </div>

            <div className="absolute top-1/2 -left-6 bg-white rounded-xl p-4 shadow-md animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-sm">98%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{isRTL ? "نجاح المشاريع" : "Success Rate"}</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

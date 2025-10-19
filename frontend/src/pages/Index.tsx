import { useLocalization } from "@/hooks/useLocalization";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { TopFreelancers } from "@/components/sections/TopFreelancers";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";

const Index = () => {
  const { isRTL, toggleLanguage } = useLocalization();

  return (
    <div className={cn("min-h-screen", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />
      <main>
        <HeroSection isRTL={isRTL} />
        <FeaturedProjects isRTL={isRTL} />
        <TopFreelancers isRTL={isRTL} />
      </main>
      <Footer isRTL={isRTL} />
    </div>
  );
};

export default Index;

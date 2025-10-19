import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreelancerCard } from "@/components/cards/FreelancerCard";
import { ProjectCard } from "@/components/cards/ProjectCard";

export default function HomePage() {
  const [isRTL, setIsRTL] = useState(true);

  const freelancers = [
    {
      id: "1",
      name: "أحمد",
      title: "مطور واجهات",
      rating: 4.9,
      reviewsCount: 12,
      hourlyRate: { min: 20, max: 40, currency: "USD" },
      location: "رام الله، فلسطين",
      skills: ["React", "TypeScript", "Tailwind"],
      completedJobs: 15,
      successRate: 95,
      isOnline: true,
      isVerified: true,
      lastSeen: "منذ ساعة",
      avatar: "/f1.png",
      description: "مطور واجهات محترف ولديه خبرة 5 سنوات"
    },
    {
      id: "2",
      name: "سارة",
      title: "مصممة UI/UX",
      rating: 4.7,
      reviewsCount: 8,
      hourlyRate: { min: 25, max: 45, currency: "USD" },
      location: "غزة، فلسطين",
      skills: ["Figma", "Adobe XD", "Photoshop"],
      completedJobs: 10,
      successRate: 90,
      isOnline: false,
      isVerified: true,
      lastSeen: "منذ 3 ساعات",
      avatar: "/f2.png",
      description: "مصممة واجهات مبدعة ومتخصصة في تصميم التطبيقات"
    },
    {
      id: "3",
      name: "محمد",
      title: "مطور Backend",
      rating: 5.0,
      reviewsCount: 20,
      hourlyRate: { min: 30, max: 50, currency: "USD" },
      location: "نابلس، فلسطين",
      skills: ["Node.js", "Spring Boot", "Java"],
      completedJobs: 25,
      successRate: 98,
      isOnline: true,
      isVerified: true,
      lastSeen: "قبل 30 دقيقة",
      avatar: "/f3.png",
      description: "مطور Backend خبير مع خبرة واسعة في الأنظمة الكبيرة"
    },
  ];

  const projects = [
    {
      id: "1",
      title: "تطبيق موبايل تعليمي",
      description: "تطبيق لتعليم الأطفال البرمجة بطريقة ممتعة",
      budget: { min: 1500, max: 2000, currency: "USD" },
      deadline: "2025-12-31",
      location: "عبر الإنترنت",
      skills: ["React Native", "Firebase", "UI/UX"],
      proposals: 10,
      rating: 4.8,
      isUrgent: true
    },
    {
      id: "2",
      title: "موقع تجارة إلكترونية",
      description: "موقع متكامل لبيع المنتجات مع بوابات دفع متعددة",
      budget: { min: 4000, max: 5000, currency: "USD" },
      deadline: "2025-11-15",
      location: "عبر الإنترنت",
      skills: ["Next.js", "Node.js", "Stripe", "MongoDB"],
      proposals: 25,
      rating: 4.5,
      isFixed: true
    },
    {
      id: "3",
      title: "لوحة تحكم SaaS",
      description: "لوحة تحكم SaaS لإدارة الشركات الصغيرة والمتوسطة",
      budget: { min: 3000, max: 3500, currency: "USD" },
      deadline: "2025-10-20",
      location: "عبر الإنترنت",
      skills: ["React", "Node.js", "PostgreSQL", "AWS"],
      proposals: 15,
      rating: 4.7
    },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="font-sans bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 min-h-screen">

      {/* === Hero Section === */}
      <section className="relative px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16 md:py-24 overflow-hidden bg-[#0A2540]">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-16">

          {/* Left content */}
          <div className="flex-1 w-full text-center lg:text-start">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 break-words">
              {isRTL ? "اكتشف أفضل المستقلين لمشاريعك" : "Find the Best Freelancers for Your Projects"}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6">
              {isRTL
                ? "منصة تجمع بين أصحاب المشاريع والمستقلين لتحقيق النجاح معًا."
                : "A platform connecting clients and freelancers to achieve success together."}
            </p>

            Search
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl shadow-strong mb-6 flex flex-col sm:flex-row items-center gap-3 w-full">
              <input
                type="text"
                placeholder={isRTL ? "ابحث عن مستقل..." : "Search for a freelancer..."}
                className="flex-1 p-3 sm:p-4 rounded-xl bg-white/70 focus:outline-none text-gray-800 w-full min-w-0"
              />
              <Button variant="default" size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl whitespace-nowrap">
                <Search className="w-5 h-5" />
              </Button>
            </div>

            {/* CTA */}
            <Button 
              variant="success" 
              size="lg" 
              className="w-full sm:w-auto text-base sm:text-lg font-semibold h-12 sm:h-14"
            >
              {isRTL ? "ابدأ البحث الآن" : "Start Searching Now"}
            </Button>
          </div>

          {/* Right image */}
          <div className="flex-1 relative hidden md:block w-full">
            <img src="/hero-illustration.png" alt="Freelance work" className="w-full max-w-md mx-auto h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* === Freelancers Section === */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16 bg-white">
        <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
          {isRTL ? "أشهر المستقلين" : "Featured Freelancers"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-8 sm:mb-10">
          {freelancers.map(f => (
            <FreelancerCard key={f.id} freelancer={f} isRTL={isRTL} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto bg-white border-primary text-black hover:bg-primary hover:text-primary-foreground"
          >
            {isRTL ? "عرض جميع المستقلين" : "View All Freelancers"}
          </Button>
        </div>
        </div>
      </section>

      {/* === Projects Section === */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
          {isRTL ? "أحدث المشاريع" : "Latest Projects"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-8 sm:mb-10">
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} isRTL={isRTL} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto bg-white border-primary text-black hover:bg-primary hover:text-primary-foreground"
          >
            {isRTL ? "عرض جميع المشاريع" : "View All Projects"}
          </Button>
        </div>
        </div>
      </section>
    </div>
  );
}

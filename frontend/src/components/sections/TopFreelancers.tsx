import React from "react";
import { FreelancerCard } from "@/components/cards/FreelancerCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// ✅ Dummy data (same as Freelancers page)
const sampleFreelancers = [
  {
    id: "1",
    name: "أحمد محمد",
    title: "مطور مواقع ومختص React/Node.js",
    rating: 4.9,
    reviewsCount: 127,
    hourlyRate: { min: 25, max: 45, currency: "$" },
    location: "الرياض، السعودية",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    completedJobs: 89,
    successRate: 98,
    isOnline: true,
    isVerified: true,
    lastSeen: "منذ ساعة",
    description:
      "مطور full-stack مع 8 سنوات خبرة في تطوير تطبيقات الويب الحديثة. متخصص في React وNode.js مع خبرة واسعة في AWS وقواعد البيانات.",
  },
  {
    id: "2",
    name: "فاطمة الزهراء",
    title: "مصممة جرافيك ومختصة UI/UX",
    rating: 4.8,
    reviewsCount: 93,
    hourlyRate: { min: 20, max: 35, currency: "$" },
    location: "دبي، الإمارات",
    skills: ["UI/UX Design", "Adobe Creative Suite", "Figma", "Branding"],
    completedJobs: 156,
    successRate: 96,
    isOnline: false,
    isVerified: true,
    lastSeen: "منذ 3 ساعات",
    description:
      "مصممة إبداعية مع أكثر من 6 سنوات في تصميم الهوية البصرية وتجربة المستخدم. تركز على التصاميم الحديثة والوظيفية.",
  },
  {
    id: "3",
    name: "خالد العثمان",
    title: "كاتب محتوى ومختص SEO",
    rating: 4.7,
    reviewsCount: 201,
    hourlyRate: { min: 15, max: 25, currency: "$" },
    location: "جدة، السعودية",
    skills: ["Content Writing", "SEO", "Digital Marketing", "Arabic/English"],
    completedJobs: 234,
    successRate: 94,
    isOnline: true,
    isVerified: true,
    lastSeen: "الآن",
    description:
      "كاتب محتوى محترف ومختص SEO مع خبرة 5 سنوات في التسويق الرقمي. يجيد الكتابة باللغتين العربية والإنجليزية.",
  },
];

const sampleFreelancersEN = [
  {
    id: "1",
    name: "Ahmed Mohamed",
    title: "Web Developer & React/Node.js Specialist",
    rating: 4.9,
    reviewsCount: 127,
    hourlyRate: { min: 25, max: 45, currency: "$" },
    location: "Riyadh, Saudi Arabia",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    completedJobs: 89,
    successRate: 98,
    isOnline: true,
    isVerified: true,
    lastSeen: "1 hour ago",
    description:
      "Full-stack developer with 8 years of experience in developing modern web applications. Specialized in React and Node.js with extensive experience in AWS and databases.",
  },
  {
    id: "2",
    name: "Fatima Al-Zahra",
    title: "Graphic Designer & UI/UX Specialist",
    rating: 4.8,
    reviewsCount: 93,
    hourlyRate: { min: 20, max: 35, currency: "$" },
    location: "Dubai, UAE",
    skills: ["UI/UX Design", "Adobe Creative Suite", "Figma", "Branding"],
    completedJobs: 156,
    successRate: 96,
    isOnline: false,
    isVerified: true,
    lastSeen: "3 hours ago",
    description:
      "Creative designer with over 6 years in brand identity design and user experience. Focuses on modern and functional designs.",
  },
  {
    id: "3",
    name: "Khalid Al-Othman",
    title: "Content Writer & SEO Specialist",
    rating: 4.7,
    reviewsCount: 201,
    hourlyRate: { min: 15, max: 25, currency: "$" },
    location: "Jeddah, Saudi Arabia",
    skills: ["Content Writing", "SEO", "Digital Marketing", "Arabic/English"],
    completedJobs: 234,
    successRate: 94,
    isOnline: true,
    isVerified: true,
    lastSeen: "Now",
    description:
      "Professional content writer and SEO specialist with 5 years of experience in digital marketing. Fluent in both Arabic and English writing.",
  },
];

interface TopFreelancersProps {
  isRTL?: boolean;
}

export const TopFreelancers = ({ isRTL = false }: TopFreelancersProps) => {
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 sm:py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5" style={{ color: "#0A2540" }}>
            {isRTL ? "أفضل المستقلين" : "Top Freelancers"}
          </h2>
          <div
            className="w-24 h-1 mx-auto rounded-full mb-4"
            style={{ background: "linear-gradient(to right, #0A2540, #0c315c)" }}
          />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {isRTL
              ? "تعرف على نخبة من أفضل المستقلين المحترفين في مختلف المجالات"
              : "Meet the elite of the best professional freelancers in various fields"}
          </p>
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link to="/freelancers">
            <Button
              size="lg"
              className="rounded-full bg-[#0A2540] hover:bg-[#0c315c] text-white px-6 flex items-center justify-center gap-2"
            >
              {isRTL ? "عرض جميع المستقلين" : "View All"}
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};


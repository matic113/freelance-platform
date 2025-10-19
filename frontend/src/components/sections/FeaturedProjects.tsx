import React from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FeaturedProjectsProps {
  isRTL?: boolean;
}

// ✅ Export both arrays so they can be reused in Projects.tsx
export const sampleProjects = [
  {
    id: "1",
    title: "تطوير تطبيق موبايل للتجارة الإلكترونية",
    description: "نحتاج لتطوير تطبيق موبايل متكامل...",
    budget: 6500,
    currency: "$",
    deadline: "30 يوم",
    deadlineDate: "2025-11-30",
    location: "الرياض، السعودية",
    skills: ["React Native", "Node.js", "MongoDB"],
    proposals: 12,
    proposalsCount: 12,
    rating: 4.8,
    category: "تطوير تطبيقات",
    status: "active",
    clientId: "client-1",
    clientName: "شركة التقنية المتقدمة",
    clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    isUrgent: true,
    isFixed: true,
    createdAt: "2024-01-15T10:30:00Z",
    views: 156,
    featured: true,
  },
  {
    id: "2",
    title: "تصميم هوية بصرية كاملة لشركة ناشئة",
    description: "مطلوب تصميم هوية بصرية كاملة...",
    budget: 2000,
    currency: "$",
    deadline: "15 يوم",
    deadlineDate: "2025-10-20",
    location: "دبي، الإمارات",
    skills: ["Graphic Design", "Brand Identity"],
    proposals: 28,
    proposalsCount: 28,
    rating: 4.9,
    category: "تصميم جرافيك",
    status: "active",
    clientId: "client-2",
    clientName: "استوديو الإبداع",
    clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    isUrgent: false,
    isFixed: true,
    createdAt: "2024-01-14T14:20:00Z",
    views: 89,
    featured: false,
  },
  {
    id: "3",
    title: "كتابة محتوى تسويقي للموقع الإلكتروني",
    description: "نحتاج لكاتب محتوى محترف...",
    budget: 1000,
    currency: "$",
    deadline: "10 أيام",
    deadlineDate: "2025-10-05",
    location: "القاهرة، مصر",
    skills: ["Content Writing", "SEO", "Arabic", "Marketing"],
    proposals: 35,
    proposalsCount: 35,
    rating: 4.7,
    category: "كتابة المحتوى",
    status: "active",
    clientId: "client-3",
    clientName: "وكالة التسويق الرقمي",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isUrgent: false,
    isFixed: true,
    createdAt: "2024-01-13T09:15:00Z",
    views: 203,
    featured: true,
  },
];

export const sampleProjectsEN = [
  {
    id: "1",
    title: "E-commerce Mobile App Development",
    description: "We need to develop a comprehensive mobile app...",
    budget: 6500,
    currency: "$",
    deadline: "30 days",
    deadlineDate: "2025-11-30",
    location: "Riyadh, Saudi Arabia",
    skills: ["React Native", "Node.js", "MongoDB"],
    proposals: 12,
    proposalsCount: 12,
    rating: 4.8,
    category: "App Development",
    status: "active",
    clientId: "client-1",
    clientName: "Tech Solutions Inc",
    clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    isUrgent: true,
    isFixed: true,
    createdAt: "2024-01-15T10:30:00Z",
    views: 156,
    featured: true,
  },
  {
    id: "2",
    title: "Complete Brand Identity Design for Startup",
    description: "We need a complete brand identity design...",
    budget: 2000,
    currency: "$",
    deadline: "15 days",
    deadlineDate: "2025-10-20",
    location: "Dubai, UAE",
    skills: ["Graphic Design", "Brand Identity"],
    proposals: 28,
    proposalsCount: 28,
    rating: 4.9,
    category: "Graphic Design",
    status: "active",
    clientId: "client-2",
    clientName: "Creative Studio",
    clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    isUrgent: false,
    isFixed: true,
    createdAt: "2024-01-14T14:20:00Z",
    views: 89,
    featured: false,
  },
  {
    id: "3",
    title: "Marketing Content Writing for Website",
    description: "We need a professional content writer...",
    budget: 1000,
    currency: "$",
    deadline: "10 days",
    deadlineDate: "2025-10-05",
    location: "Cairo, Egypt",
    skills: ["Content Writing", "SEO", "Arabic", "Marketing"],
    proposals: 35,
    proposalsCount: 35,
    rating: 4.7,
    category: "Content Writing",
    status: "active",
    clientId: "client-3",
    clientName: "Digital Marketing Agency",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isUrgent: false,
    isFixed: true,
    createdAt: "2024-01-13T09:15:00Z",
    views: 203,
    featured: true,
  },
];

export const FeaturedProjects = ({ isRTL = false }: FeaturedProjectsProps) => {
  const projects = isRTL ? sampleProjects : sampleProjectsEN;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5" style={{ color: "#0A2540" }}>
            {isRTL ? "مشاريع مميزة" : "Featured Projects"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {isRTL ? "اكتشف المشاريع المميزة والمتنوعة" : "Discover featured and diverse projects"}
          </p>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project as any} isRTL={isRTL} />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link to="/projects">
            <Button className="rounded-full bg-[#0A2540] hover:bg-[#0c315c] text-white px-6">
              {isRTL ? "عرض الكل" : "View All"}
              <ArrowIcon className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

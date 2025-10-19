import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Clock, DollarSign, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/services/user.service";
import { Link } from "react-router-dom";

interface FreelancerCardProps {
  freelancer: {
    id: string;
    name: string;
    title: string;
    avatar?: string;
    rating: number;
    reviewsCount: number;
    hourlyRate: {
      min: number;
      max: number;
      currency: string;
    };
    location: string;
    skills: string[];
    completedJobs: number;
    successRate: number;
    isOnline: boolean;
    isVerified: boolean;
    lastSeen: string;
    description: string;
  };
  isRTL?: boolean;
}

const getInitialsFromName = (name: string): string => {
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0]?.[0] || 'U').toUpperCase();
};

export const FreelancerCard = ({ freelancer, isRTL = false }: FreelancerCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-soft hover:-translate-y-1 h-full flex flex-col bg-white">
      <CardHeader className={cn("space-y-4", isRTL && "text-right")}>
        <div className={cn("flex items-start space-x-4", isRTL && "space-x-reverse")}>
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-[#0A2540]/30">
              <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#0A2540] to-[#0c315c] text-white font-semibold text-sm">
                {getInitialsFromName(freelancer.name)}
              </AvatarFallback>
            </Avatar>

            {/* Online Status */}
            {freelancer.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse flex-row-reverse")}>
              <h3 className="text-lg font-semibold text-[#0A2540] group-hover:text-[#0c315c] transition-colors truncate">
                {freelancer.name}
              </h3>
              {freelancer.isVerified && <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />}
            </div>

            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{freelancer.title}</p>

            <div className={cn("flex items-center space-x-4 text-sm", isRTL && "space-x-reverse")}>
              <div className={cn("flex items-center space-x-1", isRTL && "space-x-reverse")}>
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="font-medium">{freelancer.rating}</span>
                <span className="text-muted-foreground">({freelancer.reviewsCount})</span>
              </div>

              <div className={cn("flex items-center space-x-1 text-muted-foreground", isRTL && "space-x-reverse")}>
                <MapPin className="w-4 h-4" />
                <span className="truncate">{freelancer.location}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {freelancer.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Rate & Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cn("space-y-1", isRTL && "text-right")}>
            <div className="text-sm text-muted-foreground">{isRTL ? "السعر بالساعة" : "Hourly Rate"}</div>
            <div className={cn("flex items-center space-x-1 font-semibold text-[#0A2540]", isRTL && "space-x-reverse")}>
              <DollarSign className="w-4 h-4 text-[#0A2540]" />
              <span>
                {freelancer.hourlyRate.min}-{freelancer.hourlyRate.max}
              </span>
            </div>
          </div>

          <div className={cn("space-y-1", isRTL && "text-right")}>
            <div className="text-sm text-muted-foreground">{isRTL ? "معدل النجاح" : "Success Rate"}</div>
            <div className="font-semibold text-success">{freelancer.successRate}%</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className={cn("space-y-1", isRTL && "text-right")}>
            <div className="text-muted-foreground">{isRTL ? "مشاريع مكتملة" : "Completed Jobs"}</div>
            <div className="font-medium">{freelancer.completedJobs}</div>
          </div>

          <div className={cn("space-y-1", isRTL && "text-right")}>
            <div className="text-muted-foreground">{isRTL ? "آخر ظهور" : "Last Seen"}</div>
            <div className={cn("flex items-center space-x-1 font-medium", isRTL && "space-x-reverse")}>
              <Clock className="w-3 h-3 text-[#0A2540]" />
              <span>{freelancer.lastSeen}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className={cn("text-sm font-medium text-[#0A2540]", isRTL && "text-right")}>
            {isRTL ? "المهارات:" : "Skills:"}
          </div>
          <div className={cn("flex flex-wrap gap-1", isRTL && "justify-end")}>
            {freelancer.skills && freelancer.skills.length > 0 ? (
              <>
                {freelancer.skills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-[#0A2540] text-[#0A2540] bg-[#0A2540]/10"
                  >
                    {skill}
                  </Badge>
                ))}
                {freelancer.skills.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-[#0A2540] text-[#0A2540] bg-[#0A2540]/10"
                  >
                    +{freelancer.skills.length - 3} {isRTL ? "أكثر" : "more"}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs text-gray-500 italic">
                {isRTL ? "لم يتم تحديد المهارات بعد" : "Skills not specified yet"}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t border-[#0A2540]/30">
        {/* View Profile */}
        <Link to={`/user/${freelancer.id}`} className="flex-1">
          <Button
            variant="hero"
            size="sm"
            className="w-full bg-gradient-to-r from-[#0A2540] to-[#0c315c] text-white hover:from-[#0c315c] hover:to-[#0A2540] transition-colors"
          >
            {isRTL ? "عرض الملف الشخصي" : "View Profile"}
          </Button>
        </Link>

        {/* Message */}
        <Link to={`/messages?userId=${freelancer.id}`} className="flex-1">
          <Button
            variant="hero"
            size="sm"
            className="w-full bg-gradient-to-r from-[#0A2540] to-[#0c315c] text-white hover:from-[#0c315c] hover:to-[#0A2540] transition-colors"
          >
            {isRTL ? "رسالة مباشرة" : "Message"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

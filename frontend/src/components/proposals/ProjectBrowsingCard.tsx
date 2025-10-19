import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DollarSign,
  Calendar,
  Eye,
  Users,
  Star,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { ProjectResponse } from '@/types/api';
import { cn } from '@/lib/utils';

interface ProjectBrowsingCardProps {
  project: ProjectResponse;
  isRTL?: boolean;
  onBrowse?: (projectId: string) => void;
}

export const ProjectBrowsingCard: React.FC<ProjectBrowsingCardProps> = ({
  project,
  isRTL = false,
  onBrowse
}) => {
  const formatBudget = (min: number, max: number, currency: string = 'USD') => {
    if (min === max) {
      return `${currency} ${min.toLocaleString()}`;
    }
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const getDeadlineStatus = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: isRTL ? 'انتهت المهلة' : 'Expired', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (days === 0) return { text: isRTL ? 'اليوم' : 'Today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (days <= 3) return { text: `${days}d`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { text: `${days}d`, color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const deadlineStatus = getDeadlineStatus(project.deadline);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-blue-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className={cn("flex items-start justify-between gap-4", isRTL && "flex-row-reverse")}>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-[#0A2540] mb-1 line-clamp-2">
              {project.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          {project.isFeatured && (
            <div className="flex-shrink-0">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {project.skillsRequired?.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {project.skillsRequired && project.skillsRequired.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.skillsRequired.length - 3}
            </Badge>
          )}
        </div>

        <div className={cn("space-y-2 text-sm", isRTL && "text-right")}>
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold">{formatBudget(project.budgetMin, project.budgetMax, project.currency)}</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {project.projectType?.toLowerCase() || 'Fixed'}
            </Badge>
          </div>

          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600">{isRTL ? 'المدة: ' : 'Duration: '}{project.duration}</span>
          </div>

          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 text-xs">{isRTL ? 'الموعد النهائي: ' : 'Deadline: '}{new Date(project.deadline).toLocaleDateString()}</span>
            </div>
            <span className={cn("text-xs font-semibold px-2 py-1 rounded", deadlineStatus.bgColor, deadlineStatus.color)}>
              {deadlineStatus.text}
            </span>
          </div>
        </div>

        <div className={cn("flex items-center gap-3 pt-2 border-t", isRTL && "flex-row-reverse")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={''} alt={project.clientName} />
            <AvatarFallback>{project.clientName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <p className="text-sm font-medium text-gray-800">{project.clientName}</p>
          </div>
          <div className={cn("flex items-center gap-1 text-xs text-gray-500", isRTL && "flex-row-reverse")}>
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>{isRTL ? 'موثق' : 'Verified'}</span>
          </div>
        </div>

        <Button
          onClick={() => onBrowse?.(project.id)}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
        >
          {isRTL ? 'عرض التفاصيل' : 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
};

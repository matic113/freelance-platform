import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  Users, 
  Eye, 
  MoreVertical,
  Calendar,
  Award,
  TrendingUp,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ProjectDetailsModal } from "@/components/modals/ProjectDetailsModal";
import { proposalService } from "@/services/proposal.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    budget: number | {
      min: number;
      max: number;
      currency: string;
    };
    currency?: string;
    deadline: string;
    deadlineDate?: string;
    location: string;
    skills: string[];
    proposals: number;
    proposalsCount?: number;
    rating: number;
    category: string;
    status: string;
    clientId?: string;
    clientName: string;
    clientAvatar?: string;
    isUrgent?: boolean;
    isFixed?: boolean;
    createdAt: string;
    views: number;
    featured?: boolean;
  };
  isRTL?: boolean;
  viewMode?: 'grid' | 'list';
}

export const ProjectCard = ({ project, isRTL = false, viewMode = 'grid' }: ProjectCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Convert project to modal format
  const getModalProject = () => {
    const budgetValue = typeof project.budget === 'number' ? project.budget : (project.budget?.min || 0);
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      budget: budgetValue,
      currency: typeof project.budget === 'number' ? (project.currency || '$') : (project.budget?.currency || '$'),
      deadline: project.deadline,
      status: project.status as 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled',
      skills: project.skills,
      clientId: project.clientId || 'unknown',
      clientName: project.clientName,
      clientAvatar: project.clientAvatar,
      location: project.location,
      createdAt: project.createdAt,
      proposalsCount: project.proposalsCount || project.proposals,
    };
  };

  const formatBudget = () => {
    try {
      // Handle both budget formats: object {min, max, currency} and number
      if (typeof project.budget === 'number') {
        const currency = (project as any).currency || '$';
        return `${currency} ${project.budget.toLocaleString()}`;
      }
      
      if (!project.budget || typeof project.budget !== 'object') {
        return isRTL ? 'غير محدد' : 'Budget not specified';
      }
      
      const budgetObj = project.budget as { min: number; max: number; currency: string };
      if (!budgetObj || typeof budgetObj.min === 'undefined' || typeof budgetObj.max === 'undefined') {
        return isRTL ? 'غير محدد' : 'Budget not specified';
      }
      
      const currency = budgetObj.currency || '$';
      const min = Number(budgetObj.min);
      const max = Number(budgetObj.max);
      
      if (isNaN(min) || isNaN(max)) {
        return isRTL ? 'غير محدد' : 'Budget not specified';
      }
      
      if (min === max) {
        return `${currency} ${min.toLocaleString()}`;
      }
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } catch (error) {
      return isRTL ? 'غير محدد' : 'Budget not specified';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return isRTL ? 'نشط' : 'Active';
      case 'completed':
        return isRTL ? 'مكتمل' : 'Completed';
      case 'cancelled':
        return isRTL ? 'ملغي' : 'Cancelled';
      default:
        return status;
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString || typeof dateString !== 'string') {
      return isRTL ? 'غير محدد' : 'Unknown';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return isRTL ? 'غير محدد' : 'Unknown';
      }
      
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return isRTL ? 'الآن' : 'Now';
      if (diffInHours < 24) return isRTL ? `${diffInHours} ساعة` : `${diffInHours}h`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return isRTL ? `${diffInDays} يوم` : `${diffInDays}d`;
      const diffInWeeks = Math.floor(diffInDays / 7);
      return isRTL ? `${diffInWeeks} أسبوع` : `${diffInWeeks}w`;
    } catch (error) {
      return isRTL ? 'غير محدد' : 'Unknown';
    }
  };

  // Project management functions
  const handleApplyForProject = async () => {
    if (!user || user.userType !== 'FREELANCER') {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يجب أن تكون مستقل لتقديم عرض" : "You must be a freelancer to apply",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    try {
      // This would open a proposal submission modal
      // For now, we'll just show a success message
      setHasApplied(true);
      toast({
        title: isRTL ? "تم التقديم بنجاح" : "Application Submitted",
        description: isRTL ? "تم تقديم عرضك للمشروع بنجاح" : "Your proposal has been submitted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في تقديم العرض" : "Failed to submit proposal",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      await proposalService.acceptProposal(proposalId);
      toast({
        title: isRTL ? "تم القبول" : "Proposal Accepted",
        description: isRTL ? "تم قبول العرض بنجاح" : "Proposal accepted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في قبول العرض" : "Failed to accept proposal",
        variant: "destructive",
      });
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      await proposalService.rejectProposal(proposalId);
      toast({
        title: isRTL ? "تم الرفض" : "Proposal Rejected",
        description: isRTL ? "تم رفض العرض" : "Proposal rejected",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في رفض العرض" : "Failed to reject proposal",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawProposal = async (proposalId: string) => {
    try {
      await proposalService.withdrawProposal(proposalId);
      setHasApplied(false);
      toast({
        title: isRTL ? "تم السحب" : "Proposal Withdrawn",
        description: isRTL ? "تم سحب العرض بنجاح" : "Proposal withdrawn successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في سحب العرض" : "Failed to withdraw proposal",
        variant: "destructive",
      });
    }
  };

  // Check if user can perform actions
  const isFreelancer = user?.userType === 'FREELANCER';
  const isClient = user?.userType === 'CLIENT';
  const isProjectOwner = project.clientId === user?.id;

  if (viewMode === 'list') {
    return (
      <>
        <Card className="group hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Client Avatar */}
              <Avatar className="h-12 w-12">
                <AvatarImage src={project.clientAvatar} />
                <AvatarFallback>
                  {project.clientName?.charAt(0)?.toUpperCase() || 'C'}
                </AvatarFallback>
              </Avatar>

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-[#0A2540] group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      {project.isUrgent && (
                        <Badge variant="destructive" className="text-xs">
                          {isRTL ? "عاجل" : "Urgent"}
                        </Badge>
                      )}
                      {project.featured && (
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          {isRTL ? "مميز" : "Featured"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{formatBudget()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{project.deadline || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>{project.proposals || 0} {isRTL ? "عرض" : "proposals"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span>{project.views || 0} {isRTL ? "مشاهدة" : "views"}</span>
                  </div>
                </div>

                {/* Skills and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {(project.skills || []).slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill || 'Skill'}
                      </Badge>
                    ))}
                    {(project.skills || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(project.skills || []).length - 3}
                      </Badge>
                    )}
                    {(!project.skills || project.skills.length === 0) && (
                      <Badge variant="outline" className="text-xs text-gray-500">
                        {isRTL ? 'لا توجد مهارات' : 'No skills specified'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(project.status || 'unknown')}>
                      {getStatusText(project.status || 'unknown')}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(project.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0A2540] hover:bg-[#142b52]"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isRTL ? "عرض التفاصيل" : "View Details"}
                </Button>
                
                {/* Freelancer Actions */}
                {isFreelancer && !isProjectOwner && (
                  <>
                    {!hasApplied ? (
                      <Button 
                        onClick={handleApplyForProject}
                        disabled={isApplying}
                        variant="outline"
                        size="sm"
                      >
                        {isApplying ? (
                          <>
                            <Send className="h-4 w-4 mr-2 animate-spin" />
                            {isRTL ? "جاري التقديم..." : "Applying..."}
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            {isRTL ? "تقديم عرض" : "Apply"}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          // TODO: Get actual proposal ID from project data
                          toast({
                            title: isRTL ? "معلومة" : "Info",
                            description: isRTL ? "سيتم إضافة وظيفة سحب العرض قريباً" : "Withdraw functionality coming soon",
                            variant: "default",
                          });
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        {isRTL ? "سحب العرض" : "Withdraw"}
                      </Button>
                    )}
                  </>
                )}
                
                {/* Client Actions */}
                {isClient && isProjectOwner && (
                  <div className="flex gap-1">
                    <Button 
                      onClick={() => {
                        // TODO: Get actual proposal ID from project data
                        toast({
                          title: isRTL ? "معلومة" : "Info",
                          description: isRTL ? "سيتم إضافة وظيفة قبول العروض قريباً" : "Accept proposals functionality coming soon",
                          variant: "default",
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {isRTL ? "قبول" : "Accept"}
                    </Button>
                    <Button 
                      onClick={() => {
                        // TODO: Get actual proposal ID from project data
                        toast({
                          title: isRTL ? "معلومة" : "Info",
                          description: isRTL ? "سيتم إضافة وظيفة رفض العروض قريباً" : "Reject proposals functionality coming soon",
                          variant: "default",
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      {isRTL ? "رفض" : "Reject"}
                    </Button>
                  </div>
                )}
                
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {isRTL ? "مراسلة" : "Message"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProjectDetailsModal
          project={getModalProject()}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userType="freelancer"
          isRTL={isRTL}
        />
      </>
    );
  }

  // Grid view (default)
  return (
    <>
      <Card className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft card-gradient hover:-translate-y-1 h-full flex flex-col">
        <CardHeader className={cn("space-y-3", isRTL && "text-right")}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {project.title}
              </h3>
            </div>
            {project.isUrgent && (
              <Badge variant="destructive" className="text-xs">
                {isRTL ? "عاجل" : "Urgent"}
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-medium text-foreground">{formatBudget()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">{project.deadline || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              <span className="text-muted-foreground">{project.location || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground">{project.proposals || 0} {isRTL ? "عرض" : "proposals"}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {(project.skills || []).slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill || 'Skill'}
                </Badge>
              ))}
              {(project.skills || []).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(project.skills || []).length - 3}
                </Badge>
              )}
              {(!project.skills || project.skills.length === 0) && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  {isRTL ? 'لا توجد مهارات' : 'No skills specified'}
                </Badge>
              )}
            </div>
          </div>

          {/* Client Info */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.clientAvatar} />
              <AvatarFallback className="text-xs">
                {project.clientName?.charAt(0)?.toUpperCase() || 'C'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{project.clientName || 'Unknown Client'}</span>
            <div className="flex items-center gap-1 ml-auto">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-sm text-muted-foreground">{project.rating || 0}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(project.status || 'unknown')}>
                {getStatusText(project.status || 'unknown')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {getTimeAgo(project.createdAt)}
              </span>
            </div>
            
          </div>
          
          <div className="space-y-2 mt-3">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#0A2540] hover:bg-[#142b52]"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isRTL ? "عرض التفاصيل" : "View Details"}
            </Button>
            
            {/* Freelancer Actions */}
            {isFreelancer && !isProjectOwner && (
              <>
                {!hasApplied ? (
                  <Button 
                    onClick={handleApplyForProject}
                    disabled={isApplying}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {isApplying ? (
                      <>
                        <Send className="h-4 w-4 mr-2 animate-spin" />
                        {isRTL ? "جاري التقديم..." : "Applying..."}
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {isRTL ? "تقديم عرض" : "Apply for Project"}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      // TODO: Get actual proposal ID from project data
                      toast({
                        title: isRTL ? "معلومة" : "Info",
                        description: isRTL ? "سيتم إضافة وظيفة سحب العرض قريباً" : "Withdraw functionality coming soon",
                        variant: "default",
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    {isRTL ? "سحب العرض" : "Withdraw Proposal"}
                  </Button>
                )}
              </>
            )}
            
            {/* Client Actions */}
            {isClient && isProjectOwner && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    // TODO: Get actual proposal ID from project data
                    toast({
                      title: isRTL ? "معلومة" : "Info",
                      description: isRTL ? "سيتم إضافة وظيفة قبول العروض قريباً" : "Accept proposals functionality coming soon",
                      variant: "default",
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {isRTL ? "قبول" : "Accept"}
                </Button>
                <Button 
                  onClick={() => {
                    // TODO: Get actual proposal ID from project data
                    toast({
                      title: isRTL ? "معلومة" : "Info",
                      description: isRTL ? "سيتم إضافة وظيفة رفض العروض قريباً" : "Reject proposals functionality coming soon",
                      variant: "default",
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  {isRTL ? "رفض" : "Reject"}
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <ProjectDetailsModal
        project={getModalProject()}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userType="freelancer"
        isRTL={isRTL}
      />
    </>
  );
};
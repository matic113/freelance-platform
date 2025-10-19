import { apiService } from './api';

export interface DashboardStats {
  activeProjects: number;
  happyClients: number;
  totalEarnings: number;
  completionRate: number;
  activeProjectsChange?: string;
  happyClientsChange?: string;
  totalEarningsChange?: string;
  completionRateChange?: string;
}

export interface RecentJob {
  id: string;
  title: string;
  client: string;
  status: 'in_progress' | 'completed' | 'pending';
  budget: string;
  deadline: string;
  progress?: number;
  rating?: number;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentJobs: RecentJob[];
  skills: Skill[];
  achievements: Achievement[];
}

class DashboardService {
  private baseUrl = '/analytics';

  // Get comprehensive dashboard data for freelancer
  getFreelancerDashboard = async (): Promise<DashboardData> => {
    try {
      // Get user ID from auth context or token
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      const userType = user.userType;

      console.log('Dashboard - User data:', { userId, userType });

      if (!userId) {
        console.warn('User not authenticated, returning empty data');
        return this.getEmptyDashboardData();
      }

      if (userType !== 'FREELANCER') {
        console.warn('User is not a freelancer, returning empty data');
        return this.getEmptyDashboardData();
      }

      const [recentContracts, recentProposals, profileData] = await Promise.all([
        this.getRecentContracts(),
        this.getRecentProposals(),
        this.getProfileData()
      ]);

      const stats: DashboardStats = {
        activeProjects: (recentContracts as any)?.content?.filter((c: any) => c.status === 'ACTIVE')?.length || 0,
        happyClients: (recentContracts as any)?.content?.length || 0,
        totalEarnings: this.calculateTotalEarnings(recentContracts),
        completionRate: this.calculateCompletionRate(recentContracts)
      };

      const recentJobs = this.transformRecentJobs(recentContracts, recentProposals);
      const skills = this.transformSkills((profileData as any)?.skills || []);
      const achievements = this.generateAchievements(profileData, recentContracts, recentProposals);

      return {
        stats,
        recentJobs,
        skills,
        achievements
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return this.getEmptyDashboardData();
    }
  }

  getClientProjects = async () => {
    try {
      const { projectService } = await import('./project.service');
      return await projectService.getMyProjects(0, 10, 'createdAt,desc');
    } catch (error) {
      console.warn('Client projects endpoint not available');
      return { content: [] };
    }
  }

  getClientContracts = async () => {
    try {
      const { contractService } = await import('./contract.service');
      return await contractService.getMyContracts(0, 10, 'createdAt,desc');
    } catch (error) {
      console.warn('Client contracts endpoint not available');
      return { content: [] };
    }
  }

  getClientProposals = async () => {
    try {
      const { proposalService } = await import('./proposal.service');
      return await proposalService.getReceivedProposals(0, 10, 'submittedAt,desc');
    } catch (error) {
      console.warn('Client proposals endpoint not available');
      return { content: [] };
    }
  }

  // Get dashboard analytics
  private async getDashboardAnalytics(userId: string) {
    try {
      return await apiService.get(`${this.baseUrl}/dashboard/${userId}`);
    } catch (error) {
      console.warn('Dashboard analytics endpoint not available, using fallback data');
      return {
        activeProjects: 0,
        happyClients: 0,
        totalEarnings: 0,
        completionRate: 0
      };
    }
  }

  // Get project statistics
  private async getProjectStats() {
    try {
      return await apiService.get(`${this.baseUrl}/projects/stats`);
    } catch (error) {
      console.warn('Project stats endpoint not available, using fallback data');
      return {
        totalProposals: 0,
        acceptedProposals: 0,
        completedContracts: 0,
        averageContractValue: 0
      };
    }
  }

  // Get freelancer statistics
  private async getFreelancerStats() {
    try {
      return await apiService.get(`${this.baseUrl}/freelancers/stats`);
    } catch (error) {
      console.warn('Freelancer stats endpoint not available, using fallback data');
      return {
        totalContracts: 0,
        activeContracts: 0,
        completedContracts: 0,
        averageRating: 0,
        totalReviews: 0
      };
    }
  }

  // Get earnings analytics
  private async getEarningsAnalytics(userId: string) {
    try {
      return await apiService.get(`${this.baseUrl}/earnings/${userId}`);
    } catch (error) {
      console.warn('Earnings analytics endpoint not available, using fallback data');
      return {
        totalEarnings: 0,
        monthlyEarnings: 0,
        yearlyEarnings: 0,
        averageEarningPerProject: 0
      };
    }
  }

  // Get performance analytics
  private async getPerformanceAnalytics(userId: string) {
    try {
      return await apiService.get(`${this.baseUrl}/performance/${userId}`);
    } catch (error) {
      console.warn('Performance analytics endpoint not available, using fallback data');
      return {
        completionRate: 0,
        averageRating: 0,
        totalReviews: 0,
        responseTime: 0
      };
    }
  }

  // Get recent contracts
  private getRecentContracts = async () => {
    try {
      // Use the existing contract service
      const { contractService } = await import('./contract.service');
      return await contractService.getFreelancerContracts(0, 5, 'createdAt,desc');
    } catch (error) {
      console.warn('Recent contracts endpoint not available, using fallback data');
      return { content: [] };
    }
  }

  // Get recent proposals
  private getRecentProposals = async () => {
    try {
      // Use the existing proposal service
      const { proposalService } = await import('./proposal.service');
      return await proposalService.getMyProposals(0, 5, 'submittedAt,desc');
    } catch (error) {
      console.warn('Recent proposals endpoint not available, using fallback data');
      return { content: [] };
    }
  }

  // Get profile data
  private getProfileData = async () => {
    try {
      // Use the existing freelancer profile service
      const { freelancerProfileService } = await import('./freelancerProfile.service');
      return await freelancerProfileService.getMyProfile();
    } catch (error: any) {
      console.warn('Profile data endpoint not available:', error?.response?.status, error?.message);
      // If it's a 400 error, the user might not be a freelancer, return empty skills
      if (error?.response?.status === 400) {
        console.warn('User is not a freelancer or profile not found - this is expected for non-freelancer users');
      }
      return { skills: [] };
    }
  }

  // Transform recent contracts and proposals into jobs format
  private transformRecentJobs = (contracts: any, proposals: any): RecentJob[] => {
    const jobs: RecentJob[] = [];

    // Add contracts as jobs
    if (contracts?.content) {
      contracts.content.forEach((contract: any) => {
        jobs.push({
          id: contract.id,
          title: contract.projectTitle || 'Contract Work',
          client: contract.clientName || 'Client',
          status: this.mapContractStatus(contract.status),
          budget: `$${contract.totalAmount || 0}`,
          deadline: contract.deadline || new Date().toISOString().split('T')[0],
          progress: contract.progress || 0,
          rating: contract.rating || undefined
        });
      });
    }

    // Add proposals as pending jobs
    if (proposals?.content) {
      proposals.content.forEach((proposal: any) => {
        if (proposal.status === 'PENDING') {
          jobs.push({
            id: proposal.id,
            title: proposal.projectTitle || 'Proposed Work',
            client: proposal.clientName || 'Client',
            status: 'pending',
            budget: `$${proposal.proposedAmount || 0}`,
            deadline: proposal.deadline || new Date().toISOString().split('T')[0]
          });
        }
      });
    }

    // Sort by date and limit to 5
    return jobs
      .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
      .slice(0, 5);
  }

  // Transform skills data
  private transformSkills = (skills: string[]): Skill[] => {
    // For now, assign random levels to skills
    // In a real app, this would come from the backend
    return skills.map(skill => ({
      name: skill,
      level: Math.floor(Math.random() * 30) + 70 // Random level between 70-100
    }));
  }

  // Calculate total earnings from contracts
  private calculateTotalEarnings = (contracts: any): number => {
    if (!contracts?.content) return 0;
    return contracts.content.reduce((total: number, contract: any) => {
      return total + (contract.totalAmount || 0);
    }, 0);
  }

  // Calculate completion rate from contracts
  private calculateCompletionRate = (contracts: any): number => {
    if (!contracts?.content || contracts.content.length === 0) return 0;
    const completed = contracts.content.filter((c: any) => c.status === 'COMPLETED').length;
    return Math.round((completed / contracts.content.length) * 100);
  }

  // Generate achievements based on profile and stats
  private generateAchievements = (profile: any, contracts: any, proposals: any): Achievement[] => {
    const achievements: Achievement[] = [];

    const contractCount = contracts?.content?.length || 0;
    const proposalCount = proposals?.content?.length || 0;

    if (contractCount >= 5) {
      achievements.push({
        id: '1',
        title: 'Project Master',
        description: 'Completed 5+ projects successfully',
        icon: 'CheckCircle',
        date: new Date().toISOString()
      });
    }

    if (proposalCount >= 10) {
      achievements.push({
        id: '2',
        title: 'Active Freelancer',
        description: 'Submitted 10+ proposals',
        icon: 'Star',
        date: new Date().toISOString()
      });
    }

    if (contractCount >= 1) {
      achievements.push({
        id: '3',
        title: 'Getting Started',
        description: 'Completed your first project',
        icon: 'Award',
        date: new Date().toISOString()
      });
    }

    return achievements;
  }

  // Map contract status to job status
  private mapContractStatus = (status: string): 'in_progress' | 'completed' | 'pending' => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'IN_PROGRESS':
        return 'in_progress';
      case 'COMPLETED':
        return 'completed';
      default:
        return 'pending';
    }
  }

  // Calculate percentage change
  private calculateChange = (current: number, previous: number): string => {
    if (!previous || previous === 0) return '+0';
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${Math.round(change)}` : `${Math.round(change)}`;
  }

  // Calculate earnings change
  private calculateEarningsChange = (total: number, monthly: number): string => {
    if (!monthly || monthly === 0) return '+$0';
    return `+$${Math.round(monthly)}`;
  }

  // Get default dashboard data - returns empty data only when no real data available
  private getEmptyDashboardData = (): DashboardData => {
    return {
      stats: {
        activeProjects: 0,
        happyClients: 0,
        totalEarnings: 0,
        completionRate: 0
      },
      recentJobs: [],
      skills: [],
      achievements: []
    };
  }
}

export const dashboardService = new DashboardService();

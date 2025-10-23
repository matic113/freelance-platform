import { apiService } from './api';

export interface FreelancerDashboardStats {
  totalEarnings: number;
  activeProjects: number;
  proposalSuccessRate: number;
  rating: number;
  completionRate: number;
  totalProposals: number;
  acceptedProposals: number;
  totalContracts: number;
}

export interface ContractItem {
  id: string;
  projectTitle: string;
  clientName: string;
  status: string;
  totalAmount: number;
  endDate: string;
  createdAt: string;
}

export interface ProposalItem {
  id: string;
  projectTitle: string;
  clientName: string;
  status: string;
  proposedAmount: number;
  description: string;
  submittedAt: string;
}

export interface FreelancerDashboardResponse {
  stats: FreelancerDashboardStats;
  activeContracts: ContractItem[];
  completedContracts: ContractItem[];
  recentProposals: ProposalItem[];
}

class FreelancerDashboardService {
  private baseUrl = '/analytics';

  getFreelancerDashboard = async (): Promise<FreelancerDashboardResponse> => {
    return await apiService.get<FreelancerDashboardResponse>(`${this.baseUrl}/freelancer-dashboard`);
  }
}

export const freelancerDashboardService = new FreelancerDashboardService();

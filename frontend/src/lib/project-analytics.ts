import { ProjectResponse, ProposalResponse } from '@/types/api';

export interface ProposalStats {
  totalProposals: number;
  acceptanceRate: number;
  averageProposedAmount: number;
  acceptedCount: number;
  rejectedCount: number;
  pendingCount: number;
}

export interface ProjectMetrics {
  totalProjects: number;
  draftCount: number;
  publishedCount: number;
  inProgressCount: number;
  completedCount: number;
}

/**
 * Calculate proposal statistics across all projects
 */
export function calculateProposalStats(proposals: ProposalResponse[]): ProposalStats {
  if (proposals.length === 0) {
    return {
      totalProposals: 0,
      acceptanceRate: 0,
      averageProposedAmount: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
    };
  }

  const acceptedCount = proposals.filter(p => p.status === 'ACCEPTED').length;
  const rejectedCount = proposals.filter(p => p.status === 'REJECTED').length;
  const pendingCount = proposals.filter(p => p.status === 'PENDING').length;

  // Handle both proposedBudget and proposedAmount field names (API might return either)
  const totalAmount = proposals.reduce((sum, p) => {
    const amount = (p as any).proposedAmount || p.proposedBudget || 0;
    return sum + (typeof amount === 'number' ? amount : 0);
  }, 0);
  const averageProposedAmount = proposals.length > 0 ? totalAmount / proposals.length : 0;

  const acceptanceRate = proposals.length > 0 ? (acceptedCount / proposals.length) * 100 : 0;

  return {
    totalProposals: proposals.length,
    acceptanceRate: Math.round(acceptanceRate * 100) / 100,
    averageProposedAmount: Math.round(averageProposedAmount * 100) / 100,
    acceptedCount,
    rejectedCount,
    pendingCount,
  };
}

/**
 * Calculate project metrics from projects list
 */
export function calculateProjectMetrics(projects: ProjectResponse[]): ProjectMetrics {
  return {
    totalProjects: projects.length,
    draftCount: projects.filter(p => p.status === 'DRAFT').length,
    publishedCount: projects.filter(p => p.status === 'PUBLISHED').length,
    inProgressCount: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completedCount: projects.filter(p => p.status === 'COMPLETED').length,
  };
}

/**
 * Get proposals for a specific project
 */
export function getProjectProposals(
  allProposals: ProposalResponse[],
  projectId: string
): ProposalResponse[] {
  const projectIdNum = parseInt(projectId, 10);
  return allProposals.filter(p => p.projectId === projectIdNum);
}

/**
 * Calculate stats for a specific project
 */
export function getProjectStats(
  project: ProjectResponse,
  allProposals: ProposalResponse[]
): ProposalStats {
  const projectProposals = getProjectProposals(allProposals, project.id);
  return calculateProposalStats(projectProposals);
}

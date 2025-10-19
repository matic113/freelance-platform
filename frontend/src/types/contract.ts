// Contract and Milestone Management Types

export interface Contract {
  id: string;
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  proposalId: string;
  title: string;
  description: string;
  totalAmount: number;
  currency: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  contractId: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  completedDate?: string;
  paidDate?: string;
  orderIndex: number;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  contractId: string;
  milestoneId: string;
  freelancerId: string;
  freelancerName: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: PaymentRequestStatus;
  description: string;
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
  rejectionReason?: string;
  paymentMethod?: string;
  gatewayTransactionId?: string;
}

export enum ContractStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID'
}

export enum PaymentRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

// API Request Types
export interface CreateContractRequest {
  proposalId: string;
  title: string;
  description: string;
  totalAmount: number;
  currency?: string;
  startDate: string;
  endDate: string;
}

export interface CreateMilestoneRequest {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  orderIndex: number;
}

export interface UpdateMilestoneRequest {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  orderIndex?: number;
}

export interface CreatePaymentRequestRequest {
  contractId: string;
  milestoneId: string;
  amount: number;
  currency?: string;
  description: string;
}

// API Response Types
export interface ContractResponse {
  id: string;
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  proposalId: string;
  title: string;
  description: string;
  totalAmount: number;
  currency: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  milestones?: MilestoneResponse[];
}

export interface MilestoneResponse {
  id: string;
  contractId: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  completedDate?: string;
  paidDate?: string;
  orderIndex: number;
  createdAt: string;
}

export interface PaymentResponse {
  id: string;
  contractId: string;
  milestoneId: string;
  freelancerId: string;
  freelancerName: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: PaymentRequestStatus;
  description: string;
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
  rejectionReason?: string;
  paymentMethod?: string;
  gatewayTransactionId?: string;
}

// Page Response Types
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
   size: number;
   number: number;
}

// Proposal Types
export interface Proposal {
   id: string;
   projectId: string;
   projectTitle: string;
   freelancerId: string;
   freelancerName: string;
   description: string;
   proposedAmount: number;
   estimatedDuration: number;
   status: string;
   submittedAt: string;
   updatedAt?: string;
   attachments?: string[];
   rejectionReason?: string;
}
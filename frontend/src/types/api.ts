// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Enums
export enum UserType {
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER',
  ADMIN = 'ADMIN'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY'
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum ContractStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  TERMINATED = 'TERMINATED'
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export enum PaymentRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

export enum NotificationType {
  PROJECT_PUBLISHED = 'PROJECT_PUBLISHED',
  PROPOSAL_RECEIVED = 'PROPOSAL_RECEIVED',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
  CONTRACT_CREATED = 'CONTRACT_CREATED',
  MILESTONE_CREATED = 'MILESTONE_CREATED',
  MILESTONE_COMPLETED = 'MILESTONE_COMPLETED',
  PAYMENT_REQUEST = 'PAYMENT_REQUEST',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED'
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  roles: UserType[];
  activeRole?: UserType | null;
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  roles: UserType[];
  activeRole?: UserType | null;
  phone?: string;
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  skills?: string[];
  hourlyRate?: number;
}

export interface AdminDashboardStats {
  label: string;
  value: number | string;
  delta?: number | string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface AdminRecentUser {
  id: string;
  fullName: string;
  email: string;
  roles: UserType[];
  createdAt: string;
}

export interface AdminRecentProject {
  id: string;
  title: string;
  status: ProjectStatus;
  clientName: string;
  budget: number;
  createdAt: string;
}

export interface AdminRecentContract {
  id: string;
  projectTitle: string;
  freelancerName: string;
  status: ContractStatus;
  totalAmount: number;
  createdAt: string;
}

export interface AdminDashboardResponse {
  totalUsers: number;
  totalClients: number;
  totalFreelancers: number;
  activeUsers: number;
  verifiedUsers: number;
  totalProjects: number;
  publishedProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  featuredProjects: number;
  totalProposals: number;
  pendingProposals: number;
  acceptedProposals: number;
  rejectedProposals: number;
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  disputedContracts: number;
  totalTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  totalMessages: number;
  unreadMessages: number;
  totalNotifications: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalRevenue: number;
  recentUsers: AdminRecentUser[];
  recentProjects: AdminRecentProject[];
  recentContracts: AdminRecentContract[];
}

export interface AnalyticsSeries<TValue = number> {
  data: Record<string, TValue>;
  total: number;
  period: string;
}

export interface PerformanceMetrics {
  userActivationRate: number;
  projectCompletionRate: number;
  proposalAcceptanceRate: number;
  transactionSuccessRate: number;
}

// Skills Types
export interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreelancerSkill {
  id: string;
  skill: Skill;
  proficiencyLevel: number; // 1-5 scale
  description?: string;
  createdAt: string;
}

export interface AddSkillRequest {
  skillName: string;
  proficiencyLevel: number;
  description?: string;
}

export interface UpdateSkillRequest {
  proficiencyLevel: number;
  description?: string;
}

// Portfolio Types
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrls?: string[]; // Changed from single imageUrl to array of imageUrls
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string;
  projectDate?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddPortfolioRequest {
  title: string;
  description: string;
  imageUrls?: string[]; // Changed from single imageUrl to array of imageUrls
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string;
  projectDate?: string;
  isFeatured?: boolean;
}

export interface NotificationSettingsResponse {
  id: string;
  userId: string;
  emailNewProposals: boolean;
  emailNewMessages: boolean;
  emailPayments: boolean;
  emailNewReviews: boolean;
  emailSystemNotifications: boolean;
  emailMarketingEmails: boolean;
  pushNewProposals: boolean;
  pushNewMessages: boolean;
  pushPayments: boolean;
  pushNewReviews: boolean;
  pushSystemNotifications: boolean;
  emailFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER';
  pushFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsRequest {
  emailNewProposals?: boolean;
  emailNewMessages?: boolean;
  emailPayments?: boolean;
  emailNewReviews?: boolean;
  emailSystemNotifications?: boolean;
  emailMarketingEmails?: boolean;
  pushNewProposals?: boolean;
  pushNewMessages?: boolean;
  pushPayments?: boolean;
  pushNewReviews?: boolean;
  pushSystemNotifications?: boolean;
  emailFrequency?: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER';
  pushFrequency?: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'NEVER';
}

export interface BillingSettingsResponse {
  id: string;
  userId: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  country?: string;
  autoRenewal: boolean;
  billingEmail?: string;
  taxId?: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBillingSettingsRequest {
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  country?: string;
  autoRenewal?: boolean;
  billingEmail?: string;
  taxId?: string;
  companyName?: string;
}

export interface PaymentMethodResponse {
  id: string;
  userId: string;
  cardLastFour: string;
  cardBrand: string;
  cardType: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddPaymentMethodRequest {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
}

// Notification Types
export interface NotificationResponse {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: string;
  data?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  highPriorityNotifications: number;
  todayNotifications: number;
}

export interface CreateNotificationRequest {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: string;
  data?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
  activeRole: UserType;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserType[];
  activeRole?: UserType | null;
  isVerified: boolean;
  createdAt: string;
}

export interface GoogleAuthResponse {
  auth: AuthResponse;
  requiresRoleSelection: boolean;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  requirements: string;
  budget: number;
  projectType: ProjectType;
  status: ProjectStatus;
  skills: string[];
  clientId: string;
  client: UserResponse;
  freelancerId?: string;
  freelancer?: UserResponse;
  attachments: ProjectAttachment[];
  proposals: Proposal[];
  contract?: Contract;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  budgetMin: number;
  budgetMax: number;
  currency: string;
  projectType: ProjectType;
  duration: string;
  status: ProjectStatus;
  isFeatured: boolean;
  deadline: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  attachments: ProjectAttachment[];
}

export interface ProjectAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  budgetMin: number;
  budgetMax: number;
  currency: string;
  projectType: ProjectType;
  duration: string;
  deadline: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  category?: string;
  skillsRequired?: string[];
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  projectType?: ProjectType;
  duration?: string;
  deadline?: string;
}

export interface ProjectSearchRequest {
  searchTerm?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  projectType?: ProjectType;
  page?: number;
  size?: number;
  sort?: string;
}

// Proposal Types
export interface Proposal {
  id: number;
  projectId: number;
  project: ProjectResponse;
  freelancerId: number;
  freelancer: UserResponse;
  coverLetter: string;
  proposedBudget: number;
  estimatedDuration: number;
  status: ProposalStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface ProposalResponse {
  id: number;
  projectId: number;
  project: ProjectResponse;
  freelancerId: number;
  freelancer: UserResponse;
  coverLetter: string;
  proposedBudget: number;
  estimatedDuration: number;
  status: ProposalStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface SubmitProposalRequest {
  projectId: number;
  coverLetter: string;
  proposedBudget: number;
  estimatedDuration: number;
}

export interface UpdateProposalRequest {
  coverLetter?: string;
  proposedBudget?: number;
  estimatedDuration?: number;
}

// Contract Types
export interface Contract {
  id: number;
  projectId: number;
  project: ProjectResponse;
  clientId: number;
  client: UserResponse;
  freelancerId: number;
  freelancer: UserResponse;
  totalAmount: number;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  milestones: Milestone[];
  paymentRequests: PaymentRequest[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractResponse {
  id: number;
  projectId: number;
  project: ProjectResponse;
  clientId: number;
  client: UserResponse;
  freelancerId: number;
  freelancer: UserResponse;
  totalAmount: number;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  milestones: Milestone[];
  paymentRequests: PaymentRequest[];
  createdAt: string;
  updatedAt: string;
}

// Milestone Types
export interface Milestone {
  id: number;
  contractId: number;
  contract: ContractResponse;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneResponse {
  id: number;
  contractId: number;
  contract: ContractResponse;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMilestoneRequest {
  contractId: number;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
}

export interface UpdateMilestoneRequest {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
}

// Payment Types
export interface PaymentRequest {
  id: number;
  contractId: number;
  contract: ContractResponse;
  milestoneId?: number;
  milestone?: MilestoneResponse;
  amount: number;
  description: string;
  status: PaymentRequestStatus;
  requestedAt: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequestResponse {
  id: number;
  contractId: number;
  contract: ContractResponse;
  milestoneId?: number;
  milestone?: MilestoneResponse;
  amount: number;
  description: string;
  status: PaymentRequestStatus;
  requestedAt: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  id: string;
  contractId: string;
  milestoneId?: string;
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

export interface CreatePaymentRequestRequest {
  contractId: string;
  milestoneId?: string;
  amount: number;
  description: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  sender: UserResponse;
  recipientId: string;
  recipient: UserResponse;
  content: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface MessageResponse {
  id: string;
  senderId: string;
  sender: UserResponse;
  recipientId: string;
  recipient: UserResponse;
  content: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface SendMessageRequest {
  recipientId: string;
  content: string;
  projectId?: string | null;
}

// Conversation Types
export interface ConversationResponse {
  id: string;
  type: 'DIRECT_MESSAGE' | 'PROJECT_CHAT';
  lastMessageAt: string;
  lastMessagePreview: string;
  createdAt: string;
  otherParticipantId: string;
  otherParticipantName: string;
  otherParticipantEmail: string;
  otherParticipantAvatar?: string;
  unreadCount?: number;
  isBlocked?: boolean;
  projectId?: string;
  projectTitle?: string;
}

// Notification Types
export interface Notification {
  id: number;
  userId: number;
  user: UserResponse;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: number;
  relatedEntityType?: string;
  createdAt: string;
  readAt?: string;
}


// Review Types
export interface Review {
  id: number;
  reviewerId: number;
  reviewer: UserResponse;
  revieweeId: number;
  reviewee: UserResponse;
  projectId: number;
  project: ProjectResponse;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
   id: string;
   contractId: string;
   reviewerId: string;
   reviewerName: string;
   revieweeId: string;
   revieweeName: string;
   rating: number;
   comment: string;
   additionalFeedback?: string;
   projectName: string;
   projectCategory?: string;
   createdAt: string;
   updatedAt?: string;
}

export interface CreateReviewRequest {
  contractId: string;
  rating: number;
  comment: string;
  additionalFeedback?: string;
}

// Report Types
export interface Report {
  id: number;
  reporterId: number;
  reporter: UserResponse;
  reportedUserId?: number;
  reportedUser?: UserResponse;
  reportedProjectId?: number;
  reportedProject?: ProjectResponse;
  reason: string;
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  updatedAt: string;
}

export interface ReportResponse {
  id: number;
  reporterId: number;
  reporter: UserResponse;
  reportedUserId?: number;
  reportedUser?: UserResponse;
  reportedProjectId?: number;
  reportedProject?: ProjectResponse;
  reason: string;
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  reportedUserId?: number;
  reportedProjectId?: number;
  reason: string;
  description: string;
}

// Statistics Types
export interface UserStatistics {
  totalProjects: number;
  completedProjects: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  activeContracts: number;
  completedContracts: number;
}

export interface ClientStatistics {
  totalProjectsCreated: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  activeContracts: number;
  completedContracts: number;
}

export interface FreelancerStatistics {
  totalProposalsSubmitted: number;
  acceptedProposals: number;
  totalProjectsCompleted: number;
  totalEarnings: number;
  averageRating: number;
  activeContracts: number;
  completedContracts: number;
}

// File Upload Types
export interface FileUploadResponse {
  fileName: string;
  originalFileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  details?: Record<string, any>;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'MESSAGE' | 'NOTIFICATION' | 'PROJECT_UPDATE' | 'PROPOSAL_UPDATE' | 'CONTRACT_UPDATE';
  data: any;
  timestamp: string;
}

export interface WebSocketNotification {
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export enum FAQCategory {
  GENERAL = 'GENERAL',
  ACCOUNT = 'ACCOUNT',
  PROJECTS = 'PROJECTS',
  PAYMENTS = 'PAYMENTS',
  TECHNICAL = 'TECHNICAL',
  BILLING = 'BILLING',
  SECURITY = 'SECURITY',
  FEATURES = 'FEATURES'
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category: FAQCategory;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  category?: FAQCategory;
  displayOrder?: number;
  isActive?: boolean;
}

# Complete Flow Architecture: Project Creation to Job Completion

## Overview
This document provides a comprehensive mapping of all components involved in the freelancer platform workflow from project creation through job completion, including payments and reviews.

---

## 1. PROJECT CREATION FLOW

### 1.1 Frontend Components
- **Page:** `frontend/src/pages/CreateProject.tsx`
  - UI for creating new projects with draft/publish features
  - Form validation for project details
  - Tabs for managing multiple projects

- **Hook:** `frontend/src/hooks/useProjects.ts`
  - `useCreateProject()` - Creates new project
  - `useMyProjects()` - Fetches user's projects
  - `useUpdateProject()` - Updates project details
  - `useDeleteProject()` - Deletes draft projects
  - `usePublishProject()` - Publishes project to marketplace
  - `useUnpublishProject()` - Unpublishes project

- **Service:** `frontend/src/services/project.service.ts`
  - `createProject(data)` - POST `/api/projects`
  - `updateProject(id, data)` - PUT `/api/projects/{id}`
  - `deleteProject(id)` - DELETE `/api/projects/{id}`
  - `publishProject(id)` - POST `/api/projects/{id}/publish`
  - `unpublishProject(id)` - POST `/api/projects/{id}/unpublish`
  - `getMyProjects()` - GET `/api/projects/my-projects`
  - `searchProjects()` - Search published projects

### 1.2 Backend API Endpoints

**Controller:** `backend/src/main/java/com/freelance/platform/controller/ProjectController.java`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/projects` | POST | Create new project | CLIENT |
| `/api/projects/{id}` | GET | Get project by ID | PUBLIC |
| `/api/projects/{id}` | PUT | Update project (draft only) | CLIENT |
| `/api/projects/{id}` | DELETE | Delete project (draft only) | CLIENT |
| `/api/projects/{id}/publish` | POST | Publish project | CLIENT |
| `/api/projects/{id}/unpublish` | POST | Unpublish project | CLIENT |
| `/api/projects/my-projects` | GET | Get user's projects | CLIENT |
| `/api/projects/search` | GET | Search projects | PUBLIC |
| `/api/projects/{id}/proposals` | GET | Get project proposals | CLIENT |

### 1.3 Backend Services & Logic

**Service:** `backend/src/main/java/com/freelance/platform/service/ProjectService.java`
- `createProject()` - Validates client role, creates project in DRAFT status
- `updateProject()` - Allows updates only on DRAFT projects
- `publishProject()` - Transitions from DRAFT to PUBLISHED
- `unpublishProject()` - Transitions from PUBLISHED to DRAFT
- `deleteProject()` - Soft/hard delete only for DRAFT projects
- `searchProjects()` - Filter by skills, budget, category, etc.

### 1.4 Data Model

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Project.java`
```
- id (UUID)
- client (User) - ManyToOne relationship
- title, description, category
- skillsRequired (ElementCollection)
- budgetMin, budgetMax (BigDecimal)
- currency (String)
- projectType (Enum: FIXED_PRICE, HOURLY)
- duration (String)
- status (Enum: DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED)
- isFeatured (Boolean)
- deadline (LocalDate)
- createdAt, updatedAt (LocalDateTime)
- attachments (OneToMany relationship to ProjectAttachment)
```

**Related Entities:**
- `ProjectStatus.java` - Enum for project states
- `ProjectType.java` - Enum for project types
- `ProjectAttachment.java` - File attachments for projects

**Repository:** `backend/src/main/java/com/freelance/platform/repository/ProjectRepository.java`
- `findByClientId()` - Get all projects by client
- `findByStatus()` - Filter by status
- `findBySkillsRequired()` - Search by skills

---

## 2. PROPOSAL/APPLICATION FLOW

### 2.1 Frontend Components

- **Page:** `frontend/src/pages/AvailableProjects.tsx`
  - Displays list of published projects available for proposals
  - Project filtering and search

- **Page:** `frontend/src/pages/ProjectDetails.tsx`
  - Freelancer views detailed project information
  - Shows existing proposals
  - UI to submit new proposal

- **Page:** `frontend/src/pages/MyProposals.tsx`
  - Freelancer views all their submitted proposals
  - Shows proposal status and timeline
  - Option to update/withdraw proposals

- **Page:** `frontend/src/pages/Proposals.tsx`
  - Client views all proposals received for their projects
  - Can accept/reject proposals

- **Hook:** `frontend/src/hooks/useProposals.ts`
  - `useSubmitProposal()` - Submits new proposal
  - `useGetProposal()` - Fetches single proposal
  - `useUpdateProposal()` - Updates pending proposal
  - `useDeleteProposal()` - Deletes proposal
  - `useAcceptProposal()` - Client accepts proposal
  - `useRejectProposal()` - Client rejects proposal
  - `useGetMyProposals()` - Freelancer's proposals
  - `useGetProjectProposals()` - Get proposals for project

- **Service:** `frontend/src/services/proposal.service.ts`
  - `submitProposal(data)` - POST `/api/proposals`
  - `updateProposal(id, data)` - PUT `/api/proposals/{id}`
  - `deleteProposal(id)` - DELETE `/api/proposals/{id}`
  - `acceptProposal(id)` - POST `/api/proposals/{id}/accept`
  - `rejectProposal(id)` - POST `/api/proposals/{id}/reject`
  - `withdrawProposal(id)` - POST `/api/proposals/{id}/withdraw`
  - `getMyProposals()` - GET `/api/proposals/my-proposals`
  - `getProjectProposals()` - GET `/api/proposals/project/{projectId}`

### 2.2 Backend API Endpoints

**Controller:** `backend/src/main/java/com/freelance/platform/controller/ProposalController.java`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/proposals` | POST | Submit proposal | FREELANCER |
| `/api/proposals/{id}` | GET | Get proposal details | PUBLIC |
| `/api/proposals/{id}` | PUT | Update proposal (pending only) | FREELANCER |
| `/api/proposals/{id}` | DELETE | Delete proposal (pending only) | FREELANCER |
| `/api/proposals/{id}/accept` | POST | Accept proposal | CLIENT |
| `/api/proposals/{id}/reject` | POST | Reject proposal | CLIENT |
| `/api/proposals/{id}/withdraw` | POST | Withdraw proposal | FREELANCER |
| `/api/proposals/my-proposals` | GET | Get freelancer's proposals | FREELANCER |
| `/api/proposals/project/{id}` | GET | Get project proposals | CLIENT |

### 2.3 Backend Services & Logic

**Service:** `backend/src/main/java/com/freelance/platform/service/ProposalService.java`
- `submitProposal()` - Validates: freelancer role, project is PUBLISHED, no duplicate proposal
- `updateProposal()` - Updates proposal if status is PENDING
- `acceptProposal()` - Client accepts proposal, triggers contract creation notification
- `rejectProposal()` - Client rejects proposal, notifies freelancer
- `withdrawProposal()` - Freelancer withdraws proposal

**Notifications:** Email/in-app notifications sent on:
- New proposal received (to client)
- Proposal accepted (to freelancer)
- Proposal rejected (to freelancer)

### 2.4 Data Model

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Proposal.java`
```
- id (UUID)
- project (Project) - ManyToOne
- freelancer (User) - ManyToOne
- client (User) - ManyToOne
- title, description (String)
- proposedAmount (BigDecimal)
- currency (String)
- estimatedDuration (String)
- status (Enum: PENDING, ACCEPTED, REJECTED, WITHDRAWN)
- submittedAt (LocalDateTime)
- respondedAt (LocalDateTime)
- attachments (OneToMany to ProposalAttachment)
```

**ProposalStatus Enum:**
- PENDING - Initial state after submission
- ACCEPTED - Client has accepted the proposal
- REJECTED - Client has rejected the proposal
- WITHDRAWN - Freelancer has withdrawn the proposal

**Repository:** `backend/src/main/java/com/freelance/platform/repository/ProposalRepository.java`
- `findByFreelancerId()` - Get freelancer's proposals
- `findByProjectId()` - Get project's proposals
- `findByStatus()` - Filter by status
- `existsByProjectAndFreelancer()` - Check duplicate proposals

---

## 3. PROPOSAL ACCEPTANCE & CONTRACT CREATION FLOW

### 3.1 Frontend Components

- **Page:** `frontend/src/pages/Contracts.tsx`
  - Client and freelancer view their contracts
  - Shows contract status and milestones
  - Accept/reject/complete contract actions

- **Page:** `frontend/src/pages/ClientProjectDetails.tsx`
  - Client reviews project proposals
  - Views accepted proposals and contracts

- **Page:** `frontend/src/pages/ContractManagement.tsx`
  - Manage active contracts
  - Milestone tracking
  - Payment release actions

- **Hook:** `frontend/src/hooks/useContracts.ts`
  - `useCreateContract()` - Creates contract from accepted proposal
  - `useGetContract()` - Fetches contract details
  - `useAcceptContract()` - Freelancer accepts contract
  - `useRejectContract()` - Freelancer rejects contract
  - `useCompleteContract()` - Mark contract as complete
  - `useGetMyContracts()` - Client's contracts
  - `useGetFreelancerContracts()` - Freelancer's contracts
  - `useMilestones()` - Milestone operations

- **Service:** `frontend/src/services/contract.service.ts`
  - `createContract(request)` - POST `/api/contracts`
  - `acceptContract(id)` - POST `/api/contracts/{id}/accept`
  - `rejectContract(id)` - POST `/api/contracts/{id}/reject`
  - `completeContract(id)` - POST `/api/contracts/{id}/complete`
  - `getMyContracts()` - GET `/api/contracts/my-contracts`
  - `getFreelancerContracts()` - GET `/api/contracts/freelancer-contracts`
  - Milestone management endpoints

### 3.2 Backend API Endpoints

**Controller:** `backend/src/main/java/com/freelance/platform/controller/ContractController.java`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/contracts` | POST | Create contract from proposal | CLIENT |
| `/api/contracts/{id}` | GET | Get contract details | BOTH |
| `/api/contracts/{id}/accept` | POST | Accept contract | FREELANCER |
| `/api/contracts/{id}/reject` | POST | Reject contract | FREELANCER |
| `/api/contracts/{id}/complete` | POST | Mark contract complete | CLIENT |
| `/api/contracts/my-contracts` | GET | Get client's contracts | CLIENT |
| `/api/contracts/freelancer-contracts` | GET | Get freelancer's contracts | FREELANCER |
| `/api/contracts/{id}/milestones` | GET | Get contract milestones | BOTH |
| `/api/contracts/{id}/milestone` | POST | Create milestone | CLIENT |
| `/api/contracts/{id}/milestone/{milestoneId}` | PUT | Update milestone | CLIENT |
| `/api/contracts/{id}/milestone/{milestoneId}/approve` | POST | Approve milestone | CLIENT |
| `/api/contracts/{id}/milestone/{milestoneId}/complete` | POST | Mark milestone complete | FREELANCER |

### 3.3 Backend Services & Logic

**Service:** `backend/src/main/java/com/freelance/platform/service/ContractService.java`
- `createContract()` - Creates contract from accepted proposal, sets status to PENDING
- `acceptContract()` - Freelancer accepts, contract moves to ACTIVE
- `rejectContract()` - Freelancer rejects, contract stays PENDING
- `completeContract()` - Client marks contract complete
- `cancelContract()` - Either party can cancel under certain conditions

**Milestone Service Logic:**
- Create milestones with deliverables and amounts
- Approve milestone completion
- Trigger payments upon milestone completion

### 3.4 Data Model

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Contract.java`
```
- id (UUID)
- project (Project) - ManyToOne
- client (User) - ManyToOne
- freelancer (User) - ManyToOne
- proposal (Proposal) - ManyToOne
- title, description (String)
- totalAmount (BigDecimal)
- currency (String)
- status (Enum)
- startDate (LocalDate)
- endDate (LocalDate)
- createdAt, updatedAt (LocalDateTime)
- milestones (OneToMany relationship to Milestone)
- transactions (OneToMany relationship to Transaction)
```

**ContractStatus Enum:**
- PENDING - Awaiting freelancer acceptance
- ACTIVE - Accepted and in progress
- COMPLETED - Work complete, final payment released
- CANCELLED - Cancelled before completion
- DISPUTED - In dispute resolution

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Milestone.java`
```
- id (UUID)
- contract (Contract) - ManyToOne
- title, description (String)
- amount (BigDecimal)
- dueDate (LocalDate)
- status (Enum: PENDING, IN_PROGRESS, COMPLETED, APPROVED)
- createdAt, updatedAt (LocalDateTime)
```

**Repository:** `backend/src/main/java/com/freelance/platform/repository/ContractRepository.java`
- `findByClientId()` - Get client contracts
- `findByFreelancerId()` - Get freelancer contracts
- `findByStatus()` - Filter by status
- `findByProjectId()` - Get contracts for project

---

## 4. JOB COMPLETION & PAYMENT FLOW

### 4.1 Frontend Components

- **Page:** `frontend/src/pages/ContractManagement.tsx`
  - Complete contract/milestones
  - Request and process payments

- **Hook:** `frontend/src/hooks/usePayments.ts`
  - `useCreatePaymentRequest()` - Request payment
  - `useGetPaymentRequests()` - View payment history
  - `useApprovePayment()` - Approve payment release

- **Service:** `frontend/src/services/payment.service.ts`
  - `createPaymentRequest(data)` - POST `/api/payments/requests`
  - `getPaymentRequests()` - GET `/api/payments/requests`
  - `approvePayment(id)` - POST `/api/payments/{id}/approve`
  - `getPaymentHistory()` - GET `/api/payments/history`
  - `getBillingDetails()` - GET `/api/payments/billing`

### 4.2 Backend API Endpoints

**Controller:** `backend/src/main/java/com/freelance/platform/controller/PaymentController.java`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/payments/requests` | POST | Create payment request | FREELANCER |
| `/api/payments/requests` | GET | Get payment requests | BOTH |
| `/api/payments/{id}` | GET | Get payment details | BOTH |
| `/api/payments/{id}/approve` | POST | Approve/release payment | CLIENT |
| `/api/payments/{id}/reject` | POST | Reject payment request | CLIENT |
| `/api/payments/history` | GET | Get payment history | BOTH |
| `/api/payments/billing` | GET | Get billing settings | BOTH |

### 4.3 Backend Services & Logic

**Service:** `backend/src/main/java/com/freelance/platform/service/PaymentService.java`
- `createPaymentRequest()` - Freelancer requests payment after milestone completion
- `approvePayment()` - Client approves and releases payment
- `processPayment()` - Handles actual payment processing
- `releasePaymentToFreelancer()` - Transfers funds from escrow to freelancer
- `recordTransaction()` - Logs all payment transactions

**Payment Workflow:**
1. Freelancer completes milestone/deliverable
2. Client approves milestone completion
3. Freelancer creates payment request
4. Client reviews and approves payment
5. Platform processes payment (Stripe/PayPal integration)
6. Funds transferred to freelancer wallet/bank

### 4.4 Data Model

**Entity:** `backend/src/main/java/com/freelance/platform/entity/PaymentRequest.java`
```
- id (UUID)
- contract (Contract) - ManyToOne
- milestone (Milestone) - ManyToOne
- amount (BigDecimal)
- currency (String)
- status (Enum: PENDING, APPROVED, REJECTED, PROCESSED)
- requestedAt (LocalDateTime)
- approvedAt (LocalDateTime)
- processedAt (LocalDateTime)
```

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Transaction.java`
```
- id (UUID)
- contract (Contract) - ManyToOne
- fromUser (User) - ManyToOne (payer)
- toUser (User) - ManyToOne (payee)
- amount (BigDecimal)
- type (Enum: PAYMENT, REFUND, PLATFORM_FEE)
- status (Enum: PENDING, COMPLETED, FAILED)
- createdAt (LocalDateTime)
```

**Entity:** `backend/src/main/java/com/freelance/platform/entity/PaymentMethod.java`
```
- id (UUID)
- user (User) - ManyToOne
- type (Enum: CREDIT_CARD, BANK_ACCOUNT, PAYPAL)
- lastFourDigits (String)
- isDefault (Boolean)
- createdAt (LocalDateTime)
```

**Repositories:**
- `PaymentRequestRepository.java` - Query payment requests
- `TransactionRepository.java` - Query transactions
- `PaymentMethodRepository.java` - Query payment methods

---

## 5. REVIEWS & RATINGS FLOW

### 5.1 Frontend Components

- **Page:** `frontend/src/pages/Reviews.tsx`
  - View and manage reviews received
  - Historical review ratings

- **Component:** `frontend/src/components/reviews/ReviewCard.tsx`
  - Display individual review with rating and comment

- **Hook:** `frontend/src/hooks/useReviews.ts`
  - `useCreateReview()` - Submit review
  - `useGetReviews()` - Fetch reviews
  - `useUpdateReview()` - Update review
  - `useDeleteReview()` - Delete review

- **Service:** `frontend/src/services/review.service.ts`
  - `createReview(data)` - POST `/api/reviews`
  - `getReviews()` - GET `/api/reviews`
  - `getReviewsForUser()` - GET `/api/reviews/user/{userId}`
  - `updateReview(id, data)` - PUT `/api/reviews/{id}`
  - `deleteReview(id)` - DELETE `/api/reviews/{id}`
  - `getAverageRating()` - GET `/api/reviews/rating/{userId}`

### 5.2 Backend API Endpoints

**Controller:** `backend/src/main/java/com/freelance/platform/controller/ReviewController.java`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/reviews` | POST | Create review | BOTH |
| `/api/reviews` | GET | Get reviews (paginated) | PUBLIC |
| `/api/reviews/{id}` | GET | Get single review | PUBLIC |
| `/api/reviews/{id}` | PUT | Update review | REVIEWER |
| `/api/reviews/{id}` | DELETE | Delete review | REVIEWER/ADMIN |
| `/api/reviews/user/{userId}` | GET | Get reviews for user | PUBLIC |
| `/api/reviews/contract/{contractId}` | GET | Get reviews for contract | BOTH |
| `/api/reviews/rating/{userId}` | GET | Get average rating | PUBLIC |

### 5.3 Backend Services & Logic

**Service:** `backend/src/main/java/com/freelance/platform/service/ReviewService.java`
- `createReview()` - Creates review after contract completion
  - Validates: contract is COMPLETED
  - Prevents duplicate reviews (one per contract)
  - Rating validation (1-5 stars)
- `updateReview()` - Updates review within edit period
- `deleteReview()` - Removes review (reviewer or admin)
- `calculateAverageRating()` - Computes user's average rating
- `flagReview()` - Flag inappropriate review for moderation

### 5.4 Data Model

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Review.java`
```
- id (UUID)
- contract (Contract) - ManyToOne
- reviewer (User) - ManyToOne (who wrote the review)
- reviewee (User) - ManyToOne (who is being reviewed)
- rating (Integer) - 1-5 stars, @Min(1) @Max(5)
- comment (String) - Text review
- additionalFeedback (String)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)
```

**Constraints:**
- One review per contract (reviewer-contract unique constraint)
- Rating must be 1-5
- Can only review after contract is COMPLETED
- Reviewer must be either client or freelancer in the contract

**Repository:** `backend/src/main/java/com/freelance/platform/repository/ReviewRepository.java`
- `findByRevieweeId()` - Get reviews for a user
- `findByContractId()` - Get review for contract
- `findByReviewerId()` - Get reviews written by user
- `existsByContractAndReviewer()` - Check if review exists

---

## 6. MESSAGING & COMMUNICATION FLOW

### 6.1 Frontend Components

- **Page:** `frontend/src/pages/ChatPage.tsx`
  - Main chat interface

- **Page:** `frontend/src/pages/Messages.tsx`
  - Message history and conversations

- **Component:** `frontend/src/components/messaging/ChatWindow.tsx`
  - Real-time chat window

- **Hook:** `frontend/src/hooks/useMessages.ts`
  - `useSendMessage()` - Send message
  - `useGetMessages()` - Fetch message history
  - `useMarkAsRead()` - Mark messages as read

- **Hook:** `frontend/src/hooks/useConversations.ts`
  - `useGetConversations()` - Fetch user conversations
  - `useCreateConversation()` - Start new conversation
  - `useGetConversationMessages()` - Fetch conversation messages

- **Service:** `frontend/src/services/message.service.ts`
  - `sendMessage(data)` - POST `/api/messages`
  - `getMessages()` - GET `/api/messages`
  - `markAsRead(id)` - PUT `/api/messages/{id}/read`
  - `deleteMessage(id)` - DELETE `/api/messages/{id}`

- **Service:** `frontend/src/services/conversation.service.ts`
  - `getConversations()` - GET `/api/conversations`
  - `createConversation(data)` - POST `/api/conversations`
  - `getConversationMessages()` - GET `/api/conversations/{id}/messages`
  - `sendConversationMessage()` - POST `/api/conversations/{id}/messages`
  - `archiveConversation()` - Archive conversation
  - `markConversationAsRead()` - Mark entire conversation read

- **Service:** `frontend/src/services/websocket.service.ts`
  - Real-time WebSocket connection for instant messaging
  - Event: `new_message` - Receive message in real-time
  - Event: `user_typing` - User typing indicator
  - Event: `user_online` - User online status

### 6.2 Backend API Endpoints

**Legacy Message Controller:** `backend/src/main/java/com/freelance/platform/controller/MessageController.java`
(DEPRECATED - Use Conversation endpoints)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/messages/{id}` | GET | Get message (legacy) | BOTH |

**Conversation Controller:** `backend/src/main/java/com/freelance/platform/controller/ConversationController.java`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/conversations` | GET | Get conversations | AUTHENTICATED |
| `/api/conversations` | POST | Create conversation | AUTHENTICATED |
| `/api/conversations/{id}` | GET | Get conversation | BOTH |
| `/api/conversations/{id}` | DELETE | Delete conversation | BOTH |
| `/api/conversations/{id}/messages` | GET | Get messages in conversation | BOTH |
| `/api/conversations/{id}/messages` | POST | Send message | BOTH |
| `/api/conversations/{id}/messages/{msgId}` | DELETE | Delete message | SENDER |
| `/api/conversations/{id}/read` | POST | Mark as read | BOTH |
| `/api/conversations/{id}/archive` | POST | Archive conversation | BOTH |

**WebSocket Controller:** `backend/src/main/java/com/freelance/platform/websocket/WebSocketController.java`

| Event | Direction | Purpose |
|-------|-----------|---------|
| `/app/chat/send` | Client→Server | Send message |
| `/topic/chat/{conversationId}` | Server→Client | Broadcast message |
| `/app/user/typing` | Client→Server | Send typing indicator |
| `/topic/typing/{conversationId}` | Server→Client | Broadcast typing |
| `/app/user/status` | Client→Server | Update online status |
| `/topic/status` | Server→Client | Broadcast status |

### 6.3 Backend Services & Logic

**Service:** `backend/src/main/java/com/freelance/platform/service/MessageService.java`
- `sendMessage()` - Create and send message
- `getMessageById()` - Fetch message
- `markAsRead()` - Update message read status
- `deleteMessage()` - Soft delete message

**Service:** `backend/src/main/java/com/freelance/platform/service/ConversationService.java`
- `createConversation()` - Initiates conversation between two users
- `getConversations()` - Fetches paginated conversations for user
- `getConversationMessages()` - Fetches messages in conversation
- `sendMessage()` - Adds message to conversation
- `markAsRead()` - Marks conversation messages as read
- `archiveConversation()` - Archives conversation
- `deleteConversation()` - Soft deletes conversation

**WebSocket Handling:** `backend/src/main/java/com/freelance/platform/websocket/WebSocketController.java`
- Handles real-time message broadcasting
- Typing indicators
- Online status updates
- Message delivery confirmation

### 6.4 Data Model

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Conversation.java`
```
- id (UUID)
- participant1 (User) - ManyToOne
- participant2 (User) - ManyToOne
- subject (String)
- type (Enum: DIRECT, PROJECT_RELATED)
- lastMessageAt (LocalDateTime)
- isArchivedForParticipant1 (Boolean)
- isArchivedForParticipant2 (Boolean)
- createdAt (LocalDateTime)
- messages (OneToMany relationship to Message)
```

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Message.java`
```
- id (UUID)
- conversation (Conversation) - ManyToOne
- sender (User) - ManyToOne
- content (String)
- type (Enum: TEXT, FILE, SYSTEM)
- isRead (Boolean)
- isDeleted (Boolean)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)
```

**ConversationType Enum:**
- DIRECT - Direct message between two users
- PROJECT_RELATED - Related to specific project

**MessageType Enum:**
- TEXT - Text message
- FILE - File attachment
- SYSTEM - System notification

**Repositories:**
- `ConversationRepository.java`
  - `findByParticipant()` - Get user's conversations
  - `findByParticipants()` - Get conversation between two users
  - `findActiveConversations()` - Get non-archived conversations

- `MessageRepository.java`
  - `findByConversationId()` - Get messages in conversation
  - `findUnreadMessages()` - Get unread messages
  - `countUnreadByUser()` - Count unread for user

---

## 7. CROSS-CUTTING CONCERNS & SUPPORTING FEATURES

### 7.1 Notifications System

**Service:** `backend/src/main/java/com/freelance/platform/service/NotificationService.java`
**Entity:** `backend/src/main/java/com/freelance/platform/entity/Notification.java`

Events that trigger notifications:
- New proposal received
- Proposal accepted
- Proposal rejected
- Contract created
- Contract accepted
- Milestone completed
- Payment request created
- Payment released
- Review submitted
- Message received

**Controller:** `backend/src/main/java/com/freelance/platform/controller/NotificationController.java`
- GET `/api/notifications` - Get user's notifications
- GET `/api/notifications/{id}` - Get notification details
- PUT `/api/notifications/{id}/read` - Mark as read
- DELETE `/api/notifications/{id}` - Delete notification

### 7.2 Email Service

**Service:** `backend/src/main/java/com/freelance/platform/service/EmailService.java`
**Service:** `backend/src/main/java/com/freelance/platform/service/EmailNotificationService.java`
**Service:** `backend/src/main/java/com/freelance/platform/service/EmailTemplateService.java`

Email templates in: `backend/src/main/resources/email-templates/`

Emails sent for:
- Proposal notifications
- Contract updates
- Payment confirmations
- Review notifications
- Account updates

### 7.3 File Management

**Service:** `backend/src/main/java/com/freelance/platform/service/FileService.java`
**Service:** `backend/src/main/java/com/freelance/platform/service/StorageService.java`

**Controller:** `backend/src/main/java/com/freelance/platform/controller/FileController.java`
- POST `/api/files/upload` - Upload file
- GET `/api/files/{id}` - Download file
- DELETE `/api/files/{id}` - Delete file

**Frontend Service:** `frontend/src/services/fileUpload.service.ts`
- Upload files for projects, proposals, contracts

### 7.4 User Profiles & Freelancer Profiles

**Entity:** `backend/src/main/java/com/freelance/platform/entity/User.java`
- Basic user information
- Role (CLIENT, FREELANCER, ADMIN)
- Contact information

**Entity:** `backend/src/main/java/com/freelance/platform/entity/FreelancerProfile.java`
- `backgroundInfo` - Profile description
- `hourlyRate` - Hourly rate if applicable
- `skills` - Array of skills
- `portfolio` - Links to portfolio items
- `experienceLevel` - BEGINNER, INTERMEDIATE, EXPERT
- `availabilityStatus` - AVAILABLE, BUSY, UNAVAILABLE

**Service:** `backend/src/main/java/com/freelance/platform/service/FreelancerProfileService.java`
**Controller:** `backend/src/main/java/com/freelance/platform/controller/FreelancerProfileController.java`

**Frontend Pages:**
- `frontend/src/pages/Profile.tsx` - User profile
- `frontend/src/pages/UserProfile.tsx` - Public profile view
- `frontend/src/pages/Freelancers.tsx` - Browse freelancers

### 7.5 Reporting & Admin Features

**Entity:** `backend/src/main/java/com/freelance/platform/entity/Report.java`
**Service:** `backend/src/main/java/com/freelance/platform/service/ReportService.java`
**Controller:** `backend/src/main/java/com/freelance/platform/controller/ReportController.java`

**Frontend:**
- `frontend/src/pages/Reporting.tsx` - Report issues
- `frontend/src/pages/Reports.tsx` - View submitted reports

### 7.6 Analytics & Dashboard

**Services:**
- `backend/src/main/java/com/freelance/platform/service/AnalyticsService.java`
- `backend/src/main/java/com/freelance/platform/service/admin/AdminAnalyticsService.java`
- `backend/src/main/java/com/freelance/platform/service/DashboardService.java`

**Frontend Pages:**
- `frontend/src/pages/ClientDashboard.tsx` - Client dashboard
- `frontend/src/pages/FreelancerDashboard.tsx` - Freelancer dashboard
- `frontend/src/pages/AdminDashboard.tsx` - Admin dashboard
- `frontend/src/pages/Analytics.tsx` - Analytics

---

## 8. COMPLETE FLOW SUMMARY

### Flow Diagram: Project Creation → Job Completion → Review

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CLIENT CREATES PROJECT                                       │
│ CreateProject.tsx → projectService.createProject()             │
│ → ProjectController.createProject()                            │
│ → ProjectService.createProject() → Project (DRAFT)             │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CLIENT PUBLISHES PROJECT                                     │
│ → ProjectController.publishProject()                           │
│ → ProjectService.publishProject() → Project (PUBLISHED)        │
│ → Send notification to freelancers                             │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. FREELANCER BROWSES & APPLIES                                 │
│ AvailableProjects.tsx → projectService.searchProjects()        │
│ → ProjectController.searchProjects()                           │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. FREELANCER SUBMITS PROPOSAL                                  │
│ ProjectDetails.tsx → proposalService.submitProposal()          │
│ → ProposalController.submitProposal()                          │
│ → ProposalService.submitProposal() → Proposal (PENDING)        │
│ → Send notification to client                                  │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. CLIENT REVIEWS & ACCEPTS PROPOSAL                            │
│ Proposals.tsx → proposalService.acceptProposal()               │
│ → ProposalController.acceptProposal()                          │
│ → ProposalService.acceptProposal() → Proposal (ACCEPTED)       │
│ → Send notification to freelancer                              │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. CONTRACT CREATION & ACCEPTANCE                               │
│ Contracts.tsx → contractService.createContract()               │
│ → ContractController.createContract()                          │
│ → ContractService.createContract() → Contract (PENDING)        │
│ → Freelancer accepts → Contract (ACTIVE)                       │
│ → Project status → IN_PROGRESS                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. MESSAGING & COLLABORATION                                    │
│ ChatPage.tsx → conversationService.sendMessage()               │
│ → ConversationController.sendMessage()                         │
│ → WebSocket broadcast for real-time updates                    │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. MILESTONE COMPLETION & PAYMENT                               │
│ ContractManagement.tsx → contractService.updateMilestone()     │
│ → ContractController.approveMilestone()                        │
│ → Freelancer requests payment                                  │
│ → paymentService.createPaymentRequest()                        │
│ → PaymentController.createPaymentRequest()                     │
│ → Client approves payment                                      │
│ → PaymentService.processPayment()                              │
│ → Transaction created, funds transferred                       │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. CONTRACT COMPLETION                                          │
│ → ContractService.completeContract() → Contract (COMPLETED)    │
│ → Project status → COMPLETED                                   │
│ → Final payment released if not already done                   │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. REVIEW & RATING                                             │
│ Reviews.tsx → reviewService.createReview()                     │
│ → ReviewController.createReview()                              │
│ → ReviewService.createReview() → Review created               │
│ → Both client and freelancer can review each other             │
│ → Rating affects user profile average rating                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. KEY DATABASE RELATIONSHIPS

```
User
├── Projects (1→N) as client
├── Proposals (1→N) as freelancer
├── Proposals (1→N) as client
├── Contracts (1→N) as freelancer
├── Contracts (1→N) as client
├── Reviews (1→N) as reviewer
├── Reviews (1→N) as reviewee
├── Conversations (1→N)
├── Messages (1→N)
├── PaymentMethods (1→N)
└── FreelancerProfile (1→1)

Project
├── Client (User)
├── Proposals (1→N)
├── Contracts (1→N)
├── Attachments (1→N)
└── Milestones (through Contract)

Proposal
├── Project
├── Freelancer (User)
├── Client (User)
└── Contract (1→1, after acceptance)

Contract
├── Project
├── Client (User)
├── Freelancer (User)
├── Proposal
├── Milestones (1→N)
├── Transactions (1→N)
└── Reviews (1→N)

Milestone
├── Contract
├── PaymentRequests (1→N)
└── Transactions (1→N)

Review
├── Contract
├── Reviewer (User)
└── Reviewee (User)

Transaction
├── Contract
├── FromUser (payer)
└── ToUser (payee)

Conversation
├── Participant1 (User)
├── Participant2 (User)
└── Messages (1→N)

Message
├── Conversation
└── Sender (User)
```

---

## 10. AUTHENTICATION & AUTHORIZATION

**Auth Service:** `backend/src/main/java/com/freelance/platform/service/AuthService.java`
**Auth Controller:** `backend/src/main/java/com/freelance/platform/controller/AuthController.java`
**Security:** JWT-based authentication with Bearer tokens

**User Principal:** `backend/src/main/java/com/freelance/platform/security/UserPrincipal.java`
- Contains authenticated user information
- Used in `@AuthenticationPrincipal` annotations

**Roles:**
- CLIENT - Can create projects, accept proposals, approve payments, submit reviews
- FREELANCER - Can submit proposals, complete milestones, request payments, submit reviews
- ADMIN - Full platform access

**Authorization:**
- Method-level security via `@PreAuthorize` annotations
- Resource-level checks in services
- Role-based endpoint access

---

## 11. ERROR HANDLING & EXCEPTIONS

**Custom Exceptions:**
- `ResourceNotFoundException` - Resource not found
- `UnauthorizedException` - User not authorized for action
- `ValidationException` - Invalid input data
- `ConflictException` - Business logic conflict

**Global Exception Handler:** `@ControllerAdvice` in backend
- Returns standardized error responses with HTTP status codes
- Logs exceptions to system logs

---

## 12. TRANSACTION & PAYMENT PROCESSING

**Payment Methods Supported:**
- Credit/Debit Card
- Bank Account
- PayPal
- Platform Wallet

**Payment Flow:**
1. Client adds payment method (one-time tokenization)
2. Freelancer completes work and creates payment request
3. Client approves payment request
4. Platform processes payment through Stripe/PayPal
5. Platform takes commission (configurable)
6. Remaining amount transferred to freelancer account
7. Transaction recorded for audit trail

**Escrow Model:**
- Payment held in platform escrow until milestone completion
- Protects both parties
- Released upon client approval

---

## Summary of Files by Component

### Backend: 29 Controllers, 38+ Services, 55+ Entities, 30 Repositories

**Core Flow Files:**
- Controllers: Project, Proposal, Contract, Review, Payment, Message, Conversation
- Services: Project, Proposal, Contract, Review, Payment, Message, Conversation, Notification
- Entities: Project, Proposal, Contract, Milestone, Review, Transaction, User
- Repositories: Project, Proposal, Contract, Review, Payment, Transaction

**Frontend: 38 Pages, 20 Services, 50+ UI Components, 18+ Custom Hooks**

**Core Flow Files:**
- Pages: CreateProject, AvailableProjects, ProjectDetails, MyProposals, Proposals, Contracts, ReviewsManagement, ChatPage
- Services: project, proposal, contract, review, payment, message, conversation, websocket
- Hooks: useProjects, useProposals, useContracts, usePayments, useReviews, useMessages, useConversations

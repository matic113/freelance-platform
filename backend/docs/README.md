# Freelance Platform - Postman Collections

Comprehensive Postman collections for testing all endpoints of the Freelance Platform API.

## 📦 Collections Overview

### 1. Freelance-Platform-Collection.postman_collection.json
**Core Features Collection** - Contains the main functionality endpoints (83 endpoints):
- **Authentication** (Register, Login, Logout, Token Refresh, Get Current User)
- **User Management** (Profile operations, Avatar update, User search)
- **Projects** (CRUD operations, Search, Attachments, Status management)
- **Proposals** (Submit, Accept/Reject, Withdraw, Management)
- **Contracts** (Create, Accept/Reject, Complete, Milestones)
- **Payments** (Payment requests, Approve/Reject, Process, Transactions)
- **Messages** (Send, Read, Conversations, Unread management)
- **Notifications** (Get, Mark as read, Delete)

### 2. Freelance-Platform-Advanced-Collection.postman_collection.json
**Advanced Features Collection** - Contains advanced functionality (77 endpoints):
- **Analytics** (Dashboard, Earnings, Performance, Trends, Revenue)
- **Settings** (Profile, Notifications, Privacy, Security, Billing, Integrations)
- **Reviews** (Create, Update, Delete, Statistics, Report)
- **Files** (Upload, Download, Metadata, Storage management)
- **Reports** (Create, Resolve, Dismiss, Search, Statistics)
- **Help & Support** (FAQ, Guides, Contact forms, Search)
- **Content** (Legal documents, About Us, Success stories, Announcements)
- **Health Check** (API status and system information)

### 3. Freelance-Platform-Admin-Collection.postman_collection.json
**Admin Panel Collection** - Complete admin functionality (60 endpoints):
- **Admin Dashboard** (Overview, action logs, recent activities)
- **Admin User Management** (Create admins, manage roles & permissions)
- **Admin Project Management** (Moderation, categories, featured projects)
- **Admin Analytics** (Business intelligence, revenue, predictions)
- **Admin Report Management** (Handle reports, resolve issues, moderation)

**📖 See [ADMIN_COLLECTION_README.md](./ADMIN_COLLECTION_README.md) for complete admin documentation**

## 🚀 Getting Started

### 1. Import Collections

1. Open Postman
2. Click **Import** button
3. Select the collection files:
   - `Freelance-Platform-Collection.postman_collection.json` (Core - 83 endpoints)
   - `Freelance-Platform-Advanced-Collection.postman_collection.json` (Advanced - 77 endpoints)
   - `Freelance-Platform-Admin-Collection.postman_collection.json` (Admin - 60 endpoints)
   - `Freelance-Platform-Environment.postman_environment.json`

### 2. Set Up Environment

1. Select **"Freelance Platform - Development"** environment from the environment dropdown
2. Update the `BASE_URL` if needed (default: `http://localhost:8080`)
3. Other variables will be auto-populated during test execution

### 3. Start Testing

#### Option A: Quick Start (Recommended for new users)
Follow this sequence for a complete end-to-end test:

1. **Authentication** → Register User (as CLIENT)
2. **Authentication** → Login (token will be auto-saved)
3. **Authentication** → Register Freelancer (create second user)
4. **Projects** → Create Project
5. **Projects** → Publish Project
6. Switch to Freelancer account (Login with freelancer credentials)
7. **Proposals** → Submit Proposal
8. Switch back to Client account
9. **Proposals** → Accept Proposal
10. **Contracts** → Create Contract
11. **Milestones** → Create Milestone
12. Continue with payment and review workflows...

#### Option B: Run Entire Collection
1. Click on a collection
2. Click **Run** button
3. Select requests to run
4. Click **Run [Collection Name]**

## 🔑 Authentication

Most endpoints require authentication. The Login request includes a **Test Script** that automatically saves the access token and refresh token to environment variables.

```javascript
// Auto-executed after successful login
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("ACCESS_TOKEN", jsonData.accessToken);
    pm.environment.set("REFRESH_TOKEN", jsonData.refreshToken);
}
```

### Manual Token Setup (if needed)
1. Execute **Authentication** → **Login** request
2. Copy the `accessToken` from the response
3. Set it in the environment variable `ACCESS_TOKEN`

## 📋 Test Scenarios

### Scenario 1: Complete Project Lifecycle (Client → Freelancer → Payment)

**Prerequisites:** Two registered users (1 CLIENT, 1 FREELANCER)

1. **Client Actions:**
   - Login as CLIENT
   - Create Project
   - Publish Project
   - View Received Proposals
   - Accept a Proposal
   - Create Contract
   - Create Milestones
   - Approve Payment Request
   - Leave Review

2. **Freelancer Actions:**
   - Login as FREELANCER
   - Browse Published Projects
   - Submit Proposal
   - Accept Contract
   - Complete Milestone
   - Create Payment Request
   - Leave Review

### Scenario 2: Messaging & Notifications

1. Login as CLIENT
2. Send Message to Freelancer
3. Check Unread Message Count
4. Mark Message as Read
5. Check Notifications
6. Mark Notifications as Read

### Scenario 3: Search & Discovery

1. Browse Published Projects
2. Search Projects (by category, skills, budget)
3. Get Featured Projects
4. Search Users
5. Get User Reviews
6. Check User Statistics

### Scenario 4: Analytics & Reports

1. Login as user
2. Get Dashboard Analytics
3. View Earnings Analytics
4. Check Performance Metrics
5. View Revenue Analytics
6. Generate Reports

### Scenario 5: File Management

1. Upload File
2. Get File Information
3. Update File Metadata
4. Download File
5. Check Storage Usage
6. Delete File

## 🎯 Important Endpoints to Test First

### Core Workflow Endpoints
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ POST /api/projects
- ✅ POST /api/projects/{id}/publish
- ✅ POST /api/proposals
- ✅ POST /api/proposals/{id}/accept
- ✅ POST /api/contracts
- ✅ POST /api/contracts/{id}/milestones
- ✅ POST /api/payments/requests
- ✅ POST /api/payments/requests/{id}/approve

### User Experience Endpoints
- ✅ GET /api/projects (Browse)
- ✅ GET /api/projects/search
- ✅ GET /api/proposals/my-proposals
- ✅ GET /api/contracts/my-contracts
- ✅ GET /api/messages/conversations
- ✅ GET /api/notifications/unread
- ✅ GET /api/analytics/dashboard/{userId}

## 📊 Environment Variables

| Variable | Description | Auto-Set | Required |
|----------|-------------|----------|----------|
| BASE_URL | API base URL | No | Yes |
| ACCESS_TOKEN | JWT access token | Yes (on login) | Yes |
| REFRESH_TOKEN | JWT refresh token | Yes (on login) | No |
| USER_ID | Current user ID | Yes | No |
| PROJECT_ID | Last created project ID | Yes | No |
| PROPOSAL_ID | Last created proposal ID | Yes | No |
| CONTRACT_ID | Last created contract ID | Yes | No |
| MILESTONE_ID | Last created milestone ID | Yes | No |
| PAYMENT_REQUEST_ID | Last created payment request ID | Yes | No |
| MESSAGE_ID | Last created message ID | Yes | No |
| FILE_ID | Last uploaded file ID | Yes | No |
| REVIEW_ID | Last created review ID | Yes | No |
| REPORT_ID | Last created report ID | Yes | No |

## 🔍 Request Body Examples

### Register User
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "userType": "CLIENT",
  "country": "United States",
  "city": "New York"
}
```

### Create Project
```json
{
  "title": "E-commerce Website Development",
  "description": "Need a full-stack developer to build a modern e-commerce website...",
  "category": "Web Development",
  "skillsRequired": ["React", "Node.js", "MongoDB"],
  "budgetMin": 5000.00,
  "budgetMax": 8000.00,
  "projectType": "FIXED",
  "duration": "2-3 months",
  "deadline": "2025-03-31"
}
```

### Submit Proposal
```json
{
  "projectId": "{{PROJECT_ID}}",
  "title": "Professional E-commerce Solution",
  "description": "I am an experienced full-stack developer with 5+ years...",
  "proposedAmount": 7500.00,
  "currency": "USD",
  "estimatedDuration": "10 weeks"
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Unauthorized" error (401)
- **Solution:** Make sure you're logged in and ACCESS_TOKEN is set

**Issue:** "Forbidden" error (403)
- **Solution:** Check user role. Some endpoints are CLIENT-only or FREELANCER-only

**Issue:** "Not Found" error (404)
- **Solution:** Verify the resource ID in path variable matches an existing resource

**Issue:** Environment variables not updating
- **Solution:** Check Test Scripts are enabled in Postman settings

**Issue:** Cannot create contract
- **Solution:** Ensure proposal is ACCEPTED before creating a contract

## 📝 Notes

1. **UserType values:** `CLIENT`, `FREELANCER`
2. **ProjectType values:** `FIXED`, `HOURLY`
3. **ProjectStatus values:** `DRAFT`, `PUBLISHED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
4. **ProposalStatus values:** `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`
5. **ContractStatus values:** `DRAFT`, `ACTIVE`, `COMPLETED`, `CANCELLED`
6. **MessageType values:** `TEXT`, `FILE`, `SYSTEM`

## 🔄 API Workflow Diagram

```
CLIENT                          FREELANCER
  │                                 │
  ├─► Register                     │
  ├─► Login                        │
  ├─► Create Project               │
  ├─► Publish Project              │
  │                                 │
  │                          ◄─────┤ Browse Projects
  │                          ◄─────┤ Submit Proposal
  │                                 │
  ├─► View Proposals               │
  ├─► Accept Proposal              │
  ├─► Create Contract              │
  │                                 │
  │                          ◄─────┤ Accept Contract
  │                                 │
  ├─► Create Milestones            │
  │                                 │
  │                          ◄─────┤ Complete Milestone
  │                          ◄─────┤ Create Payment Request
  │                                 │
  ├─► Approve Payment              │
  ├─► Process Payment              │
  │                                 │
  ├─► Leave Review                 │
  │                          ◄─────┤ Leave Review
  │                                 │
  └─► Complete Contract            │
                                    └
```

## 📚 Additional Resources

- **API Base URL:** http://localhost:8080/api
- **Swagger Documentation:** http://localhost:8080/swagger-ui.html
- **Application Properties:** `/src/main/resources/application.properties`

## ✅ Complete Endpoint Coverage

### Total Endpoints: **220+**

- Authentication: 5 endpoints
- Users: 5 endpoints
- Projects: 12 endpoints
- Proposals: 10 endpoints
- Contracts: 11 endpoints (including milestones)
- Payments: 9 endpoints
- Messages: 10 endpoints
- Notifications: 6 endpoints
- Analytics: 7 endpoints
- Settings: 12 endpoints (6 types × 2 operations)
- Reviews: 10 endpoints
- Files: 9 endpoints
- Reports: 11 endpoints
- Help: 10 endpoints
- Content: 10 endpoints
- Health: 2 endpoints
- **Admin Dashboard: 4 endpoints**
- **Admin User Management: 11 endpoints**
- **Admin Project Management: 15 endpoints**
- **Admin Analytics: 13 endpoints**
- **Admin Report Management: 17 endpoints**

## 🎓 Best Practices

1. **Always test Authentication first** - Most endpoints require valid tokens
2. **Use environment variables** - Avoid hardcoding IDs in requests
3. **Test error scenarios** - Try invalid data to verify validation
4. **Check response times** - Monitor API performance
5. **Verify relationships** - Ensure foreign keys and relationships work correctly
6. **Test pagination** - Try different page sizes and page numbers
7. **Test filters and search** - Verify all query parameters work as expected
8. **Clean up test data** - Delete test resources after testing

## 📞 Support

For issues or questions:
- Check application logs in console
- Review Swagger documentation
- Verify database connection
- Check Redis and Elasticsearch services
- Ensure all required services are running

---

**Happy Testing! 🚀**

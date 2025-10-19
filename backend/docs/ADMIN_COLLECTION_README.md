# Freelance Platform - Admin Panel Collection

Complete Admin Panel API Documentation - **60+ Admin-Only Endpoints**

## 🔐 Authentication & Access

**IMPORTANT:** All admin endpoints require:
1. Valid `ACCESS_TOKEN` (Bearer authentication)
2. User must have ADMIN role/permissions
3. Some endpoints require specific admin roles (SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT)

### Admin Roles Hierarchy
```
SUPER_ADMIN (Highest)
    ├── Full system access
    ├── Manage all admins
    ├── System configuration
    └── All permissions

ADMIN
    ├── User management
    ├── Project moderation
    ├── Report handling
    └── Analytics access

MODERATOR
    ├── Content moderation
    ├── Report review
    └── Basic user actions

SUPPORT (Lowest)
    ├── View only access
    ├── Help desk functions
    └── Limited actions
```

## 📚 Collection Structure

### 1. Admin Dashboard (4 endpoints)
- Get comprehensive dashboard statistics
- View admin action logs
- Track admin activities
- Monitor recent actions

### 2. Admin User Management (11 endpoints)
- Create/Update/Delete admin users
- Manage roles and permissions
- Control admin access levels
- Search and filter admins

### 3. Admin Project Management (15 endpoints)
- View all projects (including hidden)
- Moderate project content
- Manage project categories
- Feature/suspend projects
- Full project control

### 4. Admin Analytics (13 endpoints)
- Comprehensive business intelligence
- Revenue tracking and forecasts
- User growth analytics
- Geographic distribution
- Real-time metrics
- Custom reports
- Predictive analytics

### 5. Admin Report Management (17 endpoints)
- Handle user reports
- Assign to moderators
- Track resolution status
- Manage report categories
- Analytics and trends

## 🚀 Quick Start Guide

### Step 1: Admin Account Setup
```json
POST /api/auth/register
{
  "firstName": "Super",
  "lastName": "Admin",
  "email": "admin@freelanceplatform.com",
  "password": "SuperAdmin123!",
  "userType": "CLIENT"
}
```
**Note:** The first admin needs to be created through database or promoted manually

### Step 2: Login as Admin
```json
POST /api/auth/login
{
  "email": "admin@freelanceplatform.com",
  "password": "SuperAdmin123!"
}
```
Token will be auto-saved to `ACCESS_TOKEN` environment variable

### Step 3: Access Admin Dashboard
```
GET /api/admin/dashboard
```

## 📊 Complete Endpoint Reference

### Admin Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get comprehensive dashboard |
| GET | `/api/admin/actions` | Get all admin actions (paginated) |
| GET | `/api/admin/actions/admin/{adminId}` | Get actions by specific admin |
| GET | `/api/admin/actions/recent` | Get 10 most recent actions |

### Admin User Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/admin/users` | Create new admin user | SUPER_ADMIN |
| GET | `/api/admin/users` | Get all admin users | ADMIN+ |
| GET | `/api/admin/users/{id}` | Get admin user by ID | ADMIN+ |
| PUT | `/api/admin/users/{id}` | Update admin user | SUPER_ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete admin user | SUPER_ADMIN |
| PUT | `/api/admin/users/{id}/status` | Activate/deactivate admin | SUPER_ADMIN |
| PUT | `/api/admin/users/{id}/role` | Update admin role | SUPER_ADMIN |
| GET | `/api/admin/users/search` | Search admin users | ADMIN+ |
| GET | `/api/admin/users/roles` | Get available roles | ADMIN+ |
| GET | `/api/admin/users/permissions` | Get permissions structure | SUPER_ADMIN |
| PUT | `/api/admin/users/permissions/{role}` | Update role permissions | SUPER_ADMIN |

### Admin Project Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/admin/projects` | Get all projects | ADMIN+ |
| GET | `/api/admin/projects/{id}` | Get project details | ADMIN+ |
| PUT | `/api/admin/projects/{id}/status` | Update project status | MODERATOR+ |
| PUT | `/api/admin/projects/{id}/featured` | Mark as featured | ADMIN+ |
| DELETE | `/api/admin/projects/{id}` | Delete project | ADMIN+ |
| GET | `/api/admin/projects/statistics` | Get project statistics | ADMIN+ |
| GET | `/api/admin/projects/reported` | Get reported projects | MODERATOR+ |
| PUT | `/api/admin/projects/{id}/moderate` | Moderate project | MODERATOR+ |
| GET | `/api/admin/projects/categories` | Get categories | ADMIN+ |
| POST | `/api/admin/projects/categories` | Create category | ADMIN+ |
| PUT | `/api/admin/projects/categories/{id}` | Update category | ADMIN+ |
| DELETE | `/api/admin/projects/categories/{id}` | Delete category | ADMIN+ |
| GET | `/api/admin/projects/search` | Search projects | ADMIN+ |
| GET | `/api/admin/projects/analytics` | Get project analytics | ADMIN+ |

### Admin Analytics

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/admin/analytics/dashboard` | Analytics dashboard | ADMIN+ |
| GET | `/api/admin/analytics/users` | User analytics | ADMIN+ |
| GET | `/api/admin/analytics/projects` | Project analytics | ADMIN+ |
| GET | `/api/admin/analytics/revenue` | Revenue analytics | ADMIN+ |
| GET | `/api/admin/analytics/performance` | Performance metrics | ADMIN+ |
| GET | `/api/admin/analytics/geographic` | Geographic distribution | ADMIN+ |
| GET | `/api/admin/analytics/trends` | Trend analysis | ADMIN+ |
| GET | `/api/admin/analytics/custom-reports` | List custom reports | ADMIN+ |
| POST | `/api/admin/analytics/custom-reports` | Create custom report | ADMIN+ |
| GET | `/api/admin/analytics/export` | Export data | ADMIN+ |
| GET | `/api/admin/analytics/real-time` | Real-time metrics | ADMIN+ |
| GET | `/api/admin/analytics/comparison` | Period comparison | ADMIN+ |
| GET | `/api/admin/analytics/predictions` | Predictive analytics | ADMIN+ |

### Admin Report Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/admin/reports` | Get all reports | MODERATOR+ |
| GET | `/api/admin/reports/{id}` | Get report by ID | MODERATOR+ |
| PUT | `/api/admin/reports/{id}/status` | Update status | MODERATOR+ |
| PUT | `/api/admin/reports/{id}/assign` | Assign to admin | MODERATOR+ |
| GET | `/api/admin/reports/statistics` | Report statistics | ADMIN+ |
| GET | `/api/admin/reports/pending` | Get pending reports | MODERATOR+ |
| GET | `/api/admin/reports/categories` | Get categories | MODERATOR+ |
| POST | `/api/admin/reports/categories` | Create category | ADMIN+ |
| PUT | `/api/admin/reports/categories/{id}` | Update category | ADMIN+ |
| DELETE | `/api/admin/reports/categories/{id}` | Delete category | ADMIN+ |
| GET | `/api/admin/reports/search` | Search reports | MODERATOR+ |
| GET | `/api/admin/reports/analytics` | Report analytics | ADMIN+ |
| POST | `/api/admin/reports/{id}/resolve` | Resolve report | MODERATOR+ |
| POST | `/api/admin/reports/{id}/dismiss` | Dismiss report | MODERATOR+ |
| GET | `/api/admin/reports/types` | Get report types | MODERATOR+ |

## 🎯 Common Use Cases

### Use Case 1: Onboard New Admin User

```javascript
// Step 1: Create admin user (SUPER_ADMIN only)
POST /api/admin/users
{
  "email": "moderator@platform.com",
  "firstName": "Jane",
  "lastName": "Moderator",
  "password": "SecurePass123!",
  "role": "MODERATOR"
}

// Step 2: View new admin
GET /api/admin/users/{adminUserId}

// Step 3: Adjust permissions if needed
PUT /api/admin/users/{adminUserId}/role?role=ADMIN
```

### Use Case 2: Handle User Report

```javascript
// Step 1: View pending reports
GET /api/admin/reports/pending

// Step 2: Get specific report details
GET /api/admin/reports/{reportId}

// Step 3: Assign to moderator
PUT /api/admin/reports/{reportId}/assign?adminUserId={moderatorId}

// Step 4: Update status
PUT /api/admin/reports/{reportId}/status?status=INVESTIGATING

// Step 5: Take action and resolve
POST /api/admin/reports/{reportId}/resolve
{
  "resolution": "User warned, content removed",
  "actionTaken": "WARNING_ISSUED",
  "notes": "First offense"
}
```

### Use Case 3: Moderate Suspicious Project

```javascript
// Step 1: View reported projects
GET /api/admin/projects/reported

// Step 2: Review project details
GET /api/admin/projects/{projectId}

// Step 3: Moderate the project
PUT /api/admin/projects/{projectId}/moderate?action=SUSPEND&reason=Violates community guidelines

// Step 4: Update project status
PUT /api/admin/projects/{projectId}/status?status=SUSPENDED
```

### Use Case 4: Generate Business Reports

```javascript
// Step 1: View analytics dashboard
GET /api/admin/analytics/dashboard

// Step 2: Get revenue analytics
GET /api/admin/analytics/revenue

// Step 3: Create custom report
POST /api/admin/analytics/custom-reports
{
  "name": "Monthly Revenue by Category",
  "metrics": ["revenue", "projects", "completion_rate"],
  "dimensions": ["category", "month"],
  "schedule": "monthly"
}

// Step 4: Export data
GET /api/admin/analytics/export?format=csv&dateRange=last_30_days
```

### Use Case 5: Manage Project Categories

```javascript
// Step 1: View existing categories
GET /api/admin/projects/categories

// Step 2: Create new category
POST /api/admin/projects/categories
{
  "name": "AI & Machine Learning",
  "description": "AI, ML, and data science projects",
  "isActive": true
}

// Step 3: Feature top projects in category
PUT /api/admin/projects/{projectId}/featured?isFeatured=true
```

## 📈 Admin Action Logging

Every admin action is automatically logged with:
- Admin user ID
- Action type
- Target resource
- Timestamp
- IP address
- Result (success/failure)

View logs:
```
GET /api/admin/actions
GET /api/admin/actions/admin/{adminUserId}
GET /api/admin/actions/recent
```

## 🔒 Security Best Practices

1. **Never share admin credentials**
2. **Use strong passwords** (minimum 12 characters)
3. **Enable 2FA** when available
4. **Regularly review admin actions**
5. **Follow principle of least privilege**
6. **Deactivate unused admin accounts**
7. **Monitor suspicious activities**

## 📊 Dashboard Metrics

The admin dashboard provides:

**User Metrics:**
- Total users (CLIENT/FREELANCER breakdown)
- New registrations (daily/weekly/monthly)
- Active users
- User retention rate

**Project Metrics:**
- Total projects
- Published/Draft/Completed
- Average project value
- Success rate

**Revenue Metrics:**
- Total revenue
- Revenue trends
- Commission earnings
- Outstanding payments

**Platform Health:**
- System uptime
- Response times
- Error rates
- Active sessions

## 🎨 Analytics Features

### Real-Time Metrics
Monitor live platform activity:
- Active users online
- Ongoing transactions
- Messages per minute
- API request rate

### Predictive Analytics
AI-powered forecasting:
- Revenue predictions
- User growth projections
- Seasonal trends
- Risk analysis

### Custom Reports
Create tailored reports:
- Select metrics and dimensions
- Schedule automated generation
- Export in multiple formats (CSV, Excel, PDF)
- Share with stakeholders

## ⚠️ Important Notes

1. **Admin API Rate Limits:** Admin endpoints have higher rate limits but are still monitored
2. **Data Privacy:** Admin access to user data is logged and auditable
3. **Bulk Operations:** Use with caution - always test on staging first
4. **Cache Invalidation:** Some admin actions may require cache refresh
5. **Async Operations:** Large exports and reports are processed asynchronously

## 🔧 Environment Variables

Required in your Postman environment:

```json
{
  "BASE_URL": "http://localhost:8080",
  "ACCESS_TOKEN": "",
  "ADMIN_USER_ID": "",
  "PROJECT_ID": "",
  "CATEGORY_ID": "",
  "REPORT_ID": ""
}
```

## 📞 Support

For admin panel issues:
- Check application logs: `logging.level.com.freelance.platform=DEBUG`
- Review admin action history
- Contact system administrator
- Check Swagger docs: `http://localhost:8080/swagger-ui.html`

---

## Summary

✅ **60+ Admin Endpoints**
✅ **5 Major Modules**
✅ **4 Admin Role Levels**
✅ **Complete Action Logging**
✅ **Advanced Analytics**
✅ **Content Moderation**
✅ **User Management**
✅ **Business Intelligence**

**Total Admin Endpoints: 60**
- Dashboard: 4
- User Management: 11
- Project Management: 15
- Analytics: 13
- Report Management: 17

---

**Last Updated:** January 2025
**API Version:** 1.0.0
**Admin Panel Version:** 1.0.0

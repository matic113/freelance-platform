# Freelance Platform API - Complete Endpoints Reference

## Quick Reference Guide

### 📋 Table of Contents
- [Authentication](#authentication)
- [User Management](#user-management)
- [Projects](#projects)
- [Proposals](#proposals)
- [Contracts](#contracts)
- [Payments](#payments)
- [Messages](#messages)
- [Notifications](#notifications)
- [Analytics](#analytics)
- [Settings](#settings)
- [Reviews](#reviews)
- [Files](#files)
- [Reports](#reports)
- [Help & Support](#help--support)
- [Content](#content)
- [Health Check](#health-check)

---

## Authentication
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/auth/register` | Register new user | ❌ | - |
| POST | `/api/auth/login` | User login | ❌ | - |
| POST | `/api/auth/refresh` | Refresh access token | ❌ | - |
| POST | `/api/auth/logout` | User logout | ✅ | ALL |
| GET | `/api/auth/me` | Get current user info | ✅ | ALL |

## User Management
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/users/profile` | Get current user profile | ✅ | CLIENT, FREELANCER |
| GET | `/api/users/{id}` | Get user by ID | ✅ | CLIENT, FREELANCER |
| PUT | `/api/users/profile` | Update user profile | ✅ | CLIENT, FREELANCER |
| PUT | `/api/users/profile/avatar` | Update user avatar | ✅ | CLIENT, FREELANCER |
| GET | `/api/users/search` | Search users | ✅ | CLIENT, FREELANCER |

## Projects
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/projects` | Create new project | ✅ | CLIENT |
| GET | `/api/projects/{id}` | Get project by ID | ✅ | ALL |
| PUT | `/api/projects/{id}` | Update project | ✅ | CLIENT (owner) |
| DELETE | `/api/projects/{id}` | Delete project | ✅ | CLIENT (owner) |
| POST | `/api/projects/{id}/publish` | Publish project | ✅ | CLIENT (owner) |
| GET | `/api/projects/my-projects` | Get my projects | ✅ | CLIENT |
| GET | `/api/projects` | Get published projects | ✅ | ALL |
| GET | `/api/projects/featured` | Get featured projects | ✅ | ALL |
| GET | `/api/projects/search` | Search projects | ✅ | ALL |
| POST | `/api/projects/{id}/attachments` | Add attachment | ✅ | CLIENT (owner) |
| DELETE | `/api/projects/{id}/attachments/{attachmentId}` | Remove attachment | ✅ | CLIENT (owner) |
| PUT | `/api/projects/{id}/status` | Update project status | ✅ | CLIENT (owner) |

## Proposals
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/proposals` | Submit proposal | ✅ | FREELANCER |
| GET | `/api/proposals/{id}` | Get proposal by ID | ✅ | ALL |
| PUT | `/api/proposals/{id}` | Update proposal | ✅ | FREELANCER (owner) |
| DELETE | `/api/proposals/{id}` | Delete proposal | ✅ | FREELANCER (owner) |
| POST | `/api/proposals/{id}/accept` | Accept proposal | ✅ | CLIENT |
| POST | `/api/proposals/{id}/reject` | Reject proposal | ✅ | CLIENT |
| POST | `/api/proposals/{id}/withdraw` | Withdraw proposal | ✅ | FREELANCER (owner) |
| GET | `/api/proposals/my-proposals` | Get my proposals | ✅ | FREELANCER |
| GET | `/api/proposals/received` | Get received proposals | ✅ | CLIENT |
| GET | `/api/proposals/project/{projectId}` | Get proposals for project | ✅ | ALL |

## Contracts
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/contracts` | Create contract | ✅ | CLIENT |
| GET | `/api/contracts/{id}` | Get contract by ID | ✅ | ALL |
| POST | `/api/contracts/{id}/accept` | Accept contract | ✅ | FREELANCER |
| POST | `/api/contracts/{id}/reject` | Reject contract | ✅ | FREELANCER |
| POST | `/api/contracts/{id}/complete` | Complete contract | ✅ | CLIENT |
| GET | `/api/contracts/my-contracts` | Get my contracts (client) | ✅ | CLIENT |
| GET | `/api/contracts/freelancer-contracts` | Get freelancer contracts | ✅ | FREELANCER |
| POST | `/api/contracts/{id}/milestones` | Create milestone | ✅ | CLIENT |
| PUT | `/api/contracts/{id}/milestones/{milestoneId}` | Update milestone | ✅ | CLIENT |
| POST | `/api/contracts/{id}/milestones/{milestoneId}/complete` | Complete milestone | ✅ | FREELANCER |
| GET | `/api/contracts/{id}/milestones` | Get contract milestones | ✅ | ALL |

## Payments
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/payments/requests` | Create payment request | ✅ | FREELANCER |
| GET | `/api/payments/requests/{id}` | Get payment request | ✅ | ALL |
| POST | `/api/payments/requests/{id}/approve` | Approve payment request | ✅ | CLIENT |
| POST | `/api/payments/requests/{id}/reject` | Reject payment request | ✅ | CLIENT |
| POST | `/api/payments/process` | Process payment | ✅ | CLIENT |
| GET | `/api/payments/requests/my-requests` | Get my payment requests | ✅ | FREELANCER |
| GET | `/api/payments/requests/received` | Get received requests | ✅ | CLIENT |
| GET | `/api/payments/requests/contract/{contractId}` | Get contract payment requests | ✅ | ALL |
| GET | `/api/payments/transactions/contract/{contractId}` | Get contract transactions | ✅ | ALL |

## Messages
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/messages` | Send message | ✅ | ALL |
| GET | `/api/messages/{id}` | Get message by ID | ✅ | ALL |
| GET | `/api/messages/conversations` | Get user conversations | ✅ | ALL |
| GET | `/api/messages/conversations/{conversationId}` | Get conversation messages | ✅ | ALL |
| GET | `/api/messages/project/{projectId}` | Get project messages | ✅ | ALL |
| PUT | `/api/messages/{id}/read` | Mark message as read | ✅ | ALL |
| PUT | `/api/messages/conversations/read` | Mark conversation as read | ✅ | ALL |
| GET | `/api/messages/unread/count` | Get unread message count | ✅ | ALL |
| GET | `/api/messages/unread` | Get unread messages | ✅ | ALL |
| DELETE | `/api/messages/{id}` | Delete message | ✅ | ALL (owner) |

## Notifications
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/notifications` | Get user notifications | ✅ | ALL |
| GET | `/api/notifications/unread` | Get unread notifications | ✅ | ALL |
| GET | `/api/notifications/unread/count` | Get unread count | ✅ | ALL |
| PUT | `/api/notifications/{id}/read` | Mark notification as read | ✅ | ALL |
| PUT | `/api/notifications/mark-all-read` | Mark all as read | ✅ | ALL |
| DELETE | `/api/notifications/{id}` | Delete notification | ✅ | ALL |

## Analytics
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/analytics/dashboard/{userId}` | Get user dashboard analytics | ✅ | ALL (self/admin) |
| GET | `/api/analytics/projects/stats` | Get project statistics | ✅ | ALL |
| GET | `/api/analytics/freelancers/stats` | Get freelancer statistics | ✅ | ALL |
| GET | `/api/analytics/earnings/{userId}` | Get earnings analytics | ✅ | ALL (self/admin) |
| GET | `/api/analytics/performance/{userId}` | Get performance analytics | ✅ | ALL (self/admin) |
| GET | `/api/analytics/trends` | Get trend analytics | ✅ | ALL |
| GET | `/api/analytics/revenue` | Get revenue analytics | ✅ | ALL |

## Settings
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/settings/profile/{userId}` | Get profile settings | ✅ | ALL (self) |
| PUT | `/api/settings/profile/{userId}` | Update profile settings | ✅ | ALL (self) |
| GET | `/api/settings/notifications/{userId}` | Get notification settings | ✅ | ALL (self) |
| PUT | `/api/settings/notifications/{userId}` | Update notification settings | ✅ | ALL (self) |
| GET | `/api/settings/privacy/{userId}` | Get privacy settings | ✅ | ALL (self) |
| PUT | `/api/settings/privacy/{userId}` | Update privacy settings | ✅ | ALL (self) |
| GET | `/api/settings/security/{userId}` | Get security settings | ✅ | ALL (self) |
| PUT | `/api/settings/security/{userId}` | Update security settings | ✅ | ALL (self) |
| GET | `/api/settings/billing/{userId}` | Get billing settings | ✅ | ALL (self) |
| PUT | `/api/settings/billing/{userId}` | Update billing settings | ✅ | ALL (self) |
| GET | `/api/settings/integrations/{userId}` | Get integration settings | ✅ | ALL (self) |
| PUT | `/api/settings/integrations/{userId}` | Update integration settings | ✅ | ALL (self) |

## Reviews
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/reviews` | Get reviews | ✅ | ALL |
| POST | `/api/reviews` | Create review | ✅ | ALL |
| GET | `/api/reviews/{id}` | Get review by ID | ✅ | ALL |
| PUT | `/api/reviews/{id}` | Update review | ✅ | ALL (owner) |
| DELETE | `/api/reviews/{id}` | Delete review | ✅ | ALL (owner) |
| GET | `/api/reviews/user/{userId}` | Get user reviews | ✅ | ALL |
| GET | `/api/reviews/contract/{contractId}` | Get contract reviews | ✅ | ALL |
| GET | `/api/reviews/statistics/{userId}` | Get review statistics | ✅ | ALL |
| POST | `/api/reviews/{id}/report` | Report review | ✅ | ALL |
| GET | `/api/reviews/search` | Search reviews | ✅ | ALL |

## Files
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/files/upload` | Upload file | ✅ | ALL |
| POST | `/api/files/bulk-upload` | Bulk upload files | ✅ | ALL |
| GET | `/api/files/{id}` | Get file | ✅ | ALL |
| DELETE | `/api/files/{id}` | Delete file | ✅ | ALL (owner) |
| GET | `/api/files/user/{userId}` | Get user files | ✅ | ALL (self/admin) |
| GET | `/api/files/download/{id}` | Download file | ✅ | ALL |
| PUT | `/api/files/{id}/metadata` | Update file metadata | ✅ | ALL (owner) |
| GET | `/api/files/categories` | Get file categories | ✅ | ALL |
| GET | `/api/files/storage-usage/{userId}` | Get storage usage | ✅ | ALL (self/admin) |

## Reports
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/reports` | Get reports | ✅ | ALL |
| POST | `/api/reports` | Create report | ✅ | ALL |
| GET | `/api/reports/{id}` | Get report by ID | ✅ | ALL |
| PUT | `/api/reports/{id}/status` | Update report status | ✅ | ADMIN |
| GET | `/api/reports/types` | Get report types | ✅ | ALL |
| GET | `/api/reports/categories` | Get report categories | ✅ | ALL |
| GET | `/api/reports/my-reports` | Get my reports | ✅ | ALL |
| GET | `/api/reports/statistics` | Get report statistics | ✅ | ADMIN |
| POST | `/api/reports/{id}/resolve` | Resolve report | ✅ | ADMIN |
| POST | `/api/reports/{id}/dismiss` | Dismiss report | ✅ | ADMIN |
| GET | `/api/reports/search` | Search reports | ✅ | ALL |

## Help & Support
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/help/faq` | Get FAQ list | ❌ | - |
| GET | `/api/help/faq/search` | Search FAQ | ❌ | - |
| GET | `/api/help/categories` | Get help categories | ❌ | - |
| POST | `/api/help/contact` | Submit contact form | ❌ | - |
| GET | `/api/help/guides` | Get help guides | ❌ | - |
| GET | `/api/help/guides/{id}` | Get help guide by ID | ❌ | - |
| GET | `/api/help/guides/category/{categoryId}` | Get guides by category | ❌ | - |
| GET | `/api/help/search` | Search help content | ❌ | - |
| GET | `/api/help/popular` | Get popular topics | ❌ | - |
| GET | `/api/help/recent` | Get recent topics | ❌ | - |

## Content
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/content/privacy-policy` | Get privacy policy | ❌ | - |
| GET | `/api/content/terms-of-use` | Get terms of use | ❌ | - |
| GET | `/api/content/cookie-policy` | Get cookie policy | ❌ | - |
| GET | `/api/content/about-us` | Get about us | ❌ | - |
| GET | `/api/content/success-stories` | Get success stories | ❌ | - |
| GET | `/api/content/client-experiences` | Get client experiences | ❌ | - |
| POST | `/api/content/contact-us` | Submit contact us form | ❌ | - |
| GET | `/api/content/legal/{type}` | Get legal document | ❌ | - |
| GET | `/api/content/banners` | Get active banners | ❌ | - |
| GET | `/api/content/announcements` | Get announcements | ❌ | - |

## Health Check
| Method | Endpoint | Description | Auth Required | User Role |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/health` | Health check | ❌ | - |
| GET | `/api/health/status` | System status | ❌ | - |

---

## 📊 Summary Statistics

| Category | Endpoints Count |
|----------|----------------|
| Authentication | 5 |
| User Management | 5 |
| Projects | 12 |
| Proposals | 10 |
| Contracts | 11 |
| Payments | 9 |
| Messages | 10 |
| Notifications | 6 |
| Analytics | 7 |
| Settings | 12 |
| Reviews | 10 |
| Files | 9 |
| Reports | 11 |
| Help & Support | 10 |
| Content | 10 |
| Health Check | 2 |
| **TOTAL** | **160+** |

---

## 🔐 Authentication Notes

- ✅ = Authentication required
- ❌ = No authentication required
- ALL = Any authenticated user
- CLIENT = CLIENT role only
- FREELANCER = FREELANCER role only
- ADMIN = ADMIN role only
- (self) = Can only access own data
- (owner) = Can only access owned resources
- (self/admin) = Can access own data or admin can access any

---

## 🎯 Common Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| page | Page number (0-indexed) | `page=0` |
| size | Page size | `size=20` |
| sort | Sort field and direction | `sort=createdAt,desc` |
| query | Search query | `query=javascript` |
| status | Filter by status | `status=ACTIVE` |
| category | Filter by category | `category=Web Development` |

---

## 🚨 Common Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

**Last Updated:** January 2025
**API Version:** 1.0.0
**Base URL:** `http://localhost:8080/api`

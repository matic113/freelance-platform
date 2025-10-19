# 🚀 Admin Panel - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- ✅ Backend running on `http://localhost:8080`
- ✅ Database connected
- ✅ Postman installed

---

## 📋 Step-by-Step Setup

### **Step 1: Import Admin Collection** (30 seconds)

1. Open Postman
2. Click **Import**
3. Select `Freelance-Platform-Admin-Collection.postman_collection.json`
4. Select `Freelance-Platform-Environment.postman_environment.json`

### **Step 2: Initial Admin Account Setup** (2 minutes)

#### Option A: Register New Admin (Recommended for fresh setup)

1. **Open:** `Admin Collection` → `0. Admin Authentication` → `Register Admin User`
2. **Click:** Send
3. **Copy:** The user ID from response
4. **Database:** Grant admin role manually:

```sql
-- Connect to your MySQL database
USE freelance_database;

-- Update the user role to ADMIN (replace with your user email)
UPDATE users
SET role = 'ROLE_ADMIN'
WHERE email = 'admin@freelanceplatform.com';

-- Verify the update
SELECT id, email, first_name, last_name, role
FROM users
WHERE email = 'admin@freelanceplatform.com';
```

#### Option B: Use Existing Admin Account

Skip to Step 3 if you already have admin credentials.

---

### **Step 3: Login as Admin** (30 seconds)

1. **Open:** `Admin Collection` → `0. Admin Authentication` → `Admin Login`
2. **Update credentials if needed:**
   ```json
   {
     "email": "admin@freelanceplatform.com",
     "password": "SuperAdmin123!"
   }
   ```
3. **Click:** Send
4. **✅ Token Auto-Saved!** You'll see in Console:
   ```
   ✅ Admin logged in successfully!
   Admin ID: 123e4567-e89b-12d3-a456-426614174000
   Admin Role: ADMIN
   ```

---

### **Step 4: Verify Admin Access** (30 seconds)

1. **Open:** `Admin Collection` → `0. Admin Authentication` → `Verify Admin Access`
2. **Click:** Send
3. **Expected:** `200 OK` - You have admin access! ✅
4. **If 403:** Your account doesn't have admin role (go back to Step 2)

---

### **Step 5: Explore Admin Features** (1 minute)

#### Test Admin Dashboard
```
GET /api/admin/dashboard
```
You should see comprehensive platform statistics.

#### View Admin Actions
```
GET /api/admin/actions
```
See log of all admin activities.

#### Create Another Admin User (SUPER_ADMIN only)
```
POST /api/admin/users
{
  "email": "moderator@platform.com",
  "firstName": "Jane",
  "lastName": "Moderator",
  "password": "ModPass123!",
  "role": "MODERATOR"
}
```

---

## 🎯 Common First Tasks

### 1. View Platform Statistics
```
GET /api/admin/analytics/dashboard
```

### 2. See All Projects (Including Hidden)
```
GET /api/admin/projects
```

### 3. Check Pending Reports
```
GET /api/admin/reports/pending
```

### 4. View All Users
```
GET /api/admin/users
```

### 5. Real-Time Metrics
```
GET /api/admin/analytics/real-time
```

---

## 🔐 Admin Role Hierarchy

```
SUPER_ADMIN (You - Full Access)
    ├── Create/Delete admin users
    ├── Manage all permissions
    ├── System configuration
    └── All admin features

ADMIN
    ├── User management
    ├── Project moderation
    ├── Report handling
    └── Analytics access

MODERATOR
    ├── Content moderation
    ├── Report review
    └── Basic admin actions

SUPPORT
    ├── View-only access
    └── Help desk features

ANALYST
    ├── Analytics access
    └── Report generation
```

---

## 🛠️ Troubleshooting

### Issue: "403 Forbidden" when accessing admin endpoints

**Solution:**
```sql
-- Check your user role
SELECT id, email, role FROM users WHERE email = 'your@email.com';

-- If role is not ROLE_ADMIN, update it:
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'your@email.com';
```

### Issue: "401 Unauthorized"

**Solution:**
- Run the "Admin Login" request again
- Verify ACCESS_TOKEN is saved in environment variables
- Check token hasn't expired

### Issue: Token expired

**Solution:**
- Use "Refresh Admin Token" endpoint
- Or login again with "Admin Login"

### Issue: Can't create admin users

**Solution:**
- Only SUPER_ADMIN can create admin users
- Verify your role: `GET /api/auth/me`
- If you're the first admin, manually set yourself as SUPER_ADMIN:
```sql
UPDATE users SET role = 'ROLE_SUPER_ADMIN' WHERE email = 'your@email.com';
```

---

## 📊 Quick Test Scenarios

### Scenario 1: Handle a User Report (2 min)

```javascript
// 1. View pending reports
GET /api/admin/reports/pending

// 2. Get specific report
GET /api/admin/reports/{reportId}

// 3. Assign to yourself
PUT /api/admin/reports/{reportId}/assign?adminUserId={{ADMIN_USER_ID}}

// 4. Resolve the report
POST /api/admin/reports/{reportId}/resolve
{
  "resolution": "Issue investigated and resolved",
  "actionTaken": "WARNING_ISSUED"
}
```

### Scenario 2: Moderate a Project (2 min)

```javascript
// 1. View reported projects
GET /api/admin/projects/reported

// 2. Get project details
GET /api/admin/projects/{projectId}

// 3. Moderate
PUT /api/admin/projects/{projectId}/moderate?action=APPROVE&reason=Reviewed and approved
```

### Scenario 3: Create New Moderator (1 min)

```javascript
// Create moderator account
POST /api/admin/users
{
  "email": "moderator@platform.com",
  "firstName": "Jane",
  "lastName": "Moderator",
  "password": "ModPass123!",
  "role": "MODERATOR"
}
```

---

## 📚 Next Steps

1. ✅ **Read Full Admin Guide:** [ADMIN_COLLECTION_README.md](./ADMIN_COLLECTION_README.md)
2. ✅ **Explore All Endpoints:** 60 admin endpoints available
3. ✅ **Setup Team:** Create admin accounts for your team
4. ✅ **Configure Categories:** Setup project/report categories
5. ✅ **Review Analytics:** Check business intelligence features

---

## 🎓 Learning Path

### Day 1: Basics
- [ ] Setup admin account
- [ ] Explore dashboard
- [ ] View platform statistics
- [ ] Check admin actions log

### Day 2: User Management
- [ ] Create moderator account
- [ ] Assign roles
- [ ] Manage permissions
- [ ] Deactivate test accounts

### Day 3: Content Moderation
- [ ] Review reported projects
- [ ] Moderate content
- [ ] Handle user reports
- [ ] Feature quality projects

### Day 4: Analytics
- [ ] Explore analytics dashboard
- [ ] Generate custom reports
- [ ] Export data
- [ ] View predictions

---

## ⚠️ Important Security Notes

1. **Never share admin credentials**
2. **Change default password immediately**
3. **Use strong passwords** (min 12 characters)
4. **Enable 2FA** (when available)
5. **Regularly review admin actions**
6. **Principle of least privilege** - only grant necessary permissions
7. **Deactivate unused accounts**

---

## 🆘 Need Help?

### Documentation
- 📖 [Complete Admin Guide](./ADMIN_COLLECTION_README.md)
- 📖 [Endpoints Reference](./ENDPOINTS_REFERENCE.md)
- 📖 [Main README](./README.md)

### API Resources
- 🌐 Swagger: http://localhost:8080/swagger-ui.html
- ❤️ Health: http://localhost:8080/api/health

### Support
- Check application logs
- Review admin action history
- Verify database connection
- Check all services running (MySQL, Redis, Elasticsearch)

---

## ✅ Quick Checklist

- [ ] Admin collection imported
- [ ] Environment configured
- [ ] Admin account created
- [ ] Admin role granted in database
- [ ] Logged in successfully
- [ ] Admin access verified (200 OK)
- [ ] Dashboard loads correctly
- [ ] Can view admin actions
- [ ] Can access analytics

**If all checked ✅ - You're ready to go!**

---

## 🎉 You're All Set!

You now have **full admin access** to:
- ✅ 60 admin endpoints
- ✅ Complete platform control
- ✅ Business intelligence
- ✅ Content moderation
- ✅ User management
- ✅ System configuration

**Start with the dashboard and explore from there!**

```
GET /api/admin/dashboard
```

---

**Happy Administrating! 🚀**

**Last Updated:** January 2025

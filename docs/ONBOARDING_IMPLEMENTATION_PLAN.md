# Onboarding & Profile Completion Implementation Plan

## Overview
This document outlines the comprehensive plan for implementing an onboarding/user verification workflow for the freelancer platform. The system will require users to complete their profile after email verification before accessing platform features.

---

## 1. MANDATORY FIELDS FOR PROFILE COMPLETION

### For FREELANCERS:
**✅ MANDATORY (Must complete to access platform):**
- `bio` (minimum 50 characters)
- `hourlyRate` (must be > 0)
- `experienceLevel` (must select one: ENTRY, INTERMEDIATE, EXPERT)
- At least 3 skills with proficiency levels
- `User.country` (location)
- `User.timezone`
- `avatarUrl` (profile picture - must upload)

**⚪ OPTIONAL (Can skip during onboarding):**
- portfolios (can add later)
- phone
- Social links (portfolioUrl, linkedinUrl, githubUrl, websiteUrl)

### For CLIENTS:
**✅ MANDATORY:**
- `User.country` (location)
- `User.timezone`
- `User.phone` (for project communication)
- `avatarUrl` (profile picture - must upload)

**⚪ OPTIONAL:**
- bio (clients may describe their business)

---

## 2. DATABASE SCHEMA CHANGES

### A. User Entity Modifications
**File:** `backend/src/main/java/com/freelance/platform/entity/User.java`

Add new fields after `isVerified` (line 51):
```java
private Boolean profileCompleted = false;
private LocalDateTime profileCompletedAt;
```

Add getter and setter methods:
```java
public Boolean getProfileCompleted() {
    return profileCompleted;
}

public void setProfileCompleted(Boolean profileCompleted) {
    this.profileCompleted = profileCompleted;
}

public LocalDateTime getProfileCompletedAt() {
    return profileCompletedAt;
}

public void setProfileCompletedAt(LocalDateTime profileCompletedAt) {
    this.profileCompletedAt = profileCompletedAt;
}
```

### B. Database Migration Script
**File:** `backend/src/main/resources/db/migration/V[X]__add_profile_completion_fields.sql`

```sql
ALTER TABLE users 
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN profile_completed_at TIMESTAMP;

-- Set existing users to completed (backward compatibility)
UPDATE users SET profile_completed = TRUE WHERE is_verified = TRUE;
```

---

## 3. BACKEND API ENDPOINTS

### A. New OnboardingController
**File:** `backend/src/main/java/com/freelance/platform/controller/OnboardingController.java`

```java
@RestController
@RequestMapping("/api/onboarding")
@Tag(name = "Onboarding", description = "User onboarding and profile completion APIs")
public class OnboardingController {

    // 1. GET /api/onboarding/status
    // Returns profile completion status
    @GetMapping("/status")
    public ResponseEntity<OnboardingStatusResponse> getOnboardingStatus()
    
    // 2. POST /api/onboarding/complete-freelancer
    // Complete freelancer profile (bio, hourly rate, experience, location)
    @PostMapping("/complete-freelancer")
    public ResponseEntity<ProfileCompletionResponse> completeFreelancerProfile(
        @RequestBody CompleteFreelancerProfileRequest request
    )
    
    // 3. POST /api/onboarding/complete-client
    // Complete client profile (location, phone)
    @PostMapping("/complete-client")
    public ResponseEntity<ProfileCompletionResponse> completeClientProfile(
        @RequestBody CompleteClientProfileRequest request
    )
    
    // 4. POST /api/onboarding/skip
    // Allow skip (for now) but mark as incomplete
    @PostMapping("/skip")
    public ResponseEntity<Void> skipOnboarding()
}
```

### B. Request/Response DTOs

**CompleteFreelancerProfileRequest:**
```java
public class CompleteFreelancerProfileRequest {
    @NotBlank(message = "Bio is required")
    @Size(min = 50, message = "Bio must be at least 50 characters")
    private String bio;
    
    @NotNull(message = "Hourly rate is required")
    @DecimalMin(value = "0.01", message = "Hourly rate must be greater than 0")
    private BigDecimal hourlyRate;
    
    @NotNull(message = "Experience level is required")
    private ExperienceLevel experienceLevel;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    @NotBlank(message = "Timezone is required")
    private String timezone;
    
    @NotBlank(message = "Profile picture is required")
    private String avatarUrl;
    
    @NotNull(message = "Skills are required")
    @Size(min = 3, message = "At least 3 skills are required")
    private List<SkillRequest> skills;
    
    // Optional fields
    private String phone;
    private String city;
}
```

**CompleteClientProfileRequest:**
```java
public class CompleteClientProfileRequest {
    @NotBlank(message = "Country is required")
    private String country;
    
    @NotBlank(message = "Timezone is required")
    private String timezone;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @NotBlank(message = "Profile picture is required")
    private String avatarUrl;
    
    // Optional
    private String city;
    private String bio;
}
```

**OnboardingStatusResponse:**
```java
public class OnboardingStatusResponse {
    private Boolean profileCompleted;
    private UserType activeRole;
    private String redirectUrl;
    private Map<String, Boolean> completionChecklist;
}
```

**ProfileCompletionResponse:**
```java
public class ProfileCompletionResponse {
    private Boolean success;
    private String message;
    private UserResponse updatedUser;
}
```

### C. OnboardingService
**File:** `backend/src/main/java/com/freelance/platform/service/OnboardingService.java`

```java
@Service
public class OnboardingService {
    
    public OnboardingStatusResponse checkProfileCompletion(UUID userId)
    
    public ProfileCompletionResponse completeFreelancerProfile(
        UUID userId, 
        CompleteFreelancerProfileRequest request
    )
    
    public ProfileCompletionResponse completeClientProfile(
        UUID userId, 
        CompleteClientProfileRequest request
    )
    
    // Validation helper methods
    private boolean isFreelancerProfileComplete(User user, FreelancerProfile profile)
    private boolean isClientProfileComplete(User user)
}
```

### D. Modify AuthController
**File:** `backend/src/main/java/com/freelance/platform/controller/AuthController.java`

Modify verify-email response to include profileCompleted:
```java
@PostMapping("/verify-email-register")
public ResponseEntity<?> verifyEmailRegister(...) {
    // After successful OTP verification
    AuthResponse authResponse = authService.verifyEmailAndAuthenticate(email, otp);
    
    // Add profileCompleted to response
    return ResponseEntity.ok(Map.of(
        "auth", authResponse,
        "requiresOnboarding", !authResponse.isProfileCompleted()
    ));
}
```

---

## 4. FRONTEND ONBOARDING UI/UX FLOW

### A. User Journey
```
1. User registers → Email OTP verification
2. After OTP verification → Login successful
3. Check profileCompleted flag
   - If FALSE → Redirect to onboarding page
   - If TRUE → Redirect to dashboard
4. Onboarding page presents role-specific multi-step form
5. After completion → Redirect to dashboard
```

### B. New Frontend Components

**1. Onboarding Page**
**File:** `frontend/src/pages/Onboarding.tsx`
```typescript
interface OnboardingProps {}

const Onboarding: React.FC<OnboardingProps> = () => {
  // Check user's active role
  // Render FreelancerOnboarding or ClientOnboarding accordingly
}
```

**2. Freelancer Onboarding**
**File:** `frontend/src/components/onboarding/FreelancerOnboarding.tsx`
```typescript
const FreelancerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Profile Picture Upload (avatarUrl - mandatory)
  // Step 2: Basic Info (bio, experience level)
  // Step 3: Location & Contact (country, timezone, phone optional)
  // Step 4: Skills (add at least 3 skills with proficiency)
  // Step 5: Rate & Availability (hourly rate, availability status)
}
```

**3. Client Onboarding**
**File:** `frontend/src/components/onboarding/ClientOnboarding.tsx`
```typescript
const ClientOnboarding = () => {
  // Step 1: Profile Picture Upload (avatarUrl - mandatory)
  // Step 2: Location & Contact (country, timezone, phone)
  // Step 3: Optional (bio)
}
```

**4. Supporting Components**
- `frontend/src/components/onboarding/StepIndicator.tsx` - Visual progress indicator
- `frontend/src/components/onboarding/SkillSelector.tsx` - Component to add skills with proficiency levels

### C. Frontend Service
**File:** `frontend/src/services/onboarding.service.ts`

```typescript
export const onboardingService = {
  getOnboardingStatus: async (): Promise<OnboardingStatusResponse> => {
    const response = await api.get('/api/onboarding/status');
    return response.data;
  },
  
  completeFreelancerProfile: async (
    data: CompleteFreelancerProfileRequest
  ): Promise<ProfileCompletionResponse> => {
    const response = await api.post('/api/onboarding/complete-freelancer', data);
    return response.data;
  },
  
  completeClientProfile: async (
    data: CompleteClientProfileRequest
  ): Promise<ProfileCompletionResponse> => {
    const response = await api.post('/api/onboarding/complete-client', data);
    return response.data;
  },
  
  skipOnboarding: async (): Promise<void> => {
    await api.post('/api/onboarding/skip');
  }
};
```

### D. TypeScript Types
**File:** `frontend/src/types/api.ts`

Add new interfaces:
```typescript
export interface OnboardingStatusResponse {
  profileCompleted: boolean;
  activeRole: UserType;
  redirectUrl: string;
  completionChecklist: {
    hasBio?: boolean;
    hasHourlyRate?: boolean;
    hasExperienceLevel?: boolean;
    hasLocation?: boolean;
    hasSkills?: boolean;
    skillsCount?: number;
  };
}

export interface CompleteFreelancerProfileRequest {
  bio: string;
  hourlyRate: number;
  experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'EXPERT';
  country: string;
  timezone: string;
  avatarUrl: string;
  skills: SkillRequest[];
  phone?: string;
  city?: string;
}

export interface CompleteClientProfileRequest {
  country: string;
  timezone: string;
  phone: string;
  avatarUrl: string;
  city?: string;
  bio?: string;
}

export interface SkillRequest {
  skillName: string;
  proficiencyLevel: number; // 1-5
  description?: string;
}

export interface ProfileCompletionResponse {
  success: boolean;
  message: string;
  updatedUser: UserResponse;
}
```

Update existing interface:
```typescript
export interface UserResponse {
  // ... existing fields
  profileCompleted: boolean;
  profileCompletedAt?: string;
}
```

---

## 5. MIDDLEWARE/GUARD LOGIC

### A. Backend Security Interceptor
**File:** `backend/src/main/java/com/freelance/platform/security/ProfileCompletionInterceptor.java`

```java
@Component
public class ProfileCompletionInterceptor implements HandlerInterceptor {
    
    @Autowired
    private UserService userService;
    
    // List of endpoints that don't require profile completion
    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
        "/api/auth/",
        "/api/onboarding/",
        "/api/users/me",
        "/api/users/profile"
    );
    
    @Override
    public boolean preHandle(
        HttpServletRequest request, 
        HttpServletResponse response, 
        Object handler
    ) throws Exception {
        
        String requestPath = request.getRequestURI();
        
        // Skip check for excluded paths
        if (EXCLUDED_PATHS.stream().anyMatch(requestPath::startsWith)) {
            return true;
        }
        
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return true; // Let security filter handle this
        }
        
        String email = auth.getName();
        User user = userService.findByEmail(email);
        
        // Check profile completion
        if (!user.getProfileCompleted()) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\": \"Profile Incomplete\", " +
                "\"message\": \"Please complete your profile to access this feature.\", " +
                "\"requiresOnboarding\": true}"
            );
            return false;
        }
        
        return true;
    }
}
```

**Register in WebMvcConfigurer:**
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private ProfileCompletionInterceptor profileCompletionInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(profileCompletionInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                    "/api/auth/**",
                    "/api/onboarding/**"
                );
    }
}
```

### B. Frontend Route Protection
**File:** `frontend/src/components/auth/ProtectedRoute.tsx`

Add profile completion check:
```typescript
// NEW: Check profile completion
// Allow access to onboarding page and settings
const allowedWithoutProfile = ['/onboarding', '/settings', '/profile'];
const needsProfileCompletion = !user?.profileCompleted && 
  !allowedWithoutProfile.some(path => location.pathname.startsWith(path));

if (needsProfileCompletion) {
  return <Navigate to="/onboarding" replace />;
}
```

### C. API Interceptor for Error Handling
**File:** `frontend/src/services/api.ts`

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.requiresOnboarding) {
      // Profile incomplete error
      toast.error('Please complete your profile to access this feature');
      window.location.href = '/onboarding';
      return Promise.reject(error);
    }
    
    // Existing error handling...
    return Promise.reject(error);
  }
);
```

---

## 6. IMPLEMENTATION ORDER

### Phase 2: Backend Implementation

```
Step 1: Database Changes
├── Add profileCompleted and profileCompletedAt to User entity
├── Create Flyway migration script
└── Test migration locally

Step 2: DTOs and Requests
├── Create CompleteFreelancerProfileRequest
├── Create CompleteClientProfileRequest
├── Create OnboardingStatusResponse
└── Create ProfileCompletionResponse

Step 3: OnboardingService
├── Implement checkProfileCompletion()
├── Implement completeFreelancerProfile()
├── Implement completeClientProfile()
└── Add validation logic for mandatory fields

Step 4: OnboardingController
├── Create REST endpoints (/status, /complete-freelancer, /complete-client)
├── Add @PreAuthorize security annotations
├── Add Swagger documentation
└── Test with Postman

Step 5: Update AuthService
├── Modify verifyEmailAndAuthenticate() to return profileCompleted
└── Update AuthResponse DTO to include profileCompleted flag

Step 6: Security Interceptor (OPTIONAL - can defer)
├── Create ProfileCompletionInterceptor
├── Register in WebConfig
└── Test protection on various endpoints

Step 7: Testing
├── Write unit tests for OnboardingService
├── Write integration tests for OnboardingController
└── Test full registration → onboarding flow
```

### Phase 3: Frontend Implementation

```
Step 1: Type Updates
├── Update UserResponse interface (add profileCompleted)
├── Add onboarding-related interfaces to api.ts
└── Update AuthResponse interface

Step 2: Onboarding Service
├── Create frontend/src/services/onboarding.service.ts
├── Implement API calls for status, complete-freelancer, complete-client
└── Add error handling

Step 3: Onboarding Components
├── Create Onboarding.tsx page
├── Create FreelancerOnboarding.tsx (multi-step form)
├── Create ClientOnboarding.tsx (simple form)
├── Create StepIndicator.tsx
└── Create SkillSelector.tsx component

Step 4: Update AuthContext
├── Add profileCompleted to user state
├── Update login/register flow to check profileCompleted
└── Add helper function to fetch onboarding status

Step 5: Update ProtectedRoute
├── Add profile completion check
├── Redirect to /onboarding if profile incomplete
└── Allow access to /onboarding and /settings without profile

Step 6: Update API Interceptor
├── Handle 403 errors with requiresOnboarding flag
└── Show toast and redirect to /onboarding

Step 7: Routing
├── Add /onboarding route to App.tsx
└── Ensure proper navigation after login/register

Step 8: UI/UX Polish
├── Add loading states
├── Add validation messages
├── Add skip option (with warning)
├── Add progress tracking
└── Test complete user flow
```

---

## 7. TESTING CHECKLIST

### Backend Tests:
- [ ] User entity saves profileCompleted correctly
- [ ] Migration script runs without errors
- [ ] OnboardingService validates mandatory fields
- [ ] FreelancerProfile requires 3+ skills
- [ ] ClientProfile requires phone, country, timezone
- [ ] ProfileCompletionInterceptor blocks incomplete profiles
- [ ] /api/onboarding/status returns correct data
- [ ] /api/onboarding/complete-freelancer creates/updates profile
- [ ] /api/onboarding/complete-client updates user data
- [ ] AuthResponse includes profileCompleted after login

### Frontend Tests:
- [ ] Login redirects to /onboarding if profile incomplete
- [ ] Register → verify email → redirects to onboarding
- [ ] FreelancerOnboarding form validates all mandatory fields
- [ ] ClientOnboarding form validates all mandatory fields
- [ ] Skills selector allows adding 3+ skills
- [ ] ProtectedRoute blocks access without completed profile
- [ ] API 403 error redirects to onboarding
- [ ] After completing profile, user can access dashboard
- [ ] Skip button shows warning (if implemented)
- [ ] Step indicator shows correct progress

### Integration Tests:
- [ ] Full flow: Register → OTP → Onboarding → Dashboard
- [ ] Role switching doesn't bypass onboarding
- [ ] Existing users (profileCompleted=true) can access platform
- [ ] New users (profileCompleted=false) are blocked properly

---

## 8. EDGE CASES & CONSIDERATIONS

### 1. Existing Users (Backward Compatibility)
**Solution:** Migration sets profileCompleted=TRUE for existing users

### 2. Users Who Skip Onboarding
**Options:**
- a) Block skip (force completion) - RECOMMENDED
- b) Allow skip but show persistent banner reminding to complete
- c) Allow limited access (view-only mode)

### 3. Profile Updates After Completion
**Solution:** Users can always edit profile in Settings. profileCompleted stays TRUE once set

### 4. Admin Users
**Solution:** Admins may not need freelancer/client profile. Consider separate admin onboarding or skip requirement

### 5. Users with Multiple Roles (e.g., CLIENT + FREELANCER)
**Solution:** Require separate profile completion for each role. Add profileCompletedAsFreelancer and profileCompletedAsClient flags

### 6. Partial Form Submission (Network Errors)
**Solution:** Save draft in local storage or backend. Allow resume from where user left off

### 7. Timezone and Country Selection
**Solution:** Use dropdown with search (react-select). Pre-populate from browser if possible

### 8. Skills Validation
**Solution:** Ensure skills exist in database before accepting. Use skills.service.ts to fetch available skills

---

## 9. KEY FILES TO CREATE/MODIFY

### Backend Files to CREATE:
```
backend/src/main/java/com/freelance/platform/
├── controller/OnboardingController.java (NEW)
├── service/OnboardingService.java (NEW)
├── security/ProfileCompletionInterceptor.java (NEW)
├── dto/request/CompleteFreelancerProfileRequest.java (NEW)
├── dto/request/CompleteClientProfileRequest.java (NEW)
├── dto/request/SkillRequest.java (NEW)
├── dto/response/OnboardingStatusResponse.java (NEW)
└── dto/response/ProfileCompletionResponse.java (NEW)

backend/src/main/resources/db/migration/
└── V[X]__add_profile_completion_fields.sql (NEW)
```

### Backend Files to MODIFY:
```
backend/src/main/java/com/freelance/platform/
├── entity/User.java (ADD: profileCompleted, profileCompletedAt)
├── controller/AuthController.java (UPDATE: return profileCompleted)
├── dto/response/AuthResponse.java (ADD: profileCompleted field)
├── service/AuthService.java (UPDATE: set profileCompleted logic)
├── config/WebConfig.java (ADD: register ProfileCompletionInterceptor)
└── mapper/UserMapper.java (UPDATE: map profileCompleted field)
```

### Frontend Files to CREATE:
```
frontend/src/
├── pages/Onboarding.tsx (NEW)
├── components/onboarding/
│   ├── FreelancerOnboarding.tsx (NEW)
│   ├── ClientOnboarding.tsx (NEW)
│   ├── StepIndicator.tsx (NEW)
│   └── SkillSelector.tsx (NEW)
└── services/onboarding.service.ts (NEW)
```

### Frontend Files to MODIFY:
```
frontend/src/
├── types/api.ts (ADD: onboarding interfaces, update UserResponse)
├── components/auth/ProtectedRoute.tsx (ADD: profile completion check)
├── contexts/AuthContext.tsx (ADD: profileCompleted to user state)
├── services/api.ts (ADD: handle requiresOnboarding error)
└── App.tsx (ADD: /onboarding route)
```

---

## Status
**Current Phase:** Planning Complete ✅  
**Next Phase:** Backend Implementation

**Date Created:** 2025-10-23  
**Last Updated:** 2025-10-23

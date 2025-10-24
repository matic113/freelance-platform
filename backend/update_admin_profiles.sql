-- Update existing admin users to have completed profiles
-- This prevents admins from being redirected to onboarding pages
UPDATE users 
SET 
    profile_completed = true,
    freelancer_profile_completed = true,
    client_profile_completed = true
WHERE id IN (
    SELECT DISTINCT user_id 
    FROM user_roles
    WHERE role = 'ADMIN'
);

-- Verify the update
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.profile_completed,
    u.freelancer_profile_completed,
    u.client_profile_completed
FROM users u
INNER JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'ADMIN';

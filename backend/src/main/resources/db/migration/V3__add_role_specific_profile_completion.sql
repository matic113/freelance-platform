ALTER TABLE users 
ADD COLUMN freelancer_profile_completed BOOLEAN;

ALTER TABLE users 
ADD COLUMN client_profile_completed BOOLEAN;

UPDATE users 
SET freelancer_profile_completed = COALESCE(freelancer_profile_completed, FALSE);

UPDATE users 
SET client_profile_completed = COALESCE(client_profile_completed, FALSE);

UPDATE users 
SET freelancer_profile_completed = TRUE 
WHERE profile_completed = TRUE 
AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = users.id AND role = 'FREELANCER');

UPDATE users 
SET client_profile_completed = TRUE 
WHERE profile_completed = TRUE 
AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = users.id AND role = 'CLIENT');

ALTER TABLE users 
MODIFY COLUMN freelancer_profile_completed BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE users 
MODIFY COLUMN client_profile_completed BOOLEAN DEFAULT FALSE NOT NULL;

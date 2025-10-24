UPDATE users 
SET freelancer_profile_completed = FALSE 
WHERE freelancer_profile_completed IS NULL;

UPDATE users 
SET client_profile_completed = FALSE 
WHERE client_profile_completed IS NULL;

ALTER TABLE users 
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN profile_completed_at TIMESTAMP;

UPDATE users SET profile_completed = TRUE WHERE is_verified = TRUE;

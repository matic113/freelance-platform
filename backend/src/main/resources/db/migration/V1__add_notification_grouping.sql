-- Add grouping fields to notifications table
-- This migration adds support for grouping related notifications (e.g., conversation messages)

ALTER TABLE notifications 
ADD COLUMN group_key VARCHAR(255) DEFAULT NULL COMMENT 'Key for grouping related notifications (e.g., conversation:uuid)',
ADD COLUMN group_type VARCHAR(50) DEFAULT 'NONE' COMMENT 'Type of grouping: NONE, CONVERSATION, PROJECT, etc.';

-- Add index for efficient grouping queries
CREATE INDEX idx_notifications_group_key ON notifications(group_key);

-- Add composite index for grouping queries with user filter
CREATE INDEX idx_notifications_user_group ON notifications(user_id, group_key, group_type);

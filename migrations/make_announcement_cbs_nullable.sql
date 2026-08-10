-- Make class_batch_section_id nullable in announcements table
-- This allows announcements to be sent to all institute members without specifying a class

ALTER TABLE announcements 
ALTER COLUMN class_batch_section_id DROP NOT NULL;

-- Add a comment to explain the nullable field
COMMENT ON COLUMN announcements.class_batch_section_id IS 'Optional: If null, announcement is for entire institute';

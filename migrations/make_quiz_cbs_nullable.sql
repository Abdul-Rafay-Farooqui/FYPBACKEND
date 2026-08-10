-- Make class_batch_section_id nullable in quizzes table
-- This allows quizzes to be created without a specific class-batch-section

ALTER TABLE quizzes 
ALTER COLUMN class_batch_section_id DROP NOT NULL;

-- Add a comment to explain the nullable field
COMMENT ON COLUMN quizzes.class_batch_section_id IS 'Optional: If null, quiz is for all classes in the institute';

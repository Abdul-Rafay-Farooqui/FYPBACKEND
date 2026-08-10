-- Add created_by column to discussions table to track who actually sent each message

ALTER TABLE discussions 
ADD COLUMN IF NOT EXISTS created_by UUID;

-- For existing parent discussions (original questions), set created_by to student_id
UPDATE discussions 
SET created_by = student_id 
WHERE created_by IS NULL AND parent_id IS NULL;

-- For existing replies, try to determine who sent them:
-- If teacher_id is NOT NULL and different from the parent's teacher_id, it's likely from teacher
-- Otherwise assume it's from student

-- First, let's handle replies more intelligently
UPDATE discussions d
SET created_by = d.teacher_id
WHERE d.created_by IS NULL 
  AND d.parent_id IS NOT NULL
  AND d.teacher_id IS NOT NULL;

-- If teacher_id is NULL in reply, it's from student
UPDATE discussions 
SET created_by = student_id 
WHERE created_by IS NULL 
  AND parent_id IS NOT NULL
  AND teacher_id IS NULL;

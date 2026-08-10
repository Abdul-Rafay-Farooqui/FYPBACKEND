-- Remove the foreign key constraint on class_batch_section_id
-- Since class_batch_section system is deprecated, grades are now based on subject+student+teacher

-- Step 1: Drop the foreign key constraint
ALTER TABLE "results" 
DROP CONSTRAINT IF EXISTS "results_class_batch_section_id_fkey";

-- Step 2: Make class_batch_section_id nullable
ALTER TABLE "results" 
ALTER COLUMN "class_batch_section_id" DROP NOT NULL;

-- Step 3: Add a comment to explain the change
COMMENT ON COLUMN "results"."class_batch_section_id" IS 'Nullable - Results are now identified by student_id, teacher_id, and subject_id';

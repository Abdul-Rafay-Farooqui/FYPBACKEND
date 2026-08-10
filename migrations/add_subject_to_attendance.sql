-- Add subject_id and institute_id to attendance table
-- Make class_batch_section_id nullable to support subject-based attendance

DO $$ 
BEGIN
    -- Add subject_id column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' AND column_name = 'subject_id'
    ) THEN
        ALTER TABLE attendance ADD COLUMN subject_id UUID;
    END IF;

    -- Add institute_id column if not exists (if doesn't already exist from update_cms_tables.sql)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE attendance ADD COLUMN institute_id UUID;
    END IF;

    -- Make class_batch_section_id nullable
    ALTER TABLE attendance ALTER COLUMN class_batch_section_id DROP NOT NULL;
END $$;

-- Add foreign key constraint for subject_id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_attendance_subject'
    ) THEN
        ALTER TABLE attendance 
        ADD CONSTRAINT fk_attendance_subject 
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for institute_id
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_attendance_institute'
    ) THEN
        ALTER TABLE attendance 
        ADD CONSTRAINT fk_attendance_institute 
        FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_subject_id ON attendance(subject_id);
CREATE INDEX IF NOT EXISTS idx_attendance_institute_id ON attendance(institute_id);
CREATE INDEX IF NOT EXISTS idx_attendance_subject_date ON attendance(subject_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_institute_date ON attendance(institute_id, attendance_date);

-- Update unique constraint to support both CBS-based and subject-based attendance
DO $$ 
BEGIN
    -- Drop old unique constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_attendance' AND table_name = 'attendance'
    ) THEN
        ALTER TABLE attendance DROP CONSTRAINT unique_attendance;
    END IF;

    -- Add new unique constraint that handles both cases
    -- For CBS-based: unique on (class_batch_section_id, student_id, attendance_date)
    -- For subject-based: unique on (subject_id, institute_id, student_id, attendance_date)
    -- We'll use a partial unique index instead
END $$;

-- Create partial unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique_cbs 
ON attendance(class_batch_section_id, student_id, attendance_date) 
WHERE class_batch_section_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique_subject 
ON attendance(subject_id, institute_id, student_id, attendance_date) 
WHERE subject_id IS NOT NULL AND institute_id IS NOT NULL;

-- Add comment
COMMENT ON COLUMN attendance.subject_id IS 'Subject ID for subject-based attendance (institute module)';
COMMENT ON COLUMN attendance.institute_id IS 'Institute ID for subject-based attendance';

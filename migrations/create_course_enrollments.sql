-- Create course enrollments table for students
-- This allows students to enroll in courses (subjects) taught by teachers

CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, subject_id, institute_id)
);

-- Add course_code to subjects table for students to join courses
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='subjects' AND column_name='course_code') THEN
        ALTER TABLE subjects ADD COLUMN course_code VARCHAR(20) UNIQUE;
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_subject ON course_enrollments(subject_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_institute ON course_enrollments(institute_id);

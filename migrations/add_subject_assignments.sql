-- Create subject_assignments table
-- This table stores which teachers are assigned to which subjects

CREATE TABLE IF NOT EXISTS subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject_id, teacher_id, institute_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subject_assignments_subject ON subject_assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_assignments_teacher ON subject_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subject_assignments_institute ON subject_assignments(institute_id);

COMMIT;

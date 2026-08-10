-- RESTORE ALL TABLES
-- This script recreates all the tables that were accidentally dropped

-- 1. Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Batches table
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sections table
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Class-Batch-Sections table
CREATE TABLE IF NOT EXISTS class_batch_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, batch_id, section_id)
);

-- 6. Student Enrollments table
CREATE TABLE IF NOT EXISTS student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Teacher Assignments table
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Homework table
CREATE TABLE IF NOT EXISTS homework (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID,
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    due_date TIMESTAMPTZ,
    published_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Homework Submissions table
CREATE TABLE IF NOT EXISTS homework_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    submission_text TEXT,
    image_url TEXT,
    stars INTEGER DEFAULT 0,
    teacher_feedback TEXT,
    submitted_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Results table
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    result_type VARCHAR(100) NOT NULL,
    marks_obtained NUMERIC NOT NULL,
    total_marks NUMERIC NOT NULL,
    grade VARCHAR(10),
    remarks TEXT,
    published_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID,
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    announcement_type VARCHAR(100) NOT NULL,
    student_id UUID,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_marks INTEGER NOT NULL DEFAULT 100,
    duration_minutes INTEGER,
    due_date TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Quiz Questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_type VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    marks INTEGER NOT NULL DEFAULT 1,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Quiz Attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    score NUMERIC,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Quiz Answers table
CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN,
    marks_obtained NUMERIC DEFAULT 0,
    teacher_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Discussions table
CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    student_id UUID NOT NULL,
    teacher_id UUID,
    class_batch_section_id UUID REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    parent_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Live Classes table
CREATE TABLE IF NOT EXISTS live_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    class_batch_section_id UUID REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    meeting_url TEXT,
    recording_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Live Class Participants table
CREATE TABLE IF NOT EXISTS live_class_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_institute ON classes(institute_id);
CREATE INDEX IF NOT EXISTS idx_batches_institute ON batches(institute_id);
CREATE INDEX IF NOT EXISTS idx_sections_institute ON sections(institute_id);
CREATE INDEX IF NOT EXISTS idx_subjects_institute ON subjects(institute_id);
CREATE INDEX IF NOT EXISTS idx_homework_institute ON homework(institute_id);
CREATE INDEX IF NOT EXISTS idx_homework_teacher ON homework(teacher_id);
CREATE INDEX IF NOT EXISTS idx_homework_cbs ON homework(class_batch_section_id);
CREATE INDEX IF NOT EXISTS idx_announcements_institute ON announcements(institute_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_institute ON quizzes(institute_id);
CREATE INDEX IF NOT EXISTS idx_resources_institute ON resources(institute_id);
CREATE INDEX IF NOT EXISTS idx_discussions_institute ON discussions(institute_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_institute ON live_classes(institute_id);

COMMIT;

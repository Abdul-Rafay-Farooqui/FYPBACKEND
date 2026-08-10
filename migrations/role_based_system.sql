-- Complete Role-Based System Migration
-- This creates all necessary tables for Student, Teacher, and Admin views

-- ============================================
-- 1. QUIZZES SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    total_marks INTEGER NOT NULL DEFAULT 100,
    duration_minutes INTEGER,
    due_date TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'short_answer')),
    options JSONB, -- For MCQ: ["Option A", "Option B", "Option C", "Option D"]
    correct_answer TEXT NOT NULL,
    marks INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    score INTEGER DEFAULT 0,
    total_marks INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    answer TEXT,
    is_correct BOOLEAN,
    marks_obtained INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. RESOURCES SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size BIGINT,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_batch_section_id UUID REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    resource_type VARCHAR(50) DEFAULT 'document' CHECK (resource_type IN ('document', 'video', 'audio', 'image', 'other')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. DISCUSSION/MESSAGING SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    class_batch_section_id UUID REFERENCES class_batch_sections(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    subject_line VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    parent_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. LIVE CLASSES SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS live_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_batch_section_id UUID NOT NULL REFERENCES class_batch_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    meeting_url TEXT,
    meeting_id VARCHAR(255),
    meeting_password VARCHAR(255),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_class_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. UPDATE EXISTING TABLES
-- ============================================

-- Rename homework to assignments (if needed)
-- ALTER TABLE homework RENAME TO assignments;

-- Add new fields to homework/assignments
ALTER TABLE homework ADD COLUMN IF NOT EXISTS submission_type VARCHAR(50) DEFAULT 'both' CHECK (submission_type IN ('file', 'text', 'both'));
ALTER TABLE homework ADD COLUMN IF NOT EXISTS max_file_size BIGINT DEFAULT 10485760; -- 10MB
ALTER TABLE homework ADD COLUMN IF NOT EXISTS allowed_file_types TEXT DEFAULT 'pdf,doc,docx,txt,jpg,png';
ALTER TABLE homework ADD COLUMN IF NOT EXISTS institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE;

-- Add institute_id to homework_submissions if not exists
ALTER TABLE homework_submissions ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE homework_submissions ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- ============================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_quizzes_institute ON quizzes(institute_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_teacher ON quizzes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_cbs ON quizzes(class_batch_section_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

CREATE INDEX IF NOT EXISTS idx_resources_institute ON resources(institute_id);
CREATE INDEX IF NOT EXISTS idx_resources_teacher ON resources(teacher_id);
CREATE INDEX IF NOT EXISTS idx_resources_cbs ON resources(class_batch_section_id);

CREATE INDEX IF NOT EXISTS idx_discussions_student ON discussions(student_id);
CREATE INDEX IF NOT EXISTS idx_discussions_teacher ON discussions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_discussions_institute ON discussions(institute_id);

CREATE INDEX IF NOT EXISTS idx_live_classes_institute ON live_classes(institute_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_teacher ON live_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_cbs ON live_classes(class_batch_section_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_scheduled ON live_classes(scheduled_at);

-- ============================================
-- 7. VERIFICATION QUERIES
-- ============================================

-- Check all new tables
SELECT 
    'quizzes' as table_name, 
    COUNT(*) as record_count 
FROM quizzes
UNION ALL
SELECT 'quiz_questions', COUNT(*) FROM quiz_questions
UNION ALL
SELECT 'quiz_attempts', COUNT(*) FROM quiz_attempts
UNION ALL
SELECT 'quiz_answers', COUNT(*) FROM quiz_answers
UNION ALL
SELECT 'resources', COUNT(*) FROM resources
UNION ALL
SELECT 'discussions', COUNT(*) FROM discussions
UNION ALL
SELECT 'live_classes', COUNT(*) FROM live_classes
UNION ALL
SELECT 'live_class_participants', COUNT(*) FROM live_class_participants;

-- Verify indexes
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE tablename IN ('quizzes', 'quiz_questions', 'quiz_attempts', 'resources', 'discussions', 'live_classes')
ORDER BY tablename, indexname;

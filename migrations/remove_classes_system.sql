-- Remove Classes System
-- This migration removes all class-related tables and data

-- Drop dependent tables first (foreign key constraints)
DROP TABLE IF EXISTS teacher_assignments CASCADE;
DROP TABLE IF EXISTS student_enrollments CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS homework_submissions CASCADE;
DROP TABLE IF EXISTS homework CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS class_batch_sections CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS classes CASCADE;

-- Drop quiz-related tables
DROP TABLE IF EXISTS quiz_answers CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;

-- Drop other tables
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS live_class_participants CASCADE;
DROP TABLE IF EXISTS live_classes CASCADE;

COMMIT;

-- Migration: Update CMS tables for institute integration
-- This migration ensures all CMS tables have proper institute_id references

-- Add institute_id to homework table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'homework' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE homework ADD COLUMN institute_id UUID;
        
        -- Update existing homework records to get institute_id from class_batch_section
        UPDATE homework h
        SET institute_id = (
            SELECT c.institute_id 
            FROM class_batch_sections cbs
            JOIN classes c ON cbs.class_id = c.id
            WHERE cbs.id = h.class_batch_section_id
            LIMIT 1
        );
    END IF;
END $$;

-- Add institute_id to schedules table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'schedules' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE schedules ADD COLUMN institute_id UUID;
        
        -- Update existing schedules records
        UPDATE schedules s
        SET institute_id = (
            SELECT c.institute_id 
            FROM class_batch_sections cbs
            JOIN classes c ON cbs.class_id = c.id
            WHERE cbs.id = s.class_batch_section_id
            LIMIT 1
        );
    END IF;
END $$;

-- Add institute_id to announcements table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'announcements' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE announcements ADD COLUMN institute_id UUID;
        
        -- Update existing announcements records
        UPDATE announcements a
        SET institute_id = (
            SELECT c.institute_id 
            FROM class_batch_sections cbs
            JOIN classes c ON cbs.class_id = c.id
            WHERE cbs.id = a.class_batch_section_id
            LIMIT 1
        );
    END IF;
END $$;

-- Add institute_id to attendance table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE attendance ADD COLUMN institute_id UUID;
        
        -- Update existing attendance records
        UPDATE attendance att
        SET institute_id = (
            SELECT c.institute_id 
            FROM class_batch_sections cbs
            JOIN classes c ON cbs.class_id = c.id
            WHERE cbs.id = att.class_batch_section_id
            LIMIT 1
        );
    END IF;
END $$;

-- Add institute_id to results table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'results' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE results ADD COLUMN institute_id UUID;
        
        -- Update existing results records
        UPDATE results r
        SET institute_id = (
            SELECT c.institute_id 
            FROM class_batch_sections cbs
            JOIN classes c ON cbs.class_id = c.id
            WHERE cbs.id = r.class_batch_section_id
            LIMIT 1
        );
    END IF;
END $$;

-- Add institute_id to class_batch_sections table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'class_batch_sections' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE class_batch_sections ADD COLUMN institute_id UUID;
        
        -- Update existing class_batch_sections records
        UPDATE class_batch_sections cbs
        SET institute_id = (
            SELECT c.institute_id 
            FROM classes c
            WHERE c.id = cbs.class_id
            LIMIT 1
        );
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_homework_institute_id ON homework(institute_id);
CREATE INDEX IF NOT EXISTS idx_schedules_institute_id ON schedules(institute_id);
CREATE INDEX IF NOT EXISTS idx_announcements_institute_id ON announcements(institute_id);
CREATE INDEX IF NOT EXISTS idx_attendance_institute_id ON attendance(institute_id);
CREATE INDEX IF NOT EXISTS idx_results_institute_id ON results(institute_id);
CREATE INDEX IF NOT EXISTS idx_class_batch_sections_institute_id ON class_batch_sections(institute_id);

-- Add foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_homework_institute'
    ) THEN
        ALTER TABLE homework 
        ADD CONSTRAINT fk_homework_institute 
        FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_schedules_institute'
    ) THEN
        ALTER TABLE schedules 
        ADD CONSTRAINT fk_schedules_institute 
        FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_announcements_institute'
    ) THEN
        ALTER TABLE announcements 
        ADD CONSTRAINT fk_announcements_institute 
        FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE;
    END IF;
END $$;

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

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_results_institute'
    ) THEN
        ALTER TABLE results 
        ADD CONSTRAINT fk_results_institute 
        FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_class_batch_sections_institute'
    ) THEN
        ALTER TABLE class_batch_sections 
        ADD CONSTRAINT fk_class_batch_sections_institute 
        FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Verification query
SELECT 
    'homework' as table_name, 
    COUNT(*) as total_records,
    COUNT(institute_id) as records_with_institute_id
FROM homework
UNION ALL
SELECT 
    'schedules', 
    COUNT(*), 
    COUNT(institute_id)
FROM schedules
UNION ALL
SELECT 
    'announcements', 
    COUNT(*), 
    COUNT(institute_id)
FROM announcements
UNION ALL
SELECT 
    'attendance', 
    COUNT(*), 
    COUNT(institute_id)
FROM attendance
UNION ALL
SELECT 
    'results', 
    COUNT(*), 
    COUNT(institute_id)
FROM results
UNION ALL
SELECT 
    'class_batch_sections', 
    COUNT(*), 
    COUNT(institute_id)
FROM class_batch_sections;

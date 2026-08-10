-- Migration: Add Institutes and Institute Members tables
-- Date: 2024

-- Create institutes table
CREATE TABLE IF NOT EXISTS institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create institute_members table
CREATE TABLE IF NOT EXISTS institute_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
  employee_code TEXT,
  student_code TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'left')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institute_id, user_id)
);

-- Add institute_id to existing tables (only if column doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='classes' AND column_name='institute_id') THEN
    ALTER TABLE classes ADD COLUMN institute_id UUID REFERENCES institutes(id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='batches' AND column_name='institute_id') THEN
    ALTER TABLE batches ADD COLUMN institute_id UUID REFERENCES institutes(id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='sections' AND column_name='institute_id') THEN
    ALTER TABLE sections ADD COLUMN institute_id UUID REFERENCES institutes(id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='subjects' AND column_name='institute_id') THEN
    ALTER TABLE subjects ADD COLUMN institute_id UUID REFERENCES institutes(id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_institute_members_institute ON institute_members(institute_id);
CREATE INDEX IF NOT EXISTS idx_institute_members_user ON institute_members(user_id);
CREATE INDEX IF NOT EXISTS idx_institute_members_role ON institute_members(role);
CREATE INDEX IF NOT EXISTS idx_institute_members_status ON institute_members(status);

CREATE INDEX IF NOT EXISTS idx_classes_institute ON classes(institute_id);
CREATE INDEX IF NOT EXISTS idx_batches_institute ON batches(institute_id);
CREATE INDEX IF NOT EXISTS idx_sections_institute ON sections(institute_id);
CREATE INDEX IF NOT EXISTS idx_subjects_institute ON subjects(institute_id);

CREATE INDEX IF NOT EXISTS idx_institutes_created_by ON institutes(created_by);
CREATE INDEX IF NOT EXISTS idx_institutes_slug ON institutes(slug);
CREATE INDEX IF NOT EXISTS idx_institutes_is_active ON institutes(is_active);

-- Add comments for documentation
COMMENT ON TABLE institutes IS 'Educational institutes (schools, colleges, etc.)';
COMMENT ON TABLE institute_members IS 'Members of institutes with their roles';
COMMENT ON COLUMN institute_members.role IS 'Member role: admin, teacher, or student';
COMMENT ON COLUMN institute_members.status IS 'Membership status: active, invited, suspended, or left';

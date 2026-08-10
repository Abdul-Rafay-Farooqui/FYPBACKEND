-- Add institute_id to homework and announcements tables
-- This migration adds the institute_id column to support multi-institute filtering

-- Add institute_id to homework table
ALTER TABLE homework 
ADD COLUMN IF NOT EXISTS institute_id UUID;

-- Add institute_id to announcements table
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS institute_id UUID;

-- Update existing homework records to set institute_id based on class_batch_section
UPDATE homework h
SET institute_id = c.institute_id
FROM class_batch_sections cbs
JOIN classes c ON cbs.class_id = c.id
WHERE h.class_batch_section_id = cbs.id
AND h.institute_id IS NULL;

-- Update existing announcements records to set institute_id based on class_batch_section
UPDATE announcements a
SET institute_id = c.institute_id
FROM class_batch_sections cbs
JOIN classes c ON cbs.class_id = c.id
WHERE a.class_batch_section_id = cbs.id
AND a.institute_id IS NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_homework_institute_id ON homework(institute_id);
CREATE INDEX IF NOT EXISTS idx_announcements_institute_id ON announcements(institute_id);

-- Add foreign key constraints (optional, but recommended)
ALTER TABLE homework 
ADD CONSTRAINT fk_homework_institute 
FOREIGN KEY (institute_id) 
REFERENCES institutes(id) 
ON DELETE CASCADE;

ALTER TABLE announcements 
ADD CONSTRAINT fk_announcements_institute 
FOREIGN KEY (institute_id) 
REFERENCES institutes(id) 
ON DELETE CASCADE;

COMMIT;

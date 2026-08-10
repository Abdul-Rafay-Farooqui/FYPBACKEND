-- Add subject_id column to announcements table
-- This allows announcements to be linked to specific subjects/courses

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='announcements' AND column_name='subject_id') THEN
        ALTER TABLE announcements ADD COLUMN subject_id UUID;
        
        -- Add foreign key constraint
        ALTER TABLE announcements 
        ADD CONSTRAINT announcements_subject_id_fkey 
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL;
    END IF;
END $$;

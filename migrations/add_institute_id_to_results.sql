-- Add institute_id to results table
-- This allows results to be linked to institutes for the institute module

DO $$ 
BEGIN
    -- Add institute_id column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'results' AND column_name = 'institute_id'
    ) THEN
        ALTER TABLE results ADD COLUMN institute_id UUID;
    END IF;
END $$;

-- Add foreign key constraint for institute_id
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_results_institute_id ON results(institute_id);
CREATE INDEX IF NOT EXISTS idx_results_subject_institute ON results(subject_id, institute_id);

-- Add comment
COMMENT ON COLUMN results.institute_id IS 'Institute ID for institute module results';

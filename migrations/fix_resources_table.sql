-- Add missing columns to resources table if they don't exist

-- Add file_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='resources' AND column_name='file_name') THEN
        ALTER TABLE resources ADD COLUMN file_name VARCHAR(255);
    END IF;
END $$;

-- Add file_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='resources' AND column_name='file_type') THEN
        ALTER TABLE resources ADD COLUMN file_type VARCHAR(100);
    END IF;
END $$;

-- Add file_size column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='resources' AND column_name='file_size') THEN
        ALTER TABLE resources ADD COLUMN file_size BIGINT;
    END IF;
END $$;

-- Add resource_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='resources' AND column_name='resource_type') THEN
        ALTER TABLE resources ADD COLUMN resource_type VARCHAR(50) DEFAULT 'document';
    END IF;
END $$;

-- Add missing columns to live_classes table if they don't exist

-- Add meeting_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='live_classes' AND column_name='meeting_id') THEN
        ALTER TABLE live_classes ADD COLUMN meeting_id VARCHAR(255);
    END IF;
END $$;

-- Add meeting_password column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='live_classes' AND column_name='meeting_password') THEN
        ALTER TABLE live_classes ADD COLUMN meeting_password VARCHAR(255);
    END IF;
END $$;

-- Add recording_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='live_classes' AND column_name='recording_url') THEN
        ALTER TABLE live_classes ADD COLUMN recording_url TEXT;
    END IF;
END $$;

-- Add new fields to live_classes table for schedule/start-now functionality
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS location_type VARCHAR(50) DEFAULT 'online';
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS call_type VARCHAR(50) DEFAULT 'video';
ALTER TABLE live_classes ALTER COLUMN class_batch_section_id DROP NOT NULL;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
-- Make class_batch_section_id nullable in homework table
-- This allows teachers to create assignments at institute level without tying to specific class

ALTER TABLE homework 
ALTER COLUMN class_batch_section_id DROP NOT NULL;

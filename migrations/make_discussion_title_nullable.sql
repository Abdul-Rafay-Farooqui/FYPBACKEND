-- Make title column nullable in discussions table
-- This allows replies to not require a title

ALTER TABLE discussions 
ALTER COLUMN title DROP NOT NULL;

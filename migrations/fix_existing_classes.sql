-- Fix existing classes that don't have institute_id set
-- Your institute ID: df699f58-0f5c-4e76-b1b6-0df5902204e9

-- Step 1: Check current state
SELECT 
    c.id,
    c.name,
    c.description,
    c.institute_id,
    c.created_at
FROM classes c
ORDER BY c.created_at DESC;

-- Step 2: Update ALL classes to belong to your institute
UPDATE classes 
SET institute_id = 'df699f58-0f5c-4e76-b1b6-0df5902204e9'
WHERE institute_id IS NULL;

-- Step 3: Verify the update
SELECT 
    c.id,
    c.name,
    c.institute_id,
    i.name as institute_name
FROM classes c
LEFT JOIN institutes i ON c.institute_id = i.id
ORDER BY c.created_at DESC;

-- Step 4: Do the same for batches, sections, and subjects
UPDATE batches 
SET institute_id = 'df699f58-0f5c-4e76-b1b6-0df5902204e9'
WHERE institute_id IS NULL;

UPDATE sections 
SET institute_id = 'df699f58-0f5c-4e76-b1b6-0df5902204e9'
WHERE institute_id IS NULL;

UPDATE subjects 
SET institute_id = 'df699f58-0f5c-4e76-b1b6-0df5902204e9'
WHERE institute_id IS NULL;

-- Step 5: Verify all updates
SELECT 'classes' as table_name, COUNT(*) as total, COUNT(institute_id) as with_institute_id
FROM classes
UNION ALL
SELECT 'batches', COUNT(*), COUNT(institute_id)
FROM batches
UNION ALL
SELECT 'sections', COUNT(*), COUNT(institute_id)
FROM sections
UNION ALL
SELECT 'subjects', COUNT(*), COUNT(institute_id)
FROM subjects;


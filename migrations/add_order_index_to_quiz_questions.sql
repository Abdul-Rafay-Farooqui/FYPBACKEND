-- Add order_index column to quiz_questions table
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN quiz_questions.order_index IS 'Order of the question in the quiz';

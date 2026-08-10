-- Create institute_notifications table
CREATE TABLE IF NOT EXISTS institute_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institute_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'announcement',
    'assignment',
    'assignment_submission',
    'quiz',
    'live_class',
    'live_class_started',
    'grade',
    'discussion',
    'resource',
    'query',
    'general'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  related_id UUID,
  related_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  
  -- Foreign Keys
  CONSTRAINT fk_institute_notification_institute 
    FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE,
  CONSTRAINT fk_institute_notification_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_institute_notifications_institute_id 
  ON institute_notifications(institute_id);
  
CREATE INDEX IF NOT EXISTS idx_institute_notifications_user_id 
  ON institute_notifications(user_id);
  
CREATE INDEX IF NOT EXISTS idx_institute_notifications_user_read 
  ON institute_notifications(user_id, read);
  
CREATE INDEX IF NOT EXISTS idx_institute_notifications_created_at 
  ON institute_notifications(created_at DESC);
  
CREATE INDEX IF NOT EXISTS idx_institute_notifications_type 
  ON institute_notifications(type);
  
CREATE INDEX IF NOT EXISTS idx_institute_notifications_related 
  ON institute_notifications(related_type, related_id);

-- Add comments
COMMENT ON TABLE institute_notifications IS 'Notifications for institute members (teachers and students)';
COMMENT ON COLUMN institute_notifications.type IS 'Type of notification: announcement, assignment, quiz, etc.';
COMMENT ON COLUMN institute_notifications.metadata IS 'Additional data related to the notification in JSON format';
COMMENT ON COLUMN institute_notifications.related_id IS 'ID of the related entity (assignment_id, quiz_id, etc.)';
COMMENT ON COLUMN institute_notifications.related_type IS 'Type of related entity (assignment, quiz, etc.)';

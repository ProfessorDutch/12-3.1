-- Add status field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='enrollments' 
                  AND column_name='status') THEN
        ALTER TABLE enrollments 
        ADD COLUMN status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Create index on status field
CREATE INDEX IF NOT EXISTS idx_enrollments_status 
ON enrollments(status);

-- Update any existing rows without status
UPDATE enrollments 
SET status = 'pending' 
WHERE status IS NULL;
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS enrollments;

-- Create enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    type VARCHAR(50) NOT NULL CHECK (type IN ('ambassador', 'business', 'subscriber')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    church VARCHAR(255),
    commitments_accepted BOOLEAN DEFAULT false,
    business_name VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    description TEXT,
    support_type TEXT[] DEFAULT '{}',
    subscription_tier VARCHAR(50),
    payment_method VARCHAR(100),
    billing_address JSONB
);

-- Create indexes
CREATE INDEX idx_enrollments_type ON enrollments(type);
CREATE INDEX idx_enrollments_email ON enrollments(email);

-- Disable RLS temporarily for initial setup
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;

-- Grant full access to public role
GRANT ALL ON enrollments TO PUBLIC;
GRANT USAGE ON SCHEMA public TO PUBLIC;

-- Enable RLS after setup
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies with simplified rules
CREATE POLICY "Enable all access" ON enrollments
    USING (true)
    WITH CHECK (true);
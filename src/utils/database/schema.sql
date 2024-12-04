-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS church_members;
DROP TABLE IF EXISTS churches;

-- Create churches table
CREATE TABLE churches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    coordinates JSONB,
    members INTEGER DEFAULT 0,
    claimed_by UUID,
    claimed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'claimed', 'verified')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create church_members table
CREATE TABLE church_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('member', 'admin', 'youth_leader', 'pastor')),
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    ministry_interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(church_id, user_id)
);

-- Create indexes
CREATE INDEX idx_churches_name ON churches USING gin(name gin_trgm_ops);
CREATE INDEX idx_churches_status ON churches(status);
CREATE INDEX idx_churches_claimed_by ON churches(claimed_by);
CREATE INDEX idx_church_members_church_id ON church_members(church_id);
CREATE INDEX idx_church_members_user_id ON church_members(user_id);
CREATE INDEX idx_church_members_role ON church_members(role);
CREATE INDEX idx_church_members_status ON church_members(status);

-- Enable RLS
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON churches
    FOR SELECT USING (true);

CREATE POLICY "Enable claim for authenticated users" ON churches
    FOR UPDATE USING (
        status = 'unclaimed' AND 
        claimed_by IS NULL AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Enable read access for all users" ON church_members
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON church_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_churches_updated_at
    BEFORE UPDATE ON churches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_church_members_updated_at
    BEFORE UPDATE ON church_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample churches
INSERT INTO churches (name, address, coordinates, members) VALUES
('Grace Community Church', '1234 Faith Street, Atlanta, GA 30301', '{"lat": 33.7490, "lng": -84.3880}', 250),
('Hope Fellowship', '5678 Blessing Road, Marietta, GA 30060', '{"lat": 33.9526, "lng": -84.5499}', 175),
('New Life Baptist Church', '910 Gospel Way, Alpharetta, GA 30004', '{"lat": 34.0754, "lng": -84.2941}', 300),
('Cornerstone Chapel', '1112 Prayer Avenue, Sandy Springs, GA 30328', '{"lat": 33.9304, "lng": -84.3733}', 225),
('Faith Harbor Church', '1314 Worship Lane, Roswell, GA 30075', '{"lat": 34.0232, "lng": -84.3616}', 200)
ON CONFLICT (id) DO NOTHING;
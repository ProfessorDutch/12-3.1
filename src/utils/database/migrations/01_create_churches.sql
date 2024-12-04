-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create churches table
CREATE TABLE IF NOT EXISTS churches (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_churches_name ON churches USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_churches_status ON churches(status);
CREATE INDEX IF NOT EXISTS idx_churches_claimed_by ON churches(claimed_by);

-- Insert sample churches
INSERT INTO churches (name, address, coordinates, members) VALUES
('Grace Community Church', '1234 Faith Street, Atlanta, GA 30301', '{"lat": 33.7490, "lng": -84.3880}', 250),
('Hope Fellowship', '5678 Blessing Road, Marietta, GA 30060', '{"lat": 33.9526, "lng": -84.5499}', 175),
('New Life Baptist Church', '910 Gospel Way, Alpharetta, GA 30004', '{"lat": 34.0754, "lng": -84.2941}', 300),
('Cornerstone Chapel', '1112 Prayer Avenue, Sandy Springs, GA 30328', '{"lat": 33.9304, "lng": -84.3733}', 225),
('Faith Harbor Church', '1314 Worship Lane, Roswell, GA 30075', '{"lat": 34.0232, "lng": -84.3616}', 200)
ON CONFLICT (id) DO NOTHING;
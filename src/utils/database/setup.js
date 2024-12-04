import { supabase } from '../../config/supabase.js';

const schema = `
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS church_members CASCADE;
DROP TABLE IF EXISTS churches CASCADE;

-- Create churches table
CREATE TABLE churches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    coordinates JSONB,
    members INT DEFAULT 0,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE (church_id, user_id)
);

-- Create indexes
CREATE INDEX idx_churches_name ON churches USING gin(name gin_trgm_ops);
CREATE INDEX idx_churches_status ON churches(status);
CREATE INDEX idx_churches_claimed_by ON churches(claimed_by);
CREATE INDEX idx_church_members_church_id ON church_members(church_id);
CREATE INDEX idx_church_members_user_id ON church_members(user_id);
CREATE INDEX idx_church_members_role ON church_members(role);
CREATE INDEX idx_church_members_status ON church_members(status);

-- Enable Row Level Security (RLS)
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON churches
    FOR SELECT USING (true);

CREATE POLICY "Enable claim for authenticated users" ON churches
    FOR UPDATE USING (
        status = 'unclaimed' AND 
        claimed_by IS NULL
    );

CREATE POLICY "Enable read access for all users" ON church_members
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON church_members
    FOR INSERT WITH CHECK (true);
`;

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Execute schema using Supabase's SQL Editor via RPC
    const { error: schemaError } = await supabase.rpc('execute_sql', { query: schema });
    if (schemaError) {
      console.error('Error setting up schema:', schemaError);
      return false;
    }

    // Verify table creation
    const { data: testData, error: testError } = await supabase
      .from('churches')
      .select('*')
      .limit(1);
    if (testError) {
      console.error('Database test failed:', testError);
      return false;
    }

    console.log('Database setup completed successfully');
    return true;
  } catch (err) {
    console.error('Failed to setup database:', err);
    return false;
  }
}

setupDatabase()
  .then((success) => {
    if (success) {
      console.log('Database setup completed successfully');
      process.exit(0);
    } else {
      console.error('Database setup failed');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });

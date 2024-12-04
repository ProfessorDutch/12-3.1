-- Add new fields to churches table
ALTER TABLE churches ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id);
ALTER TABLE churches ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE churches ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'claimed', 'verified'));

-- Create church_members table
CREATE TABLE IF NOT EXISTS church_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('member', 'admin', 'youth_leader', 'pastor')),
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    ministry_interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(church_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_church_members_church_id ON church_members(church_id);
CREATE INDEX IF NOT EXISTS idx_church_members_user_id ON church_members(user_id);
CREATE INDEX IF NOT EXISTS idx_church_members_role ON church_members(role);
CREATE INDEX IF NOT EXISTS idx_church_members_status ON church_members(status);

-- Add RLS policies
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
    ON church_members FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON church_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for church admins"
    ON church_members FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM church_members 
            WHERE church_id = church_id 
            AND role IN ('admin', 'pastor')
        )
    );

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_church_members_updated_at
    BEFORE UPDATE ON church_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
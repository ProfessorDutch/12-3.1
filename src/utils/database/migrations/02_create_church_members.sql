-- Create church_members table
CREATE TABLE IF NOT EXISTS church_members (
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
CREATE INDEX IF NOT EXISTS idx_church_members_church_id ON church_members(church_id);
CREATE INDEX IF NOT EXISTS idx_church_members_user_id ON church_members(user_id);
CREATE INDEX IF NOT EXISTS idx_church_members_role ON church_members(role);
CREATE INDEX IF NOT EXISTS idx_church_members_status ON church_members(status);
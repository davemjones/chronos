-- Optional: Add any initial database setup here
-- This runs automatically when the PostgreSQL container is first created

-- Example: Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Example: Create a sample table (remove or modify as needed)
-- CREATE TABLE IF NOT EXISTS example (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

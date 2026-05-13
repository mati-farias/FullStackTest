CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'AUTHOR'
                  CHECK (role IN ('AUTHOR','REVIEWER','ADMIN')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

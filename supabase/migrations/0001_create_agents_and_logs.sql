-- 0001_create_agents_and_logs.sql

-- Enable uuid generation (if not already enabled in your DB)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  system_prompt text NOT NULL,
  greeting text,
  fallback text,
  model text DEFAULT 'gpt-4o-mini',
  api_key text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_owner_id ON public.agents(owner_id);
CREATE INDEX IF NOT EXISTS idx_agents_api_key ON public.agents(api_key);

-- Agent logs
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_message text,
  assistant_message text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_id ON public.agent_logs(agent_id);

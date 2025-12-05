-- 0002_rls_policies.sql

-- Enable Row Level Security and policies for agents and agent_logs

-- Agents: only owner can SELECT/UPDATE/DELETE/INSERT their agents
ALTER TABLE IF EXISTS public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Owners can manage their agents" ON public.agents
  FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Agent logs: allow access only for owners of the parent agent
ALTER TABLE IF EXISTS public.agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Owners can read logs for their agents" ON public.agent_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE public.agents.id = public.agent_logs.agent_id AND public.agents.owner_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Owners can insert logs for their agents" ON public.agent_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agents WHERE public.agents.id = public.agent_logs.agent_id AND public.agents.owner_id = auth.uid()
    )
  );

-- Note: service_role key bypasses RLS. Use service_role for server-side operations that need to bypass policies.

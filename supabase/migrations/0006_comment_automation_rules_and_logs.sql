-- 0006_comment_automation_rules_and_logs.sql

-- Table for comment automation rules
create table if not exists comment_automation_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  trigger_words text[],
  auto_reply_message text,
  send_public_reply boolean default false,
  public_reply_template text,
  enabled boolean default true,
  created_at timestamptz default now()
);

-- Table for automation logs
create table if not exists automation_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  type text,
  raw_event jsonb,
  status text,
  created_at timestamptz default now()
);
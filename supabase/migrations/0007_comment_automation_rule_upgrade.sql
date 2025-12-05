-- Add new fields to comment_automation_rules for upgraded rule engine
alter table comment_automation_rules
  add column if not exists public_reply_template text,
  add column if not exists dm_message_template text,
  add column if not exists ai_enabled boolean default false;

-- Remove deprecated fields if needed
alter table comment_automation_rules
  drop column if exists auto_reply_message,
  drop column if exists send_public_reply;

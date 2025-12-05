-- Create comments and direct_messages tables
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null,
  author_id text,
  author_email text,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists direct_messages (
  id uuid primary key default gen_random_uuid(),
  recipient_id text not null,
  sender_id text,
  sender_display text,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now()),
  read boolean default false
);

-- indexes
create index if not exists comments_agent_idx on comments(agent_id);
create index if not exists dm_recipient_idx on direct_messages(recipient_id);

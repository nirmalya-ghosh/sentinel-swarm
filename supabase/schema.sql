create table if not exists public.incidents (
  id text primary key,
  title text not null,
  severity text not null check (severity in ('critical', 'high', 'medium', 'low')),
  vector text not null,
  source text not null,
  target text not null,
  confidence integer not null,
  status text not null default 'detected',
  created_at timestamptz not null default now()
);

create table if not exists public.agent_messages (
  id uuid primary key default gen_random_uuid(),
  incident_id text references public.incidents(id) on delete cascade,
  agent text not null,
  intent text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.incidents enable row level security;
alter table public.agent_messages enable row level security;

create policy "authenticated users can read incidents"
  on public.incidents for select
  to authenticated
  using (true);

create policy "authenticated users can read agent messages"
  on public.agent_messages for select
  to authenticated
  using (true);

create table if not exists public.incidents (
  id text primary key,
  title text not null,
  severity text not null check (severity in ('critical', 'high', 'medium', 'low')),
  vector text not null,
  source text not null,
  target text not null,
  confidence integer not null,
  status text not null default 'detected',
  priority text not null default 'P2' check (priority in ('P1', 'P2', 'P3')),
  assignee text,
  lat double precision,
  lng double precision,
  mitre text[] not null default '{}',
  affected_systems text[] not null default '{}',
  remediation text[] not null default '{}',
  raw_log text,
  created_at timestamptz not null default now()
);

alter table public.incidents add column if not exists priority text not null default 'P2' check (priority in ('P1', 'P2', 'P3'));
alter table public.incidents add column if not exists assignee text;
alter table public.incidents add column if not exists lat double precision;
alter table public.incidents add column if not exists lng double precision;
alter table public.incidents add column if not exists mitre text[] not null default '{}';
alter table public.incidents add column if not exists affected_systems text[] not null default '{}';
alter table public.incidents add column if not exists remediation text[] not null default '{}';
alter table public.incidents add column if not exists raw_log text;
alter table public.incidents add column if not exists updated_at timestamptz not null default now();

create table if not exists public.agent_messages (
  id uuid primary key default gen_random_uuid(),
  incident_id text references public.incidents(id) on delete cascade,
  agent text not null,
  intent text not null,
  message text not null,
  confidence integer check (confidence between 0 and 100),
  severity text check (severity in ('critical', 'high', 'medium', 'low')),
  created_at timestamptz not null default now()
);

create table if not exists public.swarm_runs (
  id uuid primary key default gen_random_uuid(),
  incident_id text references public.incidents(id) on delete cascade,
  mode text not null check (mode in ('demo', 'azure')),
  classification text not null check (classification in ('ANALYZED', 'INJECTION_ATTEMPT')),
  final_severity text not null check (final_severity in ('critical', 'high', 'medium', 'low')),
  final_confidence integer not null check (final_confidence between 0 and 100),
  conflict_detected boolean not null default false,
  containment_required boolean not null default false,
  orchestrator_reasoning text not null,
  confidence_matrix jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.prompt_guard_events (
  id uuid primary key default gen_random_uuid(),
  incident_id text references public.incidents(id) on delete cascade,
  classification text not null check (classification in ('SAFE', 'INJECTION_ATTEMPT')),
  score integer not null check (score between 0 and 100),
  reasons jsonb not null default '[]'::jsonb,
  sanitized_log text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.containment_actions (
  id uuid primary key default gen_random_uuid(),
  incident_id text references public.incidents(id) on delete cascade,
  action_type text not null,
  destination text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null check (status in ('PENDING', 'EXECUTING', 'SUCCESS', 'FAILED')),
  diagnostics jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.incident_notes (
  id uuid primary key default gen_random_uuid(),
  incident_id text references public.incidents(id) on delete cascade,
  author_id uuid,
  author_email text,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.incident_reports (
  id uuid primary key default gen_random_uuid(),
  incident_id text references public.incidents(id) on delete cascade,
  title text not null,
  content text not null,
  sections jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.response_playbooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tactic text,
  severity text check (severity in ('critical', 'high', 'medium', 'low')),
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.operator_activity (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  role text,
  action text not null,
  target text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists incidents_severity_created_at_idx on public.incidents (severity, created_at desc);
create index if not exists incidents_status_created_at_idx on public.incidents (status, created_at desc);
create index if not exists incidents_assignee_idx on public.incidents (assignee);
create index if not exists agent_messages_incident_created_at_idx on public.agent_messages (incident_id, created_at desc);
create index if not exists swarm_runs_incident_created_at_idx on public.swarm_runs (incident_id, created_at desc);
create index if not exists prompt_guard_events_incident_created_at_idx on public.prompt_guard_events (incident_id, created_at desc);
create index if not exists containment_actions_incident_status_idx on public.containment_actions (incident_id, status);
create index if not exists incident_notes_incident_created_at_idx on public.incident_notes (incident_id, created_at desc);
create index if not exists incident_reports_incident_created_at_idx on public.incident_reports (incident_id, created_at desc);
create index if not exists response_playbooks_tactic_idx on public.response_playbooks (tactic);
create index if not exists operator_activity_created_at_idx on public.operator_activity (created_at desc);

alter table public.incidents enable row level security;
alter table public.agent_messages enable row level security;
alter table public.swarm_runs enable row level security;
alter table public.prompt_guard_events enable row level security;
alter table public.containment_actions enable row level security;
alter table public.incident_notes enable row level security;
alter table public.incident_reports enable row level security;
alter table public.response_playbooks enable row level security;
alter table public.operator_activity enable row level security;

create policy "authenticated users can read incidents"
  on public.incidents for select
  to authenticated
  using (true);

create policy "authenticated users can read agent messages"
  on public.agent_messages for select
  to authenticated
  using (true);

create policy "authenticated users can read swarm runs"
  on public.swarm_runs for select
  to authenticated
  using (true);

create policy "authenticated users can read prompt guard events"
  on public.prompt_guard_events for select
  to authenticated
  using (true);

create policy "authenticated users can read containment actions"
  on public.containment_actions for select
  to authenticated
  using (true);

create policy "authenticated users can read incident notes"
  on public.incident_notes for select
  to authenticated
  using (true);

create policy "authenticated users can insert incident notes"
  on public.incident_notes for insert
  to authenticated
  with check (true);

create policy "authenticated users can read incident reports"
  on public.incident_reports for select
  to authenticated
  using (true);

create policy "authenticated users can read response playbooks"
  on public.response_playbooks for select
  to authenticated
  using (true);

create policy "authenticated users can read operator activity"
  on public.operator_activity for select
  to authenticated
  using (true);

insert into public.response_playbooks (title, tactic, severity, content, tags)
values
  ('Credential Attack Containment', 'T1110', 'critical', 'Block suspicious authentication sources, revoke active sessions, enforce adaptive MFA, rotate refresh tokens, and validate identity provider logs.', array['identity','mfa','tokens']),
  ('Valid Account Abuse Recovery', 'T1078', 'high', 'Disable exposed credentials, rotate secrets, audit privilege changes, and confirm no persistence remains before restoring normal access.', array['identity','privilege']),
  ('Prompt Injection Guardrail', 'T1190', 'critical', 'Bypass normal model analysis, quarantine adversarial input, record prompt-guard evidence, and isolate the source ingestion path.', array['agentic-ai','prompt-injection']),
  ('Container Escape Response', 'T1611', 'critical', 'Cordon affected nodes, remove privileged mounts, rebuild worker nodes, enforce admission controls, and review runtime alerts.', array['kubernetes','runtime'])
on conflict do nothing;

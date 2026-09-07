-- Content board cards: one row per content piece moving through the per-workspace kanban
-- (Ideas -> Unscripted -> Scripted -> Filming -> Editing -> Posted). The board is the spine
-- of the Growth Department content engine: agents (content_scripter, competitor_analyst,
-- plan generator) file cards, humans drag them through the pipeline, and a Posted card links
-- to content_pieces (content_piece_id) so revenue attribution closes the loop.
-- stage_history appends {stage, at} on every move; created_by is 'human' or 'agent:<id>'.
--
-- Apply with the Supabase CLI, or paste into the SQL editor of the client's project.

create table if not exists public.content_cards (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null,
  stage text not null default 'ideas'
    check (stage in ('ideas','unscripted','scripted','filming','editing','posted')),
  position double precision not null default 0,
  title text not null,
  topic text,
  format text
    check (format is null or format in ('reel','short','story','carousel','long_form','other')),
  platform text
    check (platform is null or platform in ('yt','ig','tt','em','sms','dm','bio','other')),
  hook text,
  script text,
  source text,
  plan_month text
    check (plan_month is null or plan_month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  notes text,
  content_piece_id uuid,
  stage_history jsonb not null default '[]'::jsonb,
  created_by text not null default 'human'
    check (created_by = 'human' or created_by like 'agent:%'),
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_cards_agency_stage_idx
  on public.content_cards (agency_id, stage, position);

create index if not exists content_cards_agency_plan_idx
  on public.content_cards (agency_id, plan_month);

comment on table public.content_cards is
  'Per-workspace content kanban cards (ideas/unscripted/scripted/filming/editing/posted). Agents file cards, humans drag them; posted cards link to content_pieces for revenue attribution.';

-- RLS mirrors content_pieces: agency members read and manage their own board; agents write
-- with the service role.
alter table public.content_cards enable row level security;

drop policy if exists content_cards_agency_select on public.content_cards;
create policy content_cards_agency_select on public.content_cards
  for select using (is_agency_member(agency_id));

drop policy if exists content_cards_agency_modify on public.content_cards;
create policy content_cards_agency_modify on public.content_cards
  for all using (is_agency_member(agency_id)) with check (is_agency_member(agency_id));

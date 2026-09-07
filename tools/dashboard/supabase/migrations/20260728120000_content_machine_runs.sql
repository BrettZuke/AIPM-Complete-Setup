-- One row per content machine run (scrape, parse, script), so the app can show what its own
-- machine actually did rather than inventing the middle numbers on the Creators flow map.
-- Written by the content machine pipeline scripts; read by /content?tab=creators.
--
-- Apply with the Supabase CLI, or paste into the SQL editor of the client's project.

create table if not exists public.content_machine_runs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null,
  stage text not null check (stage in ('scrape','parse','script')),
  ran_at timestamptz not null default now(),
  creators_read integer not null default 0,
  creators_skipped integer not null default 0,
  outliers_found integer not null default 0,
  outliers_analysed integer not null default 0,
  scripts_written integer not null default 0,
  detail jsonb,
  created_at timestamptz not null default now()
);

create index if not exists content_machine_runs_agency_stage_idx
  on public.content_machine_runs (agency_id, stage, ran_at desc);

comment on table public.content_machine_runs is
  'Content machine run log: what each stage read and produced. Feeds the flow map on the Creators tab so its numbers are measured, not estimated.';

alter table public.content_machine_runs enable row level security;

drop policy if exists content_machine_runs_agency_select on public.content_machine_runs;
create policy content_machine_runs_agency_select on public.content_machine_runs
  for select using (is_agency_member(agency_id));

drop policy if exists content_machine_runs_agency_modify on public.content_machine_runs;
create policy content_machine_runs_agency_modify on public.content_machine_runs
  for all using (is_agency_member(agency_id)) with check (is_agency_member(agency_id));

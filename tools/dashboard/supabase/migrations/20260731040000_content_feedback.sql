-- Brett's verdict on every script, captured from the morning email in one click.
--
-- Until now scripts went to the void: he read six, judged all six in his head, and the machine
-- learned nothing, so it pitched the same rejected angles the next morning. This table is the
-- memory of his taste, and it becomes an input to the strategist alongside the Brain.
--
-- Multi-tenant like everything else: agency_id on every row, RLS via is_agency_member, and every
-- (app) read must ALSO filter agency_id explicitly because View-as bypasses RLS.

-- 'to_record' sits between scripted and filming: approved and queued, but not yet being shot.
-- Brett chose a distinct column over reusing 'filming' (2026-07-30) so the board separates
-- "I said yes to this" from "I am actively making it".
alter table public.content_cards drop constraint if exists content_cards_stage_check;
alter table public.content_cards add constraint content_cards_stage_check
  check (stage = any (array[
    'ideas'::text, 'unscripted'::text, 'scripted'::text,
    'to_record'::text, 'filming'::text, 'editing'::text, 'posted'::text
  ]));

create table if not exists public.content_feedback (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null,
  card_id uuid not null references public.content_cards(id) on delete cascade,

  -- accepted  = "I will record this"
  -- rejected  = "not for me"
  -- revise    = "close, but fix something"
  verdict text not null check (verdict in ('accepted', 'rejected', 'revise')),

  -- Optional by design (Brett 2026-07-30): a reject that demands a sentence is a reject he stops
  -- bothering to give after a week, and a silent thumbs-down still carries signal.
  reason text,

  -- Snapshotted so the training signal survives the card being edited or deleted later.
  card_title text,
  card_hook text,
  card_platform text,

  source text not null default 'email',
  created_at timestamptz not null default now(),

  -- One verdict per card. Changing his mind updates rather than double-counting.
  unique (agency_id, card_id)
);

create index if not exists content_feedback_agency_idx
  on public.content_feedback (agency_id, created_at desc);

create index if not exists content_feedback_verdict_idx
  on public.content_feedback (agency_id, verdict);

alter table public.content_feedback enable row level security;

drop policy if exists content_feedback_agency_select on public.content_feedback;
create policy content_feedback_agency_select on public.content_feedback
  for select using (is_agency_member(agency_id));

drop policy if exists content_feedback_agency_modify on public.content_feedback;
create policy content_feedback_agency_modify on public.content_feedback
  for all using (is_agency_member(agency_id)) with check (is_agency_member(agency_id));

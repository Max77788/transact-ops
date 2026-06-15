-- ============================================================================
-- TransactOps: Full Schema Migration
-- Real estate transaction operations console with 7 modules
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- UTILITY: updated_at trigger function
-- ----------------------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- UTILITY: trigger helper (call per-table)
-- ----------------------------------------------------------------------------
create or replace function add_updated_at_trigger(tbl text)
returns void as $$
begin
  execute format(
    'create trigger set_updated_at before update on %I
     for each row execute function update_updated_at_column()',
    tbl
  );
end;
$$ language plpgsql;

-- ============================================================================
-- TABLE: organizations
-- Top-level tenant / brokerage account
-- ============================================================================
create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
select add_updated_at_trigger('organizations');

-- ============================================================================
-- TABLE: profiles
-- Team members; linked to auth.users via user_id.
-- Roles: lead, tc (transaction coordinator), tm (team manager), admin, agent
-- Location: US, India (for team split)
-- ============================================================================
create table profiles (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  user_id     uuid not null unique, -- matches auth.users.id
  full_name   text not null,
  role        text not null check (role in ('lead','tc','tm','admin','agent')),
  location    text not null check (location in ('US','India')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_profiles_org_id on profiles(org_id);
create index idx_profiles_user_id on profiles(user_id);
select add_updated_at_trigger('profiles');

-- ============================================================================
-- TABLE: stages
-- Fixed pipeline stages (idx 0..6), scoped per org so each brokerage can
-- customise naming.
-- ============================================================================
create table stages (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  name        text not null,
  idx         smallint not null check (idx between 0 and 6),
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(org_id, idx)
);
create index idx_stages_org_id on stages(org_id);
select add_updated_at_trigger('stages');

-- ============================================================================
-- TABLE: stage_steps
-- Sub-tasks / milestones within a stage (e.g. "Send offer letter", "Inspect")
-- ============================================================================
create table stage_steps (
  id          uuid primary key default gen_random_uuid(),
  stage_id    uuid not null references stages(id) on delete cascade,
  org_id      uuid not null references organizations(id) on delete cascade,
  name        text not null,
  idx         smallint not null default 0,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_stage_steps_stage_id on stage_steps(stage_id);
create index idx_stage_steps_org_id on stage_steps(org_id);
select add_updated_at_trigger('stage_steps');

-- ============================================================================
-- TABLE: deals
-- Core deal entity. stage_idx 0..6 maps to stages.idx.
-- Status: active, closed, withdrawn, lost
-- Type:   sale, lease
-- ============================================================================
create table deals (
  id                  uuid primary key default gen_random_uuid(),
  org_id              uuid not null references organizations(id) on delete cascade,
  address             text not null,
  client_name         text not null,
  client_email        text,
  client_phone        text,
  agent               text not null,        -- agent name (free-text for MVP)
  stage_idx           smallint not null default 0 check (stage_idx between 0 and 6),
  stage_entered_at    timestamptz not null default now(),
  active_entered_at   timestamptz,           -- when first moved to active
  close_date          date,
  contract_close_date date,
  price               numeric(12,2),
  type                text not null default 'sale' check (type in ('sale','lease')),
  status              text not null default 'active' check (status in ('active','closed','withdrawn','lost')),
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index idx_deals_org_id on deals(org_id);
create index idx_deals_stage_idx on deals(stage_idx);
create index idx_deals_status on deals(status);
select add_updated_at_trigger('deals');

-- ============================================================================
-- TABLE: deal_step_status
-- Tracks which steps are complete for each deal
-- ============================================================================
create table deal_step_status (
  id           uuid primary key default gen_random_uuid(),
  deal_id      uuid not null references deals(id) on delete cascade,
  step_id      uuid not null references stage_steps(id) on delete cascade,
  completed    boolean not null default false,
  completed_at timestamptz,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(deal_id, step_id)
);
create index idx_deal_step_status_deal_id on deal_step_status(deal_id);
select add_updated_at_trigger('deal_step_status');

-- ============================================================================
-- TABLE: stage_history
-- Immutable log of every stage change for every deal
-- ============================================================================
create table stage_history (
  id          uuid primary key default gen_random_uuid(),
  deal_id     uuid not null references deals(id) on delete cascade,
  stage_idx   smallint not null check (stage_idx between 0 and 6),
  entered_at  timestamptz not null default now(),
  exited_at   timestamptz,
  created_at  timestamptz not null default now()
);
create index idx_stage_history_deal_id on stage_history(deal_id);
-- No updated_at trigger — stage_history is append-only

-- ============================================================================
-- TABLE: tasks
-- Property-level (deal_id set) and brokerage-wide (deal_id null) tasks
-- Supports recurrence via recurrence field (cron or plain-text rrule)
-- ============================================================================
create table tasks (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  deal_id     uuid references deals(id) on delete set null,
  title       text not null,
  description text,
  assigned_to uuid references profiles(id) on delete set null,
  due_date    timestamptz,
  completed   boolean not null default false,
  completed_at timestamptz,
  recurrence  text,  -- e.g. 'weekly', 'RRULE:FREQ=WEEKLY;COUNT=10', or cron
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_tasks_org_id on tasks(org_id);
create index idx_tasks_deal_id on tasks(deal_id);
create index idx_tasks_assigned_to on tasks(assigned_to);
select add_updated_at_trigger('tasks');

-- ============================================================================
-- TABLE: owners
-- Property owners (sellers / landlords) being called
-- ============================================================================
create table owners (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references organizations(id) on delete cascade,
  full_name        text not null,
  email            text,
  phone            text,
  property_address text not null,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index idx_owners_org_id on owners(org_id);
select add_updated_at_trigger('owners');

-- ============================================================================
-- TABLE: checkins
-- Scheduled calls with owners. AI fields (ai_summary, combined_summary,
-- sentiment, recording_url, transcript_url) populated post-call.
-- ============================================================================
create table checkins (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references owners(id) on delete cascade,
  scheduled_date     date not null,
  scheduled_time     time,
  status             text not null default 'awaiting' check (status in ('awaiting','scheduled','completed','noshow')),
  booking_link       text,
  stage_idx_at_call  smallint,
  raw_notes          text,
  ai_summary         text,
  combined_summary   text,
  sentiment          text check (sentiment in ('pos','neu','neg')),
  recording_url      text,
  transcript_url     text,
  call_date          timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index idx_checkins_owner_id on checkins(owner_id);
create index idx_checkins_scheduled_date on checkins(scheduled_date);
create index idx_checkins_status on checkins(status);
select add_updated_at_trigger('checkins');

-- ============================================================================
-- TABLE: summary_templates
-- Reusable templates for call summaries, tied to a stage index
-- ============================================================================
create table summary_templates (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  name        text not null,
  stage_idx   smallint check (stage_idx between 0 and 6),
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_summary_templates_org_id on summary_templates(org_id);
select add_updated_at_trigger('summary_templates');

-- ============================================================================
-- TABLE: checkin_actions
-- Action items captured during checkin calls
-- ============================================================================
create table checkin_actions (
  id          uuid primary key default gen_random_uuid(),
  checkin_id  uuid not null references checkins(id) on delete cascade,
  description text not null,
  completed   boolean not null default false,
  completed_at timestamptz,
  assigned_to uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_checkin_actions_checkin_id on checkin_actions(checkin_id);
select add_updated_at_trigger('checkin_actions');

-- ============================================================================
-- TABLE: email_flags
-- AI-triage results for incoming emails
-- ============================================================================
create table email_flags (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  deal_id     uuid references deals(id) on delete set null,
  from_email  text not null,
  subject     text,
  body_snippet text,
  flag_type   text not null, -- e.g. 'offer', 'inspection', 'question', 'urgent', 'spam'
  ai_summary  text,
  triaged     boolean not null default false,
  triaged_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_email_flags_org_id on email_flags(org_id);
create index idx_email_flags_deal_id on email_flags(deal_id);
create index idx_email_flags_triaged on email_flags(triaged);
select add_updated_at_trigger('email_flags');

-- ============================================================================
-- TABLE: showings
-- In-person / virtual showings for a deal
-- ============================================================================
create table showings (
  id           uuid primary key default gen_random_uuid(),
  deal_id      uuid not null references deals(id) on delete cascade,
  org_id       uuid not null references organizations(id) on delete cascade,
  scheduled_at timestamptz not null,
  buyer_name   text not null,
  buyer_email  text,
  buyer_phone  text,
  status       text not null default 'scheduled' check (status in ('scheduled','confirmed','completed','cancelled','noshow')),
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_showings_deal_id on showings(deal_id);
create index idx_showings_org_id on showings(org_id);
select add_updated_at_trigger('showings');

-- ============================================================================
-- TABLE: feedback_drafts
-- Feedback collected after showings (agent / buyer)
-- ============================================================================
create table feedback_drafts (
  id           uuid primary key default gen_random_uuid(),
  showing_id   uuid not null references showings(id) on delete cascade,
  from_email   text not null,
  content      text not null,
  submitted    boolean not null default false,
  submitted_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_feedback_drafts_showing_id on feedback_drafts(showing_id);
select add_updated_at_trigger('feedback_drafts');

-- ============================================================================
-- TABLE: open_houses
-- Open house events tied to a deal
-- ============================================================================
create table open_houses (
  id           uuid primary key default gen_random_uuid(),
  deal_id      uuid not null references deals(id) on delete cascade,
  org_id       uuid not null references organizations(id) on delete cascade,
  scheduled_at timestamptz not null,
  end_at       timestamptz not null,
  status       text not null default 'scheduled' check (status in ('scheduled','active','completed','cancelled')),
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_open_houses_deal_id on open_houses(deal_id);
create index idx_open_houses_org_id on open_houses(org_id);
select add_updated_at_trigger('open_houses');

-- ============================================================================
-- TABLE: ai_runs
-- Audit trail of AI / LLM calls made by the system
-- ============================================================================
create table ai_runs (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  deal_id     uuid references deals(id) on delete set null,
  run_type    text not null, -- e.g. 'email_triage', 'call_summary', 'sentiment', 'combined_summary'
  input       jsonb,
  output      jsonb,
  status      text not null default 'pending' check (status in ('pending','running','completed','failed')),
  error       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_ai_runs_org_id on ai_runs(org_id);
create index idx_ai_runs_deal_id on ai_runs(deal_id);
select add_updated_at_trigger('ai_runs');

-- ============================================================================
-- TABLE: integrations
-- Third-party integrations (e.g. Zapier, Slack, Google Calendar)
-- ============================================================================
create table integrations (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  provider    text not null, -- e.g. 'zapier', 'slack', 'google_calendar', 'vapi'
  config      jsonb not null default '{}',
  enabled     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(org_id, provider)
);
create index idx_integrations_org_id on integrations(org_id);
select add_updated_at_trigger('integrations');

-- ============================================================================
-- TABLE: webhook_events
-- Inbound webhook event log (e.g. from Vapi, Zapier)
-- ============================================================================
create table webhook_events (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references organizations(id) on delete cascade,
  integration_id uuid references integrations(id) on delete set null,
  event_type     text not null,
  payload        jsonb not null default '{}',
  processed      boolean not null default false,
  processed_at   timestamptz,
  created_at     timestamptz not null default now()
);
create index idx_webhook_events_org_id on webhook_events(org_id);
create index idx_webhook_events_integration_id on webhook_events(integration_id);
-- No updated_at — webhook_events is mostly append-only

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Pattern: org_id = (select org_id from profiles where id = auth.uid())
-- ============================================================================

-- Helper: enable RLS on all tables
do $$
declare
  t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in (
        'organizations','profiles','stages','stage_steps','deals',
        'deal_step_status','stage_history','tasks','owners','checkins',
        'summary_templates','checkin_actions','email_flags','showings',
        'feedback_drafts','open_houses','ai_runs','integrations','webhook_events'
      )
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end;
$$;

-- organizations: only members of the org can view
create policy "org_members_can_view_org" on organizations
  for select using (
    id in (select org_id from profiles where user_id = auth.uid())
  );

-- profiles: users can view profiles in their org
create policy "users_can_view_org_profiles" on profiles
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );
create policy "users_can_update_own_profile" on profiles
  for update using (user_id = auth.uid());

-- RLS for org-scoped tables
create policy "org_scoped_select" on stages
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on stage_steps
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- deals: all org members can view; agent/tc/lead can modify
create policy "org_scoped_select" on deals
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );
create policy "org_scoped_all" on deals
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on deal_step_status
  for select using (
    deal_id in (select id from deals where org_id = (select org_id from profiles where user_id = auth.uid()))
  );

create policy "org_scoped_select" on stage_history
  for select using (
    deal_id in (select id from deals where org_id = (select org_id from profiles where user_id = auth.uid()))
  );

create policy "org_scoped_select" on tasks
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on owners
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on checkins
  for select using (
    owner_id in (select id from owners where org_id = (select org_id from profiles where user_id = auth.uid()))
  );

create policy "org_scoped_select" on summary_templates
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on checkin_actions
  for select using (
    checkin_id in (
      select c.id from checkins c
      join owners o on o.id = c.owner_id
      where o.org_id = (select org_id from profiles where user_id = auth.uid())
    )
  );

create policy "org_scoped_select" on email_flags
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on showings
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on feedback_drafts
  for select using (
    showing_id in (select id from showings where org_id = (select org_id from profiles where user_id = auth.uid()))
  );

create policy "org_scoped_select" on open_houses
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on ai_runs
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on integrations
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

create policy "org_scoped_select" on webhook_events
  for select using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- ============================================================================
-- FULL RLS FOR ALL (insert/update/delete where appropriate)
-- Org-members can insert/update/delete their org's data
-- ============================================================================

-- stages
create policy "org_scoped_all" on stages
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- stage_steps
create policy "org_scoped_all" on stage_steps
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- deal_step_status
create policy "org_scoped_all" on deal_step_status
  for all using (
    deal_id in (select id from deals where org_id = (select org_id from profiles where user_id = auth.uid()))
  );

-- tasks
create policy "org_scoped_all" on tasks
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- owners
create policy "org_scoped_all" on owners
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- checkins
create policy "org_scoped_all" on checkins
  for all using (
    owner_id in (select id from owners where org_id = (select org_id from profiles where user_id = auth.uid()))
  );

-- summary_templates
create policy "org_scoped_all" on summary_templates
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- checkin_actions
create policy "org_scoped_all" on checkin_actions
  for all using (
    checkin_id in (
      select c.id from checkins c
      join owners o on o.id = c.owner_id
      where o.org_id = (select org_id from profiles where user_id = auth.uid())
    )
  );

-- email_flags
create policy "org_scoped_all" on email_flags
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- showings
create policy "org_scoped_all" on showings
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- feedback_drafts
create policy "org_scoped_all" on feedback_drafts
  for all using (
    showing_id in (select id from showings where org_id = (select org_id from profiles where user_id = auth.uid()))
  );

-- open_houses
create policy "org_scoped_all" on open_houses
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- ai_runs
create policy "org_scoped_all" on ai_runs
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- integrations
create policy "org_scoped_all" on integrations
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );

-- webhook_events
create policy "org_scoped_all" on webhook_events
  for all using (
    org_id = (select org_id from profiles where user_id = auth.uid())
  );
